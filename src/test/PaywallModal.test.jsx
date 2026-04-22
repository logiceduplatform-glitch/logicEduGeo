import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PaywallModal from '../components/PaywallModal';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('PaywallModal', () => {
  beforeEach(() => mockNavigate.mockClear());

  it('renders English modal', () => {
    render(
      <MemoryRouter>
        <PaywallModal lang="en" onClose={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText('Unlock Everything!')).toBeInTheDocument();
    expect(screen.getByText('Upgrade to Premium for full access')).toBeInTheDocument();
  });

  it('renders Greek modal', () => {
    render(
      <MemoryRouter>
        <PaywallModal lang="el" onClose={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText('Ξεκλείδωσε Όλα!')).toBeInTheDocument();
  });

  it('shows correct price of 2.99', () => {
    render(
      <MemoryRouter>
        <PaywallModal lang="en" onClose={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText(/2\.99/)).toBeInTheDocument();
  });

  it('shows English feature list', () => {
    render(
      <MemoryRouter>
        <PaywallModal lang="en" onClose={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText('Unlock all games')).toBeInTheDocument();
    expect(screen.getByText('Detailed stats & certificates')).toBeInTheDocument();
    expect(screen.getByText('No time limits')).toBeInTheDocument();
    expect(screen.getByText('New games every month')).toBeInTheDocument();
  });

  it('has accessible dialog role', () => {
    render(
      <MemoryRouter>
        <PaywallModal lang="en" onClose={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls onClose when "Not now" is clicked', () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <PaywallModal lang="en" onClose={onClose} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Not now'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <PaywallModal lang="en" onClose={onClose} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalled();
  });

  it('navigates to /subscription when "See plans" is clicked', () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <PaywallModal lang="en" onClose={onClose} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('See plans'));
    expect(onClose).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/subscription');
  });

  it('has close button with accessible label', () => {
    render(
      <MemoryRouter>
        <PaywallModal lang="en" onClose={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <PaywallModal lang="en" onClose={onClose} />
      </MemoryRouter>
    );
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
