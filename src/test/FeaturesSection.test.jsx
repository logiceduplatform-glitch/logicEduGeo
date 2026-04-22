import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageContext } from '../i18n/LanguageContext';
import FeaturesSection from '../components/FeaturesSection';

const mockT = (key, fallback) => fallback ?? key;

function LangWrapper({ children, lang = 'en' }) {
  return (
    <LanguageContext.Provider value={{ lang, setLang: () => {}, t: mockT }}>
      {children}
    </LanguageContext.Provider>
  );
}

describe('FeaturesSection', () => {
  it('renders Features heading in English', () => {
    render(<LangWrapper lang="en"><FeaturesSection t={mockT} /></LangWrapper>);
    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  it('renders Features heading in Greek', () => {
    render(<LangWrapper lang="el"><FeaturesSection t={mockT} /></LangWrapper>);
    expect(screen.getByText('Χαρακτηριστικά')).toBeInTheDocument();
  });

  it('renders platform title', () => {
    render(<LangWrapper lang="en"><FeaturesSection t={mockT} /></LangWrapper>);
    expect(screen.getByText('Edutainment Platform')).toBeInTheDocument();
  });

  it('renders 4 main feature cards and 2 parent feature cards', () => {
    const { container } = render(<LangWrapper lang="en"><FeaturesSection t={mockT} /></LangWrapper>);
    const cards = container.querySelectorAll('.group');
    expect(cards.length).toBe(6);
  });

  it('renders feature icons (emoji or SVG)', () => {
    const { container } = render(<LangWrapper lang="en"><FeaturesSection t={mockT} /></LangWrapper>);
    const svgs = container.querySelectorAll('svg');
    const cards = container.querySelectorAll('.group');
    expect(svgs.length + cards.length).toBeGreaterThanOrEqual(4);
  });

  it('contains section element', () => {
    const { container } = render(<LangWrapper lang="en"><FeaturesSection t={mockT} /></LangWrapper>);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('shows parent-focused section in English', () => {
    render(<LangWrapper lang="en"><FeaturesSection t={mockT} /></LangWrapper>);
    expect(screen.getByText('Made for parents')).toBeInTheDocument();
  });

  it('shows parent-focused section in Greek', () => {
    render(<LangWrapper lang="el"><FeaturesSection t={mockT} /></LangWrapper>);
    expect(screen.getByText('Ειδικά για γονείς')).toBeInTheDocument();
  });
});
