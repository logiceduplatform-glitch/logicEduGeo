import { describe, it, expect, beforeEach } from 'vitest';
import { MissionsService } from '../services/MissionsService';
import { StorageService } from '../services/StorageService';

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const LAST_RESET_KEY = 'geo:dailyMissions:lastReset';
const STORAGE_KEY = 'geo:dailyMissions';

/** Pin “today” and seed three missions so updateProgress scenarios are deterministic. */
function seedTodayMissions(missions) {
  const today = todayStr();
  localStorage.setItem(LAST_RESET_KEY, today);
  StorageService.set(STORAGE_KEY, missions);
}

describe('MissionsService', () => {
  beforeEach(() => {
    localStorage.clear();
    StorageService.setScope(null);
  });

  describe('getMissions', () => {
    it('returns exactly three missions', () => {
      const missions = MissionsService.getMissions();
      expect(missions).toHaveLength(3);
    });

    it('returns the same missions on the same calendar day (localStorage date + cache)', () => {
      const first = MissionsService.getMissions();
      const second = MissionsService.getMissions();
      expect(second).toHaveLength(3);
      expect(second.map((m) => m.id).sort()).toEqual(first.map((m) => m.id).sort());
      expect(localStorage.getItem(LAST_RESET_KEY)).toBe(todayStr());
    });

    it('each mission includes id, type, target, icon, title, desc, reward, progress 0, completed false, claimed false', () => {
      const missions = MissionsService.getMissions();
      for (const m of missions) {
        expect(m).toMatchObject({
          id: expect.any(String),
          type: expect.any(String),
          target: expect.any(Number),
          icon: expect.any(String),
          title: expect.objectContaining({ el: expect.any(String), en: expect.any(String) }),
          desc: expect.objectContaining({ el: expect.any(String), en: expect.any(String) }),
          reward: expect.any(Number),
          progress: 0,
          completed: false,
          claimed: false,
        });
      }
    });

    it('multiple calls on the same day return equivalent cached missions from storage', () => {
      MissionsService.getMissions();
      const fromService = MissionsService.getMissions();
      const raw = StorageService.get(STORAGE_KEY);
      expect(fromService).toEqual(raw);
      expect(MissionsService.getMissions()).toEqual(fromService);
    });
  });

  describe('updateProgress', () => {
    it('marks a play3 (gamesPlayed / target 3) mission completed when gamesPlayedToday is 3', () => {
      seedTodayMissions([
        {
          id: 'play3',
          type: 'gamesPlayed',
          target: 3,
          icon: '🎮',
          title: { el: 'Παίξε 3 παιχνίδια', en: 'Play 3 games' },
          desc: { el: '…', en: '…' },
          reward: 2,
          progress: 0,
          completed: false,
          claimed: false,
        },
        {
          id: 'm2',
          type: 'keepStreak',
          target: 1,
          icon: '🔥',
          title: { el: 't', en: 't' },
          desc: { el: 'd', en: 'd' },
          reward: 1,
          progress: 0,
          completed: false,
          claimed: false,
        },
        {
          id: 'm3',
          type: 'keepStreak',
          target: 1,
          icon: '🔥',
          title: { el: 't', en: 't' },
          desc: { el: 'd', en: 'd' },
          reward: 1,
          progress: 0,
          completed: false,
          claimed: false,
        },
      ]);
      MissionsService.updateProgress({ gamesPlayedToday: 3 });
      const play3 = MissionsService.getMissions().find((m) => m.id === 'play3');
      expect(play3.completed).toBe(true);
      expect(play3.progress).toBe(3);
    });

    it('marks perfectScore mission completed when isPerfect is true', () => {
      seedTodayMissions([
        {
          id: 'perfect',
          type: 'perfectScore',
          target: 1,
          icon: '⭐',
          title: { el: 'Τέλειο σκορ', en: 'Perfect score' },
          desc: { el: 'd', en: 'd' },
          reward: 3,
          progress: 0,
          completed: false,
          claimed: false,
        },
        {
          id: 'm2',
          type: 'keepStreak',
          target: 1,
          icon: '🔥',
          title: { el: 't', en: 't' },
          desc: { el: 'd', en: 'd' },
          reward: 1,
          progress: 0,
          completed: false,
          claimed: false,
        },
        {
          id: 'm3',
          type: 'keepStreak',
          target: 1,
          icon: '🔥',
          title: { el: 't', en: 't' },
          desc: { el: 'd', en: 'd' },
          reward: 1,
          progress: 0,
          completed: false,
          claimed: false,
        },
      ]);
      MissionsService.updateProgress({ isPerfect: true });
      const perfect = MissionsService.getMissions().find((m) => m.id === 'perfect');
      expect(perfect.completed).toBe(true);
      expect(perfect.progress).toBe(1);
    });

    it('marks newGame mission completed when isNewGame is true', () => {
      seedTodayMissions([
        {
          id: 'tryNew',
          type: 'newGame',
          target: 1,
          icon: '🆕',
          title: { el: 'Νέο', en: 'New' },
          desc: { el: 'd', en: 'd' },
          reward: 2,
          progress: 0,
          completed: false,
          claimed: false,
        },
        {
          id: 'm2',
          type: 'keepStreak',
          target: 1,
          icon: '🔥',
          title: { el: 't', en: 't' },
          desc: { el: 'd', en: 'd' },
          reward: 1,
          progress: 0,
          completed: false,
          claimed: false,
        },
        {
          id: 'm3',
          type: 'keepStreak',
          target: 1,
          icon: '🔥',
          title: { el: 't', en: 't' },
          desc: { el: 'd', en: 'd' },
          reward: 1,
          progress: 0,
          completed: false,
          claimed: false,
        },
      ]);
      MissionsService.updateProgress({ isNewGame: true });
      const newGameMission = MissionsService.getMissions().find((m) => m.id === 'tryNew');
      expect(newGameMission.completed).toBe(true);
      expect(newGameMission.progress).toBe(1);
    });

    it('updates accuracy mission progress to 85 when accuracyThisGame is 85', () => {
      seedTodayMissions([
        {
          id: 'accuracy80',
          type: 'accuracy',
          target: 100,
          icon: '🎯',
          title: { el: 'Ακρίβεια', en: 'Accuracy' },
          desc: { el: 'd', en: 'd' },
          reward: 2,
          progress: 0,
          completed: false,
          claimed: false,
        },
        {
          id: 'm2',
          type: 'keepStreak',
          target: 1,
          icon: '🔥',
          title: { el: 't', en: 't' },
          desc: { el: 'd', en: 'd' },
          reward: 1,
          progress: 0,
          completed: false,
          claimed: false,
        },
        {
          id: 'm3',
          type: 'keepStreak',
          target: 1,
          icon: '🔥',
          title: { el: 't', en: 't' },
          desc: { el: 'd', en: 'd' },
          reward: 1,
          progress: 0,
          completed: false,
          claimed: false,
        },
      ]);
      MissionsService.updateProgress({ accuracyThisGame: 85 });
      const acc = MissionsService.getMissions().find((m) => m.id === 'accuracy80');
      expect(acc.progress).toBe(85);
      expect(acc.completed).toBe(false);
    });
  });

  describe('claimReward', () => {
    it('returns the reward amount for a completed, unclaimed mission', () => {
      seedTodayMissions([
        {
          id: 'play3',
          type: 'gamesPlayed',
          target: 3,
          icon: '🎮',
          title: { el: 't', en: 't' },
          desc: { el: 'd', en: 'd' },
          reward: 7,
          progress: 3,
          completed: true,
          claimed: false,
        },
        {
          id: 'm2',
          type: 'keepStreak',
          target: 1,
          icon: '🔥',
          title: { el: 't', en: 't' },
          desc: { el: 'd', en: 'd' },
          reward: 1,
          progress: 0,
          completed: false,
          claimed: false,
        },
        {
          id: 'm3',
          type: 'keepStreak',
          target: 1,
          icon: '🔥',
          title: { el: 't', en: 't' },
          desc: { el: 'd', en: 'd' },
          reward: 1,
          progress: 0,
          completed: false,
          claimed: false,
        },
      ]);
      expect(MissionsService.claimReward('play3')).toBe(7);
      const m = MissionsService.getMissions().find((x) => x.id === 'play3');
      expect(m.claimed).toBe(true);
    });

    it('returns 0 for an incomplete mission', () => {
      seedTodayMissions([
        {
          id: 'play3',
          type: 'gamesPlayed',
          target: 3,
          icon: '🎮',
          title: { el: 't', en: 't' },
          desc: { el: 'd', en: 'd' },
          reward: 2,
          progress: 1,
          completed: false,
          claimed: false,
        },
        {
          id: 'm2',
          type: 'keepStreak',
          target: 1,
          icon: '🔥',
          title: { el: 't', en: 't' },
          desc: { el: 'd', en: 'd' },
          reward: 1,
          progress: 0,
          completed: false,
          claimed: false,
        },
        {
          id: 'm3',
          type: 'keepStreak',
          target: 1,
          icon: '🔥',
          title: { el: 't', en: 't' },
          desc: { el: 'd', en: 'd' },
          reward: 1,
          progress: 0,
          completed: false,
          claimed: false,
        },
      ]);
      expect(MissionsService.claimReward('play3')).toBe(0);
    });

    it('returns 0 when the mission reward was already claimed', () => {
      seedTodayMissions([
        {
          id: 'play3',
          type: 'gamesPlayed',
          target: 3,
          icon: '🎮',
          title: { el: 't', en: 't' },
          desc: { el: 'd', en: 'd' },
          reward: 2,
          progress: 3,
          completed: true,
          claimed: true,
        },
        {
          id: 'm2',
          type: 'keepStreak',
          target: 1,
          icon: '🔥',
          title: { el: 't', en: 't' },
          desc: { el: 'd', en: 'd' },
          reward: 1,
          progress: 0,
          completed: false,
          claimed: false,
        },
        {
          id: 'm3',
          type: 'keepStreak',
          target: 1,
          icon: '🔥',
          title: { el: 't', en: 't' },
          desc: { el: 'd', en: 'd' },
          reward: 1,
          progress: 0,
          completed: false,
          claimed: false,
        },
      ]);
      expect(MissionsService.claimReward('play3')).toBe(0);
    });
  });
});
