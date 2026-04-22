import { describe, it, expect } from "vitest";
import {
  AGE_GROUP_CONFIG,
  CATEGORIES,
  ACTIVITIES,
  ACTIVITY_TO_COMPONENT,
  getCategoriesForAge,
  getActivitiesForAge,
  AGE_CATEGORIES,
  AGE_ACTIVITIES,
} from "../config/activityConfig";

const ORIGINAL_CATEGORY_IDS = CATEGORIES.map((c) => c.id);

function collectActivityIdsFromAgeActivities(ageKey) {
  const bucket = AGE_ACTIVITIES[ageKey];
  if (!bucket) return [];
  const ids = [];
  for (const list of Object.values(bucket)) {
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      if (item?.id) ids.push(item.id);
    }
  }
  return ids;
}

describe("activityConfig integration", () => {
  it('getCategoriesForAge returns CATEGORIES for "4-5" (same as default age bucket)', () => {
    expect(getCategoriesForAge("4-5")).toBe(AGE_CATEGORIES["4-5"]);
    expect(getCategoriesForAge("4-5")).toBe(CATEGORIES);
  });

  it('getCategoriesForAge returns custom categories for "6", "7-8", "9-10", "11-12"', () => {
    for (const age of ["6", "7-8", "9-10", "11-12"]) {
      const cats = getCategoriesForAge(age);
      expect(Array.isArray(cats)).toBe(true);
      expect(cats.length).toBeGreaterThan(0);
      expect(cats).not.toBe(CATEGORIES);
    }
  });

  it("each age group's categories have id, icon, title.el, title.en", () => {
    const ages = ["4-5", "6", "7-8", "9-10", "11-12"];
    for (const age of ages) {
      for (const cat of getCategoriesForAge(age)) {
        expect(cat.id).toBeTruthy();
        expect(cat.icon).toBeTruthy();
        expect(cat.title?.el).toBeTruthy();
        expect(cat.title?.en).toBeTruthy();
      }
    }
  });

  it('getActivitiesForAge returns ACTIVITIES for "4-5"', () => {
    expect(getActivitiesForAge("4-5")).toBe(ACTIVITIES);
  });

  it("getActivitiesForAge returns custom activities for other configured ages", () => {
    for (const age of ["6", "7-8", "9-10", "11-12"]) {
      const acts = getActivitiesForAge(age);
      expect(acts).not.toBe(ACTIVITIES);
      expect(typeof acts).toBe("object");
      expect(Object.keys(acts).length).toBeGreaterThan(0);
    }
  });

  it("every activity id referenced in AGE_ACTIVITIES has a mapping in ACTIVITY_TO_COMPONENT", () => {
    const seen = new Set();
    for (const ageKey of Object.keys(AGE_ACTIVITIES)) {
      for (const id of collectActivityIdsFromAgeActivities(ageKey)) {
        if (seen.has(id)) continue;
        seen.add(id);
        expect(
          ACTIVITY_TO_COMPONENT,
          `Missing ACTIVITY_TO_COMPONENT entry for activity id "${id}"`,
        ).toHaveProperty(id);
      }
    }
  });

  it('activities for older ages "9-10" and "11-12" do not use selfCare or fineMotor category keys', () => {
    for (const age of ["9-10", "11-12"]) {
      const keys = Object.keys(getActivitiesForAge(age));
      expect(keys).not.toContain("selfCare");
      expect(keys).not.toContain("fineMotor");
    }
  });

  it('activities for "4-5" include all original category keys from CATEGORIES', () => {
    const keys = Object.keys(getActivitiesForAge("4-5"));
    for (const id of ORIGINAL_CATEGORY_IDS) {
      expect(keys).toContain(id);
    }
  });

  it('AGE_GROUP_CONFIG has entries for age groups "4-5", "6", "7-8", "9-10", "11-12"', () => {
    const expected = ["4-5", "6", "7-8", "9-10", "11-12"];
    for (const key of expected) {
      expect(AGE_GROUP_CONFIG[key]).toBeDefined();
    }
  });

  it("each AGE_GROUP_CONFIG entry has title.el, title.en, and folderKey", () => {
    for (const cfg of Object.values(AGE_GROUP_CONFIG)) {
      expect(cfg.title?.el).toBeTruthy();
      expect(cfg.title?.en).toBeTruthy();
      expect(cfg.folderKey).toBeTruthy();
    }
  });

  it("unknown age falls back to default categories and activities", () => {
    expect(getCategoriesForAge("unknown-age")).toBe(CATEGORIES);
    expect(getActivitiesForAge("unknown-age")).toBe(ACTIVITIES);
  });
});
