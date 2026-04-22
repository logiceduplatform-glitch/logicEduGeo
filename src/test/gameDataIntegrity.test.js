import { describe, it, expect } from 'vitest';
import { readdirSync } from 'fs';
import { resolve } from 'path';

const EXERCISES_ROOT = resolve(__dirname, '../components/games');

const AGE_FOLDERS = {
  '4-5':  'exercises_4_5_1',
  '6':    'exercises_6_1',
  '7-8':  'exercises_7_8_1',
  '9-10': 'exercises_9_10_1',
  '11-12':'exercises_11_12_1',
};

const EI_GAMES = [
  'HowDoesItFeelGame',
  'DoTheRightThingGame',
  'WhoWaitsInLineGame',
  'HelpYourFriendGame',
  'GuessEmotionFromVoiceGame',
];

const LOGIC_GAMES = [
  'CompleteSentenceGame',
  'GuessWhatGame',
  'FindMissingNumberGame',
  'WhatRemainsGame',
  'PatternRecognitionGame',
];

const ALL_OVERRIDE_GAMES = [...EI_GAMES, ...LOGIC_GAMES];

describe('Age-specific override files exist', () => {
  for (const [age, folder] of Object.entries(AGE_FOLDERS)) {
    describe(`Age ${age} (${folder})`, () => {
      const folderPath = resolve(EXERCISES_ROOT, folder);
      const files = readdirSync(folderPath);

      it('folder exists and has files', () => {
        expect(files.length).toBeGreaterThan(0);
      });

      for (const game of ALL_OVERRIDE_GAMES) {
        it(`has ${game}.jsx`, () => {
          expect(files).toContain(`${game}.jsx`);
        });
      }
    });
  }
});

describe('Shared fallback files exist', () => {
  const sharedPath = resolve(EXERCISES_ROOT, 'exercises_fun_shared');
  const files = readdirSync(sharedPath);

  for (const game of ALL_OVERRIDE_GAMES) {
    it(`exercises_fun_shared has ${game}.jsx`, () => {
      expect(files).toContain(`${game}.jsx`);
    });
  }
});

describe('Game data integrity per age group', () => {
  for (const [age, folder] of Object.entries(AGE_FOLDERS)) {
    describe(`Age ${age}`, () => {

      for (const game of ALL_OVERRIDE_GAMES) {
        describe(game, () => {
          let mod;

          it('module exports a default function', async () => {
            mod = await import(`../components/games/${folder}/${game}.jsx`);
            expect(mod.default).toBeDefined();
            expect(typeof mod.default).toBe('function');
          });
        });
      }
    });
  }
});
