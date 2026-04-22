import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VoiceButton from '../components/ui/VoiceButton';

vi.mock('../../config/gameInstructions', () => ({
  GAME_INSTRUCTIONS: {},
}));

describe('VoiceButton', () => {
  beforeEach(() => {
    window.speechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn(() => []),
      speaking: false,
    };
  });

  it('renders the button', () => {
    render(<VoiceButton gameId="test" lang="en" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows instructions label in English', () => {
    render(<VoiceButton gameId="test" lang="en" />);
    expect(screen.getByText('Instructions')).toBeInTheDocument();
  });

  it('shows instructions label in Greek', () => {
    render(<VoiceButton gameId="test" lang="el" />);
    expect(screen.getByText('Οδηγίες')).toBeInTheDocument();
  });

  it('has correct title attribute in English', () => {
    render(<VoiceButton gameId="test" lang="en" />);
    expect(screen.getByTitle('Listen to instructions')).toBeInTheDocument();
  });

  it('has correct title attribute in Greek', () => {
    render(<VoiceButton gameId="test" lang="el" />);
    expect(screen.getByTitle('Άκουσε τις οδηγίες')).toBeInTheDocument();
  });

  it('shows speaker icon', () => {
    render(<VoiceButton gameId="test" lang="en" />);
    expect(screen.getByText('🔈')).toBeInTheDocument();
  });
});
