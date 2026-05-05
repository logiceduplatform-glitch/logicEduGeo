# 🛡️ Kibloo · Οδηγός Διαχειριστή (Admin Guide)

> Πλήρης οδηγός χρήσης του Admin Dashboard.
> Απευθύνεται σε **διαχειριστές πλατφόρμας** (`logic.edu.platform@gmail.com`).

---

## 📑 Περιεχόμενα

1. [Πρόσβαση & Είσοδος](#1-πρόσβαση--είσοδος)
2. [Επισκόπηση Dashboard](#2-επισκόπηση-dashboard)
3. [Χρήστες](#3-χρήστες)
4. [Συνδρομές & Πληρωμές](#4-συνδρομές--πληρωμές)
5. [Premium Content (per game)](#5-premium-content-per-game)
6. [Feature Flags](#6-feature-flags)
7. [School / B2B Invoicing](#7-school--b2b-invoicing)
8. [Analytics (A/B Tests)](#8-analytics-ab-tests)
9. [Feedback Inbox](#9-feedback-inbox)
10. [Push Notifications](#10-push-notifications)
11. [Email Queue](#11-email-queue)
12. [Error Reports](#12-error-reports)
13. [Moderation](#13-moderation)
14. [Content Library](#14-content-library)
15. [Logs](#15-logs)
16. [System Health](#16-system-health)
17. [Best Practices](#17-best-practices)

---

## 1. Πρόσβαση & Είσοδος

### Ποιος έχει admin πρόσβαση
- **Production admin email:** `logic.edu.platform@gmail.com`
- Ορίζεται μέσω custom claim `admin: true` στο Firebase Auth.

### Πώς συνδέεσαι
1. Πήγαινε στο `/auth/login`.
2. Login με το admin email.
3. Πήγαινε στο `/admin` ή κλικ στο "🛡️ Admin" στο user menu.

### Asset 2FA
Συνιστάται να ενεργοποιήσεις 2FA στον Google λογαριασμό που χρησιμοποιείται.

---

## 2. Επισκόπηση Dashboard

**Route:** `/admin`

Πρώτη οθόνη — δείχνει top-level metrics:
- 👥 Σύνολο χρηστών (free / premium / family / school)
- 💰 MRR (Monthly Recurring Revenue) — Stripe
- 🎮 Active games last 24h
- 🐛 Open error reports
- 📧 Pending email queue

**Component:** `AdminOverview.jsx`

---

## 3. Χρήστες

**Route:** `/admin/users`

### Δυνατότητες
- 🔍 Αναζήτηση με email/uid/username.
- 👤 Λεπτομέρειες χρήστη: subscription status, registration date, last login.
- 🎁 **Grant premium**: Δωρεάν Premium για X μήνες (π.χ. influencer).
- ⏸️ **Suspend** account (μη αναστρέψιμα actions απαιτούν confirmation).
- 🗑️ **Delete** account + όλα τα data (GDPR right to erasure).
- 🔄 **Reset password** email.

**Component:** `AdminUsers.jsx`

---

## 4. Συνδρομές & Πληρωμές

**Route:** `/admin/subscriptions`

### Δυνατότητες
- 📊 Live MRR, Churn Rate, ARPU.
- 📋 Λίστα ενεργών subscriptions με filter ανά plan.
- 🔄 **Refund** μέσω Stripe (one-click).
- ❌ **Cancel** subscription (immediate ή end-of-period).
- 📈 Trial conversions chart (πόσοι trials → paid).

**Component:** `AdminSubscriptions.jsx`

---

## 5. Premium Content (per game)

**Route:** `/admin/premium`

### Πώς δουλεύει
- Λίστα **όλων** των παιχνιδιών με toggle "Premium".
- Toggle ανά **παιχνίδι** (όχι ανά κατηγορία).
- Όταν ένα παιχνίδι γίνει "Premium", οι Free χρήστες βλέπουν gradient + "Αναβάθμιση".

### Τι αλλάζει σε σχέση με τα flags
- Τα **flags** ελέγχουν αν το παιχνίδι **εμφανίζεται καθόλου**.
- Το **Premium toggle** ελέγχει αν είναι **κλειδωμένο** για Free users.

**Component:** `AdminPremium.jsx`

---

## 6. Feature Flags

**Route:** `/admin/flags`

### Τι είναι
Κάθε feature στην πλατφόρμα έχει ένα flag. Με ένα toggle μπορείς να το ανοίξεις/κλείσεις **σε όλους τους χρήστες ταυτόχρονα**, χωρίς redeploy.

### Δομή
Τα flags οργανώνονται σε **κατηγορίες** (dropdown filter πάνω αριστερά):

| Κατηγορία | Παράδειγμα flags |
|---|---|
| 💳 Συνδρομές | `subs_premium`, `subs_trial`, `subs_school` |
| 🎮 Παιχνίδια ανά Ηλικία | `games_age_6_school`, `games_age_9_10_logic` |
| 🕹️ Κλασικά Παιχνίδια | `classicGames_quickWins`, `classicGames_homeBanner` |
| 🎓 Μαθητές | `battleRoyale`, `pet`, `adventureMap` |
| 🤖 AI | `aiTutor`, `aiPhotoSolver`, `aiVoiceQuiz` |
| 🏆 Πρόοδος | `trophyRoom`, `leaderboard`, `srs` |
| 👨‍🏫 Δάσκαλοι | `liveQuiz`, `worksheets`, `aiQuizGen` |
| 👨‍👩‍👧 Γονείς | `screenTime`, `weeklyDigest`, `parentTeacherChat` |
| 🤝 Multiplayer | `onlineBattle`, `friendChallenges`, `liveClassroom` |
| 🏢 B2B | `schoolAdmin`, `kidLogin`, `affiliate` |
| 🚀 Onboarding | `welcomeQuest`, `feedbackWidget` |
| 📈 Marketing | `marketing_blog`, `marketing_newsletter`, `marketing_comparison` |
| 📊 Analytics | `analytics_clarity`, `sentry_enabled`, `appcheck_enabled` |
| 💼 Business | `supportWidget`, `schoolInvoicing`, `onboardingEmails_day3` |

### Πώς γίνεται toggle
1. Επίλεξε κατηγορία από το dropdown.
2. Βρες το flag.
3. Κλίκ στο toggle → αλλαγή instant για όλους.

### Search
Πάνω δεξιά υπάρχει search field — βρίσκει με όνομα ή label.

### ⚠️ Master toggles
Κάποια flags είναι "master switches" — αν τα κλείσεις, **κλείνουν όλα τα παιδιά τους**:
- `subs_enabled` → όλο το σύστημα συνδρομών
- `classicGames_master` → όλα τα 59 classic games
- Κάθε `games_age_<X>` → όλη η ηλικιακή ομάδα

### Καλές πρακτικές
- ✅ Κάνε **soft launch** features με flag OFF, ενεργοποίησέ το όταν είσαι έτοιμος.
- ✅ Δοκίμασε νέα features με `analytics_*` ON για να δεις engagement.
- ⚠️ Μην κλείσεις `subs_enabled` σε production (όλοι θα γίνουν Free!).
- ⚠️ Μην κλείσεις `appcheck_enabled` αν είσαι κάτω από spam attack — αυτό σε προστατεύει.

**Component:** `AdminFlags.jsx`

---

## 7. School / B2B Invoicing

**Route:** `/admin/invoicing`

### Δυνατότητες
- 📝 **Create Invoice**: εισάγεις customer email, school name, line items.
- 📤 **Auto-send via Stripe**: Stripe email + hosted invoice URL.
- 📋 **Λίστα past invoices** με status (open/paid/void).
- 👁️ **View** PDF / hosted page.
- ❌ **Void** unpaid invoices.

### Backend
- Cloud Function `createSchoolInvoice` → Stripe API → Firestore mirror.
- Cloud Function `voidSchoolInvoice` → Stripe void + Firestore update.

**Component:** `AdminInvoicing.jsx`

---

## 8. Analytics (A/B Tests)

**Route:** `/admin/analytics`

### Δυνατότητες
- 📊 Λίστα ενεργών A/B tests.
- Per-variant: impressions, conversions, CTR%, lift vs control.
- 📈 95% confidence intervals (Wald method).
- ✅ Statistical significance flag (Z-test, p < 0.05).

### Πώς δημιουργείς νέο A/B test
A/B tests ορίζονται στον κώδικα (`src/services/ABTestService.js`). Για νέο test:
1. Πρόσθεσε definition: `experimentId`, variants `['control', 'variant_a']`.
2. Στο component σου, κάλεσε `ABTestService.assign(experimentId)`.
3. Στο conversion event, κάλεσε `ABTestService.convert(experimentId)`.

**Component:** `AdminAnalytics.jsx`

---

## 9. Feedback Inbox

**Route:** `/admin/feedback`

### Δυνατότητες
- Λίστα feedback από το floating widget.
- Filter ανά score (😞→🤩), σελίδα, role.
- Mark as read / starred.
- Export CSV.

**Component:** `AdminFeedback.jsx`
**Source data:** Firestore collection `feedback`.

---

## 10. Push Notifications

**Route:** `/admin/push`

### Δυνατότητες
- 📢 Στείλε broadcast push σε όλους / specific segment (ηλικία, plan).
- Schedule for later.
- Δες delivery stats (sent / opened / clicked).

**Component:** `AdminPush.jsx`

---

## 11. Email Queue

**Route:** `/admin/email-queue`

### Δυνατότητες
- 📧 Λίστα pending/sent/failed emails.
- Δες template name, recipient, error message (αν failed).
- **Retry** failed emails.

**Component:** `AdminEmailQueue.jsx`
**Backend:** Firestore collection `emailQueue`, processed by Cloud Function `processEmailQueue`.

---

## 12. Error Reports

**Route:** `/admin/errors`

### Δυνατότητες
- 🐛 Λίστα errors από Sentry + custom error reporting.
- Group ανά stack trace.
- **Mark as resolved**.
- Stack trace, user context, browser/OS info.

**Component:** `AdminErrorReports.jsx`

> **Tip:** Για deep error investigation πήγαινε στο Sentry dashboard (link στο OPS.md).

---

## 13. Moderation

**Route:** `/admin/moderation`

### Δυνατότητες
- 🚨 Reported users / posts / quiz comments.
- ✅ Approve / ❌ Remove / 🚫 Ban.
- Audit log όλων των actions.

**Component:** `AdminModeration.jsx`

---

## 14. Content Library

**Route:** `/admin/content`

### Δυνατότητες
- 📚 Διαχείριση quizzes, ασκήσεων, theory.
- ➕ Add new question (manual ή AI-generated).
- ✏️ Edit existing.
- 🌐 Bilingual editor (EL + EN side-by-side).

**Component:** `AdminContent.jsx`

---

## 15. Logs

**Route:** `/admin/logs`

### Δυνατότητες
- 📜 Audit log: ποιος admin άλλαξε τι και πότε.
- Filter ανά admin, action type, date range.
- Read-only (immutable).

**Component:** `AdminLogs.jsx`

---

## 16. System Health

**Route:** `/admin/system`

### Δυνατότητες
- 🟢 Live health checks (Auth, Firestore, Functions, Hosting).
- 📊 Quotas: Firestore reads/writes today, Functions invocations.
- 💾 Last backup timestamp.
- 🔗 Direct link στο `/status` (public version).

**Component:** `AdminSystem.jsx`

---

## 17. Best Practices

### 🔐 Security
- ✅ Πάντα 2FA στον admin Google account.
- ✅ Logout όταν τελειώνεις (ειδικά σε public computers).
- ⚠️ ΜΗΝ μοιράζεσαι credentials. Αν χρειάζεσαι 2ο admin, πρόσθεσε νέο email στα Firebase custom claims.

### 📊 Daily routine (5 λεπτά)
1. `/admin` → check overview metrics.
2. `/admin/errors` → resolve νέα errors (ή delegate σε dev).
3. `/admin/feedback` → δες τις τελευταίες απαντήσεις.
4. `/admin/email-queue` → retry failed emails αν υπάρχουν.

### 📈 Weekly routine (15 λεπτά)
1. `/admin/subscriptions` → MRR, churn, conversion rate.
2. `/admin/analytics` → A/B test results, declare winners.
3. `/admin/users` → review νέους suspended/reported users.
4. `/admin/system` → confirm last backup έγινε επιτυχώς.

### ⚠️ Πριν κάνεις destructive action
- Delete user → λάβε υπόψη GDPR (αναπόφευκτο, αλλά log it).
- Refund → confirm με customer πρώτα.
- Disable master flag → ενημέρωσε team αν υπάρχει downtime impact.
- Void invoice → ίσως καλύτερα credit note για audit trail.

---

## 🆘 Όταν κάτι πάει στραβά

| Σύμπτωμα | Πρώτο βήμα |
|---|---|
| Site down | `/status` ή `/admin/system` → check service status |
| Πληρωμές δεν λειτουργούν | Stripe Dashboard → Webhooks → check signatures |
| Emails δεν φεύγουν | `/admin/email-queue` → check failed reasons (Resend API status) |
| Spam signups | `/admin/users` → ban + ενεργοποίησε `appcheck_enabled` (αν off) |
| Slow performance | Sentry Performance tab + `/admin/system` → check Firestore quota |

---

## 📚 Σχετικά

- [`FEATURES.md`](./FEATURES.md) — Πλήρης λίστα features
- [`USER_GUIDE.md`](./USER_GUIDE.md) — Οδηγός χρηστών
- [`OPS.md`](./OPS.md) — Operations (Sentry, App Check, Backups)
- [`STRIPE_LIVE.md`](./STRIPE_LIVE.md) — Stripe go-live

---

**Τελευταία ενημέρωση:** Μάιος 2026
