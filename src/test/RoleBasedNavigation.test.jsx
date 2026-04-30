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
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderNavbar({ lang = 'en', user = null, guest = null, userRole = 'student', userProfile = null } = {}) {
  const t = (key, fallback) => fallback ?? key;
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <AuthContext.Provider value={{
          user,
          guest,
          userProfile: userProfile || (user ? { name: user.displayName || 'User', role: userRole } : null),
          userRole,
          loading: false,
          error: null,
          logout: vi.fn(),
        }}>
          <LanguageContext.Provider value={{ lang, setLang: vi.fn(), t }}>
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

describe('Role-Based Navigation', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it('renders brand for unauthenticated user', () => {
    renderNavbar();
    expect(screen.getAllByText('Kibloo').length).toBeGreaterThan(0);
  });

  it('shows login/register buttons when not logged in', () => {
    renderNavbar();
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('shows user name when logged in', () => {
    renderNavbar({
      user: { uid: 'u1', displayName: 'John' },
      userProfile: { name: 'John', role: 'student' },
      userRole: 'student',
    });
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('shows teacher dashboard link for teachers in dropdown', () => {
    renderNavbar({
      user: { uid: 'u1', displayName: 'TeacherUser' },
      userProfile: { name: 'TeacherUser', role: 'teacher' },
      userRole: 'teacher',
    });
    fireEvent.click(screen.getByLabelText('User menu'));
    expect(screen.getByText('Teacher Dashboard')).toBeInTheDocument();
  });

  it('shows parent dashboard link for parents in dropdown', () => {
    renderNavbar({
      user: { uid: 'u1', displayName: 'ParentUser' },
      userProfile: { name: 'ParentUser', role: 'parent' },
      userRole: 'parent',
    });
    fireEvent.click(screen.getByLabelText('User menu'));
    expect(screen.getByText('Parent Dashboard')).toBeInTheDocument();
  });

  it('does not show teacher/parent links for students', () => {
    renderNavbar({
      user: { uid: 'u1', displayName: 'Student' },
      userProfile: { name: 'Student', role: 'student' },
      userRole: 'student',
    });
    expect(screen.queryByText('Teacher Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Parent Dashboard')).not.toBeInTheDocument();
  });

  it('renders search button', () => {
    renderNavbar();
    const searchBtns = screen.getAllByLabelText('Search');
    expect(searchBtns.length).toBeGreaterThanOrEqual(1);
  });

  it('shows role badge for teacher in profile dropdown', () => {
    renderNavbar({
      user: { uid: 'u1', displayName: 'TeacherUser' },
      userProfile: { name: 'TeacherUser', role: 'teacher' },
      userRole: 'teacher',
    });
    fireEvent.click(screen.getByLabelText('User menu'));
    const badges = screen.getAllByText('Teacher');
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it('shows role badge for parent in profile dropdown', () => {
    renderNavbar({
      user: { uid: 'u1', displayName: 'ParentUser' },
      userProfile: { name: 'ParentUser', role: 'parent' },
      userRole: 'parent',
    });
    fireEvent.click(screen.getByLabelText('User menu'));
    expect(screen.getByText('Parent')).toBeInTheDocument();
  });
});
