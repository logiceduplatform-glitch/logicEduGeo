import { describe, it, expect } from 'vitest';
import { checkNewAchievements, getAchievementById } from '../services/RewardsService';
import { ACHIEVEMENTS } from '../config/achievements';

function makeProgressCtx(overrides = {}) {
  return {
    getUnlockedAchievements: () => overrides.unlocked || [],
    getOverallStats: () => ({
      totalGamesPlayed: 0,
      totalCorrect: 0,
      totalAttempts: 0,
      ...overrides.overall,
    }),
    getStreak: () => ({
      current: 0,
      best: 0,
      ...overrides.streak,
    }),
    getMonthlyStats: () => ({
      totalCorrect: 0,
      ...overrides.monthly,
    }),
    getAllGameProgress: () => overrides.allProgress || {},
  };
}

describe('checkNewAchievements', () => {
  it('returns firstGame when 1 game played', () => {
    const ctx = makeProgressCtx({ overall: { totalGamesPlayed: 1 } });
    const result = checkNewAchievements(ctx);
    expect(result).toContain('firstGame');
  });

  it('returns fiveGames when 5 games played', () => {
    const ctx = makeProgressCtx({ overall: { totalGamesPlayed: 5 } });
    const result = checkNewAchievements(ctx);
    expect(result).toContain('fiveGames');
  });

  it('returns perfectScore when last game has perfect score', () => {
    const ctx = makeProgressCtx({ overall: { totalGamesPlayed: 1 } });
    const result = checkNewAchievements(ctx, { score: 10, total: 10 });
    expect(result).toContain('perfectScore');
  });

  it('does not return perfectScore when score < total', () => {
    const ctx = makeProgressCtx({ overall: { totalGamesPlayed: 1 } });
    const result = checkNewAchievements(ctx, { score: 9, total: 10 });
    expect(result).not.toContain('perfectScore');
  });

  it('returns streak3 when streak is 3', () => {
    const ctx = makeProgressCtx({
      overall: { totalGamesPlayed: 3 },
      streak: { current: 3 },
    });
    const result = checkNewAchievements(ctx);
    expect(result).toContain('streak3');
  });

  it('returns correct50 when 50 correct answers', () => {
    const ctx = makeProgressCtx({ overall: { totalCorrect: 50, totalGamesPlayed: 1 } });
    const result = checkNewAchievements(ctx);
    expect(result).toContain('correct50');
  });

  it('returns difficultyLevel3 when maxDifficulty >= 3', () => {
    const ctx = makeProgressCtx({
      overall: { totalGamesPlayed: 1 },
      allProgress: { 'game1': { currentDifficulty: 3 } },
    });
    const result = checkNewAchievements(ctx);
    expect(result).toContain('difficultyLevel3');
  });

  it('returns monthGoal when monthly correct >= 100', () => {
    const ctx = makeProgressCtx({
      overall: { totalGamesPlayed: 1 },
      monthly: { totalCorrect: 100 },
    });
    const result = checkNewAchievements(ctx);
    expect(result).toContain('monthGoal');
  });

  it('excludes already unlocked achievements', () => {
    const ctx = makeProgressCtx({
      overall: { totalGamesPlayed: 1 },
      unlocked: ['firstGame'],
    });
    const result = checkNewAchievements(ctx);
    expect(result).not.toContain('firstGame');
  });

  it('returns empty array when no new achievements', () => {
    const ctx = makeProgressCtx();
    const result = checkNewAchievements(ctx);
    expect(result).toEqual([]);
  });
});

describe('getAchievementById', () => {
  it('returns the correct achievement', () => {
    const a = getAchievementById('firstGame');
    expect(a).toBeTruthy();
    expect(a.id).toBe('firstGame');
    expect(a.title.en).toBe('First Time!');
  });

  it('returns null for unknown id', () => {
    expect(getAchievementById('nonexistent')).toBeNull();
  });

  it('all achievements have required fields', () => {
    for (const a of ACHIEVEMENTS) {
      expect(a.id).toBeTruthy();
      expect(a.icon).toBeTruthy();
      expect(a.title.el).toBeTruthy();
      expect(a.title.en).toBeTruthy();
      expect(a.description.el).toBeTruthy();
      expect(a.description.en).toBeTruthy();
      expect(typeof a.condition).toBe('function');
    }
  });
});
