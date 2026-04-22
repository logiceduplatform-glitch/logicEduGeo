import { describe, it, expect } from "vitest";
import { searchGames } from "../config/searchIndex";

function assertResultShape(results) {
  for (const r of results) {
    expect(r.id).toBeTruthy();
    expect(r.title).toBeDefined();
    expect(r.title?.en != null || r.title?.el != null).toBe(true);
    expect(r.icon).toBeTruthy();
    expect(r.section).toBeTruthy();
    expect(r.route).toBeTruthy();
  }
}

describe("searchIndex / searchGames", () => {
  it('returns results for "chess" (board game)', () => {
    const results = searchGames("chess");
    expect(results.length).toBeGreaterThan(0);
    const chess = results.find((r) => r.id === "chess");
    expect(chess).toBeDefined();
    expect(chess.section).toBe("board");
  });

  it("board game results include ?game= query parameter in route", () => {
    const results = searchGames("chess");
    const boardWithGame = results.filter(
      (r) => r.section === "board" && r.route.includes("?game="),
    );
    expect(boardWithGame.length).toBeGreaterThan(0);
  });

  it('returns results for "memory" or "μνήμη"', () => {
    const en = searchGames("memory");
    const el = searchGames("μνήμη");
    expect(en.length + el.length).toBeGreaterThan(0);
  });

  it('returns empty array for "xyznonexistent123"', () => {
    expect(searchGames("xyznonexistent123")).toEqual([]);
  });

  it("returns results for adult games", () => {
    const results = searchGames("sudoku");
    expect(results.some((r) => r.section === "adult")).toBe(true);
  });

  it("all non-empty search results have id, title, icon, section, route", () => {
    for (const q of ["chess", "memory", "quiz", "sudoku"]) {
      const results = searchGames(q);
      if (results.length === 0) continue;
      assertResultShape(results);
    }
  });

  it("query shorter than 2 characters returns empty array", () => {
    expect(searchGames("")).toEqual([]);
    expect(searchGames("a")).toEqual([]);
    expect(searchGames(null)).toEqual([]);
  });
});
