import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageContext } from '../i18n/LanguageContext';
import SearchOverlay from '../components/SearchOverlay';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../services/AnalyticsService', () => ({
  AnalyticsService: { search: vi.fn() },
}));

function LangWrapper({ children, lang = 'en' }) {
  const t = (key, fallback) => fallback ?? key;
  return (
    <LanguageContext.Provider value={{ lang, setLang: () => {}, t }}>
      <MemoryRouter>{children}</MemoryRouter>
    </LanguageContext.Provider>
  );
}

describe('SearchOverlay', () => {
  beforeEach(() => mockNavigate.mockClear());

  it('renders nothing when closed', () => {
    const { container } = render(
      <LangWrapper>
        <SearchOverlay open={false} onClose={vi.fn()} />
      </LangWrapper>
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders search input when open', () => {
    render(
      <LangWrapper>
        <SearchOverlay open={true} onClose={vi.fn()} />
      </LangWrapper>
    );
    expect(screen.getByPlaceholderText('Search games, pages...')).toBeInTheDocument();
  });

  it('shows hint when query is short', () => {
    render(
      <LangWrapper>
        <SearchOverlay open={true} onClose={vi.fn()} />
      </LangWrapper>
    );
    expect(screen.getByText('Type at least 2 characters')).toBeInTheDocument();
  });

  it('shows ESC keyboard hint', () => {
    render(
      <LangWrapper>
        <SearchOverlay open={true} onClose={vi.fn()} />
      </LangWrapper>
    );
    expect(screen.getByText('ESC')).toBeInTheDocument();
  });

  it('shows no results message for unmatched query', async () => {
    render(
      <LangWrapper>
        <SearchOverlay open={true} onClose={vi.fn()} />
      </LangWrapper>
    );
    const input = screen.getByPlaceholderText('Search games, pages...');
    fireEvent.change(input, { target: { value: 'xyznonexistent123' } });
    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  it('shows results for a valid query', async () => {
    render(
      <LangWrapper>
        <SearchOverlay open={true} onClose={vi.fn()} />
      </LangWrapper>
    );
    const input = screen.getByPlaceholderText('Search games, pages...');
    fireEvent.change(input, { target: { value: 'puzzle' } });
    await waitFor(() => {
      const results = screen.queryAllByText(/puzzle/i);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <LangWrapper>
        <SearchOverlay open={true} onClose={onClose} />
      </LangWrapper>
    );
    const backdrop = container.querySelector('.fixed.inset-0');
    if (backdrop) fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(
      <LangWrapper>
        <SearchOverlay open={true} onClose={onClose} />
      </LangWrapper>
    );
    const input = screen.getByPlaceholderText('Search games, pages...');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('renders Greek placeholders when lang is el', () => {
    render(
      <LangWrapper lang="el">
        <SearchOverlay open={true} onClose={vi.fn()} />
      </LangWrapper>
    );
    expect(screen.getByPlaceholderText('Αναζήτηση παιχνιδιών, σελίδων...')).toBeInTheDocument();
    expect(screen.getByText('Πληκτρολόγησε τουλάχιστον 2 χαρακτήρες')).toBeInTheDocument();
  });
});
