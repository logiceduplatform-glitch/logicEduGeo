import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageContext } from '../i18n/LanguageContext';
import ShareScoreCard from '../components/ShareScoreCard';

function createMockCanvasContext() {
  const gradient = { addColorStop: vi.fn() };
  return {
    createLinearGradient: vi.fn(() => gradient),
    addColorStop: vi.fn(),
    fillStyle: '',
    beginPath: vi.fn(),
    roundRect: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    fillText: vi.fn(),
    font: '',
    textAlign: '',
  };
}

describe('ShareScoreCard', () => {
  let mockCtx;

  beforeEach(() => {
    mockCtx = createMockCanvasContext();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => mockCtx);
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,test');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function Wrapper({ children, lang = 'en' }) {
    return (
      <MemoryRouter>
        <LanguageContext.Provider value={{ lang, setLang: () => {}, t: (k, f) => f ?? k }}>
          {children}
        </LanguageContext.Provider>
      </MemoryRouter>
    );
  }

  it('renders when given valid props', () => {
    render(
      <Wrapper>
        <ShareScoreCard gameName="Memory Match" score={8} total={10} icon="🧠" />
      </Wrapper>
    );
    expect(screen.getByRole('button', { name: 'Facebook' })).toBeInTheDocument();
  });

  it('shows Facebook, X / Twitter, WhatsApp, and Download actions', () => {
    render(
      <Wrapper>
        <ShareScoreCard gameName="Memory Match" score={8} total={10} icon="🧠" />
      </Wrapper>
    );
    expect(screen.getByRole('button', { name: 'Facebook' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'X / Twitter' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'WhatsApp' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download Card/i })).toBeInTheDocument();
  });

  it('has accessible labels on share buttons', () => {
    render(
      <Wrapper>
        <ShareScoreCard gameName="Memory Match" score={8} total={10} icon="🧠" />
      </Wrapper>
    );
    expect(screen.getByRole('button', { name: 'Facebook' })).toHaveAttribute('aria-label', 'Facebook');
    expect(screen.getByRole('button', { name: 'X / Twitter' })).toHaveAttribute('aria-label', 'X / Twitter');
    expect(screen.getByRole('button', { name: 'WhatsApp' })).toHaveAttribute('aria-label', 'WhatsApp');
  });
});
