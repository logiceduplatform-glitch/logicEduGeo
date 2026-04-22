import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  startGuestTrial,
  getGuestTrial,
  clearGuestTrial,
  isGuestActive,
  timeLeftMs,
  consumeGuestPlay,
} from '../auth/guestTrial';

describe('Guest Trial', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('startGuestTrial', () => {
    it('creates a trial with default values', () => {
      const trial = startGuestTrial();
      expect(trial.playsLeft).toBe(2);
      expect(trial.totalPlays).toBe(2);
      expect(trial.startedAt).toBeTruthy();
      expect(trial.expiresAt).toBeGreaterThan(trial.startedAt);
    });

    it('respects custom overrides', () => {
      const trial = startGuestTrial({ minutes: 30, plays: 5 });
      expect(trial.playsLeft).toBe(5);
      expect(trial.totalPlays).toBe(5);
      expect(trial.expiresAt - trial.startedAt).toBe(30 * 60000);
    });

    it('stores trial in localStorage', () => {
      startGuestTrial();
      const stored = getGuestTrial();
      expect(stored).toBeTruthy();
      expect(stored.playsLeft).toBe(2);
    });
  });

  describe('getGuestTrial', () => {
    it('returns null when no trial exists', () => {
      expect(getGuestTrial()).toBeNull();
    });

    it('returns null for corrupted storage', () => {
      localStorage.setItem('guestTrial/v1', 'not-valid-json{');
      expect(getGuestTrial()).toBeNull();
    });

    it('returns the stored trial', () => {
      startGuestTrial();
      const trial = getGuestTrial();
      expect(trial).not.toBeNull();
      expect(trial.playsLeft).toBe(2);
    });
  });

  describe('clearGuestTrial', () => {
    it('removes the trial from storage', () => {
      startGuestTrial();
      clearGuestTrial();
      expect(getGuestTrial()).toBeNull();
    });
  });

  describe('isGuestActive', () => {
    it('returns false when no trial exists', () => {
      expect(isGuestActive()).toBe(false);
    });

    it('returns true for an active trial', () => {
      startGuestTrial({ minutes: 10, plays: 2 });
      expect(isGuestActive()).toBe(true);
    });

    it('returns false when time has expired', () => {
      const trial = startGuestTrial({ minutes: 0, plays: 2 });
      localStorage.setItem('guestTrial/v1', JSON.stringify({
        ...trial,
        expiresAt: Date.now() - 1000,
      }));
      expect(isGuestActive()).toBe(false);
    });

    it('returns false when plays exhausted', () => {
      const trial = startGuestTrial({ minutes: 10, plays: 0 });
      expect(isGuestActive()).toBe(false);
    });
  });

  describe('timeLeftMs', () => {
    it('returns 0 when no trial exists', () => {
      expect(timeLeftMs()).toBe(0);
    });

    it('returns positive value for active trial', () => {
      startGuestTrial({ minutes: 10 });
      expect(timeLeftMs()).toBeGreaterThan(0);
    });

    it('returns 0 for expired trial', () => {
      const trial = startGuestTrial();
      localStorage.setItem('guestTrial/v1', JSON.stringify({
        ...trial,
        expiresAt: Date.now() - 5000,
      }));
      expect(timeLeftMs()).toBe(0);
    });
  });

  describe('consumeGuestPlay', () => {
    it('returns false when no trial exists', () => {
      expect(consumeGuestPlay()).toBe(false);
    });

    it('decrements playsLeft by 1', () => {
      startGuestTrial({ minutes: 10, plays: 3 });
      expect(consumeGuestPlay()).toBe(true);
      expect(getGuestTrial().playsLeft).toBe(2);
    });

    it('returns false when plays exhausted', () => {
      startGuestTrial({ minutes: 10, plays: 1 });
      expect(consumeGuestPlay()).toBe(true);
      expect(consumeGuestPlay()).toBe(false);
    });

    it('returns false when time expired', () => {
      const trial = startGuestTrial({ minutes: 10, plays: 5 });
      localStorage.setItem('guestTrial/v1', JSON.stringify({
        ...trial,
        expiresAt: Date.now() - 1000,
      }));
      expect(consumeGuestPlay()).toBe(false);
    });
  });
});
