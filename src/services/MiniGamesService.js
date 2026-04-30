// Daily Mini-Games: bite-sized games (30-90 seconds) that rotate daily.
// Each user can play each mini-game once per day for full reward.
// After that, they can replay for fun but earn no rewards.

const KEY_PLAYS = "geo:minigame-plays";

export const MINI_GAMES = [
  { id: "memory_flip", title: { el: "🃏 Μνήμη", en: "🃏 Memory" }, time: 60, reward: 20 },
  { id: "math_sprint", title: { el: "🧮 Μαθηματικά Sprint", en: "🧮 Math Sprint" }, time: 60, reward: 20 },
  { id: "word_scramble", title: { el: "🔤 Ανακάτεμα Λέξεων", en: "🔤 Word Scramble" }, time: 90, reward: 25 },
  { id: "reaction_tap", title: { el: "⚡ Αντανακλαστικά", en: "⚡ Reaction Tap" }, time: 30, reward: 15 },
  { id: "color_match", title: { el: "🎨 Ταίριασμα Χρωμάτων", en: "🎨 Color Match" }, time: 45, reward: 15 },
];

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const MiniGamesService = {
  getAll: () => MINI_GAMES,
  get: (id) => MINI_GAMES.find((g) => g.id === id) || null,

  /** Returns map { gameId: { score, claimedReward, at } } for today. */
  getTodayPlays() {
    try {
      const all = JSON.parse(localStorage.getItem(KEY_PLAYS) || "{}");
      return all[todayKey()] || {};
    } catch { return {}; }
  },

  /** Has the user already claimed today's reward for this game? */
  hasClaimedToday(gameId) {
    return !!this.getTodayPlays()[gameId]?.claimedReward;
  },

  /** Save a play & claim reward (only first play per day rewards). */
  recordPlay(gameId, score) {
    try {
      const all = JSON.parse(localStorage.getItem(KEY_PLAYS) || "{}");
      const k = todayKey();
      if (!all[k]) all[k] = {};
      const wasClaimed = !!all[k][gameId]?.claimedReward;
      all[k][gameId] = {
        score,
        claimedReward: wasClaimed || true, // first play claims
        at: Date.now(),
      };
      localStorage.setItem(KEY_PLAYS, JSON.stringify(all));
      return !wasClaimed; // returns true if reward should be granted
    } catch { return false; }
  },

  /** Aggregate streak of consecutive days played. */
  getDaysStreak() {
    try {
      const all = JSON.parse(localStorage.getItem(KEY_PLAYS) || "{}");
      let streak = 0;
      for (let i = 0; i < 365; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        if (all[k] && Object.keys(all[k]).length > 0) {
          streak++;
        } else if (i > 0) break;
      }
      return streak;
    } catch { return 0; }
  },

  todayKey,
};
