import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from '../components/dashboard/StatCard';

describe('StatCard', () => {
  it('renders the icon', () => {
    render(<StatCard icon="🎮" label="Games" value={42} />);
    expect(screen.getByText('🎮')).toBeInTheDocument();
  });

  it('renders the label', () => {
    render(<StatCard icon="🎮" label="Games Played" value={42} />);
    expect(screen.getByText('Games Played')).toBeInTheDocument();
  });

  it('renders the value', () => {
    render(<StatCard icon="🎮" label="Games" value={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders sublabel when provided', () => {
    render(<StatCard icon="🏆" label="Score" value={100} sublabel="Best ever" />);
    expect(screen.getByText('Best ever')).toBeInTheDocument();
  });

  it('does not render sublabel when not provided', () => {
    const { container } = render(<StatCard icon="🎮" label="Games" value={5} />);
    expect(container.querySelectorAll('.text-xs').length).toBe(0);
  });

  it('renders with custom gradient', () => {
    const { container } = render(
      <StatCard icon="📊" label="Stats" value={10} gradient="from-emerald-500 to-teal-500" />
    );
    const gradientEl = container.querySelector('.bg-gradient-to-br');
    expect(gradientEl).toBeInTheDocument();
  });
});
