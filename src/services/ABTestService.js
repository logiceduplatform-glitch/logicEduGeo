/**
 * Lightweight A/B test framework with deterministic per-user variant
 * assignment, persistent storage, and analytics integration.
 *
 * Usage:
 *   import { useExperiment } from "../services/ABTestService";
 *
 *   const variant = useExperiment("hero_cta", ["control", "urgency", "benefit"]);
 *   return variant === "urgency"
 *     ? <button>Try free for 14 days — limited time</button>
 *     : variant === "benefit"
 *     ? <button>Unlock 350+ games</button>
 *     : <button>Get started</button>;
 *
 *   // Track conversion
 *   ABTestService.trackConversion("hero_cta", "signup");
 */
import { useEffect, useState } from "react";
import { AnalyticsService } from "./AnalyticsService";

const ASSIGNMENTS_KEY = "edu:abAssignments";
const USER_ID_KEY = "edu:abUserId";

/**
 * Stable per-browser user id for variant hashing. We could also use the
 * Firebase Auth uid when available, but a stable random id works for
 * anonymous visitors too (which is most of the funnel).
 */
function getOrCreateUserId() {
  try {
    let id = localStorage.getItem(USER_ID_KEY);
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(USER_ID_KEY, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}

/**
 * Deterministic 32-bit hash so the same user always lands in the same
 * variant for a given experiment, across devices via Firebase sync (if
 * we choose to add that later) and across page reloads.
 */
function hash32(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function loadAssignments() {
  try {
    return JSON.parse(localStorage.getItem(ASSIGNMENTS_KEY) || "{}");
  } catch { return {}; }
}

function saveAssignments(map) {
  try { localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(map)); }
  catch { /* storage full */ }
}

export const ABTestService = {
  /**
   * Returns the variant for an experiment, assigning one if needed.
   * @param {string} experimentId
   * @param {string[]|object} variants - either ["control","b","c"] or
   *    { control: 0.5, b: 0.25, c: 0.25 } for weighted assignment.
   */
  getVariant(experimentId, variants) {
    const assignments = loadAssignments();
    if (assignments[experimentId]) return assignments[experimentId];

    const userId = getOrCreateUserId();
    const seed = hash32(`${userId}:${experimentId}`);
    const r = (seed % 10000) / 10000; // 0..1

    let chosen;
    if (Array.isArray(variants)) {
      const idx = Math.floor(r * variants.length);
      chosen = variants[idx];
    } else {
      const total = Object.values(variants).reduce((s, w) => s + w, 0);
      let cum = 0;
      for (const [name, weight] of Object.entries(variants)) {
        cum += weight / total;
        if (r <= cum) { chosen = name; break; }
      }
      if (!chosen) chosen = Object.keys(variants)[0];
    }

    assignments[experimentId] = chosen;
    saveAssignments(assignments);

    AnalyticsService.featureUse?.(`exp_${experimentId}_${chosen}`);
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "experiment_impression", {
        experiment_id: experimentId,
        variant: chosen,
      });
    }
    return chosen;
  },

  /**
   * Track a goal conversion for an experiment so we can compute lift later.
   */
  trackConversion(experimentId, goal = "default", value = 1) {
    const assignments = loadAssignments();
    const variant = assignments[experimentId];
    if (!variant) return; // user wasn't in this experiment

    AnalyticsService.featureUse?.(`exp_${experimentId}_${variant}_${goal}`);
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "experiment_conversion", {
        experiment_id: experimentId,
        variant,
        goal,
        value,
      });
    }
  },

  /**
   * Force a specific variant — useful for QA / preview links like
   * ?ab_hero_cta=urgency
   */
  forceVariant(experimentId, variant) {
    const assignments = loadAssignments();
    assignments[experimentId] = variant;
    saveAssignments(assignments);
  },

  /**
   * Read all current assignments (admin debug view).
   */
  getAllAssignments() {
    return loadAssignments();
  },

  /**
   * Reset assignments — useful for QA.
   */
  reset(experimentId) {
    const assignments = loadAssignments();
    if (experimentId) {
      delete assignments[experimentId];
    } else {
      saveAssignments({});
      return;
    }
    saveAssignments(assignments);
  },
};

/**
 * Apply ?ab_<experiment>=<variant> overrides from URL on page load.
 */
if (typeof window !== "undefined") {
  try {
    const params = new URLSearchParams(window.location.search);
    for (const [key, val] of params.entries()) {
      if (key.startsWith("ab_")) {
        ABTestService.forceVariant(key.slice(3), val);
      }
    }
  } catch { /* SSR or restricted env */ }
}

/**
 * React hook wrapper.
 */
export function useExperiment(experimentId, variants) {
  const [variant, setVariant] = useState(() =>
    ABTestService.getVariant(experimentId, variants),
  );
  useEffect(() => {
    setVariant(ABTestService.getVariant(experimentId, variants));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experimentId]);
  return variant;
}
