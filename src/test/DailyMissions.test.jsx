import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageContext } from '../i18n/LanguageContext';
import { AuthContext } from '../auth/AuthContext';
import DailyMissions from '../components/DailyMissions';
import { MissionsService } from '../services/MissionsService';
import { CoinService } from '../services/CoinService';

const { mockMissions, missionTemplate } = vi.hoisted(() => {
  const template = [
    {
      id: 'play3',
      type: 'gamesPlayed',
      target: 3,
      progress: 2,
      completed: false,
      claimed: false,
      icon: '🎮',
      title: { el: 'Παίξε 3', en: 'Play 3 games' },
      desc: { el: 'desc', en: 'desc' },
      reward: 2,
    },
    {
      id: 'perfect',
      type: 'perfectScore',
      target: 1,
      progress: 1,
      completed: true,
      claimed: false,
      icon: '⭐',
      title: { el: 'Τέλειο', en: 'Perfect score' },
      desc: { el: 'desc', en: 'desc' },
      reward: 3,
    },
    {
      id: 'streak',
      type: 'keepStreak',
      target: 1,
      progress: 0,
      completed: false,
      claimed: false,
      icon: '🔥',
      title: { el: 'Σερί', en: 'Keep streak' },
      desc: { el: 'desc', en: 'desc' },
      reward: 1,
    },
  ];
  return {
    missionTemplate: template,
    mockMissions: structuredClone(template),
  };
});

vi.mock('../services/MissionsService', () => ({
  MissionsService: {
    getMissions: vi.fn(() => mockMissions),
    claimReward: vi.fn((id) => {
      const m = mockMissions.find((x) => x.id === id);
      if (m && m.completed && !m.claimed) {
        m.claimed = true;
        return m.reward;
      }
      return 0;
    }),
  },
}));

vi.mock('../services/CoinService', () => ({
  CoinService: {
    earn: vi.fn(),
    addCoins: vi.fn(),
  },
}));

function Wrapper({ children, lang = 'en' }) {
  return (
    <MemoryRouter>
      <LanguageContext.Provider value={{ lang, setLang: () => {}, t: (k, f) => f ?? k }}>
        <AuthContext.Provider
          value={{
            user: { uid: 'u1' },
            guest: null,
            userProfile: null,
            userRole: 'student',
            loading: false,
          }}
        >
          {children}
        </AuthContext.Provider>
      </LanguageContext.Provider>
    </MemoryRouter>
  );
}

describe('DailyMissions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMissions.length = 0;
    mockMissions.push(...structuredClone(missionTemplate));
  });

  it('renders "Daily Missions" heading', () => {
    render(
      <Wrapper>
        <DailyMissions />
      </Wrapper>
    );
    expect(screen.getByRole('heading', { name: 'Daily Missions' })).toBeInTheDocument();
  });

  it('renders 3 mission cards', () => {
    const { container } = render(
      <Wrapper>
        <DailyMissions />
      </Wrapper>
    );
    expect(MissionsService.getMissions).toHaveBeenCalled();
    const cards = container.querySelectorAll('.space-y-3 > div');
    expect(cards.length).toBe(3);
  });

  it('shows progress bars for each mission', () => {
    const { container } = render(
      <Wrapper>
        <DailyMissions />
      </Wrapper>
    );
    const tracks = container.querySelectorAll('.h-2.rounded-full.bg-slate-200');
    expect(tracks.length).toBe(3);
  });

  it('shows reward on claimable completed mission and progress for all', () => {
    render(
      <Wrapper>
        <DailyMissions />
      </Wrapper>
    );
    expect(screen.getByText(/🪙 \+3/)).toBeInTheDocument();
    expect(screen.getByText('2/3')).toBeInTheDocument();
    expect(screen.getByText('1/1')).toBeInTheDocument();
    expect(screen.getByText('0/1')).toBeInTheDocument();
  });

  it('calls claimReward when claim button clicked on completed mission', async () => {
    render(
      <Wrapper>
        <DailyMissions />
      </Wrapper>
    );
    fireEvent.click(screen.getByRole('button', { name: /🪙 \+3/ }));
    await waitFor(() => {
      expect(MissionsService.claimReward).toHaveBeenCalledWith('perfect');
    });
  });

  it('calls CoinService.earn with reward amount when claiming', async () => {
    render(
      <Wrapper>
        <DailyMissions />
      </Wrapper>
    );
    fireEvent.click(screen.getByRole('button', { name: /🪙 \+3/ }));
    await waitFor(() => {
      expect(CoinService.earn).toHaveBeenCalledWith(3);
    });
  });

  it('does not show claim button for uncompleted missions', () => {
    render(
      <Wrapper>
        <DailyMissions />
      </Wrapper>
    );
    const claimButtons = screen.queryAllByRole('button', { name: /🪙/ });
    expect(claimButtons).toHaveLength(1);
  });

  it('renders Greek title when lang is el', () => {
    render(
      <Wrapper lang="el">
        <DailyMissions />
      </Wrapper>
    );
    expect(screen.getByRole('heading', { name: 'Ημερήσιες Αποστολές' })).toBeInTheDocument();
  });
});
