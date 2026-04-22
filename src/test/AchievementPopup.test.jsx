import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AchievementPopup from '../components/rewards/AchievementPopup';

describe('AchievementPopup', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders achievement title in English', () => {
    render(<AchievementPopup achievementId="firstGame" lang="en" onClose={vi.fn()} />);
    expect(screen.getByText('First Time!')).toBeInTheDocument();
  });

  it('renders achievement title in Greek', () => {
    render(<AchievementPopup achievementId="firstGame" lang="el" onClose={vi.fn()} />);
    expect(screen.getByText('Πρώτη Φορά!')).toBeInTheDocument();
  });

  it('renders achievement icon', () => {
    render(<AchievementPopup achievementId="firstGame" lang="en" onClose={vi.fn()} />);
    expect(screen.getByText('⭐')).toBeInTheDocument();
  });

  it('renders achievement description', () => {
    render(<AchievementPopup achievementId="firstGame" lang="en" onClose={vi.fn()} />);
    expect(screen.getByText('Complete your first game')).toBeInTheDocument();
  });

  it('renders "New Badge!" label in English', () => {
    render(<AchievementPopup achievementId="firstGame" lang="en" onClose={vi.fn()} />);
    expect(screen.getByText('New Badge!')).toBeInTheDocument();
  });

  it('renders "Awesome!" button in English', () => {
    render(<AchievementPopup achievementId="firstGame" lang="en" onClose={vi.fn()} />);
    expect(screen.getByText('Awesome!')).toBeInTheDocument();
  });

  it('renders nothing for unknown achievement', () => {
    const { container } = render(<AchievementPopup achievementId="nonexistent" lang="en" onClose={vi.fn()} />);
    expect(container.innerHTML).toBe('');
  });

  it('calls onClose when button is clicked', () => {
    const onClose = vi.fn();
    render(<AchievementPopup achievementId="firstGame" lang="en" onClose={onClose} />);
    fireEvent.click(screen.getByText('Awesome!'));
    vi.advanceTimersByTime(500);
    expect(onClose).toHaveBeenCalled();
  });
});
