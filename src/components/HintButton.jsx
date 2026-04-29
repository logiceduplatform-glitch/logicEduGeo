import React, { useContext, useState } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { CoinService } from "../services/CoinService";

const T = {
  el: {
    needHint: "💡 Χρειάζεσαι βοήθεια;",
    showHint: "Εμφάνιση Υπόδειξης",
    eliminate: "🚫 Αφαιρέσε λάθος",
    fiftyFifty: "✂️ 50/50",
    explain: "🤖 Εξήγηση",
    hint1: "Σκέψου: Ποια λέξη ταιριάζει καλύτερα στο νόημα;",
    hint2: "Διάβασε προσεκτικά τα κλειδιά της ερώτησης",
    hint3: "Αν δεν ξέρεις, μάντεψε λογικά! Αφαίρεσε τις προφανώς λάθος επιλογές.",
    hintCost: "Κοστίζει",
    coins: "coins",
    confirm: "Χρησιμοποίηση",
    cancel: "Ακύρωση",
    notEnough: "Δεν έχεις αρκετά coins",
    noOptions: "Δεν υπάρχουν επιλογές για αφαίρεση",
    explanation: "Εξήγηση",
    close: "Κλείσιμο",
    elimDone: "Αφαιρέθηκε μια λάθος επιλογή",
    fiftyDone: "Έμειναν 2 επιλογές",
    autoExplain: "Η σωστή απάντηση είναι",
    close: "Κλείσιμο",
  },
  en: {
    needHint: "💡 Need help?",
    showHint: "Show Hint",
    eliminate: "🚫 Remove wrong",
    fiftyFifty: "✂️ 50/50",
    explain: "🤖 Explain",
    hint1: "Think: Which word fits the meaning best?",
    hint2: "Read the question keywords carefully",
    hint3: "If unsure, guess logically! Remove obviously wrong options.",
    hintCost: "Costs",
    coins: "coins",
    confirm: "Use",
    cancel: "Cancel",
    notEnough: "Not enough coins",
    noOptions: "No options to remove",
    explanation: "Explanation",
    close: "Close",
    elimDone: "Removed one wrong option",
    fiftyDone: "Two options left",
    autoExplain: "The correct answer is",
    close: "Close",
  },
};

const HINT_COSTS = {
  general: 5,
  eliminate: 10,
  fiftyFifty: 15,
  explain: 20,
};

function getRandomHintText(l) {
  const hints = [l.hint1, l.hint2, l.hint3];
  return hints[Math.floor(Math.random() * hints.length)];
}

export default function HintButton({
  question,
  options = [],
  correctAnswer,
  correctIndex,
  onEliminate,
  className = "",
}) {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;

  const [open, setOpen] = useState(false);
  const [shownHint, setShownHint] = useState(null);
  const [coins, setCoins] = useState(() => CoinService.getBalance().balance || 0);

  const trySpend = (amount) => {
    const ok = CoinService.spend(amount);
    if (!ok) return false;
    setCoins(CoinService.getBalance().balance || 0);
    return true;
  };

  const useGeneralHint = () => {
    if (!trySpend(HINT_COSTS.general)) { setShownHint({ kind: "error", text: l.notEnough }); return; }
    setShownHint({ kind: "general", text: getRandomHintText(l) });
  };

  const useEliminate = () => {
    if (!options || options.length < 3) { setShownHint({ kind: "error", text: l.noOptions }); return; }
    if (!trySpend(HINT_COSTS.eliminate)) { setShownHint({ kind: "error", text: l.notEnough }); return; }
    // Find an incorrect option and signal removal
    let wrongIdx = -1;
    for (let i = 0; i < options.length; i++) {
      const isCorrect = (correctIndex !== undefined ? i === correctIndex : options[i] === correctAnswer);
      if (!isCorrect) { wrongIdx = i; break; }
    }
    if (wrongIdx === -1) { setShownHint({ kind: "error", text: l.noOptions }); return; }
    onEliminate?.([wrongIdx]);
    setShownHint({ kind: "elim", text: l.elimDone });
  };

  const useFiftyFifty = () => {
    if (!options || options.length < 4) { setShownHint({ kind: "error", text: l.noOptions }); return; }
    if (!trySpend(HINT_COSTS.fiftyFifty)) { setShownHint({ kind: "error", text: l.notEnough }); return; }
    const wrongIndices = [];
    for (let i = 0; i < options.length; i++) {
      const isCorrect = (correctIndex !== undefined ? i === correctIndex : options[i] === correctAnswer);
      if (!isCorrect) wrongIndices.push(i);
    }
    // Remove all but one wrong
    const keepWrong = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
    const removeList = wrongIndices.filter(i => i !== keepWrong);
    onEliminate?.(removeList);
    setShownHint({ kind: "fifty", text: l.fiftyDone });
  };

  const useExplain = () => {
    if (!trySpend(HINT_COSTS.explain)) { setShownHint({ kind: "error", text: l.notEnough }); return; }
    const correct = correctIndex !== undefined ? options[correctIndex] : correctAnswer;
    setShownHint({ kind: "explain", text: `${l.autoExplain}: ${correct}` });
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={l.needHint}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold hover:bg-amber-200 dark:hover:bg-amber-900/50 transition focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
      >
        <span aria-hidden>💡</span> {l.needHint}
      </button>

      {open && (
        <div role="dialog" aria-label={l.needHint} className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-amber-200 dark:border-amber-800 p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500"><span aria-hidden>🪙</span> {coins} {l.coins}</span>
            <button onClick={() => setOpen(false)} aria-label={l.close || "Close"} className="text-slate-400 hover:text-slate-600 text-lg leading-none focus:outline-none focus:ring-2 focus:ring-amber-400 rounded">×</button>
          </div>

          <div className="space-y-2">
            <HintAction onClick={useGeneralHint} cost={HINT_COSTS.general} label={l.showHint} icon="💡" />
            {options.length >= 3 && <HintAction onClick={useEliminate} cost={HINT_COSTS.eliminate} label={l.eliminate} icon="🚫" />}
            {options.length >= 4 && <HintAction onClick={useFiftyFifty} cost={HINT_COSTS.fiftyFifty} label={l.fiftyFifty} icon="✂️" />}
            <HintAction onClick={useExplain} cost={HINT_COSTS.explain} label={l.explain} icon="🤖" />
          </div>

          {shownHint && (
            <div className={`mt-3 p-3 rounded-lg text-xs ${shownHint.kind === "error" ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"}`}>
              {shownHint.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function HintAction({ onClick, cost, label, icon }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-amber-50 dark:hover:bg-amber-900/30 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
    >
      <span>{icon} {label}</span>
      <span className="text-amber-600 dark:text-amber-400 font-bold">🪙 {cost}</span>
    </button>
  );
}
