/**
 * Push notification dispatcher.
 *
 * Two paths:
 *   1. sendPushToUser  — onCall, send a single push to one user (admin tool)
 *   2. processPushCampaign — Firestore trigger when an admin creates a
 *      `pushCampaigns/{id}` doc with audience + payload.
 *
 * Audience filters:
 *   - "all"            — every user with a push token
 *   - "premium"        — users with an active paid subscription
 *   - "trial"          — users currently in trial
 *   - "inactive7d"     — users who haven't opened the app for 7+ days
 *   - { uids: [...] }  — explicit list
 */
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";
import { getMessaging } from "firebase-admin/messaging";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

async function isAdmin(auth) {
  if (!auth) return false;
  if (auth.token.email === "logic.edu.platform@gmail.com") return true;
  if (auth.token.admin === true) return true;
  try {
    const snap = await getFirestore().collection("admins").doc(auth.uid).get();
    return snap.exists;
  } catch { return false; }
}

async function getTokensForAudience(audience) {
  const db = getFirestore();
  if (Array.isArray(audience?.uids)) {
    const tokens = [];
    for (const uid of audience.uids.slice(0, 1000)) {
      const t = await db.doc(`users/${uid}/data/pushToken`).get();
      if (t.exists && t.data().token) tokens.push({ uid, token: t.data().token });
    }
    return tokens;
  }

  // Iterate users (admin should keep audiences modest — for >10k use BigQuery export).
  const usersSnap = await db.collection("users").limit(2000).get();
  const out = [];
  for (const u of usersSnap.docs) {
    const uid = u.id;
    const tokDoc = await db.doc(`users/${uid}/data/pushToken`).get();
    if (!tokDoc.exists || !tokDoc.data().token) continue;

    if (audience === "all") {
      out.push({ uid, token: tokDoc.data().token });
      continue;
    }

    const subDoc = await db.doc(`users/${uid}/data/subscription`).get();
    const sub = subDoc.exists ? subDoc.data() : {};

    if (audience === "premium" && (sub.tier === "premium" || sub.tier === "family") && sub.status === "active") {
      out.push({ uid, token: tokDoc.data().token });
    } else if (audience === "trial" && sub.status === "trialing") {
      out.push({ uid, token: tokDoc.data().token });
    } else if (audience === "inactive7d") {
      const profile = u.data();
      const lastSeen = profile?.lastActiveAt?.toMillis?.() || 0;
      if (Date.now() - lastSeen > 7 * 24 * 60 * 60 * 1000) {
        out.push({ uid, token: tokDoc.data().token });
      }
    }
  }
  return out;
}

async function sendBatch(messages) {
  if (!messages.length) return { successCount: 0, failureCount: 0 };
  // sendEach handles up to 500 messages and returns per-token success/failure.
  const response = await getMessaging().sendEach(messages);
  return {
    successCount: response.successCount,
    failureCount: response.failureCount,
    errors: response.responses
      .map((r, i) => ({ idx: i, error: r.error?.message }))
      .filter((r) => r.error),
  };
}

// ─── 1. Single push (admin tool) ─────────────────────────────────────────
export const sendPushToUser = onCall(
  { region: "europe-west1" },
  async (req) => {
    if (!(await isAdmin(req.auth))) {
      throw new HttpsError("permission-denied", "Admin only.");
    }
    const { uid, title, body, url } = req.data || {};
    if (!uid || !title) throw new HttpsError("invalid-argument", "uid + title required.");

    const tokDoc = await getFirestore().doc(`users/${uid}/data/pushToken`).get();
    if (!tokDoc.exists) throw new HttpsError("not-found", "No push token for this user.");

    const message = {
      token: tokDoc.data().token,
      notification: { title, body: body || "" },
      data: { url: url || "/" },
      webpush: {
        fcmOptions: { link: url || "/" },
      },
    };
    try {
      const messageId = await getMessaging().send(message);
      return { ok: true, messageId };
    } catch (e) {
      logger.error("sendPushToUser failed", e);
      throw new HttpsError("internal", e.message);
    }
  },
);

// ─── 2. Campaign processor — fires when a doc is added to pushCampaigns ──
export const processPushCampaign = onDocumentCreated(
  {
    document: "pushCampaigns/{campaignId}",
    region: "europe-west1",
    timeoutSeconds: 540,
  },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;
    const ref = event.data.ref;

    try {
      await ref.update({ status: "processing", startedAt: FieldValue.serverTimestamp() });

      const tokens = await getTokensForAudience(data.audience || "all");
      if (!tokens.length) {
        await ref.update({ status: "completed", recipients: 0, completedAt: FieldValue.serverTimestamp() });
        return;
      }

      const messages = tokens.map(({ token }) => ({
        token,
        notification: { title: data.title, body: data.body || "" },
        data: { url: data.url || "/" },
        webpush: { fcmOptions: { link: data.url || "/" } },
      }));

      // Send in chunks of 500 (FCM limit).
      const stats = { successCount: 0, failureCount: 0, errors: [] };
      for (let i = 0; i < messages.length; i += 500) {
        const r = await sendBatch(messages.slice(i, i + 500));
        stats.successCount += r.successCount;
        stats.failureCount += r.failureCount;
        if (r.errors) stats.errors.push(...r.errors.slice(0, 5));
      }

      await ref.update({
        status: "completed",
        recipients: tokens.length,
        successCount: stats.successCount,
        failureCount: stats.failureCount,
        sampleErrors: stats.errors.slice(0, 10),
        completedAt: FieldValue.serverTimestamp(),
      });
    } catch (e) {
      logger.error("processPushCampaign failed", e);
      await ref.update({
        status: "failed",
        error: e.message,
        completedAt: FieldValue.serverTimestamp(),
      });
    }
  },
);
