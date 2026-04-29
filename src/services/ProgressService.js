import { StorageService } from "./StorageService";
import { SyncService } from "./SyncService";
import { AnalyticsService } from "./AnalyticsService";
import { CoinService } from "./CoinService";
import { MissionsService } from "./MissionsService";
import { CertificateService } from "./CertificateService";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function monthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function dayIndex() {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

export const ProgressService = {
  // ─── Per-game progress ──────────────────────────────────────────

  getGameProgress(gameId) {
    return StorageService.get(`progress:game:${gameId}`) || {
      gamesPlayed: 0,
      bestScore: 0,
      totalCorrect: 0,
      totalAttempts: 0,
      currentDifficulty: 1,
      lastPlayedAt: null,
      history: [],
    };
  },

  recordGameComplete({ gameId, title, score, total, category, difficulty }) {
    const existing = this.getGameProgress(gameId);
    const entry = { date: new Date().toISOString(), score, total, difficulty: difficulty || existing.currentDifficulty };

    const updated = {
      ...existing,
      gamesPlayed: existing.gamesPlayed + 1,
      bestScore: Math.max(existing.bestScore, score),
      totalCorrect: existing.totalCorrect + score,
      totalAttempts: existing.totalAttempts + total,
      lastPlayedAt: entry.date,
      currentDifficulty: existing.currentDifficulty,
      history: [...existing.history.slice(-19), entry],
    };

    StorageService.set(`progress:game:${gameId}`, updated);
    SyncService.syncProgress(gameId, updated);
    this._updateDailyStats(score, total);
    this._updateMonthlyStats(score);
    this._updateStreak();
    this._updateOverall(score, total);
    this.addXP(score, difficulty || existing.currentDifficulty);
    this._setRecentGame({ title: title || gameId, score, total, category, gameId });
    AnalyticsService.gameComplete(gameId, score, total);

    try {
      const isNew = existing.gamesPlayed === 0;
      const ds = this.getDailyStats();
      const dailyGames = ds.gamesPlayed || 0;
      const dailyCorrect = ds.totalCorrect || 0;
      MissionsService.updateProgress({
        gamesPlayedToday: dailyGames,
        accuracyThisGame: total > 0 ? (score / total) * 100 : 0,
        isPerfect: total > 0 && score === total,
        isNewGame: isNew,
        totalCorrectToday: dailyCorrect,
      });
    } catch (_) { /* missions are non-critical */ }

    try {
      const overall = this.getOverallStats();
      const xpData = this.getXP();
      const streakData = this.getStreak();
      const newCerts = CertificateService.checkMilestones({
        gamesPlayed: overall.totalGamesPlayed,
        level: xpData.level,
        streak: streakData.current,
        correct: overall.totalCorrect,
      });
      if (newCerts.length > 0) {
        window.dispatchEvent(new CustomEvent("geo:milestone", { detail: newCerts[0] }));
      }
    } catch (_) { /* certificates are non-critical */ }

    return updated;
  },

  // ─── Difficulty ─────────────────────────────────────────────────

  getDifficulty(gameId) {
    return this.getGameProgress(gameId).currentDifficulty;
  },

  setDifficulty(gameId, level) {
    const existing = this.getGameProgress(gameId);
    existing.currentDifficulty = Math.max(1, Math.min(5, level));
    StorageService.set(`progress:game:${gameId}`, existing);
    SyncService.syncProgress(gameId, existing);
  },

  // ─── Recent / in-progress tracking ─────────────────────────────

  _setRecentGame(data) {
    StorageService.set("progress:recent", data);
    const list = this.getRecentGames();
    const filtered = list.filter((g) => g.gameId !== data.gameId);
    filtered.unshift(data);
    StorageService.set("progress:recentList", filtered.slice(0, 10));
  },

  getRecentGame() {
    return StorageService.get("progress:recent") || null;
  },

  getRecentGames() {
    return StorageService.get("progress:recentList") || [];
  },

  // ─── Favorites ──────────────────────────────────────────────────

  getFavorites() {
    return StorageService.get("progress:favorites") || [];
  },

  toggleFavorite(gameId) {
    const favs = this.getFavorites();
    const idx = favs.indexOf(gameId);
    const removing = idx >= 0;
    if (removing) {
      favs.splice(idx, 1);
      SyncService.syncFavoriteRemove(gameId);
    } else {
      favs.push(gameId);
      SyncService.syncFavoriteAdd(gameId);
      AnalyticsService.favorite(gameId);
    }
    StorageService.set("progress:favorites", favs);
    return favs;
  },

  isFavorite(gameId) {
    return this.getFavorites().includes(gameId);
  },

  setInProgressGame({ title, index, length, score, categoryId }) {
    StorageService.set("progress:inProgress", { title, index, length, score, categoryId });
  },

  getInProgressGame() {
    return StorageService.get("progress:inProgress") || null;
  },

  // ─── Daily stats ────────────────────────────────────────────────

  _updateDailyStats(correct, total) {
    const key = `stats:daily:${todayKey()}`;
    const existing = StorageService.get(key) || { gamesPlayed: 0, totalCorrect: 0, minutesPlayed: 0 };
    existing.gamesPlayed += 1;
    existing.totalCorrect += correct;
    StorageService.set(key, existing);
    SyncService.syncStat(key, existing);
  },

  getDailyStats(dateStr) {
    return StorageService.get(`stats:daily:${dateStr || todayKey()}`) || { gamesPlayed: 0, totalCorrect: 0, minutesPlayed: 0 };
  },

  addMinutesPlayed(minutes) {
    const key = `stats:daily:${todayKey()}`;
    const existing = StorageService.get(key) || { gamesPlayed: 0, totalCorrect: 0, minutesPlayed: 0 };
    existing.minutesPlayed += minutes;
    StorageService.set(key, existing);
    SyncService.syncStat(key, existing);
  },

  // ─── Monthly stats ──────────────────────────────────────────────

  _updateMonthlyStats(correct) {
    const key = `stats:monthly:${monthKey()}`;
    const existing = StorageService.get(key) || { totalCorrect: 0, gamesPlayed: 0 };
    existing.totalCorrect += correct;
    existing.gamesPlayed += 1;
    StorageService.set(key, existing);
    SyncService.syncStat(key, existing);
  },

  getMonthlyStats(mk) {
    return StorageService.get(`stats:monthly:${mk || monthKey()}`) || { totalCorrect: 0, gamesPlayed: 0 };
  },

  // ─── Streak ─────────────────────────────────────────────────────

  _updateStreak() {
    const streakData = StorageService.get("stats:streak") || { current: 0, best: 0, lastActiveDate: null };
    const today = todayKey();

    if (streakData.lastActiveDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

    if (streakData.lastActiveDate === yesterdayStr) {
      streakData.current += 1;
    } else {
      streakData.current = 1;
    }

    streakData.best = Math.max(streakData.best, streakData.current);
    streakData.lastActiveDate = today;
    StorageService.set("stats:streak", streakData);
    SyncService.syncStat("stats:streak", streakData);
  },

  getStreak() {
    return StorageService.get("stats:streak") || { current: 0, best: 0, lastActiveDate: null };
  },

  // ─── Weekly grid ────────────────────────────────────────────────

  getWeeklyGrid() {
    const grid = Array(7).fill(false);
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - ((now.getDay() + 6) % 7) + i);
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const stats = StorageService.get(`stats:daily:${ds}`);
      grid[i] = stats ? stats.gamesPlayed > 0 : false;
    }
    return grid;
  },

  // ─── Overall stats ──────────────────────────────────────────────

  _updateOverall(correct, total) {
    const overall = StorageService.get("stats:overall") || { totalGamesPlayed: 0, totalCorrect: 0, totalAttempts: 0 };
    overall.totalGamesPlayed += 1;
    overall.totalCorrect += correct;
    overall.totalAttempts += total;
    StorageService.set("stats:overall", overall);
    SyncService.syncStat("stats:overall", overall);
  },

  getOverallStats() {
    return StorageService.get("stats:overall") || { totalGamesPlayed: 0, totalCorrect: 0, totalAttempts: 0 };
  },

  // ─── Achievements ───────────────────────────────────────────────

  getUnlockedAchievements() {
    return StorageService.get("achievements:unlocked") || [];
  },

  unlockAchievement(achievementId) {
    const list = this.getUnlockedAchievements();
    if (!list.includes(achievementId)) {
      list.push(achievementId);
      StorageService.set("achievements:unlocked", list);
      SyncService.syncStat("achievements:unlocked", list);
      const timestamps = StorageService.get("achievements:timestamps") || {};
      timestamps[achievementId] = new Date().toISOString();
      StorageService.set("achievements:timestamps", timestamps);
    }
  },

  getAchievementTimestamps() {
    return StorageService.get("achievements:timestamps") || {};
  },

  // ─── All game progress (for dashboard) ──────────────────────────

  getAllGameProgress() {
    return StorageService.getAll("progress:game:");
  },

  getDailyStatsRange(days = 30) {
    const results = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      results.push({ date: ds, ...this.getDailyStats(ds) });
    }
    return results;
  },

  // ─── XP / Level System ─────────────────────────────────────────
  getXP() {
    return StorageService.get("stats:xp") || { totalXP: 0, level: 1 };
  },

  addXP(score, difficulty = 1) {
    const prevMilestone = CoinService.getLastXPMilestone();
    const xpData = this.getXP();
    const earned = score * 10 + difficulty * 5;
    xpData.totalXP += earned;
    xpData.level = Math.floor(Math.sqrt(xpData.totalXP / 50)) + 1;
    StorageService.set("stats:xp", xpData);
    SyncService.syncStat("stats:xp", xpData);

    const newMilestone = Math.floor(xpData.totalXP / 50);
    if (newMilestone > prevMilestone) {
      const coinsEarned = newMilestone - prevMilestone;
      CoinService.earn(coinsEarned);
      CoinService.setLastXPMilestone(newMilestone);
    }

    try {
      import("../config/petConfig").then(m => { try { m.awardPetXP(Math.max(1, Math.round(earned / 4))); } catch {} });
    } catch {}

    return { earned, totalXP: xpData.totalXP, level: xpData.level };
  },

  getXPForNextLevel() {
    const { level } = this.getXP();
    return level * level * 50;
  },

  getXPProgress() {
    const { totalXP, level } = this.getXP();
    const currentLevelXP = (level - 1) * (level - 1) * 50;
    const nextLevelXP = level * level * 50;
    const progress = nextLevelXP > currentLevelXP ? (totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP) : 1;
    return Math.min(1, Math.max(0, progress));
  },
};
