import React, { useContext, useState } from "react";
import { LanguageContext } from "../../../i18n/LanguageContext";
import { useSubscription } from "../../../contexts/SubscriptionContext";
import { ProgressService } from "../../../services/ProgressService";
import { PremiumContentService } from "../../../services/PremiumContentService";
import { FeatureFlagService } from "../../../services/FeatureFlagService";

const CATEGORIES = [
  {
    id: "classics",
    title: { en: "Strategy Classics", el: "Κλασικά Στρατηγικής" },
    icon: "♟️",
    games: [
      { id: "chess", icon: "♟️", label: { el: "Σκάκι", en: "Chess" }, gradient: "from-slate-600 to-slate-800" },
      { id: "go", icon: "⚫", label: { el: "Go", en: "Go" }, gradient: "from-gray-700 to-gray-900" },
      { id: "checkers", icon: "🔴", label: { el: "Ντάμα", en: "Checkers" }, gradient: "from-red-600 to-red-800" },
      { id: "othello", icon: "⚪", label: { el: "Όθελο", en: "Othello" }, gradient: "from-emerald-500 to-teal-500" },
      { id: "backgammon", icon: "🎲", label: { el: "Τάβλι", en: "Backgammon" }, gradient: "from-amber-600 to-yellow-500" },
      { id: "connect4", icon: "🟡", label: { el: "Σκορ 4", en: "Connect 4" }, gradient: "from-red-500 to-orange-500" },
      { id: "mahjong", icon: "🀄", label: { el: "Mahjong", en: "Mahjong" }, gradient: "from-red-600 to-amber-600" },
      { id: "stratego", icon: "⚔️", label: { el: "Stratego", en: "Stratego" }, gradient: "from-blue-700 to-red-700" },
      { id: "battleship", icon: "🚢", label: { el: "Ναυμαχία", en: "Battleship" }, gradient: "from-blue-600 to-cyan-700" },
    ],
  },
  {
    id: "modern",
    title: { en: "Modern Board Game Hits", el: "Σύγχρονα Επιτραπέζια" },
    icon: "🎯",
    games: [
      { id: "catan", icon: "🏝️", label: { el: "Catan", en: "Catan" }, gradient: "from-amber-500 to-orange-600" },
      { id: "ticket", icon: "🚂", label: { el: "Ticket to Ride", en: "Ticket to Ride" }, gradient: "from-blue-500 to-sky-600" },
      { id: "carcassonne", icon: "🏰", label: { el: "Carcassonne", en: "Carcassonne" }, gradient: "from-yellow-600 to-lime-600" },
      { id: "pandemic", icon: "🦠", label: { el: "Pandemic", en: "Pandemic" }, gradient: "from-teal-500 to-cyan-600" },
      { id: "trivial", icon: "🧩", label: { el: "Trivial Pursuit", en: "Trivial Pursuit" }, gradient: "from-blue-500 to-purple-600" },
    ],
  },
  {
    id: "party",
    title: { en: "Party & Social Games", el: "Παιχνίδια Παρέας" },
    icon: "🎉",
    games: [
      { id: "codenames", icon: "🕵️", label: { el: "Codenames", en: "Codenames" }, gradient: "from-red-500 to-blue-600" },
      { id: "uno", icon: "🃏", label: { el: "UNO", en: "UNO" }, gradient: "from-red-500 to-yellow-500" },
      { id: "monopoly", icon: "🏦", label: { el: "Monopoly", en: "Monopoly" }, gradient: "from-green-500 to-emerald-700" },
      { id: "werewolf", icon: "🐺", label: { el: "Λυκάνθρωπος", en: "Werewolf" }, gradient: "from-indigo-600 to-purple-800" },
    ],
  },
];

const GAMES = CATEGORIES.flatMap(cat => cat.games);

export default function BoardGamesSidebar({ active, onSelect, onLockedClick }) {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const { isPremium } = useSubscription();
  const subsEnabled = FeatureFlagService.isEnabled("subs_enabled");
  const isGameLocked = (gameId) => {
    if (!subsEnabled) return false;
    if (isPremium) return false;
    return PremiumContentService.isGameLocked("adult", "board", gameId);
  };
  const [favorites, setFavorites] = useState(() => ProgressService.getFavorites());

  const handleToggleFav = (e, gameId) => {
    e.stopPropagation();
    const updated = ProgressService.toggleFavorite(gameId);
    setFavorites([...updated]);
  };

  return (
    <aside className="hidden lg:block w-72 shrink-0 border-r border-slate-100 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-5">
        {CATEGORIES.map(cat => (
          <div key={cat.id}>
            <h2 className="px-2 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <span>{cat.icon}</span>
              {cat.title[isEl ? "el" : "en"]}
            </h2>
            <nav className="space-y-1.5 mt-1">
              {cat.games.map(({ id, icon, label, gradient }) => {
                const isActive = active === id;
                const locked = isGameLocked(id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => locked ? onLockedClick?.() : onSelect(id)}
                    className={[
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
                      locked
                        ? "opacity-60 text-slate-400 dark:text-slate-500 border border-transparent"
                        : isActive
                          ? "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent"
                    ].join(" ")}
                  >
                    <div className={[
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all text-base",
                      locked
                        ? "bg-slate-200 dark:bg-slate-700"
                        : isActive
                          ? `bg-gradient-to-br ${gradient} shadow-md`
                          : "bg-slate-100 dark:bg-slate-700"
                    ].join(" ")}>
                      {locked ? "🔒" : icon}
                    </div>
                    <span className={[
                      "font-semibold text-sm",
                      locked
                        ? "text-slate-400 dark:text-slate-500"
                        : isActive ? "text-slate-800 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"
                    ].join(" ")}>
                      {label[isEl ? "el" : "en"]}
                    </span>
                    {locked && (
                      <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold">PRO</span>
                    )}
                    {!locked && (
                      <span className="ml-auto flex items-center gap-1.5 shrink-0">
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => handleToggleFav(e, id)}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleToggleFav(e, id); } }}
                          className={`text-sm cursor-pointer hover:scale-125 transition-transform ${favorites.includes(id) ? "text-amber-400" : "text-slate-300 dark:text-slate-600 hover:text-amber-300"}`}
                          title={isEl ? "Αγαπημένο" : "Favorite"}
                        >
                          {favorites.includes(id) ? "★" : "☆"}
                        </span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500" />
                        )}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}

export { GAMES, CATEGORIES };
