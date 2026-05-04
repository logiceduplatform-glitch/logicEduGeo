// Spaced Repetition System (SRS)
//
// Lightweight SM-2-inspired algorithm tuned for kids' learning.
// Tracks each "card" (here: a question/concept the child has seen) and
// schedules the next review based on whether the answer was correct.
//
// Why SM-2 instead of full Anki?
//   - SM-2 is simple, well-understood, and produces excellent retention.
//   - We swap the 4-quality scale for a friendlier 3-state input
//     (wrong / okay / great) which maps cleanly to game results.
//
// Storage shape (per profile, scoped via StorageService):
//   { [cardId]: { ef, reps, interval, dueAt, lastSeen, correctStreak } }
// where ef ∈ [1.3, 2.5] is the easiness factor.

import { StorageService } from "./StorageService";

const SRS_KEY = "srs:cards";
const MIN_EF = 1.3;
const DEFAULT_EF = 2.5;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function loadAll() {
  return StorageService.get(SRS_KEY) || {};
}

function saveAll(data) {
  StorageService.set(SRS_KEY, data);
}

/**
 * Advance an SM-2 card based on a quality grade ∈ {0,1,2}:
 *   0 → wrong   (reset to 1-day review)
 *   1 → okay    (slow growth)
 *   2 → great   (fast growth)
 */
function nextScheduling(card, grade) {
  const prev = card || { ef: DEFAULT_EF, reps: 0, interval: 0, correctStreak: 0 };
  let { ef, reps, interval, correctStreak } = prev;

  if (grade === 0) {
    reps = 0;
    correctStreak = 0;
    interval = 1;
  } else {
    reps += 1;
    correctStreak = (correctStreak || 0) + 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = grade === 2 ? 6 : 3;
    else interval = Math.round(prev.interval * ef);
    if (interval > 90) interval = 90; // cap at 3 months for kids
  }

  // Easiness factor adjustment (SM-2 formula, adapted for 3-grade scale)
  const q = grade === 0 ? 0 : grade === 1 ? 3 : 5;
  ef = ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (ef < MIN_EF) ef = MIN_EF;

  return {
    ef: +ef.toFixed(3),
    reps,
    interval,
    correctStreak,
    dueAt: Date.now() + interval * ONE_DAY_MS,
    lastSeen: Date.now(),
  };
}

export const SRSService = {
  /**
   * Submit a review result for a card. `grade` is one of:
   *   "wrong" | "okay" | "great"
   * Returns the updated card.
   */
  review(cardId, grade) {
    const data = loadAll();
    const gradeNum = grade === "wrong" ? 0 : grade === "great" ? 2 : 1;
    const updated = nextScheduling(data[cardId], gradeNum);
    data[cardId] = updated;
    saveAll(data);
    return updated;
  },

  /**
   * All cards that are due now (or overdue). Sorted by oldest-first.
   */
  getDueCards(now = Date.now()) {
    const data = loadAll();
    return Object.entries(data)
      .filter(([, v]) => (v.dueAt || 0) <= now)
      .map(([cardId, v]) => ({ cardId, ...v }))
      .sort((a, b) => (a.dueAt || 0) - (b.dueAt || 0));
  },

  /**
   * All cards regardless of due time (used for stats).
   */
  getAll() {
    const data = loadAll();
    return Object.entries(data).map(([cardId, v]) => ({ cardId, ...v }));
  },

  /**
   * Aggregate stats for a child's learning health.
   */
  getStats(now = Date.now()) {
    const cards = this.getAll();
    if (cards.length === 0) {
      return { total: 0, due: 0, mature: 0, learning: 0, avgEf: 0, accuracy: 0 };
    }
    let due = 0, mature = 0, learning = 0, sumEf = 0;
    cards.forEach((c) => {
      if ((c.dueAt || 0) <= now) due++;
      if (c.interval >= 21) mature++;
      else learning++;
      sumEf += c.ef || 0;
    });
    return {
      total: cards.length,
      due,
      mature,
      learning,
      avgEf: +(sumEf / cards.length).toFixed(2),
      maturityRate: +((mature / cards.length) * 100).toFixed(1),
    };
  },

  /**
   * Reset everything (for testing / "start over").
   */
  reset() {
    saveAll({});
  },

  /**
   * Convenience: log a quiz result. `correct` boolean produces a "great"
   * if instant, "okay" if slow, "wrong" if false.
   */
  logQuizResult({ cardId, correct, timeMs = 0 }) {
    if (!cardId) return null;
    const grade = !correct ? "wrong" : timeMs < 5000 ? "great" : "okay";
    return this.review(cardId, grade);
  },
};

export default SRSService;
