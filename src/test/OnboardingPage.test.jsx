import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageContext } from '../i18n/LanguageContext';
import { AuthContext } from '../auth/AuthContext';
import OnboardingPage from '../pages/OnboardingPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }) => <div data-testid="helmet">{children}</div>,
  HelmetProvider: ({ children }) => children,
}));

const mockSaveProfile = vi.fn();

function Wrapper({ children, lang = 'en' }) {
  const t = (key, fallback) => fallback ?? key;
  return (
    <LanguageContext.Provider value={{ lang, setLang: () => {}, t }}>
      <AuthContext.Provider value={{
        user: { uid: 'test-user' },
        guest: null,
        userProfile: null,
        userRole: 'student',
        loading: false,
        error: null,
        saveUserProfile: mockSaveProfile,
      }}>
        <MemoryRouter>{children}</MemoryRouter>
      </AuthContext.Provider>
    </LanguageContext.Provider>
  );
}

describe('OnboardingPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockSaveProfile.mockClear();
  });

  it('renders role selection as first step', () => {
    render(<Wrapper><OnboardingPage /></Wrapper>);
    expect(screen.getByText('Who are you?')).toBeInTheDocument();
    expect(screen.getByText('Choose your role')).toBeInTheDocument();
  });

  it('shows three role options', () => {
    render(<Wrapper><OnboardingPage /></Wrapper>);
    expect(screen.getByText('imStudent')).toBeInTheDocument();
    expect(screen.getByText('imParent')).toBeInTheDocument();
    expect(screen.getByText('imTeacher')).toBeInTheDocument();
  });

  it('shows progress indicator', () => {
    render(<Wrapper><OnboardingPage /></Wrapper>);
    expect(screen.getByText(/Step 1/)).toBeInTheDocument();
  });

  it('action button is disabled until role is selected', () => {
    render(<Wrapper><OnboardingPage /></Wrapper>);
    const actionBtn = screen.getByText("Let's go!").closest('button');
    expect(actionBtn).toBeDisabled();
  });

  it('enables Next after selecting student role', () => {
    render(<Wrapper><OnboardingPage /></Wrapper>);
    fireEvent.click(screen.getByText('imStudent'));
    const nextBtn = screen.getByText('Next');
    expect(nextBtn).not.toBeDisabled();
  });

  it('proceeds to name step after selecting student and clicking Next', () => {
    render(<Wrapper><OnboardingPage /></Wrapper>);
    fireEvent.click(screen.getByText('imStudent'));
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText("What's your name?")).toBeInTheDocument();
  });

  it('student flow goes through 4 steps (role → name → age → objective)', () => {
    render(<Wrapper><OnboardingPage /></Wrapper>);
    fireEvent.click(screen.getByText('imStudent'));
    expect(screen.getByText(/of 4/)).toBeInTheDocument();
  });

  it('parent flow goes through 6 steps', () => {
    render(<Wrapper><OnboardingPage /></Wrapper>);
    fireEvent.click(screen.getByText('imParent'));
    expect(screen.getByText(/of 6/)).toBeInTheDocument();
  });

  it('teacher flow goes through 3 steps (role → name → teacher-info)', () => {
    render(<Wrapper><OnboardingPage /></Wrapper>);
    fireEvent.click(screen.getByText('imTeacher'));
    expect(screen.getByText(/of 3/)).toBeInTheDocument();
  });

  it('parent flow saves profile and navigates after all 6 steps', () => {
    render(<Wrapper><OnboardingPage /></Wrapper>);

    // Step 1: role
    fireEvent.click(screen.getByText('imParent'));
    fireEvent.click(screen.getByText('Next'));

    // Step 2: parent name
    fireEvent.change(screen.getByPlaceholderText('e.g. Maria'), { target: { value: 'Parent User' } });
    fireEvent.click(screen.getByText('Next'));

    // Step 3: child name
    fireEvent.change(screen.getByPlaceholderText('e.g. Nick'), { target: { value: 'Child Name' } });
    fireEvent.click(screen.getByText('Next'));

    // Step 4: child age - click an age option
    fireEvent.click(screen.getByText(/4-5/));
    fireEvent.click(screen.getByText('Next'));

    // Step 5: parent goal
    fireEvent.click(screen.getByText('School preparation'));
    fireEvent.click(screen.getByText('Next'));

    // Step 6: session time
    fireEvent.click(screen.getByText('20 minutes'));
    fireEvent.click(screen.getByText("Let's go!"));

    expect(mockSaveProfile).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Parent User', role: 'parent' })
    );
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('teacher flow shows school name and grade selection', () => {
    render(<Wrapper><OnboardingPage /></Wrapper>);

    fireEvent.click(screen.getByText('imTeacher'));
    fireEvent.click(screen.getByText('Next'));

    const input = screen.getByPlaceholderText('e.g. Maria');
    fireEvent.change(input, { target: { value: 'Teacher User' } });
    fireEvent.click(screen.getByText('Next'));

    expect(screen.getByText('A few more details')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Lincoln Elementary')).toBeInTheDocument();
    expect(screen.getByText('Elementary (6-12)')).toBeInTheDocument();
    expect(screen.getByText('Middle school (13-15)')).toBeInTheDocument();
    expect(screen.getByText('High school (16-18)')).toBeInTheDocument();
    expect(screen.getByText('All grades')).toBeInTheDocument();
  });

  it('teacher flow saves profile and navigates to /teacher-dashboard', () => {
    render(<Wrapper><OnboardingPage /></Wrapper>);

    fireEvent.click(screen.getByText('imTeacher'));
    fireEvent.click(screen.getByText('Next'));

    fireEvent.change(screen.getByPlaceholderText('e.g. Maria'), { target: { value: 'TeacherName' } });
    fireEvent.click(screen.getByText('Next'));

    fireEvent.change(screen.getByPlaceholderText('e.g. Lincoln Elementary'), { target: { value: 'Test School' } });
    fireEvent.click(screen.getByText('Elementary (6-12)'));
    fireEvent.click(screen.getByText("Let's go!"));

    expect(mockSaveProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'TeacherName',
        role: 'teacher',
        schoolName: 'Test School',
        gradeRange: 'elem',
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/teacher-dashboard');
  });

  it('back button returns to previous step', () => {
    render(<Wrapper><OnboardingPage /></Wrapper>);

    fireEvent.click(screen.getByText('imStudent'));
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText("What's your name?")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Back/));
    expect(screen.getByText('Who are you?')).toBeInTheDocument();
  });

  it('renders in Greek', () => {
    render(<Wrapper lang="el"><OnboardingPage /></Wrapper>);
    expect(screen.getByText('Ποιος είσαι;')).toBeInTheDocument();
    expect(screen.getByText('Διάλεξε τον ρόλο σου')).toBeInTheDocument();
  });
});
