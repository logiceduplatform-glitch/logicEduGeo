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
};
