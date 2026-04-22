import { ACHIEVEMENTS } from "../config/achievements";
import { ProgressService } from "./ProgressService";

/**
 * Checks all achievements against current stats + last game result.
 * Returns an array of newly unlocked achievement IDs.
 */
export function checkNewAchievements(progressCtx, lastGame = null) {
  const unlocked = progressCtx.getUnlockedAchievements();
  const overall = progressCtx.getOverallStats();
  const streak = progressCtx.getStreak();
  const monthly = progressCtx.getMonthlyStats();

  let maxDifficulty = 1;
  const allProgress = progressCtx.getAllGameProgress();
  for (const [, data] of Object.entries(allProgress)) {
    if (data?.currentDifficulty > maxDifficulty) {
      maxDifficulty = data.currentDifficulty;
    }
  }

  const stats = {
    totalGamesPlayed: overall.totalGamesPlayed,
    totalCorrect: overall.totalCorrect,
    totalAttempts: overall.totalAttempts,
    streak: streak.current,
    bestStreak: streak.best,
    maxDifficulty,
    monthlyCorrect: monthly.totalCorrect,
  };

  const newlyUnlocked = [];

  for (const achievement of ACHIEVEMENTS) {
    if (unlocked.includes(achievement.id)) continue;
    try {
      if (achievement.condition(stats, lastGame)) {
        newlyUnlocked.push(achievement.id);
      }
    } catch {
      // skip malformed conditions
    }
  }

  return newlyUnlocked;
}

export function getAchievementById(id) {
  return ACHIEVEMENTS.find((a) => a.id === id) || null;
}
