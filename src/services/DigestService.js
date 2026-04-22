import { StorageService } from "./StorageService";
import { ProgressService } from "./ProgressService";

const PREFS_KEY = "digest:preferences";

export const DigestService = {
  getPreferences() {
    return StorageService.get(PREFS_KEY) || {
      enabled: false,
      email: "",
      frequency: "weekly",
    };
  },

  setPreferences(prefs) {
    StorageService.set(PREFS_KEY, prefs);
  },

  prepareDigestData() {
    const overall = ProgressService.getOverallStats();
    const streak = ProgressService.getStreak();
    const xp = ProgressService.getXP();
    const recentGames = ProgressService.getRecentGames();
    const achievements = ProgressService.getUnlockedAchievements();

    const weeklyStats = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      weeklyStats.push({ date: ds, ...ProgressService.getDailyStats(ds) });
    }

    return {
      generatedAt: new Date().toISOString(),
      overall,
      streak,
      xp,
      recentGames,
      achievements,
      weeklyStats,
      totalGamesThisWeek: weeklyStats.reduce((s, d) => s + d.gamesPlayed, 0),
      totalCorrectThisWeek: weeklyStats.reduce((s, d) => s + d.totalCorrect, 0),
    };
  },
};
