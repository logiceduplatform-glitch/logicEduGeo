import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BadgeCollection from '../components/rewards/BadgeCollection';
import { ACHIEVEMENTS } from '../config/achievements';

describe('BadgeCollection', () => {
  it('renders all achievements', () => {
    const { container } = render(<BadgeCollection unlockedIds={[]} lang="en" />);
    const cards = container.querySelectorAll('[class*="rounded-2xl"]');
    expect(cards.length).toBe(ACHIEVEMENTS.length);
  });

  it('shows lock icon for locked achievements', () => {
    render(<BadgeCollection unlockedIds={[]} lang="en" />);
    const locks = screen.getAllByText('🔒');
    expect(locks.length).toBe(ACHIEVEMENTS.length);
  });

  it('shows achievement icon for unlocked achievements', () => {
    render(<BadgeCollection unlockedIds={['firstGame']} lang="en" />);
    expect(screen.getByText('⭐')).toBeInTheDocument();
  });

  it('shows checkmark for unlocked achievements', () => {
    render(<BadgeCollection unlockedIds={['firstGame']} lang="en" />);
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('renders English titles', () => {
    render(<BadgeCollection unlockedIds={[]} lang="en" />);
    expect(screen.getByText('First Time!')).toBeInTheDocument();
    expect(screen.getByText('5 Games!')).toBeInTheDocument();
  });

  it('renders Greek titles', () => {
    render(<BadgeCollection unlockedIds={[]} lang="el" />);
    expect(screen.getByText('Πρώτη Φορά!')).toBeInTheDocument();
    expect(screen.getByText('5 Παιχνίδια!')).toBeInTheDocument();
  });

  it('applies active styling to unlocked badges', () => {
    const { container } = render(<BadgeCollection unlockedIds={['firstGame']} lang="en" />);
    const unlockedCard = container.querySelector('.shadow-lg');
    expect(unlockedCard).toBeInTheDocument();
  });

  it('applies grayscale to locked badges', () => {
    const { container } = render(<BadgeCollection unlockedIds={[]} lang="en" />);
    const lockedCards = container.querySelectorAll('.grayscale');
    expect(lockedCards.length).toBe(ACHIEVEMENTS.length);
  });
});
