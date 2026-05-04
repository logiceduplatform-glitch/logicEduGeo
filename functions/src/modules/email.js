/**
 * Transactional email for Kibloo.
 *
 * We use Resend (https://resend.com) as the provider — generous free tier,
 * no SDK required, simple HTTPS API. Replace RESEND_API_KEY with your key.
 *
 * Required secrets:
 *   RESEND_API_KEY   — re_xxx
 *   FROM_EMAIL       — e.g. "Kibloo <hello@kibloo.app>"
 *
 * Triggers:
 *   1. sendWelcomeEmail        — Auth onCreate (new user signs up)
 *   2. sendTrialEndingEmail    — onCall, manual trigger from emailQueue
 *   3. scheduledTrialReminders — Pub/Sub schedule, daily at 09:00
 */
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");
const FROM_EMAIL_PARAM = defineSecret("FROM_EMAIL");

const APP_URL = process.env.APP_URL || "https://kibloo.app";

/**
 * Low-level send. Returns { ok, id?, error? }.
 */
async function sendEmail({ to, subject, html, text, replyTo }) {
  if (!to) return { ok: false, error: "no-recipient" };
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY.value()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL_PARAM.value(),
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
        reply_to: replyTo,
      }),
    });
    if (!r.ok) {
      const body = await r.text();
      logger.error("Resend send failed", { status: r.status, body });
      return { ok: false, error: `${r.status}: ${body.slice(0, 200)}` };
    }
    const data = await r.json();
    return { ok: true, id: data.id };
  } catch (e) {
    logger.error("Resend network error", e);
    return { ok: false, error: e.message };
  }
}

// ─── Templates ───────────────────────────────────────────────────────────
function welcomeTemplate({ name, lang = "el" }) {
  const isEl = lang === "el";
  const subject = isEl
    ? "🌸 Καλώς ήρθες στην Kibloo!"
    : "🌸 Welcome to Kibloo!";
  const greeting = isEl ? `Γεια σου ${name || "φίλε"}!` : `Hi ${name || "friend"}!`;
  const intro = isEl
    ? "Είμαστε ενθουσιασμένοι που σε έχουμε στην οικογένεια Kibloo. 350+ εκπαιδευτικά παιχνίδια σε περιμένουν!"
    : "We're thrilled to have you in the Kibloo family. 350+ educational games are waiting for you!";
  const cta = isEl ? "Ξεκίνα τώρα" : "Start now";
  const trialNote = isEl
    ? "🎁 <b>Bonus:</b> Ξεκλείδωσε 14 ημέρες δωρεάν Premium — χωρίς κάρτα."
    : "🎁 <b>Bonus:</b> Unlock 14 free days of Premium — no card required.";
  const html = baseTemplate({
    title: subject,
    body: `
      <p style="font-size:16px;color:#1f2937;">${greeting}</p>
      <p style="font-size:15px;color:#4b5563;">${intro}</p>
      <div style="margin:32px 0;text-align:center;">
        <a href="${APP_URL}/play" style="background:linear-gradient(90deg,#7c3aed,#ec4899);color:#fff;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700;display:inline-block;">${cta}</a>
      </div>
      <p style="font-size:14px;color:#6b7280;">${trialNote}
        <br><a href="${APP_URL}/subscription" style="color:#7c3aed;">${isEl ? "Ενεργοποίησε δωρεάν Premium" : "Activate free Premium"}</a></p>
    `,
    lang,
  });
  return { subject, html };
}

function trialEndingTemplate({ name, daysLeft, lang = "el" }) {
  const isEl = lang === "el";
  const subject = isEl
    ? `⏰ Η δοκιμή Premium λήγει σε ${daysLeft} ημέρες`
    : `⏰ Your Premium trial ends in ${daysLeft} days`;
  const html = baseTemplate({
    title: subject,
    body: `
      <p style="font-size:16px;color:#1f2937;">${isEl ? `Γεια σου ${name || ""},` : `Hi ${name || ""},`}</p>
      <p style="font-size:15px;color:#4b5563;">
        ${isEl
          ? `Η δωρεάν δοκιμή Premium λήγει σε <b>${daysLeft} ημέρες</b>. Συνέχισε με Premium και κράτα όλα τα παιχνίδια ξεκλείδωτα.`
          : `Your free Premium trial ends in <b>${daysLeft} days</b>. Keep all games unlocked by continuing with Premium.`}
      </p>
      <div style="margin:32px 0;text-align:center;">
        <a href="${APP_URL}/subscription" style="background:linear-gradient(90deg,#f59e0b,#ef4444);color:#fff;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700;display:inline-block;">${isEl ? "Συνέχισε με Premium" : "Continue with Premium"}</a>
      </div>
      <p style="font-size:13px;color:#9ca3af;">${isEl ? "Δεν θες να συνεχίσεις; Δεν χρειάζεται να κάνεις τίποτα — η δοκιμή θα λήξει αυτόματα." : "Not interested? No action needed — your trial will end automatically."}</p>
    `,
    lang,
  });
  return { subject, html };
}

function receiptTemplate({ name, amountPaid, currency, hostedInvoiceUrl, lang = "el" }) {
  const isEl = lang === "el";
  const amt = (amountPaid / 100).toFixed(2);
  const subject = isEl ? "📄 Η απόδειξή σου από την Kibloo" : "📄 Your Kibloo receipt";
  const html = baseTemplate({
    title: subject,
    body: `
      <p style="font-size:16px;color:#1f2937;">${isEl ? `Γεια σου ${name || ""}` : `Hi ${name || ""}`},</p>
      <p style="font-size:15px;color:#4b5563;">
        ${isEl
          ? `Ευχαριστούμε για την πληρωμή σου! Χρεώθηκες <b>${amt} ${currency.toUpperCase()}</b>.`
          : `Thanks for your payment! You were charged <b>${amt} ${currency.toUpperCase()}</b>.`}
      </p>
      ${hostedInvoiceUrl ? `<div style="margin:24px 0;text-align:center;">
        <a href="${hostedInvoiceUrl}" style="background:#1f2937;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block;">${isEl ? "Δες την απόδειξη" : "View receipt"}</a>
      </div>` : ""}
    `,
    lang,
  });
  return { subject, html };
}

function paymentFailedTemplate({ name, hostedInvoiceUrl, lang = "el" }) {
  const isEl = lang === "el";
  const subject = isEl ? "⚠️ Πρόβλημα με την πληρωμή σου" : "⚠️ Payment problem";
  const html = baseTemplate({
    title: subject,
    body: `
      <p style="font-size:16px;color:#1f2937;">${isEl ? `Γεια σου ${name || ""}` : `Hi ${name || ""}`},</p>
      <p style="font-size:15px;color:#4b5563;">
        ${isEl
          ? "Δεν μπορέσαμε να ολοκληρώσουμε την τελευταία χρέωση για τη συνδρομή σου. Παρακαλούμε ενημέρωσε την κάρτα σου για να συνεχίσεις χωρίς διακοπή."
          : "We couldn't complete the last charge for your subscription. Please update your payment method to avoid interruption."}
      </p>
      ${hostedInvoiceUrl ? `<div style="margin:24px 0;text-align:center;">
        <a href="${hostedInvoiceUrl}" style="background:#ef4444;color:#fff;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:700;display:inline-block;">${isEl ? "Ενημέρωσε την κάρτα" : "Update payment"}</a>
      </div>` : ""}
    `,
    lang,
  });
  return { subject, html };
}

function baseTemplate({ title, body, lang = "el" }) {
  const isEl = lang === "el";
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.06);">
        <tr><td style="background:linear-gradient(135deg,#7c3aed,#ec4899);padding:32px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:28px;font-weight:800;letter-spacing:-.5px;">Kibloo 🌸</h1>
          <p style="margin:8px 0 0;color:#fbbf24;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">${isEl ? "Όπου η περιέργεια ανθίζει" : "Where curiosity blooms"}</p>
        </td></tr>
        <tr><td style="padding:40px 32px;">${body}</td></tr>
        <tr><td style="background:#f9fafb;padding:24px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} Kibloo · <a href="${APP_URL}" style="color:#7c3aed;text-decoration:none;">kibloo.app</a> · <a href="${APP_URL}/profile" style="color:#9ca3af;">${isEl ? "Διαχείριση email" : "Manage email"}</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── 1. Welcome email — fired on Auth user creation ──────────────────────
// Note: v2 functions don't have an onAuthCreate trigger, so we listen on a
// `users/{uid}` document creation instead — assumes the client writes this
// doc upon signup (which the existing onboarding flow already does).
export const sendWelcomeEmail = onDocumentCreated(
  {
    document: "users/{uid}",
    secrets: [RESEND_API_KEY, FROM_EMAIL_PARAM],
    region: "europe-west1",
  },
  async (event) => {
    const uid = event.params.uid;
    try {
      const userRecord = await getAuth().getUser(uid);
      const email = userRecord.email;
      if (!email) return;

      const profile = event.data?.data() || {};
      const name = profile.displayName || userRecord.displayName || email.split("@")[0];
      const lang = profile.lang || "el";

      const tpl = welcomeTemplate({ name, lang });
      const result = await sendEmail({
        to: email,
        subject: tpl.subject,
        html: tpl.html,
        replyTo: "hello@kibloo.app",
      });
      logger.info("Welcome email", { uid, email, result });
    } catch (e) {
      logger.error("sendWelcomeEmail failed", e);
    }
  },
);

// ─── 2. On-demand trigger for trial-ending email ─────────────────────────
export const sendTrialEndingEmail = onCall(
  {
    secrets: [RESEND_API_KEY, FROM_EMAIL_PARAM],
    region: "europe-west1",
  },
  async (req) => {
    if (!req.auth) throw new HttpsError("unauthenticated", "Not signed in.");
    const uid = req.auth.uid;
    const userRecord = await getAuth().getUser(uid);
    if (!userRecord.email) throw new HttpsError("failed-precondition", "No email on file.");

    const tpl = trialEndingTemplate({
      name: userRecord.displayName || "",
      daysLeft: req.data?.daysLeft || 3,
      lang: req.data?.lang || "el",
    });
    const r = await sendEmail({ to: userRecord.email, subject: tpl.subject, html: tpl.html });
    return r;
  },
);

// ─── 3. Daily scheduled job — process emailQueue + trial reminders ──────
export const scheduledTrialReminders = onSchedule(
  {
    schedule: "every day 09:00",
    timeZone: "Europe/Athens",
    secrets: [RESEND_API_KEY, FROM_EMAIL_PARAM],
    region: "europe-west1",
  },
  async () => {
    const db = getFirestore();

    // Process emailQueue (created by Stripe webhook for receipts/failed/trial_ending)
    const queueSnap = await db.collection("emailQueue")
      .where("status", "==", "pending")
      .limit(50)
      .get();

    for (const doc of queueSnap.docs) {
      const data = doc.data();
      try {
        const userRecord = await getAuth().getUser(data.uid);
        if (!userRecord.email) {
          await doc.ref.update({ status: "skipped", reason: "no-email" });
          continue;
        }
        let tpl;
        if (data.type === "trial_ending") {
          tpl = trialEndingTemplate({ name: userRecord.displayName || "", daysLeft: data.daysLeft || 3, lang: "el" });
        } else if (data.type === "receipt") {
          tpl = receiptTemplate({ name: userRecord.displayName || "", amountPaid: data.amountPaid, currency: data.currency, hostedInvoiceUrl: data.hostedInvoiceUrl, lang: "el" });
        } else if (data.type === "payment_failed") {
          tpl = paymentFailedTemplate({ name: userRecord.displayName || "", hostedInvoiceUrl: data.hostedInvoiceUrl, lang: "el" });
        } else {
          await doc.ref.update({ status: "skipped", reason: "unknown-type" });
          continue;
        }
        const r = await sendEmail({ to: userRecord.email, subject: tpl.subject, html: tpl.html });
        await doc.ref.update({
          status: r.ok ? "sent" : "failed",
          error: r.error || null,
          sentAt: FieldValue.serverTimestamp(),
        });
      } catch (e) {
        logger.error("emailQueue item failed", { id: doc.id, error: e.message });
        await doc.ref.update({ status: "failed", error: e.message });
      }
    }

    logger.info(`Processed ${queueSnap.size} queued emails`);
  },
);
