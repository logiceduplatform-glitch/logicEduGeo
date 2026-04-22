import { describe, it, expect, beforeEach, vi } from 'vitest';
import { updateProgress } from '../utils/quizProgress';

describe('updateProgress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('does nothing when title is falsy', () => {
    updateProgress('', 0, 10, true);
    expect(localStorage.getItem('geo:quizStats')).toBeNull();
  });

  it('stores progress for a quiz', () => {
    updateProgress('MathQuiz', 2, 10, true);
    const stored = JSON.parse(localStorage.getItem('progress:MathQuiz'));
    expect(stored).toEqual({ index: 2, length: 10 });
  });

  it('stores the most recent quiz title', () => {
    updateProgress('MathQuiz', 0, 5, true);
    const recent = JSON.parse(localStorage.getItem('geo:progress:recent'));
    expect(recent.title).toBe('MathQuiz');
  });

  it('increments totalAttempts on each call', () => {
    updateProgress('Q1', 0, 5, true);
    updateProgress('Q1', 1, 5, false);
    updateProgress('Q1', 2, 5, true);

    const stats = JSON.parse(localStorage.getItem('geo:quizStats'));
    expect(stats.totalAttempts).toBe(3);
  });

  it('increments totalCorrect only on correct answers', () => {
    updateProgress('Q1', 0, 5, true);
    updateProgress('Q1', 1, 5, false);
    updateProgress('Q1', 2, 5, true);

    const stats = JSON.parse(localStorage.getItem('geo:quizStats'));
    expect(stats.totalCorrect).toBe(2);
  });

  it('tracks monthly correct answers', () => {
    updateProgress('Q1', 0, 5, true);
    updateProgress('Q1', 1, 5, true);
    updateProgress('Q1', 2, 5, false);

    const stats = JSON.parse(localStorage.getItem('geo:quizStats'));
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    expect(stats.monthCorrectByKey[monthKey]).toBe(2);
  });

  it('updates weekly grid for today', () => {
    updateProgress('Q1', 0, 5, true);
    const stats = JSON.parse(localStorage.getItem('geo:quizStats'));
    expect(stats.weekly).toHaveLength(7);
  });

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('geo:quizStats', 'not-json');
    expect(() => updateProgress('Q1', 0, 5, true)).not.toThrow();
    const stats = JSON.parse(localStorage.getItem('geo:quizStats'));
    expect(stats.totalAttempts).toBe(1);
  });
});
