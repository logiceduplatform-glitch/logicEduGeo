import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageContext } from '../i18n/LanguageContext';
import { AuthContext } from '../auth/AuthContext';
import PricingSection from '../components/PricingSection';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

let mockTier = 'free';
let mockIsPremium = false;
vi.mock('../contexts/SubscriptionContext', () => ({
  useSubscription: () => ({ tier: mockTier, isPremium: mockIsPremium, loading: false }),
}));

function Wrapper({ children, lang = 'en', user = null, guest = null }) {
  const t = (key, fallback) => fallback ?? key;
  return (
    <LanguageContext.Provider value={{ lang, setLang: () => {}, t }}>
      <AuthContext.Provider value={{ user, guest, userProfile: null, userRole: 'student', loading: false, error: null }}>
        <MemoryRouter>{children}</MemoryRouter>
      </AuthContext.Provider>
    </LanguageContext.Provider>
  );
}

describe('PricingSection', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockTier = 'free';
    mockIsPremium = false;
  });

  it('renders pricing section heading in English', () => {
    render(<Wrapper><PricingSection /></Wrapper>);
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Start free, upgrade when you want')).toBeInTheDocument();
  });

  it('renders three pricing plans', () => {
    render(<Wrapper><PricingSection /></Wrapper>);
    expect(screen.getAllByText('Free').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('Family')).toBeInTheDocument();
  });

  it('shows correct prices', () => {
    render(<Wrapper><PricingSection /></Wrapper>);
    expect(screen.getByText('€2.99')).toBeInTheDocument();
    expect(screen.getByText('€4.99')).toBeInTheDocument();
  });

  it('shows "Popular" badge on premium plan', () => {
    render(<Wrapper><PricingSection /></Wrapper>);
    expect(screen.getByText('Popular')).toBeInTheDocument();
  });

  it('shows free plan features', () => {
    render(<Wrapper><PricingSection /></Wrapper>);
    expect(screen.getByText('5 games per category')).toBeInTheDocument();
    expect(screen.getByText('Basic statistics')).toBeInTheDocument();
    expect(screen.getByText('Guest mode')).toBeInTheDocument();
  });

  it('shows premium plan features', () => {
    render(<Wrapper><PricingSection /></Wrapper>);
    expect(screen.getByText('All games unlocked')).toBeInTheDocument();
    expect(screen.getByText('Detailed statistics')).toBeInTheDocument();
    expect(screen.getByText('No ads')).toBeInTheDocument();
  });

  it('shows family plan features', () => {
    render(<Wrapper><PricingSection /></Wrapper>);
    expect(screen.getByText('Everything in Premium')).toBeInTheDocument();
    expect(screen.getByText('Up to 3 child profiles')).toBeInTheDocument();
    expect(screen.getByText('Parent dashboard')).toBeInTheDocument();
  });

  it('shows trial message', () => {
    render(<Wrapper><PricingSection /></Wrapper>);
    expect(screen.getByText('7-day free trial. Cancel anytime.')).toBeInTheDocument();
  });

  it('shows "Active ✓" for active tier', () => {
    mockTier = 'premium';
    mockIsPremium = true;
    render(<Wrapper><PricingSection /></Wrapper>);
    expect(screen.getAllByText('Active ✓').length).toBeGreaterThanOrEqual(1);
  });

  it('free plan shows Active badge when on free tier', () => {
    render(<Wrapper><PricingSection /></Wrapper>);
    expect(screen.getAllByText('Active ✓').length).toBeGreaterThanOrEqual(1);
  });

  it('upgrade button navigates to /subscription', () => {
    render(<Wrapper><PricingSection /></Wrapper>);
    fireEvent.click(screen.getByText('Upgrade'));
    expect(mockNavigate).toHaveBeenCalledWith('/subscription');
  });

  it('renders in Greek', () => {
    render(<Wrapper lang="el"><PricingSection /></Wrapper>);
    expect(screen.getByText('Δημοφιλές')).toBeInTheDocument();
    expect(screen.getByText('Οικογενειακό')).toBeInTheDocument();
  });

  it('has pricing section id for anchor links', () => {
    const { container } = render(<Wrapper><PricingSection /></Wrapper>);
    expect(container.querySelector('#pricing')).toBeInTheDocument();
  });
});
