import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ProgressProvider, useProgress, ProgressContext } from '../contexts/ProgressContext';

function TestConsumer() {
  const ctx = React.useContext(ProgressContext);

  const handleRecord = () => {
    ctx.recordGameComplete({
      gameId: 'test-game',
      title: 'Test Game',
      score: 5,
      total: 10,
      category: 'fun',
    });
  };

  const stats = ctx.getOverallStats();

  return (
    <div>
      <span data-testid="games-played">{stats.totalGamesPlayed}</span>
      <span data-testid="version">{ctx.version}</span>
      <button onClick={handleRecord}>Record</button>
      <button onClick={() => ctx.setDifficulty('test-game', 3)}>Set Difficulty</button>
      <button onClick={() => ctx.unlockAchievement('test-ach')}>Unlock</button>
    </div>
  );
}

describe('ProgressContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides initial values', () => {
    render(
      <ProgressProvider>
        <TestConsumer />
      </ProgressProvider>
    );
    expect(screen.getByTestId('games-played').textContent).toBe('0');
    expect(screen.getByTestId('version').textContent).toBe('0');
  });

  it('recordGameComplete updates stats and bumps version', () => {
    render(
      <ProgressProvider>
        <TestConsumer />
      </ProgressProvider>
    );

    fireEvent.click(screen.getByText('Record'));

    expect(screen.getByTestId('games-played').textContent).toBe('1');
    expect(parseInt(screen.getByTestId('version').textContent)).toBeGreaterThan(0);
  });

  it('setDifficulty bumps version', () => {
    render(
      <ProgressProvider>
        <TestConsumer />
      </ProgressProvider>
    );

    const versionBefore = screen.getByTestId('version').textContent;
    fireEvent.click(screen.getByText('Set Difficulty'));
    expect(parseInt(screen.getByTestId('version').textContent)).toBeGreaterThan(parseInt(versionBefore));
  });

  it('unlockAchievement bumps version', () => {
    render(
      <ProgressProvider>
        <TestConsumer />
      </ProgressProvider>
    );

    const versionBefore = screen.getByTestId('version').textContent;
    fireEvent.click(screen.getByText('Unlock'));
    expect(parseInt(screen.getByTestId('version').textContent)).toBeGreaterThan(parseInt(versionBefore));
  });

  it('useProgress throws outside of ProgressProvider', () => {
    function Bad() {
      useProgress();
      return null;
    }

    expect(() => render(<Bad />)).toThrow('useProgress must be used within ProgressProvider');
  });

  it('dispatches progressUpdate event on recordGameComplete', () => {
    const handler = vi.fn();
    window.addEventListener('progressUpdate', handler);

    render(
      <ProgressProvider>
        <TestConsumer />
      </ProgressProvider>
    );

    fireEvent.click(screen.getByText('Record'));
    expect(handler).toHaveBeenCalledTimes(1);

    window.removeEventListener('progressUpdate', handler);
  });
});
