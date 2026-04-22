import { describe, it, expect } from 'vitest';
import {
  getTimingParams,
  getBlinkParams,
  getMemoryParams,
  getItemCountParams,
  getMazeParams,
  getFireParams,
  getDifficultyLabel,
  getDifficultyColor,
  getDifficultyStars,
} from '../utils/difficultyHelpers';

describe('getTimingParams', () => {
  it('returns correct values for difficulty 1 (easiest)', () => {
    const p = getTimingParams(1);
    expect(p.revealTime).toBe(4000);
    expect(p.wrongDelay).toBe(2000);
    expect(p.nextRoundDelay).toBe(3000);
    expect(p.speakDelay).toBe(500);
    expect(p.popupDuration).toBe(1000);
  });

  it('returns correct values for difficulty 5 (hardest)', () => {
    const p = getTimingParams(5);
    expect(p.revealTime).toBe(1500);
    expect(p.wrongDelay).toBe(1000);
    expect(p.nextRoundDelay).toBe(2000);
  });

  it('defaults to difficulty 3 when not provided', () => {
    const p = getTimingParams();
    expect(p.revealTime).toBe(2500);
  });

  it('clamps values below 1', () => {
    expect(getTimingParams(0)).toEqual(getTimingParams(1));
    expect(getTimingParams(-5)).toEqual(getTimingParams(1));
  });

  it('clamps values above 5', () => {
    expect(getTimingParams(10)).toEqual(getTimingParams(5));
  });

  it('timing decreases as difficulty increases', () => {
    for (let d = 1; d < 5; d++) {
      expect(getTimingParams(d).revealTime).toBeGreaterThan(getTimingParams(d + 1).revealTime);
    }
  });
});

describe('getBlinkParams', () => {
  it('returns correct values for each difficulty level', () => {
    expect(getBlinkParams(1).blinkInterval).toBe(500);
    expect(getBlinkParams(5).blinkInterval).toBe(150);
  });

  it('blink interval decreases as difficulty increases', () => {
    for (let d = 1; d < 5; d++) {
      expect(getBlinkParams(d).blinkInterval).toBeGreaterThan(getBlinkParams(d + 1).blinkInterval);
    }
  });
});

describe('getMemoryParams', () => {
  it('pair count increases with difficulty', () => {
    for (let d = 1; d < 5; d++) {
      expect(getMemoryParams(d).pairCount).toBeLessThanOrEqual(getMemoryParams(d + 1).pairCount);
    }
  });

  it('reveal time decreases with difficulty', () => {
    for (let d = 1; d < 5; d++) {
      expect(getMemoryParams(d).revealTime).toBeGreaterThan(getMemoryParams(d + 1).revealTime);
    }
  });
});

describe('getItemCountParams', () => {
  it('returns expected structure', () => {
    const p = getItemCountParams(3);
    expect(p).toHaveProperty('optionsCount');
    expect(p).toHaveProperty('itemsPerRound');
    expect(p).toHaveProperty('roundCount');
  });

  it('round count increases with difficulty', () => {
    expect(getItemCountParams(1).roundCount).toBeLessThan(getItemCountParams(5).roundCount);
  });
});

describe('getMazeParams', () => {
  it('wall count increases with difficulty', () => {
    expect(getMazeParams(1).wallCount).toBeLessThan(getMazeParams(5).wallCount);
  });

  it('grid complexity increases with difficulty', () => {
    expect(getMazeParams(1).gridComplexity).toBeLessThan(getMazeParams(5).gridComplexity);
  });
});

describe('getFireParams', () => {
  it('fire radius decreases with difficulty', () => {
    expect(getFireParams(1).fireRadius).toBeGreaterThan(getFireParams(5).fireRadius);
  });

  it('size multiplier decreases with difficulty', () => {
    expect(getFireParams(1).sizeMultiplier).toBeGreaterThan(getFireParams(5).sizeMultiplier);
  });
});

describe('getDifficultyLabel', () => {
  it('returns Greek labels by default', () => {
    expect(getDifficultyLabel(1, 'el')).toBe('Πολύ Εύκολο');
    expect(getDifficultyLabel(3, 'el')).toBe('Κανονικό');
    expect(getDifficultyLabel(5, 'el')).toBe('Πολύ Δύσκολο');
  });

  it('returns English labels', () => {
    expect(getDifficultyLabel(1, 'en')).toBe('Very Easy');
    expect(getDifficultyLabel(3, 'en')).toBe('Normal');
    expect(getDifficultyLabel(5, 'en')).toBe('Very Hard');
  });

  it('falls back to English for unknown languages', () => {
    expect(getDifficultyLabel(3, 'fr')).toBe('Normal');
  });

  it('clamps out-of-range difficulty', () => {
    expect(getDifficultyLabel(0, 'en')).toBe('Very Easy');
    expect(getDifficultyLabel(99, 'en')).toBe('Very Hard');
  });
});

describe('getDifficultyColor', () => {
  it('returns a Tailwind text color class for each level', () => {
    for (let d = 1; d <= 5; d++) {
      expect(getDifficultyColor(d)).toMatch(/^text-\w+-500$/);
    }
  });

  it('returns green for easiest and red for hardest', () => {
    expect(getDifficultyColor(1)).toBe('text-green-500');
    expect(getDifficultyColor(5)).toBe('text-red-500');
  });
});

describe('getDifficultyStars', () => {
  it('returns correct star pattern for each level', () => {
    expect(getDifficultyStars(1)).toBe('★☆☆☆☆');
    expect(getDifficultyStars(3)).toBe('★★★☆☆');
    expect(getDifficultyStars(5)).toBe('★★★★★');
  });

  it('always returns exactly 5 characters', () => {
    for (let d = 1; d <= 5; d++) {
      expect(getDifficultyStars(d)).toHaveLength(5);
    }
  });
});
