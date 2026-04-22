import { describe, it, expect } from "vitest";
import { ADULT_GAME_CATEGORIES } from "../config/adultGameConfig";

function subgroupGameIdCount(category) {
  const unique = new Set();
  for (const sg of category.subgroups || []) {
    for (const id of sg.ids || []) {
      unique.add(id);
    }
  }
  return unique.size;
}

function allGameIdsFromCategories() {
  const ids = [];
  for (const cat of ADULT_GAME_CATEGORIES) {
    for (const g of cat.games || []) {
      ids.push(g.id);
    }
  }
  return ids;
}

describe("adultGameConfig integration", () => {
  it("exports ADULT_GAME_CATEGORIES with brainTraining, funGames, logicThinking", () => {
    expect(Array.isArray(ADULT_GAME_CATEGORIES)).toBe(true);
    expect(ADULT_GAME_CATEGORIES).toHaveLength(3);
    expect(ADULT_GAME_CATEGORIES.map((c) => c.id)).toEqual([
      "brainTraining",
      "funGames",
      "logicThinking",
    ]);
  });

  it("each category has id, title.el, title.en, icon, subgroups array", () => {
    for (const cat of ADULT_GAME_CATEGORIES) {
      expect(cat.id).toBeTruthy();
      expect(cat.title?.el).toBeTruthy();
      expect(cat.title?.en).toBeTruthy();
      expect(cat.icon).toBeTruthy();
      expect(Array.isArray(cat.subgroups)).toBe(true);
      expect(cat.subgroups.length).toBeGreaterThan(0);
    }
  });

  it("brainTraining has at least 20 distinct game ids across subgroups", () => {
    const cat = ADULT_GAME_CATEGORIES.find((c) => c.id === "brainTraining");
    expect(subgroupGameIdCount(cat)).toBeGreaterThanOrEqual(20);
  });

  it("funGames has at least 20 distinct game ids across subgroups", () => {
    const cat = ADULT_GAME_CATEGORIES.find((c) => c.id === "funGames");
    expect(subgroupGameIdCount(cat)).toBeGreaterThanOrEqual(20);
  });

  it("logicThinking has at least 20 distinct game ids across subgroups", () => {
    const cat = ADULT_GAME_CATEGORIES.find((c) => c.id === "logicThinking");
    expect(subgroupGameIdCount(cat)).toBeGreaterThanOrEqual(20);
  });

  it("each game has id, title.el, title.en, icon (display labels use title, not label)", () => {
    for (const cat of ADULT_GAME_CATEGORIES) {
      for (const game of cat.games || []) {
        expect(game.id).toBeTruthy();
        expect(game.title?.el).toBeTruthy();
        expect(game.title?.en).toBeTruthy();
        expect(game.icon).toBeTruthy();
      }
    }
  });

  it("no duplicate game ids across all categories", () => {
    const ids = allGameIdsFromCategories();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("total games across all categories is at least 60", () => {
    expect(allGameIdsFromCategories().length).toBeGreaterThanOrEqual(60);
  });
});
