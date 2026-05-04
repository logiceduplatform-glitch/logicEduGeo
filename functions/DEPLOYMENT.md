# Cloud Functions Deployment Guide

## Prerequisites

1. **Upgrade Firebase project to Blaze plan** (required for Cloud Functions).
   Go to https://console.firebase.google.com/project/logic-education-platform/usage/details
2. **Stripe account**:
   - Create products & prices in Stripe Dashboard for: Premium Monthly, Premium Yearly, Family Monthly, Family Yearly.
   - Note each `price_xxx` id.
3. **Resend account** (free tier: 3000 emails/mo):
   - Sign up at https://resend.com
   - Verify your domain (kibloo.app) — add DNS records.
   - Generate an API key.

## Setting Secrets

Run these commands (you'll be prompted to paste each value):

```bash
# From project root
cd functions

# Stripe secrets
firebase functions:secrets:set STRIPE_SECRET_KEY        # sk_live_xxx
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET    # whsec_xxx (after creating webhook below)
firebase functions:secrets:set STRIPE_PRICE_PREMIUM_M   # price_xxx
firebase functions:secrets:set STRIPE_PRICE_PREMIUM_Y   # price_xxx
firebase functions:secrets:set STRIPE_PRICE_FAMILY_M    # price_xxx
firebase functions:secrets:set STRIPE_PRICE_FAMILY_Y    # price_xxx

# Resend (email) secrets
firebase functions:secrets:set RESEND_API_KEY           # re_xxx
firebase functions:secrets:set FROM_EMAIL               # "Kibloo <hello@kibloo.app>"
```

## Deploy

```bash
# From project root
firebase deploy --only functions
```

## Set up Stripe Webhook

After first deploy, get the webhook URL:

```bash
firebase functions:list | grep stripeWebhook
# Or check https://console.firebase.google.com/project/logic-education-platform/functions
```

Then in Stripe Dashboard → Developers → Webhooks → Add endpoint:

- **URL**: `https://europe-west1-logic-education-platform.cloudfunctions.net/stripeWebhook`
- **Events to send**:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `customer.subscription.trial_will_end`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

After creating, copy the **Signing secret** (`whsec_xxx`) and set:

```bash
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
firebase deploy --only functions:stripeWebhook
```

## Test

```bash
# Local emulator
cd functions
npm run serve

# View logs in production
firebase functions:log --only stripeWebhook
```

## Customer Lifecycle Flow

1. User clicks "Subscribe" on `/subscription` page
2. Client calls `createCheckoutSession` Cloud Function
3. Stripe Checkout opens, user pays (or starts 14-day trial)
4. Stripe redirects back to `/subscription?success=true`
5. Webhook fires `checkout.session.completed` + `customer.subscription.created`
6. Webhook updates Firestore at `users/{uid}/data/subscription`
7. Client's onSnapshot listener sees the change → `isPremium` becomes true
8. 11 days later, Stripe fires `customer.subscription.trial_will_end`
9. Webhook adds entry to `emailQueue`
10. Daily scheduled job (`scheduledTrialReminders`) sends the email via Resend
