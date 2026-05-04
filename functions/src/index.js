/**
 * Kibloo Cloud Functions entrypoint.
 *
 * Each capability lives in its own module under ./modules so cold-start
 * stays small. We re-export only what we need to keep the function
 * surface area minimal and explicit.
 */
import { initializeApp } from "firebase-admin/app";

initializeApp();

// Stripe — checkout + portal + webhook
export {
  createCheckoutSession,
  createPortalSession,
  stripeWebhook,
} from "./modules/stripe.js";

// Transactional email
export {
  sendWelcomeEmail,
  sendTrialEndingEmail,
  scheduledTrialReminders,
} from "./modules/email.js";

// Push notifications (FCM)
export {
  sendPushToUser,
  processPushCampaign,
} from "./modules/push.js";
