import { logEvent } from "firebase/analytics";
import { analytics } from "../auth/firebase";

function log(eventName, params = {}) {
  if (!analytics) return;
  try {
    logEvent(analytics, eventName, params);
  } catch {
    // Analytics not available (blocked, localhost, etc.)
  }
}

export const AnalyticsService = {
  pageView(pageName) {
    log("page_view", { page_title: pageName });
  },

  gameStart(gameId, category) {
    log("game_start", { game_id: gameId, category });
  },

  gameComplete(gameId, score, total) {
    log("game_complete", { game_id: gameId, score, total });
  },

  search(query, resultsCount) {
    log("search", { search_term: query, results_count: resultsCount });
  },

  signup(method) {
    log("sign_up", { method });
  },

  login(method) {
    log("login", { method });
  },

  subscribe(plan, period) {
    log("begin_checkout", { plan, period });
  },

  favorite(gameId) {
    log("add_to_favorites", { game_id: gameId });
  },

  onboardingStep(step, role) {
    log("onboarding_step", { step, role });
  },

  onboardingComplete(role) {
    log("onboarding_complete", { role });
  },

  classroomEnroll(classroomCode) {
    log("classroom_enroll", { classroom_code: classroomCode });
  },

  classroomCreate(classroomCode) {
    log("classroom_create", { classroom_code: classroomCode });
  },

  quizCreate(quizId) {
    log("quiz_create", { quiz_id: quizId });
  },

  quizAssign(quizCode, classroomCode) {
    log("quiz_assign", { quiz_code: quizCode, classroom_code: classroomCode });
  },

  subscriptionView(currentTier) {
    log("subscription_view", { current_tier: currentTier });
  },

  referralShare(method) {
    log("referral_share", { method });
  },

  featureUse(featureName) {
    log("feature_use", { feature: featureName });
  },
};
