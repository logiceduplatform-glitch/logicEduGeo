import { describe, it, expect, beforeEach } from 'vitest';
import { DifficultyService } from '../services/DifficultyService';
import { ProgressService } from '../services/ProgressService';

describe('DifficultyService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getDifficulty', () => {
    it('returns 1 for a new game', () => {
      expect(DifficultyService.getDifficulty('newgame')).toBe(1);
    });

    it('returns the current difficulty after manual set', () => {
      ProgressService.setDifficulty('testgame', 3);
      expect(DifficultyService.getDifficulty('testgame')).toBe(3);
    });
  });

  describe('evaluate', () => {
    it('returns no change for game with no history', () => {
      const result = DifficultyService.evaluate('empty-game');
      expect(result.changed).toBe(false);
      expect(result.direction).toBeNull();
    });

    it('advances difficulty after 3 consecutive high scores', () => {
      const gameId = 'advance-test';
      for (let i = 0; i < 3; i++) {
        ProgressService.recordGameComplete({
          gameId, title: 'Test', score: 9, total: 10, category: 'fun', difficulty: 1,
        });
      }

      const result = DifficultyService.evaluate(gameId);
      expect(result.changed).toBe(true);
      expect(result.direction).toBe('up');
      expect(result.newLevel).toBe(2);
    });

    it('decreases difficulty after 2 consecutive low scores', () => {
      const gameId = 'decrease-test';
      ProgressService.setDifficulty(gameId, 3);

      for (let i = 0; i < 2; i++) {
        ProgressService.recordGameComplete({
          gameId, title: 'Test', score: 2, total: 10, category: 'fun', difficulty: 3,
        });
      }

      const result = DifficultyService.evaluate(gameId);
      expect(result.changed).toBe(true);
      expect(result.direction).toBe('down');
      expect(result.newLevel).toBe(2);
    });

    it('does not advance beyond level 5', () => {
      const gameId = 'max-test';
      ProgressService.setDifficulty(gameId, 5);

      for (let i = 0; i < 3; i++) {
        ProgressService.recordGameComplete({
          gameId, title: 'Test', score: 10, total: 10, category: 'fun', difficulty: 5,
        });
      }

      const result = DifficultyService.evaluate(gameId);
      expect(result.changed).toBe(false);
      expect(result.newLevel).toBe(5);
    });

    it('does not decrease below level 1', () => {
      const gameId = 'min-test';
      ProgressService.setDifficulty(gameId, 1);

      for (let i = 0; i < 2; i++) {
        ProgressService.recordGameComplete({
          gameId, title: 'Test', score: 1, total: 10, category: 'fun', difficulty: 1,
        });
      }

      const result = DifficultyService.evaluate(gameId);
      expect(result.changed).toBe(false);
      expect(result.newLevel).toBe(1);
    });
  });

  describe('getParams', () => {
    it('returns timer params for known game type', () => {
      const params = DifficultyService.getParams('timer', 3);
      expect(params).toHaveProperty('timeLimit');
      expect(params).toHaveProperty('speedMultiplier');
    });

    it('returns memory params for known game type', () => {
      const params = DifficultyService.getParams('memory', 1);
      expect(params.pairCount).toBe(3);
      expect(params.revealTime).toBe(3000);
    });

    it('returns math params for known game type', () => {
      const params = DifficultyService.getParams('math', 5);
      expect(params.maxNumber).toBe(100);
      expect(params.operations).toContain('*');
      expect(params.operations).toContain('/');
    });

    it('returns language params for known game type', () => {
      const params = DifficultyService.getParams('language', 1);
      expect(params.maxWordLength).toBe(4);
      expect(params.hintLevel).toBe('full');
    });

    it('returns default params for unknown game type', () => {
      const params = DifficultyService.getParams('unknown', 3);
      expect(params).toHaveProperty('timeLimit');
      expect(params).toHaveProperty('itemCount');
      expect(params).toHaveProperty('complexity');
    });
  });
});
