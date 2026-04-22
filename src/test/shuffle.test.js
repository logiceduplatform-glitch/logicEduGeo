import { describe, it, expect } from 'vitest';
import { shuffleArray } from '../utils/shuffle';

describe('shuffleArray', () => {
  it('returns a new array (does not mutate the original)', () => {
    const original = [1, 2, 3, 4, 5];
    const result = shuffleArray(original);
    expect(result).not.toBe(original);
    expect(original).toEqual([1, 2, 3, 4, 5]);
  });

  it('preserves all elements', () => {
    const input = [10, 20, 30, 40, 50];
    const result = shuffleArray(input);
    expect(result).toHaveLength(input.length);
    expect(result.sort((a, b) => a - b)).toEqual(input.sort((a, b) => a - b));
  });

  it('handles empty array', () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it('handles single-element array', () => {
    expect(shuffleArray([42])).toEqual([42]);
  });

  it('handles array of strings', () => {
    const input = ['a', 'b', 'c', 'd'];
    const result = shuffleArray(input);
    expect(result).toHaveLength(4);
    expect(result.sort()).toEqual(['a', 'b', 'c', 'd']);
  });

  it('produces a different order at least sometimes (statistical)', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let sameOrderCount = 0;
    for (let i = 0; i < 20; i++) {
      const result = shuffleArray(input);
      if (JSON.stringify(result) === JSON.stringify(input)) sameOrderCount++;
    }
    expect(sameOrderCount).toBeLessThan(20);
  });
});
