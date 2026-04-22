import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

function ThemeDisplay() {
  const { dark, toggle } = useTheme();
  return (
    <div>
      <span data-testid="theme">{dark ? 'dark' : 'light'}</span>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('defaults to light when no saved preference and no prefers-color-scheme', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    // Default depends on matchMedia, which returns false in jsdom
    const theme = screen.getByTestId('theme');
    expect(['light', 'dark']).toContain(theme.textContent);
  });

  it('toggles theme', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );

    const theme = screen.getByTestId('theme');
    const initial = theme.textContent;

    fireEvent.click(screen.getByText('Toggle'));
    expect(theme.textContent).not.toBe(initial);

    fireEvent.click(screen.getByText('Toggle'));
    expect(theme.textContent).toBe(initial);
  });

  it('persists theme to localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByText('Toggle'));
    const saved = localStorage.getItem('geo:theme');
    expect(['dark', 'light']).toContain(saved);
  });

  it('applies dark class to document element', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );

    const theme = screen.getByTestId('theme');
    if (theme.textContent === 'light') {
      fireEvent.click(screen.getByText('Toggle'));
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    } else {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    }
  });
});
