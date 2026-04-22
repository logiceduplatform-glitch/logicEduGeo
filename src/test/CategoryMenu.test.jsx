import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageContext } from '../i18n/LanguageContext';
import CategoryMenu from '../components/Sidebar/CategoryMenu';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

function renderMenu({ lang = 'en', active = null, onSelect = vi.fn() } = {}) {
  return render(
    <MemoryRouter>
      <LanguageContext.Provider value={{ lang, setLang: vi.fn(), t: (k, f) => f ?? k }}>
        <CategoryMenu active={active} onSelect={onSelect} />
      </LanguageContext.Provider>
    </MemoryRouter>
  );
}

describe('CategoryMenu', () => {
  beforeEach(() => mockNavigate.mockClear());

  it('renders Categories heading in English', () => {
    renderMenu({ lang: 'en' });
    expect(screen.getByText(/Categories/)).toBeInTheDocument();
  });

  it('renders Categories heading in Greek', () => {
    renderMenu({ lang: 'el' });
    expect(screen.getByText(/Κατηγορίες/)).toBeInTheDocument();
  });

  it('renders 11 category buttons', () => {
    renderMenu();
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(12);
  });

  it('renders category labels in English', () => {
    renderMenu({ lang: 'en' });
    expect(screen.getByText('Math & Logic')).toBeInTheDocument();
    expect(screen.getByText('Natural World')).toBeInTheDocument();
    expect(screen.getByText('Puzzles & Riddles')).toBeInTheDocument();
    expect(screen.getByText('Science & Space')).toBeInTheDocument();
  });

  it('renders category labels in Greek', () => {
    renderMenu({ lang: 'el' });
    expect(screen.getByText('Μαθηματικά & Λογική')).toBeInTheDocument();
    expect(screen.getByText('Φυσικός Κόσμος')).toBeInTheDocument();
  });

  it('calls onSelect when a category is clicked', () => {
    const onSelect = vi.fn();
    renderMenu({ onSelect });
    fireEvent.click(screen.getByText('Math & Logic'));
    expect(onSelect).toHaveBeenCalledWith('LogicMath');
  });

  it('highlights active category', () => {
    const { container } = renderMenu({ active: 'LogicMath' });
    const activeBtn = container.querySelector('.scale-105');
    expect(activeBtn).toBeInTheDocument();
  });

  it('renders Board Games link', () => {
    renderMenu({ lang: 'en' });
    expect(screen.getByText('Board Games')).toBeInTheDocument();
  });

  it('Board Games link navigates', () => {
    renderMenu();
    fireEvent.click(screen.getByText('Board Games'));
    expect(mockNavigate).toHaveBeenCalledWith('/play/board-games');
  });
});
