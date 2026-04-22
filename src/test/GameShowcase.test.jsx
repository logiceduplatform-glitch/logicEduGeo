import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GameShowcase from '../components/GameShowcase';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('GameShowcase', () => {
  beforeEach(() => mockNavigate.mockClear());

  it('renders English games when lang is en', () => {
    render(<MemoryRouter><GameShowcase lang="en" /></MemoryRouter>);
    expect(screen.getByText('Image Puzzle')).toBeInTheDocument();
    expect(screen.getByText('Bubble Pop')).toBeInTheDocument();
    expect(screen.getByText('Position Memory')).toBeInTheDocument();
  });

  it('renders Greek games when lang is el', () => {
    render(<MemoryRouter><GameShowcase lang="el" /></MemoryRouter>);
    expect(screen.getByText('Παζλ Εικόνων')).toBeInTheDocument();
    expect(screen.getByText('Φούσκες που Σκάζουν')).toBeInTheDocument();
  });

  it('renders section heading', () => {
    render(<MemoryRouter><GameShowcase lang="en" /></MemoryRouter>);
    expect(screen.getByText('See what awaits you')).toBeInTheDocument();
    expect(screen.getByText('Game Preview')).toBeInTheDocument();
  });

  it('renders 8 game cards', () => {
    const { container } = render(<MemoryRouter><GameShowcase lang="en" /></MemoryRouter>);
    const cards = container.querySelectorAll('.group');
    expect(cards.length).toBe(8);
  });

  it('displays age badges on cards', () => {
    render(<MemoryRouter><GameShowcase lang="en" /></MemoryRouter>);
    expect(screen.getAllByText(/Age 4-5/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Age 2-3/).length).toBeGreaterThan(0);
  });

  it('displays difficulty labels', () => {
    render(<MemoryRouter><GameShowcase lang="en" /></MemoryRouter>);
    expect(screen.getAllByText('Easy').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Medium').length).toBeGreaterThan(0);
  });

  it('navigates when game card is clicked', () => {
    render(<MemoryRouter><GameShowcase lang="en" /></MemoryRouter>);
    fireEvent.click(screen.getByText('Image Puzzle').closest('.group'));
    expect(mockNavigate).toBeCalledWith('/play/4-5-fun');
  });

  it('has games section id for play links', () => {
    const { container } = render(<MemoryRouter><GameShowcase lang="en" /></MemoryRouter>);
    expect(container.querySelector('#games')).toBeInTheDocument();
  });

  it('renders Greek age badges', () => {
    render(<MemoryRouter><GameShowcase lang="el" /></MemoryRouter>);
    expect(screen.getAllByText(/Ηλικία 4-5/).length).toBeGreaterThan(0);
  });
});
