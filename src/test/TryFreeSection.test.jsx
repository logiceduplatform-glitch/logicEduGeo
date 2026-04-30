import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { LanguageContext } from '../i18n/LanguageContext';
import TryFreeSection from '../components/TryFreeSection';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockT = (key, fallback) => {
  if (key === '_lang') return 'en';
  return fallback ?? key;
};

const langValue = { lang: 'en', setLang: () => {}, t: mockT };

function renderSection(authOverrides = {}) {
  return render(
    <MemoryRouter>
      <LanguageContext.Provider value={langValue}>
        <AuthContext.Provider value={{
          user: null,
          guest: null,
          userProfile: null,
          ...authOverrides,
        }}>
          <TryFreeSection t={mockT} />
        </AuthContext.Provider>
      </LanguageContext.Provider>
    </MemoryRouter>
  );
}

describe('TryFreeSection', () => {
  beforeEach(() => mockNavigate.mockClear());

  it('renders heading', () => {
    renderSection();
    expect(screen.getByText('Try for free')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    renderSection();
    expect(screen.getByText(/Create a free account/)).toBeInTheDocument();
  });

  it('shows Sign Up and Try as guest when not logged in', () => {
    renderSection();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Try as guest')).toBeInTheDocument();
  });

  it('shows Continue playing when logged in', () => {
    renderSection({ user: { displayName: 'Test' } });
    expect(screen.getByText(/Continue playing|Συνέχισε να παίζεις/)).toBeInTheDocument();
    expect(screen.getByText(/My stats|Τα στατιστικά μου/)).toBeInTheDocument();
  });

  it('Sign Up navigates to /auth?mode=register', () => {
    renderSection();
    fireEvent.click(screen.getByText('Sign Up'));
    expect(mockNavigate).toHaveBeenCalledWith('/auth?mode=register');
  });

  it('Try as guest navigates to /guest-setup', () => {
    renderSection();
    fireEvent.click(screen.getByText('Try as guest'));
    expect(mockNavigate).toHaveBeenCalledWith('/guest-setup');
  });
});
