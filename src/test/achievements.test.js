import { describe, it, expect } from 'vitest';
import { ACHIEVEMENTS } from '../config/achievements';

describe('ACHIEVEMENTS config', () => {
  it('has at least 10 achievements', () => {
    expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(10);
  });

  it('all achievement IDs are unique', () => {
    const ids = ACHIEVEMENTS.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every achievement has required fields', () => {
    for (const a of ACHIEVEMENTS) {
      expect(a).toHaveProperty('id');
      expect(a).toHaveProperty('icon');
      expect(a).toHaveProperty('title');
      expect(a).toHaveProperty('description');
      expect(a).toHaveProperty('condition');
      expect(typeof a.condition).toBe('function');
    }
  });

  it('every achievement has bilingual title and description', () => {
    for (const a of ACHIEVEMENTS) {
      expect(a.title.el).toBeTruthy();
      expect(a.title.en).toBeTruthy();
      expect(a.description.el).toBeTruthy();
      expect(a.description.en).toBeTruthy();
    }
  });

  describe('achievement conditions', () => {
    const baseStats = {
      totalGamesPlayed: 0,
      totalCorrect: 0,
      totalAttempts: 0,
      streak: 0,
      bestStreak: 0,
      maxDifficulty: 1,
      monthlyCorrect: 0,
    };

    it('firstGame triggers at 1 game', () => {
      const a = ACHIEVEMENTS.find(x => x.id === 'firstGame');
      expect(a.condition({ ...baseStats, totalGamesPlayed: 1 })).toBe(true);
      expect(a.condition({ ...baseStats, totalGamesPlayed: 0 })).toBe(false);
    });

    it('fiveGames triggers at 5 games', () => {
      const a = ACHIEVEMENTS.find(x => x.id === 'fiveGames');
      expect(a.condition({ ...baseStats, totalGamesPlayed: 5 })).toBe(true);
      expect(a.condition({ ...baseStats, totalGamesPlayed: 4 })).toBe(false);
    });

    it('perfectScore requires lastGame with score === total', () => {
      const a = ACHIEVEMENTS.find(x => x.id === 'perfectScore');
      expect(a.condition(baseStats, { score: 10, total: 10 })).toBe(true);
      expect(a.condition(baseStats, { score: 9, total: 10 })).toBe(false);
      expect(a.condition(baseStats, null)).toBeFalsy();
    });

    it('streak achievements trigger at correct values', () => {
      const streak3 = ACHIEVEMENTS.find(x => x.id === 'streak3');
      expect(streak3.condition({ ...baseStats, streak: 3 })).toBe(true);
      expect(streak3.condition({ ...baseStats, streak: 2 })).toBe(false);

      const streak7 = ACHIEVEMENTS.find(x => x.id === 'streak7');
      expect(streak7.condition({ ...baseStats, streak: 7 })).toBe(true);
    });

    it('correct milestones trigger at correct values', () => {
      const c100 = ACHIEVEMENTS.find(x => x.id === 'correct100');
      expect(c100.condition({ ...baseStats, totalCorrect: 100 })).toBe(true);
      expect(c100.condition({ ...baseStats, totalCorrect: 99 })).toBe(false);
    });

    it('difficulty achievements check maxDifficulty', () => {
      const d5 = ACHIEVEMENTS.find(x => x.id === 'difficultyLevel5');
      expect(d5.condition({ ...baseStats, maxDifficulty: 5 })).toBe(true);
      expect(d5.condition({ ...baseStats, maxDifficulty: 4 })).toBe(false);
    });

    it('monthGoal checks monthlyCorrect', () => {
      const mg = ACHIEVEMENTS.find(x => x.id === 'monthGoal');
      expect(mg.condition({ ...baseStats, monthlyCorrect: 100 })).toBe(true);
      expect(mg.condition({ ...baseStats, monthlyCorrect: 99 })).toBe(false);
    });
  });
});
