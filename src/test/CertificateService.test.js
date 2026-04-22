import { describe, it, expect, beforeEach } from 'vitest';
import { CertificateService } from '../services/CertificateService';
import { StorageService } from '../services/StorageService';

describe('CertificateService', () => {
  beforeEach(() => {
    localStorage.clear();
    StorageService.setScope(null);
  });

  describe('getEarnedCertificates', () => {
    it('returns an empty array when nothing has been earned yet', () => {
      expect(CertificateService.getEarnedCertificates()).toEqual([]);
    });
  });

  describe('checkMilestones', () => {
    it('earns the games_10 certificate when gamesPlayed reaches 10', () => {
      const newlyEarned = CertificateService.checkMilestones({ gamesPlayed: 10 });
      expect(newlyEarned.map((c) => c.id)).toContain('games_10');
      const earned = CertificateService.getEarnedCertificates();
      expect(earned.some((c) => c.id === 'games_10')).toBe(true);
    });

    it('earns games_10, games_25, and games_50 in one call when gamesPlayed reaches 50', () => {
      const newlyEarned = CertificateService.checkMilestones({ gamesPlayed: 50 });
      const ids = newlyEarned.map((c) => c.id).sort();
      expect(ids).toEqual(['games_10', 'games_25', 'games_50'].sort());
      const earnedIds = CertificateService.getEarnedCertificates().map((c) => c.id);
      expect(earnedIds).toEqual(expect.arrayContaining(['games_10', 'games_25', 'games_50']));
    });

    it('does not re-earn certificates that are already stored', () => {
      CertificateService.checkMilestones({ gamesPlayed: 50 });
      const second = CertificateService.checkMilestones({ gamesPlayed: 100 });
      const secondIds = second.map((c) => c.id);
      expect(secondIds).not.toContain('games_10');
      expect(secondIds).not.toContain('games_25');
      expect(secondIds).not.toContain('games_50');
      expect(CertificateService.getEarnedCertificates().filter((c) => c.id === 'games_10')).toHaveLength(1);
    });
  });

  describe('getUnshownCertificate and markCertificateShown', () => {
    it('returns the first earned certificate that has not been marked shown', () => {
      CertificateService.checkMilestones({ gamesPlayed: 10 });
      const unshown = CertificateService.getUnshownCertificate();
      expect(unshown).not.toBeNull();
      expect(unshown.id).toBe('games_10');
    });

    it('markCertificateShown removes that certificate from the unshown queue', () => {
      CertificateService.checkMilestones({ gamesPlayed: 50 });
      expect(CertificateService.getUnshownCertificate().id).toBe('games_10');
      CertificateService.markCertificateShown('games_10');
      expect(CertificateService.getUnshownCertificate().id).toBe('games_25');
      CertificateService.markCertificateShown('games_25');
      expect(CertificateService.getUnshownCertificate().id).toBe('games_50');
      CertificateService.markCertificateShown('games_50');
      expect(CertificateService.getUnshownCertificate()).toBeNull();
    });
  });

  describe('getProgress', () => {
    it('returns one entry per milestone (14) with current values and progress ratios', () => {
      const progress = CertificateService.getProgress({
        gamesPlayed: 5,
        level: 2,
        streak: 3,
        correct: 50,
      });
      expect(progress).toHaveLength(14);
      const games10 = progress.find((p) => p.id === 'games_10');
      expect(games10.current).toBe(5);
      expect(games10.progress).toBe(0.5);
      expect(games10.earned).toBe(false);

      const level3 = progress.find((p) => p.id === 'level_3');
      expect(level3.current).toBe(2);
      expect(level3.progress).toBeCloseTo(2 / 3, 5);

      const streak7 = progress.find((p) => p.id === 'streak_7');
      expect(streak7.current).toBe(3);
      expect(streak7.progress).toBeCloseTo(3 / 7, 5);

      const correct100 = progress.find((p) => p.id === 'correct_100');
      expect(correct100.current).toBe(50);
      expect(correct100.progress).toBe(0.5);
    });
  });

  describe('getAllMilestones', () => {
    it('returns the full list of 14 milestone definitions', () => {
      const all = CertificateService.getAllMilestones();
      expect(all).toHaveLength(14);
      expect(all.every((m) => m.id && m.type && m.target != null)).toBe(true);
    });
  });
});
