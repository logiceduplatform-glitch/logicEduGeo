import { describe, it, expect, vi } from 'vitest';
import { dispatchQuizProgress, dispatchQuizComplete } from '../utils/quizEvents';

describe('dispatchQuizProgress', () => {
  it('dispatches a quizProgress custom event with correct detail', () => {
    const handler = vi.fn();
    window.addEventListener('quizProgress', handler);

    dispatchQuizProgress({ title: 'MathQuiz', score: 3, total: 10, index: 5 });

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0];
    expect(event.detail).toEqual({ title: 'MathQuiz', score: 3, total: 10, index: 5 });

    window.removeEventListener('quizProgress', handler);
  });
});

describe('dispatchQuizComplete', () => {
  it('dispatches a quizComplete custom event with correct detail', () => {
    const handler = vi.fn();
    window.addEventListener('quizComplete', handler);

    dispatchQuizComplete({ title: 'ScienceQuiz', score: 8, total: 10 });

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0];
    expect(event.detail).toEqual({ title: 'ScienceQuiz', score: 8, total: 10 });

    window.removeEventListener('quizComplete', handler);
  });
});
