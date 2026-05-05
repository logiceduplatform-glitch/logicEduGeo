/**
 * B2B / school invoicing.
 *
 * Workflow:
 *   1. Admin (in Admin Dashboard → Invoices) calls `createSchoolInvoice` with:
 *        { schoolName, contactEmail, vatNumber, lineItems[], notes }
 *   2. We create (or fetch) a Stripe Customer for the school.
 *   3. We add InvoiceItems for each line, then finalize the Invoice.
 *   4. Stripe emails the hosted invoice link to the school.
 *   5. We mirror the invoice metadata into Firestore `schoolInvoices/{id}`
 *      so the admin UI can list/track them (paid / pending / void).
 *
 * The `stripeWebhook` already handles `invoice.payment_succeeded` and updates
 * the `schoolInvoices` doc accordingly (see stripe.js).
 */
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = defineSecret("STRIPE_SECRET_KEY");

function stripe() {
  return new Stripe(STRIPE_SECRET_KEY.value(), { apiVersion: "2024-06-20" });
}

async function assertAdmin(uid) {
  const user = await getAuth().getUser(uid);
  const isAdmin = user.customClaims?.admin === true
    || user.email === "logic.edu.platform@gmail.com";
  if (!isAdmin) {
    throw new HttpsError("permission-denied", "Admin only.");
  }
}

/**
 * Create or fetch a Stripe Customer for a school.
 * We key by contactEmail to keep things deterministic across re-invoicing.
 */
async function getOrCreateSchoolCustomer({ schoolName, contactEmail, vatNumber, address }) {
  const s = stripe();
  const existing = await s.customers.list({ email: contactEmail, limit: 1 });
  if (existing.data.length > 0) return existing.data[0];

  const customer = await s.customers.create({
    name: schoolName,
    email: contactEmail,
    description: `School: ${schoolName}`,
    address: address || undefined,
    tax_id_data: vatNumber ? [{ type: "eu_vat", value: vatNumber }] : undefined,
    metadata: { type: "school", schoolName, vatNumber: vatNumber || "" },
  });
  return customer;
}

/**
 * Create a Stripe invoice for a school account.
 *
 * @param {object} req.data
 * @param {string} req.data.schoolName    e.g. "1ο Δημοτικό Σχολείο Αθηνών"
 * @param {string} req.data.contactEmail  invoice recipient
 * @param {string} req.data.vatNumber     EU VAT (e.g. "EL999999999"), optional
 * @param {object} req.data.address       { line1, postal_code, city, country }
 * @param {Array<{description: string, quantity: number, unitAmount: number}>} req.data.lineItems
 *        unitAmount is in cents (e.g. 5000 = €50.00)
 * @param {string} req.data.notes         optional footer note for the invoice
 * @param {boolean} req.data.draft        if true, leave invoice as draft instead of finalizing
 */
export const createSchoolInvoice = onCall(
  {
    secrets: [STRIPE_SECRET_KEY],
    region: "europe-west1",
    enforceAppCheck: false,
  },
  async (req) => {
    if (!req.auth) throw new HttpsError("unauthenticated", "Sign in required.");
    await assertAdmin(req.auth.uid);

    const {
      schoolName, contactEmail, vatNumber = "", address = null,
      lineItems = [], notes = "", draft = false,
    } = req.data || {};

    if (!schoolName)   throw new HttpsError("invalid-argument", "schoolName required.");
    if (!contactEmail) throw new HttpsError("invalid-argument", "contactEmail required.");
    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      throw new HttpsError("invalid-argument", "At least one line item required.");
    }

    const s = stripe();
    const customer = await getOrCreateSchoolCustomer({ schoolName, contactEmail, vatNumber, address });

    // 1) Add invoice items (each shows as a separate line on the invoice)
    for (const item of lineItems) {
      const qty = Number(item.quantity) || 1;
      const unit = Math.round(Number(item.unitAmount) || 0);
      if (unit <= 0) throw new HttpsError("invalid-argument", `Invalid unitAmount for "${item.description}"`);
      await s.invoiceItems.create({
        customer: customer.id,
        currency: "eur",
        unit_amount: unit,
        quantity: qty,
        description: item.description || "Service",
      });
    }

    // 2) Create the invoice
    const invoice = await s.invoices.create({
      customer: customer.id,
      collection_method: "send_invoice",
      days_until_due: 30,
      footer: notes,
      auto_advance: !draft,
      metadata: { schoolName, createdBy: req.auth.uid },
    });

    // 3) Finalize (and email) unless explicitly draft
    let finalInvoice = invoice;
    if (!draft) {
      finalInvoice = await s.invoices.finalizeInvoice(invoice.id);
      try {
        await s.invoices.sendInvoice(invoice.id);
      } catch (e) {
        logger.warn("invoices.sendInvoice failed (non-fatal)", e?.message);
      }
    }

    // 4) Mirror to Firestore for the admin UI
    const db = getFirestore();
    await db.collection("schoolInvoices").doc(finalInvoice.id).set({
      schoolName,
      contactEmail,
      vatNumber,
      stripeCustomerId: customer.id,
      stripeInvoiceId: finalInvoice.id,
      hostedInvoiceUrl: finalInvoice.hosted_invoice_url,
      invoicePdf: finalInvoice.invoice_pdf,
      total: finalInvoice.total,
      currency: finalInvoice.currency,
      status: finalInvoice.status,
      lineItems,
      notes,
      createdBy: req.auth.uid,
      createdAt: FieldValue.serverTimestamp(),
    });

    logger.info("School invoice created", {
      invoiceId: finalInvoice.id, schoolName, total: finalInvoice.total,
    });

    return {
      ok: true,
      invoiceId: finalInvoice.id,
      hostedInvoiceUrl: finalInvoice.hosted_invoice_url,
      invoicePdf: finalInvoice.invoice_pdf,
      total: finalInvoice.total,
      status: finalInvoice.status,
    };
  },
);

/**
 * Void an unpaid invoice.
 */
export const voidSchoolInvoice = onCall(
  {
    secrets: [STRIPE_SECRET_KEY],
    region: "europe-west1",
  },
  async (req) => {
    if (!req.auth) throw new HttpsError("unauthenticated", "Sign in required.");
    await assertAdmin(req.auth.uid);

    const { invoiceId } = req.data || {};
    if (!invoiceId) throw new HttpsError("invalid-argument", "invoiceId required.");

    const s = stripe();
    const invoice = await s.invoices.voidInvoice(invoiceId);

    const db = getFirestore();
    await db.collection("schoolInvoices").doc(invoiceId).set({
      status: invoice.status,
      voidedAt: FieldValue.serverTimestamp(),
      voidedBy: req.auth.uid,
    }, { merge: true });

    return { ok: true, status: invoice.status };
  },
);
