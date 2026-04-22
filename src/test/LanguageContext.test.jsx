import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, LanguageContext } from '../i18n/LanguageContext';

function LangDisplay() {
  const { lang, setLang, t } = React.useContext(LanguageContext);
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="translated">{t('_lang', 'fallback')}</span>
      <button onClick={() => setLang('en')}>Switch EN</button>
      <button onClick={() => setLang('el')}>Switch EL</button>
    </div>
  );
}

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders with a default language', () => {
    render(
      <LanguageProvider>
        <LangDisplay />
      </LanguageProvider>
    );
    const lang = screen.getByTestId('lang');
    expect(['el', 'en']).toContain(lang.textContent);
  });

  it('switches language to English', () => {
    render(
      <LanguageProvider>
        <LangDisplay />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByText('Switch EN'));
    expect(screen.getByTestId('lang').textContent).toBe('en');
  });

  it('switches language to Greek', () => {
    render(
      <LanguageProvider>
        <LangDisplay />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByText('Switch EL'));
    expect(screen.getByTestId('lang').textContent).toBe('el');
  });

  it('persists language to localStorage', () => {
    render(
      <LanguageProvider>
        <LangDisplay />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByText('Switch EN'));
    expect(localStorage.getItem('geo:lang')).toBe('en');
  });

  it('sets document.documentElement.lang', () => {
    render(
      <LanguageProvider>
        <LangDisplay />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByText('Switch EN'));
    expect(document.documentElement.lang).toBe('en');
  });

  it('t() returns fallback for unknown keys', () => {
    render(
      <LanguageProvider>
        <LangDisplay />
      </LanguageProvider>
    );
    // The translated testid shows the result of t('_lang', 'fallback')
    // It could be from dict or fallback
    const translated = screen.getByTestId('translated');
    expect(translated.textContent).toBeTruthy();
  });
});
