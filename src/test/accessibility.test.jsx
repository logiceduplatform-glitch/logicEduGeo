import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageContext } from '../i18n/LanguageContext';
import { AuthContext } from '../auth/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import FooterSection from '../components/FooterSection';
import ErrorBoundary from '../components/ErrorBoundary';
import NotFoundPage from '../pages/NotFoundPage';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import StatCard from '../components/dashboard/StatCard';
import BadgeCollection from '../components/rewards/BadgeCollection';
import SEO from '../components/SEO';

expect.extend(toHaveNoViolations);

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockT = (key, fallback) => fallback ?? key;

function wrapWithProviders(ui) {
  return (
    <HelmetProvider>
      <MemoryRouter>
        <ThemeProvider>
          <AuthContext.Provider value={{ user: null, guest: null, userProfile: null, logout: vi.fn() }}>
            <LanguageContext.Provider value={{ lang: 'en', setLang: vi.fn(), t: mockT }}>
              {ui}
            </LanguageContext.Provider>
          </AuthContext.Provider>
        </ThemeProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('Accessibility (axe-core)', () => {
  it('FooterSection has no a11y violations', async () => {
    const { container } = render(wrapWithProviders(<FooterSection t={mockT} />));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ErrorBoundary (no error state) has no a11y violations', async () => {
    const { container } = render(
      wrapWithProviders(
        <ErrorBoundary>
          <div>Content</div>
        </ErrorBoundary>
      )
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('NotFoundPage has no a11y violations', async () => {
    const { container } = render(wrapWithProviders(<NotFoundPage />));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('FeaturesSection has no a11y violations', async () => {
    const { container } = render(wrapWithProviders(<FeaturesSection t={mockT} />));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('TestimonialsSection has no a11y violations', async () => {
    const { container } = render(wrapWithProviders(<TestimonialsSection lang="en" />));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('StatCard has no a11y violations', async () => {
    const { container } = render(
      wrapWithProviders(<StatCard icon="🎮" label="Games" value={42} />)
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('BadgeCollection has no a11y violations', async () => {
    const { container } = render(
      wrapWithProviders(<BadgeCollection unlockedIds={['firstGame']} lang="en" />)
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('SEO renders without a11y issues', async () => {
    const { container } = render(
      wrapWithProviders(<SEO title="Test" description="Test page" />)
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
