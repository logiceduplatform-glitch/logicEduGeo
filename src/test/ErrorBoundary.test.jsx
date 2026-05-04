import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';
import { ErrorReportingService } from '../services/ErrorReportingService';

function BrokenComponent() {
  throw new Error('Test explosion');
}

function GoodComponent() {
  return <div>All good here</div>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    localStorage.clear();
    ErrorReportingService._resetForTests?.();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('All good here')).toBeInTheDocument();
  });

  it('renders fallback UI when child throws', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument();
  });

  it('shows Try again button', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('logs error to localStorage', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    const errorLog = JSON.parse(localStorage.getItem('geo:errorLog'));
    expect(errorLog).toBeInstanceOf(Array);
    expect(errorLog.length).toBeGreaterThan(0);
    expect(errorLog[0].message).toBe('Test explosion');
    expect(errorLog[0].timestamp).toBeTruthy();
    expect(errorLog[0].url).toBeTruthy();
  });

  it('limits error log to 50 entries', () => {
    const existingLog = Array(55).fill(null).map((_, i) => ({
      message: `Error ${i}`,
      timestamp: new Date().toISOString(),
      url: 'test',
    }));
    localStorage.setItem('geo:errorLog', JSON.stringify(existingLog));

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    const errorLog = JSON.parse(localStorage.getItem('geo:errorLog'));
    expect(errorLog.length).toBeLessThanOrEqual(50);
  });

  it('resets error state when Try again is clicked', () => {
    let shouldThrow = true;

    function MaybeThrow() {
      if (shouldThrow) throw new Error('boom');
      return <div>Recovered!</div>;
    }

    const { container } = render(
      <ErrorBoundary>
        <MaybeThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

    shouldThrow = false;
    fireEvent.click(screen.getByText('Try again'));

    expect(screen.getByText('Recovered!')).toBeInTheDocument();
  });
});
