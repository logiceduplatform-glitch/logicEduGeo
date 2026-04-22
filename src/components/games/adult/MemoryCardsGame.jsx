import React, { useState, useEffect, useCallback } from "react";

const EMOJIS = ["🎯", "🎨", "🎵", "🌟", "🍎", "🐱", "🚀", "🔥"];

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryCardsGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [processing, setProcessing] = useState(false);

  const initGame = useCallback(() => {
    const pairs = [...EMOJIS, ...EMOJIS];
    setCards(shuffle(pairs.map((emoji, i) => ({ id: i, emoji }))));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setStartTime(Date.now());
    setElapsed(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    if (!startTime || gameOver) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(t);
  }, [startTime, gameOver]);

  useEffect(() => {
    if (matched.length === EMOJIS.length * 2) setGameOver(true);
  }, [matched]);

  const handleClick = useCallback(
    (card) => {
      if (processing || flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.id)) return;
      const nextFlipped = [...flipped, card.id];
      setFlipped(nextFlipped);
      setMoves((m) => m + 1);

      if (nextFlipped.length === 2) {
        setProcessing(true);
        const [a, b] = nextFlipped;
        const cardA = cards.find((c) => c.id === a);
        const cardB = cards.find((c) => c.id === b);
        if (cardA?.emoji === cardB?.emoji) {
          setMatched((m) => [...m, a, b]);
        }
        setTimeout(() => {
          setFlipped([]);
          setProcessing(false);
        }, 800);
      }
    },
    [cards, flipped, matched, processing]
  );

  const T = {
    title: isEl ? "Μνήμη Καρτών" : "Memory Cards",
    moves: isEl ? "Κινήσεις" : "Moves",
    time: isEl ? "Χρόνος" : "Time",
    congrats: isEl ? "Συγχαρητήρια! Ολοκλήρωσες το παιχνίδι!" : "Congratulations! You completed the game!",
    playAgain: isEl ? "Παίξτε ξανά" : "Play Again",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <div className="flex justify-center gap-6 mb-6">
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.moves}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{moves}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.time}</span>
            <span className="ml-2 font-semibold text-slate-800 dark:text-slate-200">{elapsed}s</span>
          </div>
        </div>

        {gameOver ? (
          <div className=" rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-center shadow-xl">
            <p className="text-2xl font-bold text-white mb-4">🎉 {T.congrats}</p>
            <p className="text-white/90 mb-6">
              {moves} {isEl ? "κινήσεις" : "moves"} • {elapsed}s
            </p>
            <button
              onClick={initGame}
              className="px-6 py-3 rounded-xl bg-white text-emerald-600 font-semibold hover:bg-slate-50 transition"
            >
              {T.playAgain}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
              return (
                <button
                  key={card.id}
                  onClick={() => handleClick(card)}
                  disabled={isFlipped}
                  className={`
                    aspect-square rounded-xl flex items-center justify-center text-2xl sm:text-3xl
                    transition-all duration-300 transform
                    ${isFlipped ? "bg-emerald-400 dark:bg-emerald-600 text-slate-900 scale-100" : "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 shadow-md hover:shadow-lg hover:scale-105"}
                  `}
                >
                  {isFlipped ? card.emoji : "?"}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
