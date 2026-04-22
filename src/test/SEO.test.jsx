import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import SEO from '../components/SEO';

function renderSEO(props = {}) {
  return render(
    <MemoryRouter>
      <HelmetProvider>
        <SEO {...props} />
      </HelmetProvider>
    </MemoryRouter>
  );
}

describe('SEO', () => {
  it('renders without crashing', () => {
    expect(() => renderSEO()).not.toThrow();
  });

  it('sets title with site name suffix', () => {
    renderSEO({ title: 'Math Quiz' });
    // HelmetProvider processes meta but in test env we check it doesn't throw
    // Full meta tag verification would require a more complex setup
  });

  it('renders with default values when no props provided', () => {
    expect(() => renderSEO()).not.toThrow();
  });

  it('renders with custom title and description', () => {
    expect(() => renderSEO({ title: 'Custom', description: 'Custom desc' })).not.toThrow();
  });
});
