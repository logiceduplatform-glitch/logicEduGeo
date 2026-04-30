import React, { useState, useContext, useEffect, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import BoardGamesSidebar, { GAMES, CATEGORIES } from "../components/games/board/BoardGamesSidebar";
import GameLobby from "../components/games/board/GameLobby";
import { LanguageContext } from "../i18n/LanguageContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import { PremiumContentService } from "../services/PremiumContentService";
import { FeatureFlagService } from "../services/FeatureFlagService";
import PaywallModal from "../components/PaywallModal";
import Breadcrumb from "../components/Breadcrumb";
import { GameSkeleton } from "../components/SkeletonLoader";

const Connect4 = React.lazy(() => import("../components/games/board/Connect4"));
const Othello = React.lazy(() => import("../components/games/board/Othello"));
const Backgammon = React.lazy(() => import("../components/games/board/Backgammon"));
const Chess = React.lazy(() => import("../components/games/board/Chess"));
const TrivialPursuit = React.lazy(() => import("../components/games/board/TrivialPursuit"));
const Go = React.lazy(() => import("../components/games/board/Go"));
const Checkers = React.lazy(() => import("../components/games/board/Checkers"));
const Catan = React.lazy(() => import("../components/games/board/Catan"));
const TicketToRide = React.lazy(() => import("../components/games/board/TicketToRide"));
const Carcassonne = React.lazy(() => import("../components/games/board/Carcassonne"));
const Pandemic = React.lazy(() => import("../components/games/board/Pandemic"));
const Codenames = React.lazy(() => import("../components/games/board/Codenames"));
const Uno = React.lazy(() => import("../components/games/board/Uno"));
const Monopoly = React.lazy(() => import("../components/games/board/Monopoly"));
const Werewolf = React.lazy(() => import("../components/games/board/Werewolf"));
const Mahjong = React.lazy(() => import("../components/games/board/Mahjong"));
const Stratego = React.lazy(() => import("../components/games/board/Stratego"));
const BattleshipGame = React.lazy(() => import("../components/games/board/Battleship"));

const GAME_COMPONENTS = {
  connect4: Connect4,
  othello: Othello,
  backgammon: Backgammon,
  chess: Chess,
  trivial: TrivialPursuit,
  go: Go,
  checkers: Checkers,
  catan: Catan,
  ticket: TicketToRide,
  carcassonne: Carcassonne,
  pandemic: Pandemic,
  codenames: Codenames,
  uno: Uno,
  monopoly: Monopoly,
  werewolf: Werewolf,
  mahjong: Mahjong,
  stratego: Stratego,
  battleship: BattleshipGame,
};

export default function BoardGamesPage() {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeGame, setActiveGame] = useState(() => {
    const fromUrl = searchParams.get("game");
    if (fromUrl && GAMES.find(g => g.id === fromUrl)) return fromUrl;
    return "chess";
  });
  const [gameConfig, setGameConfig] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const { isPremium } = useSubscription();
  const subsEnabled = FeatureFlagService.isEnabled("subs_enabled");
  const isGameLocked = (gameId) => {
    if (!subsEnabled) return false;
    if (isPremium) return false;
    return PremiumContentService.isGameLocked("adult", "board", gameId);
  };

  useEffect(() => {
    const fromUrl = searchParams.get("game");
    if (fromUrl && GAMES.find(g => g.id === fromUrl) && fromUrl !== activeGame) {
      setActiveGame(fromUrl);
      setGameConfig(null);
    }
  }, [searchParams]);

  const currentGame = GAMES.find(g => g.id === activeGame);
  const GameComponent = GAME_COMPONENTS[activeGame];

  const handleStart = (config) => setGameConfig(config);
  const handleBack = () => setGameConfig(null);
  const handleChangeGame = () => { setGameConfig(null); };

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <SEO title={isEl ? "Επιτραπέζια Παιχνίδια" : "Board Games"} />
      <Navbar />

      {/* Mobile game selector - collapsible */}
      <div className="lg:hidden pt-16 sticky top-16 z-40">
        {/* Current game + toggle button */}
        <button
          onClick={() => setMobileCatOpen(!mobileCatOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentGame?.icon}</span>
            <span className="font-bold text-slate-800 dark:text-white text-sm">
              {currentGame?.label[isEl ? "el" : "en"] || activeGame}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{isEl ? "Αλλαγή παιχνιδιού" : "Change game"}</span>
            <svg className={`w-4 h-4 text-slate-400 transition-transform ${mobileCatOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Expanded game list */}
        {mobileCatOpen && (
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 px-3 pb-3 max-h-[60vh] overflow-y-auto">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="mt-3">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 px-1">
                  {cat.icon} {cat.title[isEl ? "el" : "en"]}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {cat.games.map(({ id, icon, label, gradient }) => {
                    const isActive = activeGame === id;
                    const locked = isGameLocked(id);
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          if (locked) { setShowPaywall(true); return; }
                          setActiveGame(id);
                          setGameConfig(null);
                          setMobileCatOpen(false);
                        }}
                        className={[
                          "flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl text-xs font-semibold whitespace-nowrap transition-all",
                          locked
                            ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
                            : isActive
                              ? `bg-gradient-to-r ${gradient} text-white shadow-md`
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 active:bg-slate-200 dark:active:bg-slate-700"
                        ].join(" ")}
                      >
                        <span>{locked ? "🔒" : icon}</span>
                        {label[isEl ? "el" : "en"]}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lg:pt-16 flex">
        <BoardGamesSidebar
          active={activeGame}
          onSelect={(id) => { setActiveGame(id); setGameConfig(null); }}
          onLockedClick={() => setShowPaywall(true)}
        />

        <main className="flex-1 p-4 lg:p-8 min-w-0">
          <div className="max-w-3xl mx-auto">
            <Breadcrumb items={[
              { label: isEl ? "Παιχνίδια" : "Games", icon: "🎮", onClick: () => { setGameConfig(null); } },
              { label: currentGame?.label[isEl ? "el" : "en"] || activeGame, icon: currentGame?.icon },
              ...(gameConfig ? [{ label: isEl ? "Σε εξέλιξη" : "Playing" }] : []),
            ]} />
            {!gameConfig ? (
              <GameLobby
                gameId={activeGame}
                gameName={currentGame?.label[isEl ? "el" : "en"] || activeGame}
                onStart={handleStart}
              />
            ) : (
              <Suspense fallback={<GameSkeleton />}>
                <div className="mb-4">
                  <button
                    onClick={handleBack}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    {isEl ? "Πίσω στο Lobby" : "Back to Lobby"}
                  </button>
                </div>
                <GameComponent
                  mode={gameConfig.mode}
                  difficulty={gameConfig.difficulty}
                  onPlayAgain={() => setGameConfig({ ...gameConfig })}
                  onChangeGame={handleChangeGame}
                  lang={lang}
                />
              </Suspense>
            )}
          </div>
        </main>
      </div>

      {showPaywall && (
        <PaywallModal lang={lang} onClose={() => setShowPaywall(false)} />
      )}
    </div>
  );
}
