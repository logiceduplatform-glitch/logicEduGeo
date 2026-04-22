import { describe, it, expect } from 'vitest';
import {
  FUN_AGE_CONFIG,
  SIDEBAR_CATEGORIES,
  FUN_SIDEBAR_CATEGORIES,
  LOGIC_SIDEBAR_CATEGORIES,
  FUN_1112_SIDEBAR_CATEGORIES,
  LOGIC_1112_SIDEBAR_CATEGORIES,
  getGameCategories,
} from '../config/funGameConfig';

describe('FUN_AGE_CONFIG', () => {
  const expectedAges = ['4-5', '6', '7-8', '9-10', '11-12'];

  for (const age of expectedAges) {
    it(`has config for age ${age}`, () => {
      const config = FUN_AGE_CONFIG[age];
      expect(config).toBeDefined();
      expect(config.folderKey).toBeTruthy();
      expect(config.title.el).toBeTruthy();
      expect(config.title.en).toBeTruthy();
      expect(config.gradient).toBeTruthy();
      expect(config.titleGradient).toBeTruthy();
    });
  }

  it('folder keys are unique', () => {
    const keys = Object.values(FUN_AGE_CONFIG).map(c => c.folderKey);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('Sidebar categories', () => {
  it('SIDEBAR_CATEGORIES has entries', () => {
    expect(SIDEBAR_CATEGORIES.length).toBeGreaterThanOrEqual(6);
  });

  it('FUN_SIDEBAR_CATEGORIES has entries', () => {
    expect(FUN_SIDEBAR_CATEGORIES.length).toBeGreaterThanOrEqual(4);
  });

  it('LOGIC_SIDEBAR_CATEGORIES has entries', () => {
    expect(LOGIC_SIDEBAR_CATEGORIES.length).toBeGreaterThanOrEqual(4);
  });

  it('FUN_1112_SIDEBAR_CATEGORIES has entries', () => {
    expect(FUN_1112_SIDEBAR_CATEGORIES.length).toBeGreaterThanOrEqual(3);
  });

  it('LOGIC_1112_SIDEBAR_CATEGORIES has entries', () => {
    expect(LOGIC_1112_SIDEBAR_CATEGORIES.length).toBeGreaterThanOrEqual(3);
  });

  it('each sidebar category has required fields', () => {
    const allCats = [
      ...SIDEBAR_CATEGORIES,
      ...FUN_SIDEBAR_CATEGORIES,
      ...LOGIC_SIDEBAR_CATEGORIES,
      ...FUN_1112_SIDEBAR_CATEGORIES,
      ...LOGIC_1112_SIDEBAR_CATEGORIES,
    ];

    for (const cat of allCats) {
      expect(cat.id).toBeTruthy();
      expect(cat.icon).toBeTruthy();
      expect(cat.title.el).toBeTruthy();
      expect(cat.title.en).toBeTruthy();
      expect(cat.color).toBeTruthy();
    }
  });
});

describe('getGameCategories', () => {
  const ageGroups = ['4-5', '6', '7-8', '9-10', '11-12'];

  for (const age of ageGroups) {
    describe(`age ${age}`, () => {
      if (age === '11-12') {
        it('fun mode returns categories with games', () => {
          const cats = getGameCategories(age, 'fun');
          expect(Object.keys(cats).length).toBeGreaterThan(0);
          const totalGames = Object.values(cats).flat().length;
          expect(totalGames).toBeGreaterThan(0);
        });

        it('logic mode returns categories with games', () => {
          const cats = getGameCategories(age, 'logic');
          expect(Object.keys(cats).length).toBeGreaterThan(0);
          const totalGames = Object.values(cats).flat().length;
          expect(totalGames).toBeGreaterThan(0);
        });
      } else if (age === '4-5') {
        it('default mode (no mode) returns all categories', () => {
          const cats = getGameCategories(age);
          expect(Object.keys(cats).length).toBeGreaterThanOrEqual(6);
        });
      } else {
        it('fun mode returns categories', () => {
          const cats = getGameCategories(age, 'fun');
          expect(Object.keys(cats).length).toBeGreaterThan(0);
        });

        it('logic mode returns categories', () => {
          const cats = getGameCategories(age, 'logic');
          expect(Object.keys(cats).length).toBeGreaterThan(0);
        });
      }
    });
  }

  it('age 6 fun gets extra games', () => {
    const cats6 = getGameCategories('6', 'fun');
    const cats78 = getGameCategories('7-8', 'fun');
    const total6 = Object.values(cats6).flat().length;
    const total78 = Object.values(cats78).flat().length;
    expect(total6).toBeGreaterThanOrEqual(total78);
  });

  it('age 6 logic gets extra games', () => {
    const cats6 = getGameCategories('6', 'logic');
    const cats78 = getGameCategories('7-8', 'logic');
    const total6 = Object.values(cats6).flat().length;
    const total78 = Object.values(cats78).flat().length;
    expect(total6).toBeGreaterThanOrEqual(total78);
  });
});
