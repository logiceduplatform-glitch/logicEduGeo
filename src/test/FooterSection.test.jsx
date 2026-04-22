import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageContext } from '../i18n/LanguageContext';
import FooterSection from '../components/FooterSection';

const mockT = (key, fallback) => fallback ?? key;

function LangWrapper({ children, lang = 'en' }) {
  return (
    <LanguageContext.Provider value={{ lang, setLang: () => {}, t: mockT }}>
      {children}
    </LanguageContext.Provider>
  );
}

describe('FooterSection', () => {
  it('renders the brand name', () => {
    render(<LangWrapper lang="en"><FooterSection t={mockT} /></LangWrapper>);
    expect(screen.getByText('GeoLo Platform')).toBeInTheDocument();
  });

  it('shows current year in copyright', () => {
    render(<LangWrapper lang="en"><FooterSection t={mockT} /></LangWrapper>);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeTruthy();
  });

  it('renders navigation links in English', () => {
    render(<LangWrapper lang="en"><FooterSection t={mockT} /></LangWrapper>);
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Games')).toBeInTheDocument();
    expect(screen.getByText('How it works')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
  });

  it('renders navigation links in Greek', () => {
    render(<LangWrapper lang="el"><FooterSection t={mockT} /></LangWrapper>);
    expect(screen.getByText('Κατηγορίες')).toBeInTheDocument();
    expect(screen.getByText('Χαρακτηριστικά')).toBeInTheDocument();
    expect(screen.getByText('Παιχνίδια')).toBeInTheDocument();
    expect(screen.getByText('Πώς λειτουργεί')).toBeInTheDocument();
  });

  it('shows contact email', () => {
    render(<LangWrapper lang="en"><FooterSection t={mockT} /></LangWrapper>);
    expect(screen.getByText('info@geoloplatform.com')).toBeInTheDocument();
  });

  it('renders privacy and terms links', () => {
    render(<LangWrapper lang="en"><FooterSection t={mockT} /></LangWrapper>);
    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
  });

  it('renders Greek privacy and terms', () => {
    render(<LangWrapper lang="el"><FooterSection t={mockT} /></LangWrapper>);
    expect(screen.getByText('Απόρρητο')).toBeInTheDocument();
    expect(screen.getByText('Όροι χρήσης')).toBeInTheDocument();
  });

  it('shows the footer tag name', () => {
    const { container } = render(<LangWrapper lang="en"><FooterSection t={mockT} /></LangWrapper>);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('shows the "Made with" tagline', () => {
    render(<LangWrapper lang="en"><FooterSection t={mockT} /></LangWrapper>);
    expect(screen.getByText(/Made with/)).toBeInTheDocument();
  });

  it('renders the branding tagline', () => {
    render(<LangWrapper lang="en"><FooterSection t={mockT} /></LangWrapper>);
    expect(screen.getByText('Learn. Think. Solve.')).toBeInTheDocument();
  });

});
