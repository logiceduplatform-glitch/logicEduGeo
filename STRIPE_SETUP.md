# Stripe Subscription Setup Guide

## Overview

The subscription system uses:
- **Stripe** for payment processing
- **PHP** on your shared hosting for checkout session creation and webhook handling
- **Firebase Firestore** for storing subscription status (read by the React app in real-time)

## Step 1: Create a Stripe Account

1. Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Create an account (you can start in **Test Mode**)
3. Note: You stay in Test Mode until you activate your account for live payments

## Step 2: Create Products & Prices in Stripe

In the Stripe Dashboard (make sure "Test mode" toggle is ON):

1. Go to **Products** > **Add product**
2. Create **Premium** product:
   - Name: `Premium`
   - Add pricing:
     - Monthly: **€4.99** / month (recurring)
     - Yearly: **€49.99** / year (recurring)
3. Create **Family** product:
   - Name: `Family`
   - Add pricing:
     - Monthly: **€7.99** / month (recurring)
     - Yearly: **€79.99** / year (recurring)
4. Copy each **Price ID** (starts with `price_...`)

## Step 3: Get Your API Keys

1. Go to **Developers** > **API keys**
2. Copy:
   - **Publishable key** (`pk_test_...`)
   - **Secret key** (`sk_test_...`)

## Step 4: Set Up Webhook

1. Go to **Developers** > **Webhooks** > **Add endpoint**
2. Endpoint URL: `https://yourdomain.com/api/stripe-webhook.php`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Click **Add endpoint**
5. Copy the **Signing secret** (`whsec_...`)

## Step 5: Firebase Service Account

The webhook needs to write to Firestore using a service account:

1. Go to [Firebase Console](https://console.firebase.google.com) > Your Project
2. **Project Settings** (gear icon) > **Service Accounts**
3. Click **Generate New Private Key** > **Generate Key**
4. Save the downloaded JSON file as `firebase-service-account.json`
5. Upload it to your hosting's `api/` folder (next to the PHP files)

> **Security**: Make sure this file is NOT publicly accessible! Add it to `.htaccess`:
> ```apache
> <Files "firebase-service-account.json">
>     Order allow,deny
>     Deny from all
> </Files>
> ```

## Step 6: Configure PHP Files

Edit `api/stripe-config.php` on your hosting:

```php
define('STRIPE_SECRET_KEY', 'sk_test_YOUR_KEY_HERE');
define('STRIPE_PUBLISHABLE_KEY', 'pk_test_YOUR_KEY_HERE');
define('STRIPE_WEBHOOK_SECRET', 'whsec_YOUR_SECRET_HERE');

define('STRIPE_PRICES', [
    'premium_monthly' => 'price_ACTUAL_ID_1',
    'premium_yearly'  => 'price_ACTUAL_ID_2',
    'family_monthly'  => 'price_ACTUAL_ID_3',
    'family_yearly'   => 'price_ACTUAL_ID_4',
]);

define('FRONTEND_URL', 'https://logic-education-platform.web.app');
```

## Step 7: Upload PHP Files to Hosting

Upload these files to your shared hosting's `api/` folder:
- `stripe-config.php`
- `stripe-checkout.php`
- `stripe-webhook.php`
- `firebase-service-account.json`

Make sure PHP has `curl` and `openssl` extensions enabled (most hosts have them).

## Step 8: Configure Frontend

Add to your `.env` file:
```
VITE_STRIPE_API_URL=https://yourdomain.com/api
```

Then rebuild and deploy:
```bash
npx vite build
# Deploy the dist/ folder to Firebase Hosting or your hosting
```

## Step 9: Protect the Service Account File

Add to `api/.htaccess`:
```apache
<Files "firebase-service-account.json">
    Order allow,deny
    Deny from all
</Files>

<Files "stripe-config.php">
    Order allow,deny
    Deny from all
</Files>
```

## Testing

### Test with Stripe Test Cards

Use these test card numbers in Stripe Checkout:
- **Success**: `4242 4242 4242 4242` (any future expiry, any CVC)
- **Declined**: `4000 0000 0000 0002`
- **Requires auth**: `4000 0025 0000 3155`

### Test Flow

1. Log in to the app
2. Go to Subscription page
3. Choose Premium or Family plan
4. Toggle Monthly/Yearly
5. Click "Choose" - you'll be redirected to Stripe Checkout
6. Use test card `4242 4242 4242 4242`
7. After payment, you'll be redirected back with `?success=true`
8. The webhook fires and updates Firestore
9. Your app's real-time listener picks up the change immediately

### Webhook Testing (Local)

For local testing, use the Stripe CLI:
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:8000/stripe-webhook.php
# Copy the webhook signing secret it gives you
```

## Going Live

When ready for real payments:

1. Activate your Stripe account (submit business details)
2. Switch from test keys to live keys (`sk_live_...`, `pk_live_...`)
3. Create live products/prices (or copy from test mode)
4. Update `stripe-config.php` with live keys and price IDs
5. Create a live webhook endpoint with the same events
6. Update the webhook signing secret

## Data Flow

```
User clicks "Choose Plan"
    → React calls PHP stripe-checkout.php (with Firebase token)
    → PHP creates Stripe Checkout Session
    → User redirected to Stripe's hosted checkout page
    → User pays with card
    → Stripe redirects back to app (?success=true)
    → Stripe sends webhook to stripe-webhook.php
    → PHP verifies webhook signature
    → PHP writes to Firestore: users/{uid}/data/subscription
    → React's onSnapshot listener detects change
    → UI updates immediately to show premium status
```
