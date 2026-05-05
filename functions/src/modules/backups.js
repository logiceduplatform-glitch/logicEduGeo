/**
 * Firestore daily backup → GCS bucket.
 *
 * Setup BEFORE first deploy:
 *   1. Create a GCS bucket for backups (one-time):
 *        gcloud storage buckets create gs://kibloo-firestore-backups \
 *          --project=logic-education-platform \
 *          --location=europe-west1 \
 *          --uniform-bucket-level-access
 *
 *   2. Set Object Lifecycle to delete files older than 30 days:
 *        cat > lifecycle.json <<EOF
 *        {
 *          "lifecycle": {
 *            "rule": [{ "action": { "type": "Delete" },
 *                       "condition": { "age": 30 } }]
 *          }
 *        }
 *        EOF
 *        gcloud storage buckets update gs://kibloo-firestore-backups \
 *          --lifecycle-file=lifecycle.json
 *
 *   3. Grant the Cloud Functions service account export permissions:
 *        export PROJECT_ID=logic-education-platform
 *        export SA="${PROJECT_ID}@appspot.gserviceaccount.com"
 *        gcloud projects add-iam-policy-binding $PROJECT_ID \
 *          --member="serviceAccount:$SA" \
 *          --role="roles/datastore.importExportAdmin"
 *        gcloud storage buckets add-iam-policy-binding \
 *          gs://kibloo-firestore-backups \
 *          --member="serviceAccount:$SA" \
 *          --role="roles/storage.admin"
 *
 *   4. Enable required API:
 *        gcloud services enable firestore.googleapis.com --project=$PROJECT_ID
 *
 *   5. Deploy: firebase deploy --only functions:scheduledFirestoreBackup
 *
 * Schedule: Every day at 03:00 Europe/Athens.
 * Retention: Handled by GCS lifecycle (30 days). Backups are stored as
 *            gs://kibloo-firestore-backups/YYYY-MM-DD/
 *
 * Restore (manual, in case of disaster):
 *   gcloud firestore import gs://kibloo-firestore-backups/2026-05-04
 */

import { onSchedule } from "firebase-functions/v2/scheduler";
import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import admin from "firebase-admin";

const PROJECT_ID = process.env.GCLOUD_PROJECT || "logic-education-platform";
const BUCKET = process.env.BACKUP_BUCKET || "kibloo-firestore-backups";

/**
 * Trigger an export of ALL Firestore collections to the backup bucket.
 * Returns the operation name (used for monitoring).
 */
async function exportFirestore(prefix) {
  const databaseName = `projects/${PROJECT_ID}/databases/(default)`;
  const outputUriPrefix = `gs://${BUCKET}/${prefix}`;

  // We use the underlying REST API via google-auth from firebase-admin since
  // there is no native admin.firestore().export() method in the JS SDK.
  const accessToken = await admin.app().options.credential.getAccessToken();
  const url = `https://firestore.googleapis.com/v1/${databaseName}:exportDocuments`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ outputUriPrefix }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore export failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  logger.info("Firestore export started", { name: data.name, output: outputUriPrefix });
  return data.name;
}

/**
 * Daily scheduled backup. Runs at 03:00 Europe/Athens.
 */
export const scheduledFirestoreBackup = onSchedule(
  {
    schedule: "0 3 * * *",
    timeZone: "Europe/Athens",
    region: "europe-west1",
    retryCount: 2,
    memory: "256MiB",
    timeoutSeconds: 540,
  },
  async () => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    try {
      await exportFirestore(today);
    } catch (err) {
      logger.error("Daily Firestore backup failed", { error: err?.message });
      throw err;
    }
  },
);

/**
 * Manual trigger for emergency / on-demand backups.
 * Restricted: requires an authorized header to prevent abuse.
 *
 * Usage:
 *   curl -X POST https://<region>-<project>.cloudfunctions.net/manualFirestoreBackup \
 *     -H "X-Backup-Key: <BACKUP_API_KEY>"
 */
export const manualFirestoreBackup = onRequest(
  {
    region: "europe-west1",
    memory: "256MiB",
    timeoutSeconds: 540,
    cors: false,
  },
  async (req, res) => {
    const expected = process.env.BACKUP_API_KEY || "";
    const provided = req.get("X-Backup-Key") || "";
    if (!expected || provided !== expected) {
      res.status(403).send("Forbidden");
      return;
    }
    const tag = `manual-${Date.now()}`;
    try {
      const op = await exportFirestore(tag);
      res.status(200).json({ ok: true, operation: op, prefix: tag });
    } catch (err) {
      logger.error("Manual backup failed", { error: err?.message });
      res.status(500).json({ ok: false, error: err?.message });
    }
  },
);
