import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProgressService } from "../services/ProgressService";
import { MissionsService } from "../services/MissionsService";
import { CertificateService } from "../services/CertificateService";

describe("game completion flow (Progress + Missions + Certificates)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("recording a game completion updates game stats in ProgressService", () => {
    ProgressService.recordGameComplete({
      gameId: "integration-game-a",
      title: "Test Game",
      score: 8,
      total: 10,
      category: "math",
      difficulty: 2,
    });
    const p = ProgressService.getGameProgress("integration-game-a");
    expect(p.gamesPlayed).toBe(1);
    expect(p.bestScore).toBe(8);
    expect(p.totalCorrect).toBe(8);
    expect(p.totalAttempts).toBe(10);
  });

  it("recording a game completion updates daily stats", () => {
    ProgressService.recordGameComplete({
      gameId: "daily-stats-game",
      score: 3,
      total: 5,
    });
    const daily = ProgressService.getDailyStats();
    expect(daily.gamesPlayed).toBe(1);
    expect(daily.totalCorrect).toBe(3);
  });

  it("recording multiple games increases XP", () => {
    const xp0 = ProgressService.getXP().totalXP;
    ProgressService.recordGameComplete({
      gameId: "xp-1",
      score: 5,
      total: 5,
      difficulty: 1,
    });
    const xp1 = ProgressService.getXP().totalXP;
    ProgressService.recordGameComplete({
      gameId: "xp-2",
      score: 5,
      total: 5,
      difficulty: 1,
    });
    const xp2 = ProgressService.getXP().totalXP;
    expect(xp1).toBeGreaterThan(xp0);
    expect(xp2).toBeGreaterThan(xp1);
  });

  it('after completing 10 games, CertificateService state includes "games_10"', () => {
    for (let i = 0; i < 10; i++) {
      ProgressService.recordGameComplete({
        gameId: `cert-milestone-${i}`,
        score: 1,
        total: 1,
      });
    }
    expect(ProgressService.getOverallStats().totalGamesPlayed).toBe(10);
    const earned = CertificateService.getEarnedCertificates();
    expect(earned.some((c) => c.id === "games_10")).toBe(true);
    const fresh = CertificateService.checkMilestones({
      gamesPlayed: 10,
      level: 1,
      streak: 0,
      correct: 0,
    });
    expect(fresh.some((c) => c.id === "games_10")).toBe(false);
  });

  it("MissionsService.getMissions returns 3 missions; still 3 after a game completion", () => {
    const initial = MissionsService.getMissions();
    expect(initial).toHaveLength(3);
    ProgressService.recordGameComplete({
      gameId: "missions-count",
      score: 10,
      total: 10,
    });
    expect(MissionsService.getMissions()).toHaveLength(3);
  });

  it("ProgressService.recordGameComplete invokes MissionsService.updateProgress", () => {
    MissionsService.getMissions();
    const spy = vi.spyOn(MissionsService, "updateProgress");
    ProgressService.recordGameComplete({
      gameId: "spy-mission-game",
      score: 4,
      total: 4,
    });
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0]).toMatchObject({
      gamesPlayedToday: expect.any(Number),
      accuracyThisGame: expect.any(Number),
    });
    spy.mockRestore();
  });
});
