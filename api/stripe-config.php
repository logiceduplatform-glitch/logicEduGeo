<?php
/**
 * Stripe + Firebase configuration for subscription payments.
 *
 * SETUP:
 * 1. Create a Stripe account at https://stripe.com
 * 2. In Stripe Dashboard (Test Mode), create 4 prices:
 *    - Premium Monthly, Premium Yearly, Family Monthly, Family Yearly
 * 3. Fill in the price IDs below
 * 4. Create a webhook endpoint pointing to your-domain.com/api/stripe-webhook.php
 *    with events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
 * 5. Copy the webhook signing secret below
 */

// Stripe API keys (use test keys for development)
define('STRIPE_SECRET_KEY', 'sk_test_XXXXXXXXXXXXXXXXXXXXXXXX');
define('STRIPE_PUBLISHABLE_KEY', 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXX');
define('STRIPE_WEBHOOK_SECRET', 'whsec_XXXXXXXXXXXXXXXXXXXXXXXX');

// Stripe Price IDs (create these in Stripe Dashboard > Products)
define('STRIPE_PRICES', [
    'premium_monthly' => 'price_XXXXXXXX',
    'premium_yearly'  => 'price_XXXXXXXX',
    'family_monthly'  => 'price_XXXXXXXX',
    'family_yearly'   => 'price_XXXXXXXX',
]);

// Firebase project config
define('FIREBASE_PROJECT_ID', 'logic-education-platform');

// Firebase service account JSON file path (for Firestore writes from webhook)
// Download from Firebase Console > Project Settings > Service Accounts > Generate New Private Key
define('FIREBASE_SERVICE_ACCOUNT_PATH', __DIR__ . '/firebase-service-account.json');

// Frontend URLs
define('FRONTEND_URL', 'https://logic-education-platform.web.app');
define('SUCCESS_URL', FRONTEND_URL . '/subscription?success=true');
define('CANCEL_URL', FRONTEND_URL . '/subscription?cancelled=true');

// Allowed origins for CORS
define('STRIPE_ALLOWED_ORIGINS', [
    'https://logic-education-platform.web.app',
    'https://logic-education-platform.firebaseapp.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
]);
