import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageContext } from '../i18n/LanguageContext';
import NotFoundPage from '../pages/NotFoundPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderWithProviders(lang = 'en') {
  return render(
    <HelmetProvider>
      <LanguageContext.Provider value={{ lang, setLang: () => {}, t: () => {} }}>
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </LanguageContext.Provider>
    </HelmetProvider>
  );
}

describe('NotFoundPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('displays 404 heading', () => {
    renderWithProviders('en');
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('shows English text when lang is en', () => {
    renderWithProviders('en');
    expect(screen.getByText("Oops! Lost your way?")).toBeInTheDocument();
    expect(screen.getByText("Go home")).toBeInTheDocument();
    expect(screen.getByText("Go back")).toBeInTheDocument();
  });

  it('shows Greek text when lang is el', () => {
    renderWithProviders('el');
    expect(screen.getByText("Ωπ! Χάθηκες;")).toBeInTheDocument();
    expect(screen.getByText("Αρχική σελίδα")).toBeInTheDocument();
    expect(screen.getByText("Πίσω")).toBeInTheDocument();
  });

  it('Go home button navigates to /', () => {
    renderWithProviders('en');
    fireEvent.click(screen.getByText('Go home'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('Go back button navigates to home when no history', () => {
    renderWithProviders('en');
    fireEvent.click(screen.getByText('Go back'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('has the main-content id for accessibility skip-link', () => {
    const { container } = renderWithProviders('en');
    expect(container.querySelector('#main-content')).toBeInTheDocument();
  });
});
