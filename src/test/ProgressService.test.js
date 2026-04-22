import { describe, it, expect, beforeEach } from 'vitest';
import { ProgressService } from '../services/ProgressService';

describe('ProgressService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getGameProgress', () => {
    it('returns default values for unknown game', () => {
      const progress = ProgressService.getGameProgress('unknownGame');
      expect(progress).toEqual({
        gamesPlayed: 0,
        bestScore: 0,
        totalCorrect: 0,
        totalAttempts: 0,
        currentDifficulty: 1,
        lastPlayedAt: null,
        history: [],
      });
    });
  });

  describe('recordGameComplete', () => {
    it('increments games played', () => {
      ProgressService.recordGameComplete({
        gameId: 'chess', title: 'Chess', score: 5, total: 10, category: 'board',
      });
      const progress = ProgressService.getGameProgress('chess');
      expect(progress.gamesPlayed).toBe(1);
    });

    it('tracks best score', () => {
      ProgressService.recordGameComplete({ gameId: 'math', title: 'Math', score: 5, total: 10, category: 'logic' });
      ProgressService.recordGameComplete({ gameId: 'math', title: 'Math', score: 8, total: 10, category: 'logic' });
      ProgressService.recordGameComplete({ gameId: 'math', title: 'Math', score: 3, total: 10, category: 'logic' });

      const progress = ProgressService.getGameProgress('math');
      expect(progress.bestScore).toBe(8);
    });

    it('accumulates total correct and attempts', () => {
      ProgressService.recordGameComplete({ gameId: 'g1', title: 'G1', score: 3, total: 5, category: 'fun' });
      ProgressService.recordGameComplete({ gameId: 'g1', title: 'G1', score: 4, total: 5, category: 'fun' });

      const progress = ProgressService.getGameProgress('g1');
      expect(progress.totalCorrect).toBe(7);
      expect(progress.totalAttempts).toBe(10);
    });

    it('keeps history limited to 20 entries', () => {
      for (let i = 0; i < 25; i++) {
        ProgressService.recordGameComplete({ gameId: 'g1', title: 'G1', score: i, total: 10, category: 'fun' });
      }
      const progress = ProgressService.getGameProgress('g1');
      expect(progress.history.length).toBeLessThanOrEqual(20);
    });

    it('sets lastPlayedAt', () => {
      ProgressService.recordGameComplete({ gameId: 'g1', title: 'G1', score: 5, total: 10, category: 'fun' });
      const progress = ProgressService.getGameProgress('g1');
      expect(progress.lastPlayedAt).toBeTruthy();
    });
  });

  describe('difficulty', () => {
    it('defaults to difficulty 1', () => {
      expect(ProgressService.getDifficulty('newgame')).toBe(1);
    });

    it('setDifficulty changes the level', () => {
      ProgressService.setDifficulty('g1', 3);
      expect(ProgressService.getDifficulty('g1')).toBe(3);
    });

    it('clamps difficulty between 1 and 5', () => {
      ProgressService.setDifficulty('g1', 0);
      expect(ProgressService.getDifficulty('g1')).toBe(1);

      ProgressService.setDifficulty('g1', 10);
      expect(ProgressService.getDifficulty('g1')).toBe(5);
    });
  });

  describe('favorites', () => {
    it('starts with empty favorites', () => {
      expect(ProgressService.getFavorites()).toEqual([]);
    });

    it('toggleFavorite adds a game', () => {
      ProgressService.toggleFavorite('chess');
      expect(ProgressService.isFavorite('chess')).toBe(true);
    });

    it('toggleFavorite removes a favorited game', () => {
      ProgressService.toggleFavorite('chess');
      ProgressService.toggleFavorite('chess');
      expect(ProgressService.isFavorite('chess')).toBe(false);
    });

    it('supports multiple favorites', () => {
      ProgressService.toggleFavorite('chess');
      ProgressService.toggleFavorite('math');
      expect(ProgressService.getFavorites()).toEqual(['chess', 'math']);
    });
  });

  describe('recent games', () => {
    it('getRecentGame returns null initially', () => {
      expect(ProgressService.getRecentGame()).toBeNull();
    });

    it('recordGameComplete tracks recent game', () => {
      ProgressService.recordGameComplete({ gameId: 'g1', title: 'Game1', score: 5, total: 10, category: 'fun' });
      const recent = ProgressService.getRecentGame();
      expect(recent.title).toBe('Game1');
    });

    it('getRecentGames returns a list capped at 10', () => {
      for (let i = 0; i < 15; i++) {
        ProgressService.recordGameComplete({ gameId: `g${i}`, title: `Game${i}`, score: i, total: 10, category: 'fun' });
      }
      const list = ProgressService.getRecentGames();
      expect(list.length).toBeLessThanOrEqual(10);
    });
  });

  describe('in-progress game', () => {
    it('returns null when no game in progress', () => {
      expect(ProgressService.getInProgressGame()).toBeNull();
    });

    it('stores and retrieves in-progress game', () => {
      ProgressService.setInProgressGame({ title: 'Quiz1', index: 3, length: 10, score: 2, categoryId: 'math' });
      const ip = ProgressService.getInProgressGame();
      expect(ip.title).toBe('Quiz1');
      expect(ip.index).toBe(3);
    });
  });

  describe('overall stats', () => {
    it('starts with zero stats', () => {
      const stats = ProgressService.getOverallStats();
      expect(stats.totalGamesPlayed).toBe(0);
      expect(stats.totalCorrect).toBe(0);
      expect(stats.totalAttempts).toBe(0);
    });

    it('accumulates after game completions', () => {
      ProgressService.recordGameComplete({ gameId: 'g1', title: 'G1', score: 3, total: 5, category: 'fun' });
      ProgressService.recordGameComplete({ gameId: 'g2', title: 'G2', score: 4, total: 5, category: 'fun' });

      const stats = ProgressService.getOverallStats();
      expect(stats.totalGamesPlayed).toBe(2);
      expect(stats.totalCorrect).toBe(7);
      expect(stats.totalAttempts).toBe(10);
    });
  });

  describe('streak', () => {
    it('starts with zero streak', () => {
      const streak = ProgressService.getStreak();
      expect(streak.current).toBe(0);
      expect(streak.best).toBe(0);
    });

    it('increments after first game', () => {
      ProgressService.recordGameComplete({ gameId: 'g1', title: 'G1', score: 5, total: 10, category: 'fun' });
      const streak = ProgressService.getStreak();
      expect(streak.current).toBeGreaterThanOrEqual(1);
    });
  });

  describe('achievements', () => {
    it('starts with empty unlocked achievements', () => {
      expect(ProgressService.getUnlockedAchievements()).toEqual([]);
    });

    it('unlockAchievement adds to list', () => {
      ProgressService.unlockAchievement('firstGame');
      expect(ProgressService.getUnlockedAchievements()).toContain('firstGame');
    });

    it('does not duplicate achievements', () => {
      ProgressService.unlockAchievement('firstGame');
      ProgressService.unlockAchievement('firstGame');
      expect(ProgressService.getUnlockedAchievements().filter(a => a === 'firstGame')).toHaveLength(1);
    });
  });

  describe('weekly grid', () => {
    it('returns 7-element array', () => {
      const grid = ProgressService.getWeeklyGrid();
      expect(grid).toHaveLength(7);
      expect(grid.every(v => typeof v === 'boolean')).toBe(true);
    });
  });

  describe('daily stats range', () => {
    it('returns array with correct length', () => {
      const range = ProgressService.getDailyStatsRange(7);
      expect(range).toHaveLength(7);
      range.forEach(entry => {
        expect(entry).toHaveProperty('date');
        expect(entry).toHaveProperty('gamesPlayed');
      });
    });
  });
});
