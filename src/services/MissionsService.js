import { StorageService } from "./StorageService";

const STORAGE_KEY = "geo:dailyMissions";
const LAST_RESET_KEY = "geo:dailyMissions:lastReset";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const MISSION_TEMPLATES = [
  { id: "play3", type: "gamesPlayed", target: 3, icon: "🎮",
    title: { el: "Παίξε 3 παιχνίδια", en: "Play 3 games" },
    desc: { el: "Ολοκλήρωσε 3 παιχνίδια σήμερα", en: "Complete 3 games today" }, reward: 2 },
  { id: "play5", type: "gamesPlayed", target: 5, icon: "🏆",
    title: { el: "Παίξε 5 παιχνίδια", en: "Play 5 games" },
    desc: { el: "Ολοκλήρωσε 5 παιχνίδια σήμερα", en: "Complete 5 games today" }, reward: 3 },
  { id: "accuracy80", type: "accuracy", target: 80, icon: "🎯",
    title: { el: "80% ακρίβεια", en: "80% accuracy" },
    desc: { el: "Πέτυχε 80% ακρίβεια σε ένα παιχνίδι", en: "Achieve 80% accuracy in a game" }, reward: 2 },
  { id: "perfect", type: "perfectScore", target: 1, icon: "⭐",
    title: { el: "Τέλειο σκορ", en: "Perfect score" },
    desc: { el: "Πάρε τέλειο σκορ σε ένα παιχνίδι", en: "Get a perfect score in a game" }, reward: 3 },
  { id: "streak", type: "keepStreak", target: 1, icon: "🔥",
    title: { el: "Κράτα το σερί", en: "Keep the streak" },
    desc: { el: "Παίξε σήμερα για να κρατήσεις το σερί", en: "Play today to keep your streak" }, reward: 1 },
  { id: "tryNew", type: "newGame", target: 1, icon: "🆕",
    title: { el: "Δοκίμασε κάτι νέο", en: "Try something new" },
    desc: { el: "Παίξε ένα παιχνίδι που δεν έχεις ξαναπαίξει", en: "Play a game you haven't played before" }, reward: 2 },
  { id: "play10", type: "gamesPlayed", target: 10, icon: "🚀",
    title: { el: "Μαραθώνιος", en: "Marathon" },
    desc: { el: "Ολοκλήρωσε 10 παιχνίδια σήμερα", en: "Complete 10 games today" }, reward: 5 },
  { id: "score50", type: "totalCorrect", target: 50, icon: "💪",
    title: { el: "50 σωστές", en: "50 correct" },
    desc: { el: "Δώσε 50 σωστές απαντήσεις σήμερα", en: "Give 50 correct answers today" }, reward: 4 },
];

function pickDailyMissions(dateStr) {
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) seed = ((seed << 5) - seed + dateStr.charCodeAt(i)) | 0;
  const shuffled = [...MISSION_TEMPLATES].sort((a, b) => {
    const ha = ((seed * 31 + a.id.charCodeAt(0)) >>> 0) % 1000;
    const hb = ((seed * 31 + b.id.charCodeAt(0)) >>> 0) % 1000;
    return ha - hb;
  });
  return shuffled.slice(0, 3).map(m => ({ ...m, progress: 0, completed: false, claimed: false }));
}

export const MissionsService = {
  getMissions() {
    const today = todayStr();
    const lastReset = localStorage.getItem(LAST_RESET_KEY);
    if (lastReset !== today) {
      const missions = pickDailyMissions(today);
      StorageService.set(STORAGE_KEY, missions);
      localStorage.setItem(LAST_RESET_KEY, today);
      return missions;
    }
    return StorageService.get(STORAGE_KEY) || pickDailyMissions(today);
  },

  _save(missions) {
    StorageService.set(STORAGE_KEY, missions);
  },

  updateProgress({ gamesPlayedToday = 0, accuracyThisGame = 0, isPerfect = false, isNewGame = false, totalCorrectToday = 0 }) {
    const missions = this.getMissions();
    let changed = false;

    missions.forEach(m => {
      if (m.completed) return;
      let newProgress = m.progress;

      switch (m.type) {
        case "gamesPlayed":
          newProgress = gamesPlayedToday;
          break;
        case "accuracy":
          newProgress = Math.max(m.progress, Math.round(accuracyThisGame));
          break;
        case "perfectScore":
          if (isPerfect) newProgress = 1;
          break;
        case "keepStreak":
          if (gamesPlayedToday > 0) newProgress = 1;
          break;
        case "newGame":
          if (isNewGame) newProgress = 1;
          break;
        case "totalCorrect":
          newProgress = totalCorrectToday;
          break;
      }

      if (newProgress !== m.progress) {
        m.progress = Math.min(newProgress, m.target);
        if (m.progress >= m.target) m.completed = true;
        changed = true;
      }
    });

    if (changed) this._save(missions);
    return missions;
  },

  claimReward(missionId) {
    const missions = this.getMissions();
    const m = missions.find(x => x.id === missionId);
    if (m && m.completed && !m.claimed) {
      m.claimed = true;
      this._save(missions);
      return m.reward;
    }
    return 0;
  },

  getTodayGamesPlayed() {
    const today = todayStr();
    const stats = StorageService.get("progress:daily") || {};
    return stats[today]?.gamesPlayed || 0;
  },

  getTodayCorrect() {
    const today = todayStr();
    const stats = StorageService.get("progress:daily") || {};
    return stats[today]?.correct || 0;
  },
};
