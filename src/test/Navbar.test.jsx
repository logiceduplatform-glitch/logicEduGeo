import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageContext } from '../i18n/LanguageContext';
import { AuthContext } from '../auth/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';
import { ProgressProvider } from '../contexts/ProgressContext';
import Navbar from '../components/Navbar';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderNavbar({ lang = 'en', user = null, guest = null } = {}) {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <AuthContext.Provider value={{
          user,
          guest,
          userProfile: null,
          logout: vi.fn(),
        }}>
          <LanguageContext.Provider value={{
            lang,
            setLang: vi.fn(),
            t: (key, fallback) => fallback ?? key,
          }}>
            <SubscriptionProvider>
              <ProgressProvider>
                <Navbar />
              </ProgressProvider>
            </SubscriptionProvider>
          </LanguageContext.Provider>
        </AuthContext.Provider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('Navbar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it('renders brand name', () => {
    renderNavbar();
    expect(screen.getAllByText('Kibloo').length).toBeGreaterThan(0);
  });

  it('renders navigation landmark', () => {
    const { container } = renderNavbar();
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav.getAttribute('role')).toBe('navigation');
  });

  it('shows login/signup buttons when not authenticated', () => {
    renderNavbar();
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('shows Greek login/signup when lang is el', () => {
    renderNavbar({ lang: 'el' });
    expect(screen.getByText('Σύνδεση')).toBeInTheDocument();
    expect(screen.getByText('Εγγραφή')).toBeInTheDocument();
  });

  it('shows user menu when logged in', () => {
    renderNavbar({ user: { displayName: 'John', email: 'john@test.com' } });
    expect(screen.getByLabelText('User menu')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('shows guest label when in guest mode', () => {
    renderNavbar({ guest: { id: 'guest_1', name: 'TestKid' } });
    expect(screen.getByLabelText('User menu')).toBeInTheDocument();
  });

  it('has mobile hamburger button', () => {
    renderNavbar();
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });

  it('opens mobile menu on hamburger click', () => {
    renderNavbar();
    fireEvent.click(screen.getByLabelText('Open menu'));
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
  });

  it('logo navigates to home', () => {
    renderNavbar();
    const logoSpans = screen.getAllByText('Kibloo');
    const logoButton = logoSpans[0].closest('button');
    fireEvent.click(logoButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
