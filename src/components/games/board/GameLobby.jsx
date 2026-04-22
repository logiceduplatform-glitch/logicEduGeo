import React, { useState, useContext } from "react";
import { LanguageContext } from "../../../i18n/LanguageContext";
import { ProgressService } from "../../../services/ProgressService";

const GAME_RULES = {
  connect4: {
    en: "Drop your pieces into the grid. First to connect 4 in a row (horizontal, vertical, or diagonal) wins!",
    el: "Ρίξε τα πούλια σου στο πλέγμα. Ο πρώτος που φτιάξει 4 στη σειρά (οριζόντια, κάθετα ή διαγώνια) κερδίζει!"
  },
  othello: {
    en: "Place pieces to flip your opponent's. The player with the most pieces when the board is full wins!",
    el: "Τοποθέτησε πούλια για να γυρίσεις τα αντίπαλα. Ο παίκτης με τα περισσότερα πούλια όταν γεμίσει το ταμπλό κερδίζει!"
  },
  backgammon: {
    en: "Roll dice and move your 15 pieces around the board. First to bear off all pieces wins!",
    el: "Ρίξε τα ζάρια και μετακίνησε τα 15 πούλια σου στο ταμπλό. Ο πρώτος που θα μαζέψει όλα τα πούλια κερδίζει!"
  },
  chess: {
    en: "Classic chess. Checkmate your opponent's king to win!",
    el: "Κλασικό σκάκι. Κάνε ματ τον βασιλιά του αντιπάλου για να κερδίσεις!"
  },
  trivial: {
    en: "Roll the dice, land on categories, answer questions correctly to collect all 6 wedges and win!",
    el: "Ρίξε το ζάρι, πέσε σε κατηγορίες, απάντησε σωστά για να μαζέψεις και τα 6 κομμάτια και να κερδίσεις!"
  },
  go: {
    en: "Place stones on the board to surround territory and capture opponent's stones. Largest territory wins!",
    el: "Τοποθέτησε πέτρες στο ταμπλό για να περικυκλώσεις περιοχή και να αιχμαλωτίσεις πέτρες. Η μεγαλύτερη περιοχή κερδίζει!"
  },
  checkers: {
    en: "Move your pieces diagonally, jump over opponents to capture them. Capture all enemy pieces or block them to win!",
    el: "Μετακίνησε τα πούλια σου διαγώνια, πήδηξε πάνω από τα αντίπαλα. Αιχμαλώτισε όλα ή μπλόκαρέ τα για να κερδίσεις!"
  },
  catan: {
    en: "Collect resources, build settlements and roads. First to reach 5 victory points wins!",
    el: "Μάζεψε πόρους, χτίσε οικισμούς και δρόμους. Ο πρώτος με 5 πόντους νίκης κερδίζει!"
  },
  ticket: {
    en: "Collect train cards and claim routes across Europe. Complete tickets for bonus points!",
    el: "Μάζεψε κάρτες τρένων και κατέλαβε διαδρομές στην Ευρώπη. Ολοκλήρωσε εισιτήρια για μπόνους!"
  },
  carcassonne: {
    en: "Place tiles to build cities, roads and monasteries. Deploy meeples to score points!",
    el: "Τοποθέτησε πλακίδια για πόλεις, δρόμους και μοναστήρια. Τοποθέτησε βοηθούς για πόντους!"
  },
  pandemic: {
    en: "Cooperative game! Work together to cure 4 diseases before outbreaks overwhelm the world!",
    el: "Συνεργατικό παιχνίδι! Θεράπευσε 4 ασθένειες πριν οι εξάρσεις κατακλύσουν τον κόσμο!"
  },
  codenames: {
    en: "Two teams compete to find their agents using one-word clues. Avoid the assassin!",
    el: "Δύο ομάδες ψάχνουν τους πράκτορές τους με μονολεκτικά στοιχεία. Απόφυγε τον δολοφόνο!"
  },
  uno: {
    en: "Match cards by color or number. Use action cards strategically. First to empty your hand wins!",
    el: "Ταίριαξε κάρτες κατά χρώμα ή αριθμό. Χρησιμοποίησε ειδικές κάρτες. Πρώτος χωρίς κάρτες κερδίζει!"
  },
  monopoly: {
    en: "Buy properties, collect rent, and bankrupt your opponent! Manage your money wisely to win!",
    el: "Αγόρασε ιδιοκτησίες, μάζεψε ενοίκια και χρεοκόπησε τον αντίπαλο! Διαχειρίσου σωστά τα χρήματά σου!"
  },
  werewolf: {
    en: "Village vs Werewolves! Use deduction to find the werewolves before they eliminate the villagers!",
    el: "Χωριό εναντίον Λυκάνθρωπων! Βρες τους λυκάνθρωπους πριν εξολοθρεύσουν τους χωρικούς!"
  },
  mahjong: {
    en: "Match pairs of identical tiles to clear the board. Only free tiles can be selected!",
    el: "Ταίριαξε ζευγάρια ίδιων πλακιδίων για να καθαρίσεις το ταμπλό. Μόνο ελεύθερα πλακίδια!"
  },
  stratego: {
    en: "Deploy your army and capture the enemy flag! Each piece has a rank — higher rank wins battles!",
    el: "Τοποθέτησε τον στρατό σου και κατέλαβε τη σημαία του εχθρού! Κάθε πιόνι έχει βαθμό — ο υψηλότερος κερδίζει!"
  },
  battleship: {
    en: "Find and sink all enemy ships by firing at their grid. First to sink the entire fleet wins!",
    el: "Βρες και βύθισε τα εχθρικά πλοία πυροβολώντας στο πλέγμα. Πρώτος που βυθίζει τον στόλο κερδίζει!"
  },
};

const COOP_GAMES = new Set(["pandemic"]);

export default function GameLobby({ gameId, gameName, onStart }) {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const isCoop = COOP_GAMES.has(gameId);
  const [mode, setMode] = useState(isCoop ? "ai" : "ai");
  const [difficulty, setDifficulty] = useState("medium");
  const [isFav, setIsFav] = useState(() => ProgressService.isFavorite(gameId));

  const handleToggleFav = () => {
    ProgressService.toggleFavorite(gameId);
    setIsFav(!isFav);
  };

  React.useEffect(() => {
    setIsFav(ProgressService.isFavorite(gameId));
  }, [gameId]);

  const rules = GAME_RULES[gameId];

  return (
    <div className="max-w-md mx-auto">
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-purple-50/50 dark:from-slate-800 dark:to-purple-900/20 border-b border-slate-100 dark:border-slate-700 text-center relative">
          <button
            onClick={handleToggleFav}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 dark:bg-slate-700/80 backdrop-blur flex items-center justify-center hover:bg-white dark:hover:bg-slate-600 shadow-sm transition-all"
            title={isEl ? "Αγαπημένο" : "Favorite"}
          >
            <span className={`text-lg ${isFav ? "text-amber-400" : "text-slate-300 dark:text-slate-500"}`}>
              {isFav ? "★" : "☆"}
            </span>
          </button>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{gameName}</h2>
          {isCoop && (
            <span className="mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              {isEl ? "Συνεργατικό" : "Co-op"}
            </span>
          )}
        </div>

        <div className="p-6 space-y-5">
          {rules && (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center leading-relaxed">
              {rules[isEl ? "el" : "en"]}
            </p>
          )}

          {!isCoop && (
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                {isEl ? "Λειτουργία" : "Mode"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMode("ai")}
                  className={[
                    "px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2",
                    mode === "ai"
                      ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 shadow-sm border-2 border-purple-300 dark:border-purple-600"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-2 border-transparent hover:bg-slate-200 dark:hover:bg-slate-600"
                  ].join(" ")}
                >
                  <span>🤖</span> {isEl ? "vs AI" : "vs AI"}
                </button>
                <button
                  onClick={() => setMode("local")}
                  className={[
                    "px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2",
                    mode === "local"
                      ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 shadow-sm border-2 border-emerald-300 dark:border-emerald-600"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-2 border-transparent hover:bg-slate-200 dark:hover:bg-slate-600"
                  ].join(" ")}
                >
                  <span>👥</span> {isEl ? "2 Παίκτες" : "2 Players"}
                </button>
              </div>
            </div>
          )}

          {mode === "ai" && (
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                {isEl ? (isCoop ? "Δυσκολία" : "Δυσκολία AI") : (isCoop ? "Difficulty" : "AI Difficulty")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "easy", label: isEl ? "Εύκολο" : "Easy", color: "emerald" },
                  { id: "medium", label: isEl ? "Μέτριο" : "Medium", color: "amber" },
                  { id: "hard", label: isEl ? "Δύσκολο" : "Hard", color: "red" },
                ].map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    className={[
                      "px-3 py-2.5 rounded-xl text-xs font-semibold transition-all",
                      difficulty === d.id
                        ? `bg-${d.color}-100 dark:bg-${d.color}-900/40 text-${d.color}-700 dark:text-${d.color}-300 shadow-sm border-2 border-${d.color}-300 dark:border-${d.color}-600`
                        : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-2 border-transparent hover:bg-slate-200 dark:hover:bg-slate-600"
                    ].join(" ")}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => onStart({ mode, difficulty })}
            className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-200 dark:shadow-purple-900/30 hover:-translate-y-0.5 transition-all"
          >
            {isEl ? "Ξεκίνα!" : "Start!"}
          </button>
        </div>
      </div>
    </div>
  );
}
