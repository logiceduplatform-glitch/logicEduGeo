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

  // ── Funnels ───────────────────────────────────────────────────────────
  // Track structured progression through key conversion funnels. Each step
  // is logged with funnel name + step index, so we can visualise drop-off
  // in any analytics tool.
  funnelStep(funnel, step, label, extra = {}) {
    log("funnel_step", { funnel, step, label, ...extra });
    log(`funnel_${funnel}_${label}`, extra);
  },

  // Convenience wrappers for the most important conversion funnels.
  signupFunnel(step, extra = {}) {
    // Steps: 1 land, 2 view_signup, 3 fill_form, 4 submit, 5 verified
    this.funnelStep("signup", step.idx, step.name, extra);
  },

  trialFunnel(step, extra = {}) {
    // Steps: 1 view_pricing, 2 click_trial, 3 trial_started, 4 trial_active_d3, 5 converted
    this.funnelStep("trial", step.idx, step.name, extra);
  },

  paidFunnel(step, extra = {}) {
    // Steps: 1 view_pricing, 2 click_plan, 3 stripe_redirect, 4 stripe_return, 5 paid
    this.funnelStep("paid", step.idx, step.name, extra);
  },

  trialStarted() {
    log("trial_started", { plan: "premium", duration_days: 14 });
    this.trialFunnel({ idx: 3, name: "trial_started" });
  },

  trialConverted(plan, period) {
    log("trial_converted", { plan, period });
    this.trialFunnel({ idx: 5, name: "converted" }, { plan, period });
  },

  // ── Retention ─────────────────────────────────────────────────────────
  // Lightweight client-side retention buckets. Each session we calculate
  // days since first visit and emit a single retention bucket per session.
  trackRetention() {
    const KEY = "edu:firstSeen";
    const SESSION_KEY = "edu:retentionLogged";
    try {
      let firstSeen = localStorage.getItem(KEY);
      if (!firstSeen) {
        firstSeen = String(Date.now());
        localStorage.setItem(KEY, firstSeen);
        log("user_first_seen", {});
        return;
      }
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");

      const days = Math.floor((Date.now() - Number(firstSeen)) / (24 * 60 * 60 * 1000));
      let bucket = "d0";
      if (days >= 1)  bucket = "d1";
      if (days >= 3)  bucket = "d3";
      if (days >= 7)  bucket = "d7";
      if (days >= 14) bucket = "d14";
      if (days >= 30) bucket = "d30";
      if (days >= 90) bucket = "d90";
      log("retention_session", { bucket, days });
    } catch {
      /* storage blocked */
    }
  },

  trackEngagement(action, value = 1) {
    log("engagement", { action, value });
  },

  // Fire when a user reaches a milestone (level up, achievement, etc.)
  milestone(name, value = null) {
    log("milestone", { name, ...(value != null && { value }) });
  },

  // Generic event for marketing surfaces (newsletter, blog reads, A/B tests).
  track(name, params = {}) {
    log(name, params);
  },
};

// Auto-track retention on module load (once per session).
if (typeof window !== "undefined") {
  setTimeout(() => AnalyticsService.trackRetention(), 2000);
}
