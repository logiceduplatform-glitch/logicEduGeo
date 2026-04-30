import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TestimonialsSection from '../components/TestimonialsSection';

describe('TestimonialsSection', () => {
  it('renders English heading', () => {
    render(<TestimonialsSection lang="en" />);
    expect(screen.getByText('What our users say')).toBeInTheDocument();
    expect(screen.getByText('Testimonials')).toBeInTheDocument();
  });

  it('renders Greek heading', () => {
    render(<TestimonialsSection lang="el" />);
    expect(screen.getByText('Τι λένε οι χρήστες μας')).toBeInTheDocument();
    expect(screen.getByText('Αξιολογήσεις')).toBeInTheDocument();
  });

  it('renders 3 testimonial cards in English', () => {
    render(<TestimonialsSection lang="en" />);
    expect(screen.getAllByText('Maria K.').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('George P.').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Elena D.').length).toBeGreaterThanOrEqual(1);
  });

  it('renders 3 testimonial cards in Greek', () => {
    render(<TestimonialsSection lang="el" />);
    expect(screen.getAllByText('Μαρία Κ.').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Γιώργος Π.').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Ελένη Δ.').length).toBeGreaterThanOrEqual(1);
  });

  it('shows roles for each testimonial', () => {
    render(<TestimonialsSection lang="en" />);
    expect(screen.getAllByText('Mother of 2').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('2nd Grade Teacher').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Mother & Pediatrician').length).toBeGreaterThanOrEqual(1);
  });

  it('renders star ratings', () => {
    const { container } = render(<TestimonialsSection lang="en" />);
    const stars = container.querySelectorAll('svg');
    expect(stars.length).toBeGreaterThanOrEqual(15);
  });

  it('renders testimonial text', () => {
    render(<TestimonialsSection lang="en" />);
    expect(screen.getAllByText(/recognizes all letters/).length).toBeGreaterThanOrEqual(1);
  });
});
