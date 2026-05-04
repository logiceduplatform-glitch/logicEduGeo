import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageContext } from '../i18n/LanguageContext';
import HeroSection from '../components/HeroSection';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockT = (key, fallback) => fallback ?? key;

function LangWrapper({ children, lang = 'en' }) {
  const t = (key, fallback) => fallback ?? key;
  return (
    <LanguageContext.Provider value={{ lang, setLang: () => {}, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

function renderHero(props = {}) {
  return render(
    <MemoryRouter>
      <LangWrapper lang="en">
        <HeroSection
          t={mockT}
          loginWithGoogle={vi.fn()}
          beginGuest={vi.fn()}
          guest={null}
          user={null}
          userProfile={null}
          {...props}
        />
      </LangWrapper>
    </MemoryRouter>
  );
}

describe('HeroSection', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    // Force the A/B test to the control variant so assertions are stable.
    try {
      localStorage.setItem(
        'edu:abAssignments',
        JSON.stringify({ hero_cta_v1: 'control' }),
      );
    } catch { /* test env */ }
  });

  it('renders the hero title', () => {
    renderHero();
    expect(screen.getByText('Where curiosity blooms.')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    renderHero();
    expect(screen.getByText(/350\+ playful educational games/)).toBeInTheDocument();
  });

  it('shows Sign Up, Log in, Try as guest buttons when not logged in', () => {
    renderHero();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText('Try as guest')).toBeInTheDocument();
  });

  it('shows Continue playing and My profile when logged in with user', () => {
    renderHero({ user: { displayName: 'Test' } });
    expect(screen.getByText('Continue playing')).toBeInTheDocument();
    expect(screen.getByText('My profile')).toBeInTheDocument();
  });

  it('shows Continue playing when guest', () => {
    renderHero({ guest: { id: 'g1', age: 'Age 6' } });
    expect(screen.getByText('Continue playing')).toBeInTheDocument();
  });

  it('shows guest mode badge when guest is active', () => {
    renderHero({ guest: { id: 'g1' } });
    expect(screen.getByText('Guest mode active')).toBeInTheDocument();
  });

  it('renders stat cards (Games, Categories, Age Groups)', () => {
    renderHero();
    expect(screen.getByText('Games')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Age Groups')).toBeInTheDocument();
  });

  it('Sign Up navigates to /auth?mode=register', () => {
    renderHero();
    fireEvent.click(screen.getByText('Sign Up'));
    expect(mockNavigate).toHaveBeenCalledWith('/auth?mode=register');
  });

  it('Log in navigates to /auth', () => {
    renderHero();
    fireEvent.click(screen.getByText('Log in'));
    expect(mockNavigate).toHaveBeenCalledWith('/auth');
  });

  it('Try as guest navigates to /guest-setup', () => {
    renderHero();
    fireEvent.click(screen.getByText('Try as guest'));
    expect(mockNavigate).toHaveBeenCalledWith('/guest-setup');
  });

  it('renders trust badge section', () => {
    renderHero();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('500+')).toBeInTheDocument();
  });

  it('does not render platform badge (removed)', () => {
    renderHero();
    expect(screen.queryByText('Kibloo Platform Badge')).not.toBeInTheDocument();
  });

  it('renders tagline badge', () => {
    renderHero();
    const matches = screen.getAllByText(/Where curiosity blooms/);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });
});
