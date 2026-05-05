/**
 * Stripe integration for Kibloo subscriptions.
 *
 * Three callables/HTTPS endpoints:
 *   1. createCheckoutSession  — onCall: returns a Stripe Checkout URL
 *   2. createPortalSession    — onCall: returns Stripe Billing Portal URL
 *   3. stripeWebhook          — onRequest: receives Stripe events
 *
 * Required environment variables (set via `firebase functions:secrets:set`):
 *   STRIPE_SECRET_KEY        — sk_live_xxx  (or sk_test_xxx in dev)
 *   STRIPE_WEBHOOK_SECRET    — whsec_xxx
 *   STRIPE_PRICE_PREMIUM_M   — price_xxx (Premium, monthly)
 *   STRIPE_PRICE_PREMIUM_Y   — price_xxx (Premium, yearly)
 *   STRIPE_PRICE_FAMILY_M    — price_xxx (Family,  monthly)
 *   STRIPE_PRICE_FAMILY_Y    — price_xxx (Family,  yearly)
 */
import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import Stripe from "stripe";

const STRIPE_SECRET_KEY     = defineSecret("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = defineSecret("STRIPE_WEBHOOK_SECRET");
const STRIPE_PRICE_PREMIUM_M = defineSecret("STRIPE_PRICE_PREMIUM_M");
const STRIPE_PRICE_PREMIUM_Y = defineSecret("STRIPE_PRICE_PREMIUM_Y");
const STRIPE_PRICE_FAMILY_M  = defineSecret("STRIPE_PRICE_FAMILY_M");
const STRIPE_PRICE_FAMILY_Y  = defineSecret("STRIPE_PRICE_FAMILY_Y");

const APP_URL = process.env.APP_URL || "https://kibloo.app";
const TRIAL_DAYS = 14;

function stripe() {
  return new Stripe(STRIPE_SECRET_KEY.value(), { apiVersion: "2024-06-20" });
}

function pickPrice(plan, period) {
  if (plan === "premium" && period === "monthly") return STRIPE_PRICE_PREMIUM_M.value();
  if (plan === "premium" && period === "yearly")  return STRIPE_PRICE_PREMIUM_Y.value();
  if (plan === "family"  && period === "monthly") return STRIPE_PRICE_FAMILY_M.value();
  if (plan === "family"  && period === "yearly")  return STRIPE_PRICE_FAMILY_Y.value();
  return null;
}

/**
 * Look up (or create) a Stripe Customer for this Firebase user, and
 * persist the Stripe customer id back to Firestore. Idempotent.
 */
async function getOrCreateCustomer(uid, email) {
  const db = getFirestore();
  const ref = db.collection("users").doc(uid).collection("data").doc("subscription");
  const snap = await ref.get();
  if (snap.exists && snap.data().stripeCustomerId) {
    return snap.data().stripeCustomerId;
  }

  const customer = await stripe().customers.create({
    email: email || undefined,
    metadata: { firebaseUid: uid },
  });

  await ref.set({ stripeCustomerId: customer.id }, { merge: true });
  return customer.id;
}

// ─── 1. Create Checkout Session ──────────────────────────────────────────
export const createCheckoutSession = onCall(
  {
    secrets: [STRIPE_SECRET_KEY, STRIPE_PRICE_PREMIUM_M, STRIPE_PRICE_PREMIUM_Y, STRIPE_PRICE_FAMILY_M, STRIPE_PRICE_FAMILY_Y],
    region: "europe-west1",
    cors: [APP_URL, "http://localhost:5173"],
    enforceAppCheck: false,
  },
  async (req) => {
    if (!req.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in to subscribe.");
    }
    const { plan = "premium", period = "monthly" } = req.data || {};
    const priceId = pickPrice(plan, period);
    if (!priceId) {
      throw new HttpsError("invalid-argument", `Unknown plan/period combination: ${plan}/${period}`);
    }

    const uid = req.auth.uid;
    const email = req.auth.token.email || null;
    const customerId = await getOrCreateCustomer(uid, email);

    try {
      const session = await stripe().checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        subscription_data: {
          trial_period_days: TRIAL_DAYS,
          metadata: { firebaseUid: uid, plan, period },
        },
        client_reference_id: uid,
        metadata: { firebaseUid: uid, plan, period },
        success_url: `${APP_URL}/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${APP_URL}/subscription?cancelled=true`,
        allow_promotion_codes: true,
        billing_address_collection: "auto",
        automatic_tax: { enabled: false },
      });

      // Mirror minimal info for analytics / debugging.
      await getFirestore()
        .collection("checkoutSessions")
        .doc(session.id)
        .set({
          uid,
          plan,
          period,
          createdAt: FieldValue.serverTimestamp(),
          status: "pending",
        });

      return { url: session.url, sessionId: session.id };
    } catch (err) {
      logger.error("Stripe checkout failed", err);
      throw new HttpsError("internal", "Could not create checkout session.");
    }
  },
);

// ─── 2. Customer Portal (manage / cancel subscription) ───────────────────
export const createPortalSession = onCall(
  {
    secrets: [STRIPE_SECRET_KEY],
    region: "europe-west1",
    cors: [APP_URL, "http://localhost:5173"],
  },
  async (req) => {
    if (!req.auth) throw new HttpsError("unauthenticated", "Must be logged in.");
    const uid = req.auth.uid;
    const returnUrl = (req.data && req.data.returnUrl) || `${APP_URL}/profile`;

    const subSnap = await getFirestore()
      .collection("users").doc(uid).collection("data").doc("subscription").get();
    const customerId = subSnap.exists ? subSnap.data().stripeCustomerId : null;
    if (!customerId) {
      throw new HttpsError("failed-precondition", "No Stripe customer for this user.");
    }

    try {
      const portal = await stripe().billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
      return { url: portal.url };
    } catch (err) {
      logger.error("Stripe portal failed", err);
      throw new HttpsError("internal", "Could not open billing portal.");
    }
  },
);

// ─── 3. Webhook handler ──────────────────────────────────────────────────
// Receives Stripe events, verifies signature, and mirrors subscription
// state into Firestore so the client can react in real time.
export const stripeWebhook = onRequest(
  {
    secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET],
    region: "europe-west1",
    invoker: "public",
  },
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
      res.status(400).send("Missing stripe-signature header.");
      return;
    }

    let event;
    try {
      event = stripe().webhooks.constructEvent(
        req.rawBody,
        sig,
        STRIPE_WEBHOOK_SECRET.value(),
      );
    } catch (err) {
      logger.error("Stripe webhook signature verification failed", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    const db = getFirestore();

    // Idempotency: Stripe retries failed webhooks. Skip if we've already
    // processed this event id. We use create() (fails if doc exists) so two
    // concurrent retries can't both proceed.
    try {
      await db.collection("stripeWebhookEvents").doc(event.id).create({
        type: event.type,
        receivedAt: FieldValue.serverTimestamp(),
      });
    } catch (e) {
      // AlreadyExists → we processed this before. Acknowledge fast.
      if (e?.code === 6 /* ALREADY_EXISTS */ || /already exists/i.test(e?.message || "")) {
        logger.info("Stripe webhook duplicate", { eventId: event.id, type: event.type });
        res.json({ received: true, duplicate: true });
        return;
      }
      logger.warn("Webhook idempotency check failed (continuing)", e?.message);
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          const uid = session.client_reference_id || session.metadata?.firebaseUid;
          if (!uid) break;
          await db.collection("checkoutSessions").doc(session.id).set({
            status: "completed",
            completedAt: FieldValue.serverTimestamp(),
            stripeCustomerId: session.customer,
            subscriptionId: session.subscription,
          }, { merge: true });
          break;
        }

        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.trial_will_end":
        case "customer.subscription.deleted": {
          const sub = event.data.object;
          const uid = sub.metadata?.firebaseUid;
          if (!uid) break;

          const item = sub.items?.data?.[0];
          const product = item?.price?.product;
          const price = item?.price?.id;
          let tier = "free";
          let period = "monthly";
          if (price === STRIPE_PRICE_PREMIUM_M.value() || price === STRIPE_PRICE_PREMIUM_Y.value()) tier = "premium";
          if (price === STRIPE_PRICE_FAMILY_M.value()  || price === STRIPE_PRICE_FAMILY_Y.value())  tier = "family";
          if (price === STRIPE_PRICE_PREMIUM_Y.value() || price === STRIPE_PRICE_FAMILY_Y.value())  period = "yearly";

          const status = sub.status;
          // Treat trialing/active as paid; everything else falls back to free.
          const effectiveTier = ["active", "trialing"].includes(status) ? tier : "free";

          await db
            .collection("users").doc(uid).collection("data").doc("subscription")
            .set({
              tier: effectiveTier,
              status,
              period,
              stripeCustomerId: sub.customer,
              stripeSubscriptionId: sub.id,
              currentPeriodEnd: sub.current_period_end || null,
              cancelAtPeriodEnd: !!sub.cancel_at_period_end,
              trialEnd: sub.trial_end || null,
              updatedAt: FieldValue.serverTimestamp(),
            }, { merge: true });

          // Trigger trial-ending email reminder via flag.
          if (event.type === "customer.subscription.trial_will_end") {
            await db.collection("emailQueue").add({
              type: "trial_ending",
              uid,
              createdAt: FieldValue.serverTimestamp(),
              status: "pending",
            });
          }
          break;
        }

        case "invoice.payment_succeeded": {
          const invoice = event.data.object;
          const uid = invoice.subscription_details?.metadata?.firebaseUid
            || invoice.metadata?.firebaseUid;
          if (uid) {
            await db.collection("emailQueue").add({
              type: "receipt",
              uid,
              invoiceId: invoice.id,
              amountPaid: invoice.amount_paid,
              currency: invoice.currency,
              hostedInvoiceUrl: invoice.hosted_invoice_url || null,
              createdAt: FieldValue.serverTimestamp(),
              status: "pending",
            });
          }
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object;
          const uid = invoice.subscription_details?.metadata?.firebaseUid;
          if (uid) {
            await db.collection("emailQueue").add({
              type: "payment_failed",
              uid,
              hostedInvoiceUrl: invoice.hosted_invoice_url || null,
              createdAt: FieldValue.serverTimestamp(),
              status: "pending",
            });
          }
          break;
        }

        default:
          // Ignore anything else
          break;
      }

      res.json({ received: true });
    } catch (err) {
      logger.error("Stripe webhook processing failed", err);
      res.status(500).send("Webhook handler error");
    }
  },
);
