import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageContext } from '../i18n/LanguageContext';
import { AuthContext } from '../auth/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';
import { ProgressProvider } from '../contexts/ProgressContext';
import SubscriptionPage from '../pages/SubscriptionPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }) => <div data-testid="helmet">{children}</div>,
  HelmetProvider: ({ children }) => children,
}));

function Wrapper({ children, lang = 'en', user = null }) {
  const t = (key, fallback) => fallback ?? key;
  return (
    <MemoryRouter>
      <ThemeProvider>
        <AuthContext.Provider value={{
          user,
          guest: null,
          userProfile: null,
          userRole: 'student',
          loading: false,
          error: null,
          logout: vi.fn(),
        }}>
          <LanguageContext.Provider value={{ lang, setLang: vi.fn(), t }}>
            <SubscriptionProvider>
              <ProgressProvider>
                {children}
              </ProgressProvider>
            </SubscriptionProvider>
          </LanguageContext.Provider>
        </AuthContext.Provider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('SubscriptionPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it('renders subscription plans', () => {
    render(<Wrapper user={{ uid: 'u1' }}><SubscriptionPage /></Wrapper>);
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('Family')).toBeInTheDocument();
  });

  it('shows correct premium price of €2.99', () => {
    render(<Wrapper user={{ uid: 'u1' }}><SubscriptionPage /></Wrapper>);
    expect(screen.getByText(/2\.99/)).toBeInTheDocument();
  });

  it('shows correct family price of €4.99', () => {
    render(<Wrapper user={{ uid: 'u1' }}><SubscriptionPage /></Wrapper>);
    expect(screen.getByText(/4\.99/)).toBeInTheDocument();
  });

  it('shows login prompt when not logged in', () => {
    render(<Wrapper><SubscriptionPage /></Wrapper>);
    expect(screen.getByText('You need to log in to subscribe')).toBeInTheDocument();
  });

  it('shows free plan features', () => {
    render(<Wrapper user={{ uid: 'u1' }}><SubscriptionPage /></Wrapper>);
    expect(screen.getByText(/5 games per category/)).toBeInTheDocument();
    expect(screen.getByText(/Basic statistics/)).toBeInTheDocument();
  });

  it('shows premium plan features', () => {
    render(<Wrapper user={{ uid: 'u1' }}><SubscriptionPage /></Wrapper>);
    expect(screen.getByText(/All games unlocked/)).toBeInTheDocument();
    expect(screen.getByText(/No ads/)).toBeInTheDocument();
  });
});
