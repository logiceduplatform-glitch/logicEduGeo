# Going Live with Stripe — Production Checklist

Step-by-step playbook to switch from Stripe **test mode** to **live mode**.
Allow ~1 hour end-to-end (most of it Stripe activation).

---

## Pre-requisites

- Greek legal entity (ΑΦΜ + ΓΕΜΗ) **OR** sole trader (ατομική επιχείρηση)
- Greek/EU bank account for payouts (IBAN)
- Verified personal ID (passport / ΑΔΤ)
- Privacy policy + Terms live on `kibloo.app` (already done ✓)

---

## 1. Activate your Stripe account (Stripe Console)

1. <https://dashboard.stripe.com> → Activate Account
2. Business details:
   - **Business type**: Company / Sole proprietor
   - **Country**: Greece
   - **Industry**: Software / SaaS
   - **Website**: <https://kibloo.app>
3. Bank account for payouts (Greek IBAN)
4. Tax info: ΑΦΜ + tax office
5. Two-factor auth (2FA) — **mandatory before going live**

Wait ~24h for Stripe to verify your account.

---

## 2. Create the live products & prices

In Stripe Dashboard (toggle "View test data" **OFF**):

### Premium plan
1. Products → Create product → "Kibloo Premium"
2. Add 2 prices (recurring):
   - **€4.99/month**, EUR
   - **€39.99/year** (≈33% discount), EUR
3. Copy each `price_xxx` ID

### Family plan
1. Products → Create product → "Kibloo Family"
2. Add 2 prices:
   - **€7.99/month**
   - **€69.99/year**
3. Copy each `price_xxx` ID

---

## 3. Set up webhook (live)

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. **URL**: `https://europe-west1-logic-education-platform.cloudfunctions.net/stripeWebhook`
3. **Events to listen for**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.trial_will_end`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the **Signing secret** (`whsec_xxx`)

---

## 4. Configure Firebase Functions secrets

```bash
cd functions

# Live API keys
firebase functions:secrets:set STRIPE_SECRET_KEY
# paste: sk_live_xxx

firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
# paste: whsec_xxx (from step 3)

# Live price IDs (from step 2)
firebase functions:secrets:set STRIPE_PRICE_PREMIUM_M  # price_xxx
firebase functions:secrets:set STRIPE_PRICE_PREMIUM_Y  # price_xxx
firebase functions:secrets:set STRIPE_PRICE_FAMILY_M   # price_xxx
firebase functions:secrets:set STRIPE_PRICE_FAMILY_Y   # price_xxx

# Verify
firebase functions:secrets:access STRIPE_SECRET_KEY    # should show sk_live_…
```

---

## 5. Configure Resend (transactional email)

```bash
firebase functions:secrets:set RESEND_API_KEY
# paste: re_xxx (from https://resend.com/api-keys)

firebase functions:secrets:set FROM_EMAIL
# paste: Kibloo <hello@kibloo.app>
```

**DNS setup** (Resend → Domains → Add domain):
- `kibloo.app` → add the SPF + DKIM records they show you to your DNS
- Wait ~30min for verification

---

## 6. Deploy functions

```bash
firebase deploy --only functions
```

---

## 7. Smoke test (use a real card!)

1. Open <https://kibloo.app/subscription>
2. Pick a plan → Stripe Checkout opens in **live mode** (no longer "Test Mode" yellow banner)
3. Use a real card and run €1 payment OR use Stripe's "Use this card" with your own
4. Verify within 30s:
   - Receipt arrives by email
   - Stripe Dashboard → Payments shows the charge
   - Firestore `users/{uid}/data/subscription` has `tier: "premium"`, `status: "active"`
5. Refund yourself: Stripe Dashboard → Payments → Refund

---

## 8. Go-live checklist

- [ ] Stripe account fully activated (no warnings in dashboard)
- [ ] All 4 live prices created
- [ ] Webhook endpoint verified (Stripe shows ✅ under endpoint health)
- [ ] All 8 Firebase secrets set with `sk_live_…` / `whsec_…` values
- [ ] DNS for transactional email verified (SPF/DKIM green)
- [ ] First test payment processed and refunded successfully
- [ ] Subscription Portal accessible from `/profile` page
- [ ] Trial-end email arrives (test by manually changing trial_end in Stripe)
- [ ] Day-3 + Day-7 onboarding emails enqueue correctly (check `emailQueue` collection)

---

## Cost summary

| Service                   | Cost                       | Notes |
|---------------------------|----------------------------|-------|
| Stripe payments (EU)      | 1.4% + €0.25 per transaction | EU cards |
| Stripe payments (non-EU)  | 2.9% + €0.25                | Most international cards |
| Resend                    | Free up to 3K emails/month | $20/mo for 50K |
| Firebase Functions        | Free up to 2M invocations  | Pennies after |

For a €4.99/month Premium subscription:
- You receive: **€4.74**
- Stripe takes: **€0.25**
- Margin after VAT (24% in Greece): **€3.82**

---

## Rollback (if something goes wrong)

To switch back to test mode quickly:

```bash
# Override Stripe key with test value
firebase functions:secrets:set STRIPE_SECRET_KEY  # paste sk_test_xxx
firebase deploy --only functions:stripeWebhook,functions:createCheckoutSession,functions:createPortalSession
```

Existing subscriptions remain in live mode; only new checkouts go to test.

---

## Compliance notes (Greece)

- VAT (ΦΠΑ): Apply 24% on B2C subscriptions to Greek customers. Stripe Tax can automate this (settings → Tax).
- Issue invoices via myDATA (AADE): you must report B2B invoices to AADE within 1 day.
  - Easiest path: connect your Stripe to a Greek accounting tool (e.g., Pylon, EpsilonNet)
  - Or use the **Invoicing module** in Admin Dashboard for school accounts.
- **Right of withdrawal** (digital services): we waive it once usage starts (already in our Terms).
