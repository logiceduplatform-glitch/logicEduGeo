# Kibloo · Operational Stack

This guide covers the **production operational stack** of Kibloo. Each section
describes how to set up an external service and what it gives you.

> Total monthly cost (free tiers): **€0** — every service below has a generous
> free plan that covers our launch needs.

---

## Table of contents

1. [Sentry — Error & Performance Tracking](#1-sentry)
2. [Firebase App Check — Anti-Abuse](#2-firebase-app-check)
3. [Firestore Backups — Disaster Recovery](#3-firestore-backups)
4. [UptimeRobot — Uptime Monitoring](#4-uptimerobot)
5. [Microsoft Clarity — Heatmaps & Sessions](#5-microsoft-clarity)
6. [Status Page](#6-status-page)
7. [Health Check Cheat-Sheet](#7-health-check)

---

## 1. Sentry

Real-time error tracking + performance traces for production users.

**Free tier**: 5,000 errors/month, 1 team member.

### Setup (5 minutes)

1. Go to <https://sentry.io> and create a free account.
2. Create a project: **Platform = React**, **Alert = email**, **Team = #default**.
3. Copy the DSN from *Settings → Projects → kibloo → Client Keys*.
4. Add to `.env`:
   ```bash
   VITE_SENTRY_DSN=https://abc@o123.ingest.sentry.io/456
   VITE_SENTRY_ENV=production
   VITE_SENTRY_RELEASE=kibloo@1.0.0
   ```
5. (Optional) Upload source maps on each deploy:
   ```bash
   npm install --save-dev @sentry/cli
   npx sentry-cli releases new kibloo@1.0.0
   npx sentry-cli releases files kibloo@1.0.0 upload-sourcemaps dist
   npx sentry-cli releases finalize kibloo@1.0.0
   ```

### Verify

After deploy, throw a test error from the browser console:
```js
throw new Error("sentry-smoke-test");
```
You should see it within 30s in the Sentry dashboard.

### Toggle from Admin

Admin Dashboard → Feature Flags → `sentry_enabled`.

---

## 2. Firebase App Check

Stops bots, scrapers and curl from abusing your Firebase backend.

### Setup

1. **Google reCAPTCHA Admin** → <https://www.google.com/recaptcha/admin>
   - Register a new site
   - Type: **reCAPTCHA v3**
   - Domains: `kibloo.app`, `logic-education-platform.web.app`, `localhost` (for dev)
   - Copy the **Site key** (starts with `6L…`)

2. **Firebase Console** → App Check → Web app (`kibloo`)
   - Provider: **reCAPTCHA v3**
   - Paste the Site key
   - Token TTL: 1 hour (default)

3. Add to `.env`:
   ```bash
   VITE_RECAPTCHA_V3_SITE_KEY=6Lxxxxx
   ```

4. **Start in monitoring mode** (DON'T enforce yet):
   - Console → App Check → APIs → Firestore: **Unenforced**
   - Watch the dashboard for a few days; ensure < 1% of requests are unverified.
   - When healthy → switch to **Enforced**.

### Local development

The service auto-enables debug tokens in DEV mode. Look for the token in the
browser console output, then add it to:
*Firebase Console → App Check → Web → ⋯ → Manage debug tokens*.

### Toggle from Admin

Admin Dashboard → Feature Flags → `appcheck_enabled`.

---

## 3. Firestore Backups

Daily automatic backups of all Firestore collections to Google Cloud Storage.
Retained for 30 days.

### One-time setup

```bash
export PROJECT_ID=logic-education-platform
export BUCKET=kibloo-firestore-backups

# 1. Create the GCS bucket (use a region close to Firestore)
gcloud storage buckets create gs://$BUCKET \
  --project=$PROJECT_ID \
  --location=europe-west1 \
  --uniform-bucket-level-access

# 2. Set 30-day lifecycle policy
cat > /tmp/lifecycle.json <<'EOF'
{
  "lifecycle": {
    "rule": [{ "action": { "type": "Delete" },
               "condition": { "age": 30 } }]
  }
}
EOF
gcloud storage buckets update gs://$BUCKET --lifecycle-file=/tmp/lifecycle.json

# 3. Grant Cloud Functions service account export rights
SA="${PROJECT_ID}@appspot.gserviceaccount.com"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SA" \
  --role="roles/datastore.importExportAdmin"

gcloud storage buckets add-iam-policy-binding gs://$BUCKET \
  --member="serviceAccount:$SA" \
  --role="roles/storage.admin"

# 4. Enable required API
gcloud services enable firestore.googleapis.com --project=$PROJECT_ID

# 5. Deploy the backup function
firebase deploy --only functions:scheduledFirestoreBackup
```

### Verify

Trigger the function manually from Firebase Console → Functions → ⋯ → Test:
```bash
gcloud scheduler jobs run firebase-schedule-scheduledFirestoreBackup-europe-west1 \
  --project=$PROJECT_ID --location=europe-west1
```

After 5 minutes you should see a folder `gs://kibloo-firestore-backups/YYYY-MM-DD/`.

### Restore (in a disaster)

```bash
# CAUTION: this OVERWRITES current Firestore data.
gcloud firestore import gs://kibloo-firestore-backups/2026-05-04 \
  --project=$PROJECT_ID
```

---

## 4. UptimeRobot

Free monitoring service. 5-minute checks, email + SMS alerts on downtime.

### Setup (3 minutes)

1. <https://uptimerobot.com> → Free account.
2. Add new monitor:
   - **Type**: HTTP(s)
   - **URL**: `https://logic-education-platform.web.app/status`
   - **Friendly name**: Kibloo · Web
   - **Interval**: 5 minutes
   - **Alert contacts**: Your email
3. Add a second monitor with **Keyword** type:
   - **URL**: same as above
   - **Keyword**: `All systems operational`
   - **Alert when**: keyword *not* found
4. Optional: Public status page → set up via UptimeRobot dashboard, share URL
   on `/status` page (next to the dot indicator).

### What this catches
- DNS resolution failures
- TLS/cert expiry
- Hosting downtime
- Firebase outages (because `/status` page probes Firestore in-browser)

---

## 5. Microsoft Clarity

Free heatmaps + session recordings + rage-click detection. Already integrated.

Toggle: Admin Dashboard → Feature Flags → `analytics_clarity`.

If not configured yet:

1. <https://clarity.microsoft.com> → New project
2. Copy the project ID
3. Set in `src/services/ClarityService.js` `CLARITY_PROJECT_ID`

---

## 6. Status Page

Public health page at <https://logic-education-platform.web.app/status>.

Performs in-browser checks against:
- Web Hosting (always OK if page loads)
- Firebase Auth (SDK init)
- Firestore (read latency)
- Cloud Functions (DNS reachability)

The string **"All systems operational"** appears when everything is green —
that's why UptimeRobot uses it as a keyword check.

---

## 7. Health check

Quick smoke test before deploying anything to production:

```bash
# 1. Lint
npm run lint

# 2. Tests
npm test -- --run

# 3. Build
npm run build

# 4. Local preview
npm run preview
# → open http://localhost:4173, do a visual sanity check

# 5. Deploy
npx firebase-tools deploy --only hosting
# or for everything: firebase deploy
```

After deploy, run this checklist:

- [ ] `/status` shows all green
- [ ] No errors in browser console on home page
- [ ] Sign in works (if Firebase configured)
- [ ] One game loads & plays
- [ ] Sentry receives a test event (`throw new Error("smoke")`)
- [ ] Lighthouse Performance ≥ 80 on `/`

---

## Cost summary (free tiers)

| Service               | Free tier               | Paid tier kicks in      |
|-----------------------|-------------------------|-------------------------|
| Sentry                | 5K errors / month       | $26/mo (50K events)     |
| Firebase App Check    | Unlimited (free)        | n/a                     |
| Firestore Backups     | Free export op + GCS    | ~$0.02/GB/mo storage    |
| UptimeRobot           | 50 monitors, 5-min      | $7/mo (1-min)           |
| Microsoft Clarity     | Unlimited (free)        | n/a                     |

Total at launch: **€0/mo** until you exceed free tiers (months in).
