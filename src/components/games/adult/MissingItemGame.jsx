import React, { useState, useEffect, useCallback, useRef } from "react";

const ITEM_SETS = [
  ["🍎","🍊","🍋","🍇","🍓","🫐","🥝","🍑"],
  ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼"],
  ["⚽","🏀","🎾","🏐","🏈","⚾","🎱","🏓"],
  ["🚗","🚕","🚌","🚎","🏎️","🚓","🚑","🚒"],
  ["🌸","🌹","🌻","🌺","🌷","💐","🌼","🪻"],
  ["🎸","🎹","🥁","🎺","🎻","🪗","🎷","🪈"],
  ["🍕","🍔","🌮","🍣","🥗","🍜","🥘","🧆"],
  ["✈️","🚀","🛸","🚁","⛵","🚂","🏍️","🛵"],
  ["📱","💻","⌚","📷","🎮","🖨️","🔭","🔬"],
  ["🏠","🏰","⛪","🏛️","🗼","🏟️","🎪","🏗️"],
];

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MissingItemGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState("memorize");
  const [items, setItems] = useState([]);
  const [missingItem, setMissingItem] = useState(null);
  const [remaining, setRemaining] = useState([]);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef(null);

  const TARGET_ROUNDS = 10;

  const setupRound = useCallback((r) => {
    const set = ITEM_SETS[r % ITEM_SETS.length];
    const shuffledSet = shuffled(set);
    setItems(shuffledSet);
    setPhase("memorize");
    setSelected(null);

    timerRef.current = setTimeout(() => {
      const removeIdx = Math.floor(Math.random() * shuffledSet.length);
      const missing = shuffledSet[removeIdx];
      const rest = shuffledSet.filter((_, i) => i !== removeIdx);
      setMissingItem(missing);
      setRemaining(shuffled(rest));

      const decoys = ITEM_SETS.flat().filter(e => !shuffledSet.includes(e));
      const optionList = shuffled([missing, ...shuffled(decoys).slice(0, 3)]);
      setOptions(optionList);
      setPhase("guess");
    }, 5000);
  }, []);

  useEffect(() => {
    setupRound(0);
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleSelect = (item) => {
    if (selected) return;
    setSelected(item);
    if (item === missingItem) setScore(prev => prev + 1);

    setTimeout(() => {
      if (round + 1 >= TARGET_ROUNDS) {
        setGameOver(true);
      } else {
        const next = round + 1;
        setRound(next);
        setupRound(next);
      }
    }, 1500);
  };

  const restart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRound(0);
    setScore(0);
    setGameOver(false);
    setupRound(0);
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <span className="text-7xl">🔍</span>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          {isEl ? "Τέλος!" : "Finished!"}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {isEl ? `Σκόρ: ${score}/${TARGET_ROUNDS}` : `Score: ${score}/${TARGET_ROUNDS}`}
        </p>
        <button onClick={restart} className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transition-transform">
          {isEl ? "Ξανά" : "Play Again"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between mb-3">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
            {isEl ? "Τι Λείπει;" : "Missing Item"} 🔍
          </span>
          <span className="text-sm font-bold text-slate-500">{round + 1}/{TARGET_ROUNDS}</span>
        </div>

        {phase === "memorize" && (
          <>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 mb-4 text-center text-sm font-semibold text-amber-700 dark:text-amber-300">
              {isEl ? "Απομνημόνευσε τα αντικείμενα! (5 δευτ.)" : "Memorize the items! (5 sec)"}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {items.map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-700 rounded-xl p-4 text-center text-3xl shadow-md border border-slate-200 dark:border-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </>
        )}

        {phase === "guess" && (
          <>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 mb-4 text-center text-sm font-semibold text-purple-700 dark:text-purple-300">
              {isEl ? "Ποιο αντικείμενο λείπει;" : "Which item is missing?"}
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {remaining.map((item, i) => (
                <div key={i} className="bg-slate-100 dark:bg-slate-700 rounded-xl p-3 text-center text-2xl">
                  {item}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {options.map((opt) => {
                const isCorrect = opt === missingItem;
                const isSel = selected === opt;
                return (
                  <button key={opt} onClick={() => handleSelect(opt)} disabled={!!selected}
                    className={[
                      "px-4 py-4 rounded-xl text-3xl transition-all border-2",
                      selected && isCorrect ? "bg-emerald-100 border-emerald-400 scale-105"
                        : selected && isSel ? "bg-red-100 border-red-400"
                        : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-purple-400",
                    ].join(" ")}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </>
        )}

        <div className="flex justify-center mt-4 text-sm font-semibold">
          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700">⭐ {score}</span>
        </div>
      </div>
    </div>
  );
}
