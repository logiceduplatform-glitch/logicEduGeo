# 🎓 Kibloo · Educational Gaming Platform

Διαδραστική εκπαιδευτική πλατφόρμα για παιδιά **2–12 ετών** + Ενήλικες, με **130+ features** και **59 κλασικά παιχνίδια**.

🌐 **Live:** [https://logic-education-platform.web.app](https://logic-education-platform.web.app)

---

## 📖 Documentation

### 👥 Για χρήστες
- 📘 **[USER_GUIDE.md](./USER_GUIDE.md)** — Οδηγός για μαθητές, γονείς, δασκάλους
- 📚 **[FEATURES.md](./FEATURES.md)** — Πλήρης λίστα όλων των features

### 🛡️ Για administrators
- 🛡️ **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** — Πλήρης οδηγός Admin Dashboard
- ⚙️ **[OPS.md](./OPS.md)** — Operations (Sentry, App Check, Backups, Uptime)

### 💰 Για business operations
- 💳 **[STRIPE_LIVE.md](./STRIPE_LIVE.md)** — Stripe go-live checklist
- 🛠️ **[STRIPE_SETUP.md](./STRIPE_SETUP.md)** — Initial Stripe configuration

### 🚀 Για deployment
- 📦 **[DEPLOY.md](./DEPLOY.md)** — Deployment instructions
- 🔥 **[DEPLOY_FIRESTORE.md](./DEPLOY_FIRESTORE.md)** — Firestore rules
- 🌍 **[DOMAIN_SETUP.md](./DOMAIN_SETUP.md)** — Custom domain setup
- 📱 **[CAPACITOR_SETUP.md](./CAPACITOR_SETUP.md)** — Native iOS/Android wrapping

---

## 🚀 Quick Start (για developers)

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Deploy to Firebase
npx firebase-tools deploy

# Run tests
npm test                # Unit tests (Vitest)
npm run test:smoke      # E2E smoke tests against live site (Playwright)
```

---

## 🏗️ Tech Stack

- **Frontend:** React 18 + Vite 5 + Tailwind CSS 3
- **State:** React Context + localStorage
- **Routing:** react-router-dom v6 (lazy loading)
- **Backend:** Firebase (Auth, Firestore, Functions, Hosting, App Check)
- **Payments:** Stripe (Checkout + Webhooks)
- **Email:** Resend (transactional)
- **Analytics:** Microsoft Clarity, Firebase Analytics, custom A/B testing
- **Error Tracking:** Sentry
- **i18n:** Greek + English
- **PWA:** Service Worker + offline support
- **Testing:** Vitest (unit), Playwright (E2E)

---

## 📂 Project Structure

```
src/
├── App.jsx                  # Routes + global components
├── main.jsx                 # Entry point
├── auth/                    # Firebase auth + context
├── components/              # Reusable React components
│   ├── admin/              # Admin dashboard panels
│   ├── games/              # Game shells & utilities
│   └── ...
├── pages/                   # Route-level pages
│   ├── games/              # Game-specific pages
│   └── ...
├── services/                # Business logic & API clients
│   ├── FeatureFlagService.js
│   ├── SentryService.js
│   ├── ABTestService.js
│   └── ...
├── hooks/                   # Custom React hooks
├── i18n/                    # Translation strings
├── config/                  # Constants & config (legalInfo, curriculumPacks)
└── test/                    # Unit tests

functions/                   # Firebase Cloud Functions
├── src/
│   ├── index.js            # Function exports
│   └── modules/            # backups, email, invoicing, stripe

public/                      # Static assets (sitemap, robots, manifest)
tests/e2e/                   # Playwright E2E tests
scripts/                     # Build scripts (RSS generator)
```

---

## 🎯 Key Features

| Category | Highlights |
|---|---|
| 🎮 **Games** | 100+ quizzes + 59 classic games (Wordle, 2048, Snake, Pixel Art, STEM…) |
| 🤖 **AI** | Study Buddy tutor, Math photo solver, Voice quiz, AI quiz/lesson generator |
| 🏆 **Gamification** | Trophies, pets, cards, daily challenges, leaderboards |
| 👨‍🏫 **Teacher tools** | Live quiz, worksheets, lesson plans, class reports |
| 👨‍👩‍👧 **Parent controls** | Screen time, weekly digest, multi-child, co-play |
| 💰 **Subscriptions** | Free / Premium / Family / School (Stripe) |
| 🌐 **i18n** | Full bilingual (EL + EN) |
| ♿ **Accessibility** | WCAG AA, sign language, voice commands, TTS |
| 📱 **PWA** | Installable, offline mode, push notifications |
| 🔐 **Security** | Firestore rules, App Check, Sentry, rate limiting |

> Δες την [πλήρη λίστα στο FEATURES.md](./FEATURES.md).

---

## 🎛️ Feature Flags

**130+** runtime feature flags διαχειρίζονται από το **Admin Dashboard → Feature Flags** (`/admin/flags`).
Κάθε feature μπορεί να ενεργοποιηθεί/απενεργοποιηθεί **χωρίς redeploy**.

Δες [ADMIN_GUIDE.md → Feature Flags](./ADMIN_GUIDE.md#6-feature-flags).

---

## 🆘 Need Help?

- 📧 **Support:** `support@kibloo.app`
- 💬 **Live chat:** μωβ bubble κάτω δεξιά στο site
- 🐛 **Bug reports:** `bugs@kibloo.app`
- 🟢 **Status:** [/status](https://logic-education-platform.web.app/status)

---

## 📜 License & Legal

- [Privacy Policy](https://logic-education-platform.web.app/privacy)
- [Terms of Service](https://logic-education-platform.web.app/terms)
- [Cookie Policy](https://logic-education-platform.web.app/cookies)
- [DPA](https://logic-education-platform.web.app/dpa)

GDPR + COPPA compliant.

---

**Έκδοση:** v1.0 · **Τελευταία ενημέρωση:** Μάιος 2026
