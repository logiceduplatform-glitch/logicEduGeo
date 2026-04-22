import { ProgressService } from "./ProgressService";

export const RecommendationService = {
  getRecommendations(allGames, limit = 5) {
    if (!allGames || allGames.length === 0) return [];

    const overall = ProgressService.getOverallStats();
    const favorites = ProgressService.getFavorites();

    const gameScores = allGames.map((game) => {
      const progress = ProgressService.getGameProgress(game.id);
      const played = progress.gamesPlayed > 0;
      const accuracy = progress.totalAttempts > 0
        ? progress.totalCorrect / progress.totalAttempts
        : null;

      let score = 0;
      let reason = "new";

      if (!played) {
        score += 30;
        reason = "new";
      } else if (accuracy !== null && accuracy < 0.6) {
        score += 50;
        reason = "practice";
      } else if (favorites.includes(game.id)) {
        score += 20;
        reason = "favorite";
      } else {
        score += 10;
        reason = "explore";
      }

      const daysSincePlayed = progress.lastPlayedAt
        ? (Date.now() - new Date(progress.lastPlayedAt).getTime()) / (1000 * 60 * 60 * 24)
        : 999;
      if (daysSincePlayed > 7) score += 15;
      else if (daysSincePlayed > 3) score += 5;

      score += Math.random() * 10;

      return { game, score, reason };
    });

    gameScores.sort((a, b) => b.score - a.score);
    return gameScores.slice(0, limit).map(({ game, reason }) => ({ ...game, reason }));
  },
};
