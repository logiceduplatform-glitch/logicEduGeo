import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TimeLimitService } from '../services/TimeLimitService';
import { StorageService } from '../services/StorageService';

vi.mock('../services/ProfileService', () => ({
  ProfileService: {
    getActiveId: vi.fn(() => 'child1'),
  },
}));

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

describe('TimeLimitService', () => {
  beforeEach(() => {
    localStorage.clear();
    StorageService.setScope(null);
  });

  describe('getLimits and setLimit', () => {
    it('returns an empty object when no limits have been stored', () => {
      expect(TimeLimitService.getLimits()).toEqual({});
    });

    it('persists per-child limits via StorageService', () => {
      TimeLimitService.setLimit('child1', { dailyMinutes: 45, enabled: true });
      expect(TimeLimitService.getLimits().child1).toEqual({ dailyMinutes: 45, enabled: true });
      TimeLimitService.setLimit('child2', { dailyMinutes: 20, enabled: false });
      expect(TimeLimitService.getLimits().child1).toEqual({ dailyMinutes: 45, enabled: true });
      expect(TimeLimitService.getLimits().child2).toEqual({ dailyMinutes: 20, enabled: false });
    });
  });

  describe('getChildLimit', () => {
    it('returns default dailyMinutes 30 and enabled false when the child has no entry', () => {
      expect(TimeLimitService.getChildLimit('unknown')).toEqual({
        dailyMinutes: 30,
        enabled: false,
      });
    });
  });

  describe('removeLimit', () => {
    it('removes the stored limit for that child', () => {
      TimeLimitService.setLimit('child1', { dailyMinutes: 60, enabled: true });
      TimeLimitService.removeLimit('child1');
      expect(TimeLimitService.getLimits().child1).toBeUndefined();
      expect(TimeLimitService.getChildLimit('child1').enabled).toBe(false);
    });
  });

  describe('getRemainingMinutes', () => {
    it('returns Infinity when the limit is not enabled', () => {
      TimeLimitService.setLimit('child1', { dailyMinutes: 10, enabled: false });
      expect(TimeLimitService.getRemainingMinutes('child1')).toBe(Infinity);
    });

    it('returns dailyMinutes minus today usage when enabled', () => {
      const today = todayStr();
      StorageService.set('geo:dailyUsage', { [`child1:${today}`]: 25 });
      TimeLimitService.setLimit('child1', { dailyMinutes: 60, enabled: true });
      expect(TimeLimitService.getRemainingMinutes('child1')).toBe(35);
    });

    it('never returns a negative remainder (clamps at 0)', () => {
      const today = todayStr();
      StorageService.set('geo:dailyUsage', { [`child1:${today}`]: 100 });
      TimeLimitService.setLimit('child1', { dailyMinutes: 30, enabled: true });
      expect(TimeLimitService.getRemainingMinutes('child1')).toBe(0);
    });
  });

  describe('isTimeLimitReached', () => {
    it('returns false when limits are not enabled', () => {
      TimeLimitService.setLimit('child1', { dailyMinutes: 1, enabled: false });
      expect(TimeLimitService.isTimeLimitReached('child1')).toBe(false);
    });

    it('returns false when childId is missing', () => {
      TimeLimitService.setLimit('child1', { dailyMinutes: 1, enabled: true });
      expect(TimeLimitService.isTimeLimitReached(null)).toBe(false);
    });

    it('returns true when enabled and usage has reached the daily cap', () => {
      const today = todayStr();
      StorageService.set('geo:dailyUsage', { [`child1:${today}`]: 30 });
      TimeLimitService.setLimit('child1', { dailyMinutes: 30, enabled: true });
      expect(TimeLimitService.isTimeLimitReached('child1')).toBe(true);
    });
  });

  describe('getUsageHistory', () => {
    it('returns seven calendar days of rows with date and minutes', () => {
      const history = TimeLimitService.getUsageHistory('child1', 7);
      expect(history).toHaveLength(7);
      expect(history.every((row) => row.date && typeof row.minutes === 'number')).toBe(true);
    });

    it('fills in stored usage for matching dates', () => {
      const today = todayStr();
      StorageService.set('geo:dailyUsage', { [`child1:${today}`]: 12 });
      const history = TimeLimitService.getUsageHistory('child1', 7);
      const todayRow = history.find((h) => h.date === today);
      expect(todayRow.minutes).toBe(12);
    });
  });

  describe('cleanOldData', () => {
    it('drops usage entries older than 30 days while keeping recent keys', () => {
      const today = todayStr();
      const oldDate = '2000-01-15';
      StorageService.set('geo:dailyUsage', {
        [`child1:${oldDate}`]: 999,
        [`child1:${today}`]: 5,
      });
      TimeLimitService.cleanOldData();
      const usage = StorageService.get('geo:dailyUsage');
      expect(usage[`child1:${oldDate}`]).toBeUndefined();
      expect(usage[`child1:${today}`]).toBe(5);
    });
  });
});
