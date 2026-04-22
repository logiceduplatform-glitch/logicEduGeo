import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  SkeletonCard,
  SkeletonStats,
  GameSkeleton,
  SkeletonList,
  EmptySearchState,
} from '../components/SkeletonLoader';

function RouterWrap({ children }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

describe('SkeletonLoader', () => {
  describe('SkeletonCard', () => {
    it('renders default 3 cards with animate-pulse', () => {
      const { container } = render(
        <RouterWrap>
          <SkeletonCard />
        </RouterWrap>
      );
      const grid = container.querySelector('.grid.grid-cols-1');
      expect(grid).toBeInTheDocument();
      expect(grid.children.length).toBe(3);
      expect(grid.querySelectorAll('.animate-pulse').length).toBe(3);
    });

    it('renders custom count of cards', () => {
      const { container } = render(
        <RouterWrap>
          <SkeletonCard count={7} />
        </RouterWrap>
      );
      const grid = container.querySelector('.grid.grid-cols-1');
      expect(grid.children.length).toBe(7);
    });
  });

  describe('SkeletonStats', () => {
    it('renders 4 stat blocks with animate-pulse on the grid', () => {
      const { container } = render(
        <RouterWrap>
          <SkeletonStats />
        </RouterWrap>
      );
      const grid = container.querySelector('.grid.grid-cols-2');
      expect(grid).toHaveClass('animate-pulse');
      expect(grid.children.length).toBe(4);
    });
  });

  describe('GameSkeleton', () => {
    it('renders single game skeleton with animate-pulse', () => {
      const { container } = render(
        <RouterWrap>
          <GameSkeleton />
        </RouterWrap>
      );
      const pulseRoots = container.querySelectorAll('.animate-pulse');
      expect(pulseRoots.length).toBeGreaterThanOrEqual(1);
      expect(container.querySelector('.max-w-2xl')).toBeInTheDocument();
    });
  });

  describe('SkeletonList', () => {
    it('renders default 5 rows', () => {
      const { container } = render(
        <RouterWrap>
          <SkeletonList />
        </RouterWrap>
      );
      const list = container.querySelector('.space-y-3');
      expect(list.children.length).toBe(5);
    });

    it('renders custom number of rows', () => {
      const { container } = render(
        <RouterWrap>
          <SkeletonList rows={2} />
        </RouterWrap>
      );
      expect(container.querySelector('.space-y-3').children.length).toBe(2);
    });
  });

  describe('EmptySearchState', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('renders search icon and English copy when lang is en', () => {
      render(
        <RouterWrap>
          <EmptySearchState lang="en" />
        </RouterWrap>
      );
      expect(screen.getByText('🔍')).toBeInTheDocument();
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('shows clear button when onClear is provided', () => {
      const onClear = vi.fn();
      render(
        <RouterWrap>
          <EmptySearchState lang="en" onClear={onClear} />
        </RouterWrap>
      );
      expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
    });

    it('does not show clear button when onClear is omitted', () => {
      render(
        <RouterWrap>
          <EmptySearchState lang="en" />
        </RouterWrap>
      );
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('calls onClear when clear button is clicked', () => {
      const onClear = vi.fn();
      render(
        <RouterWrap>
          <EmptySearchState lang="en" onClear={onClear} />
        </RouterWrap>
      );
      fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('works in Greek', () => {
      render(
        <RouterWrap>
          <EmptySearchState lang="el" onClear={() => {}} />
        </RouterWrap>
      );
      expect(screen.getByText('Δεν βρέθηκαν αποτελέσματα')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Καθαρισμός' })).toBeInTheDocument();
    });
  });
});
