import React, { useState, useCallback } from "react";
import BoardHeader from "./shared/BoardHeader";
import GameOverModal from "./shared/GameOverModal";

const WORD_POOL_EN = [
  "APPLE","BANK","CASTLE","DIAMOND","ENGINE","FLAME","GHOST","HOTEL","ICE","JUNGLE",
  "KNIGHT","LEMON","MIRROR","NEEDLE","OCEAN","PIANO","QUEEN","ROCKET","SHADOW","TOWER",
  "UMBRELLA","VIRUS","WHALE","YOGA","ZINC","BRIDGE","CLOUD","DRAGON","EAGLE","FORTUNE",
];
const WORD_POOL_EL = [
  "ΜΗΛΟ","ΤΡΑΠΕΖΑ","ΚΑΣΤΡΟ","ΔΙΑΜΑΝΤΙ","ΜΗΧΑΝΗ","ΦΛΟΓΑ","ΦΑΝΤΑΣΜΑ","ΞΕΝΟΔΟΧΕΙΟ","ΠΑΓΟΣ","ΖΟΥΓΚΛΑ",
  "ΙΠΠΟΤΗΣ","ΛΕΜΟΝΙ","ΚΑΘΡΕΦΤΗΣ","ΒΕΛΟΝΑ","ΩΚΕΑΝΟΣ","ΠΙΑΝΟ","ΒΑΣΙΛΙΣΣΑ","ΠΥΡΑΥΛΟΣ","ΣΚΙΑ","ΠΥΡΓΟΣ",
  "ΟΜΠΡΕΛΑ","ΙΟΣ","ΦΑΛΑΙΝΑ","ΓΙΟΓΚΑ","ΨΕΥΔΑΡΓΥΡΟΣ","ΓΕΦΥΡΑ","ΣΥΝΝΕΦΟ","ΔΡΑΚΟΣ","ΑΕΤΟΣ","ΤΥΧΗ",
];

function shuffled(arr) { const a = [...arr]; for (let i = a.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; }

function initBoard(isEl) {
  const pool = shuffled(isEl ? WORD_POOL_EL : WORD_POOL_EN).slice(0,25);
  const roles = shuffled([
    ...new Array(9).fill("red"), ...new Array(8).fill("blue"),
    ...new Array(7).fill("neutral"), "assassin"
  ]);
  return pool.map((word,i) => ({ word, role: roles[i], revealed: false }));
}

const ROLE_COLORS = {
  red: "bg-gradient-to-br from-red-500 to-red-700 text-white ring-[3px] ring-red-400/50 shadow-xl",
  blue: "bg-gradient-to-br from-blue-500 to-blue-700 text-white ring-[3px] ring-blue-400/50 shadow-xl",
  neutral: "bg-gradient-to-br from-amber-800 to-amber-900 text-amber-200 ring-[3px] ring-amber-400/30 shadow-xl",
  assassin: "bg-gradient-to-br from-slate-800 to-slate-950 text-white ring-[3px] ring-slate-500 shadow-xl",
};

const CLUES = {
  en: ["Animals","Places","Objects","Science","Food","Nature","Sports","Music","History","Colors"],
  el: ["Ζώα","Τόποι","Αντικείμενα","Επιστήμη","Φαγητό","Φύση","Σπορ","Μουσική","Ιστορία","Χρώματα"],
};

export default function Codenames({ mode, difficulty, onPlayAgain, onChangeGame, lang }) {
  const isEl = lang === "el";
  const playerNames = { 1: isEl ? "Κόκκινη ομάδα" : "Red Team", 2: isEl ? "Μπλε ομάδα" : "Blue Team" };

  const [cards, setCards] = useState(() => initBoard(isEl));
  const [turn, setTurn] = useState(1);
  const [guessesLeft, setGuessesLeft] = useState(0);
  const [winner, setWinner] = useState(null);
  const [clue, setClue] = useState("");
  const [showClue, setShowClue] = useState(false);
  const [spymasterView, setSpymasterView] = useState(false);

  const gameOver = winner !== null;
  const redLeft = cards.filter(c => c.role === "red" && !c.revealed).length;
  const blueLeft = cards.filter(c => c.role === "blue" && !c.revealed).length;
  const teamColor = turn === 1 ? "red" : "blue";

  const giveClue = useCallback(() => {
    const pool = isEl ? CLUES.el : CLUES.en;
    const randomClue = pool[Math.floor(Math.random()*pool.length)];
    const num = Math.floor(Math.random()*3)+1;
    setClue(`${randomClue} ${num}`);
    setGuessesLeft(num + 1);
    setShowClue(true);
  }, [isEl]);

  const revealCard = useCallback((idx) => {
    if (gameOver || !showClue || guessesLeft <= 0) return;
    if (cards[idx].revealed) return;

    const nc = cards.map((c,i) => i === idx ? { ...c, revealed: true } : c);
    setCards(nc);

    const card = nc[idx];
    if (card.role === "assassin") {
      setWinner(turn === 1 ? 2 : 1);
      return;
    }

    const newRedLeft = nc.filter(c => c.role === "red" && !c.revealed).length;
    const newBlueLeft = nc.filter(c => c.role === "blue" && !c.revealed).length;
    if (newRedLeft === 0) { setWinner(1); return; }
    if (newBlueLeft === 0) { setWinner(2); return; }

    if (card.role !== teamColor) {
      setTurn(turn === 1 ? 2 : 1);
      setShowClue(false); setGuessesLeft(0); setClue("");
      return;
    }

    const left = guessesLeft - 1;
    setGuessesLeft(left);
    if (left <= 0) {
      setTurn(turn === 1 ? 2 : 1);
      setShowClue(false); setClue("");
    }
  }, [gameOver, showClue, guessesLeft, cards, turn, teamColor]);

  const reset = useCallback(() => {
    setCards(initBoard(isEl)); setTurn(1); setGuessesLeft(0);
    setWinner(null); setClue(""); setShowClue(false); setSpymasterView(false);
    onPlayAgain?.();
  }, [isEl, onPlayAgain]);

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 w-full">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-2xl shadow-black/30">
        <BoardHeader title="Codenames" turn={gameOver ? null : turn} playerNames={playerNames}
          scores={{ 1: 9 - redLeft, 2: 8 - blueLeft }}
          status={showClue ? `💡 ${clue}` : null} />
        <div className="p-4 sm:p-6 space-y-4 bg-white/5 backdrop-blur-sm">
          <div className="grid grid-cols-5 gap-3">
            {cards.map((c,i) => (
              <button key={i} onClick={() => revealCard(i)}
                className={["aspect-[3/2] rounded-2xl text-sm sm:text-base font-bold flex items-center justify-center p-2 transition-all tracking-wide",
                  c.revealed ? ROLE_COLORS[c.role]
                  : spymasterView ? `border-2 backdrop-blur-sm bg-white/10 ${c.role === "red" ? "border-red-400 ring-[3px] ring-red-400/50" : c.role === "blue" ? "border-blue-400 ring-[3px] ring-blue-400/50" : c.role === "assassin" ? "border-slate-500 ring-[3px] ring-slate-500/50" : "border-amber-400 ring-[3px] ring-amber-400/50"} text-slate-300`
                  : "bg-white/10 backdrop-blur-sm border border-white/10 text-slate-300 hover:bg-white/20 transition-all",
                ].join(" ")}
                disabled={c.revealed || gameOver}>
                {c.word}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 justify-center text-base">
            <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-900/40 to-red-800/30 backdrop-blur-sm border border-white/10 text-red-300 font-bold shadow-xl">🔴 {redLeft}</span>
            <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-900/40 to-blue-800/30 backdrop-blur-sm border border-white/10 text-blue-300 font-bold shadow-xl">🔵 {blueLeft}</span>
            <button onClick={() => setSpymasterView(v => !v)}
              className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-slate-300 hover:bg-white/20 font-bold text-sm transition-all shadow-xl">
              {spymasterView ? "👁️" : "👁️‍🗨️"} Spymaster
            </button>
          </div>

          {!gameOver && !showClue && (
            <div className="flex justify-center">
              <button onClick={giveClue}
                className={`px-6 py-3 rounded-xl text-white text-base font-bold shadow-xl hover:-translate-y-0.5 transition-all ${turn === 1 ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500" : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500"}`}>
                💡 {isEl ? "Δώσε στοιχείο" : "Give Clue"}
              </button>
            </div>
          )}

          {showClue && <p className="text-center text-base text-slate-400 font-medium">{isEl ? `Μαντεύεις: ${guessesLeft}` : `Guesses left: ${guessesLeft}`}</p>}
        </div>
      </div>
      {gameOver && <GameOverModal winner={winner} playerNames={playerNames}
        stats={{ "🔴": 9 - redLeft, "🔵": 8 - blueLeft }}
        onPlayAgain={reset} onChangeGame={onChangeGame} />}
    </div>
  );
}
