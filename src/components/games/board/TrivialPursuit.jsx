import React, { useState, useEffect, useCallback, useRef } from "react";
import BoardHeader from "./shared/BoardHeader";
import GameOverModal from "./shared/GameOverModal";
import { trivialQuestions as _tq } from "./data/trivialQuestions";

const tqData = _tq && typeof _tq === "object" ? _tq : {};

const CATS = ["geography", "entertainment", "history", "science", "art", "sports"];

const FALLBACK = {
  geography: [{ question: { en: "What is the capital of France?", el: "Ποια είναι η πρωτεύουσα της Γαλλίας;" }, options: { en: ["London","Paris","Berlin","Madrid"], el: ["Λονδίνο","Παρίσι","Βερολίνο","Μαδρίτη"] }, correct: { en: "Paris", el: "Παρίσι" }, explanation: { en: "Paris is the capital of France.", el: "Το Παρίσι είναι η πρωτεύουσα της Γαλλίας." } }],
  entertainment: [{ question: { en: "Who directed Titanic?", el: "Ποιος σκηνοθέτησε το Titanic;" }, options: { en: ["Spielberg","Cameron","Nolan","Tarantino"], el: ["Σπίλμπεργκ","Κάμερον","Νόλαν","Ταραντίνο"] }, correct: { en: "Cameron", el: "Κάμερον" }, explanation: { en: "James Cameron directed Titanic.", el: "Ο Τζέιμς Κάμερον σκηνοθέτησε το Titanic." } }],
  history: [{ question: { en: "When did WWII end?", el: "Πότε τελείωσε ο Β' Παγκόσμιος;" }, options: { en: ["1943","1944","1945","1946"], el: ["1943","1944","1945","1946"] }, correct: { en: "1945", el: "1945" }, explanation: { en: "WWII ended in 1945.", el: "Ο Β'ΠΠ τελείωσε το 1945." } }],
  science: [{ question: { en: "Chemical symbol for water?", el: "Χημικό σύμβολο νερού;" }, options: { en: ["H2O","CO2","O2","NaCl"], el: ["H2O","CO2","O2","NaCl"] }, correct: { en: "H2O", el: "H2O" }, explanation: { en: "Water is H2O.", el: "Το νερό είναι H2O." } }],
  art: [{ question: { en: "Who painted the Mona Lisa?", el: "Ποιος ζωγράφισε τη Μόνα Λίζα;" }, options: { en: ["Van Gogh","Da Vinci","Picasso","Michelangelo"], el: ["Βαν Γκογκ","Ντα Βίντσι","Πικάσο","Μιχαήλ Άγγελος"] }, correct: { en: "Da Vinci", el: "Ντα Βίντσι" }, explanation: { en: "Leonardo da Vinci painted it.", el: "Ο Λεονάρντο ντα Βίντσι τη ζωγράφισε." } }],
  sports: [{ question: { en: "Players on a soccer team?", el: "Παίκτες ποδοσφαιρικής ομάδας;" }, options: { en: ["9","10","11","12"], el: ["9","10","11","12"] }, correct: { en: "11", el: "11" }, explanation: { en: "11 players per team.", el: "11 παίκτες ανά ομάδα." } }],
};

const POS_CAT = [
  "geography","entertainment","history","science","art","sports",
  "geography","entertainment","history","science","art","sports",
  "geography","entertainment","history","science","art","sports",
  "geography","entertainment","history","science","art","sports",
  "geography","entertainment","history","science","art","sports",
];

const CAT_CFG = {
  geography:     { icon: "🌍", bg: "bg-gradient-to-br from-blue-400 to-blue-600",    ring: "ring-blue-400" },
  entertainment: { icon: "🎬", bg: "bg-gradient-to-br from-pink-400 to-pink-600",    ring: "ring-pink-400" },
  history:       { icon: "📜", bg: "bg-gradient-to-br from-yellow-400 to-yellow-600",  ring: "ring-yellow-400" },
  science:       { icon: "🔬", bg: "bg-gradient-to-br from-emerald-400 to-emerald-600", ring: "ring-emerald-400" },
  art:           { icon: "🎨", bg: "bg-gradient-to-br from-orange-400 to-orange-600",  ring: "ring-orange-400" },
  sports:        { icon: "⚽", bg: "bg-gradient-to-br from-amber-400 to-amber-600",   ring: "ring-amber-400" },
};

const WEDGE_COLORS = {
  geography: "#3b82f6", entertainment: "#ec4899", history: "#eab308",
  science: "#10b981", art: "#f97316", sports: "#d97706",
};

const LETTERS = ["A", "B", "C", "D"];
const AI_RATE = { easy: 0.4, medium: 0.65, hard: 0.85 };

function pickQ(cat) {
  const pool = (tqData[cat] && tqData[cat].length > 0) ? tqData[cat] : (FALLBACK[cat] || []);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function txt(obj, lang) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[lang] ?? obj.en ?? "";
}

function norm(v) { return v == null ? "" : String(v).trim().toLowerCase(); }

export default function TrivialPursuit({ mode, difficulty, onPlayAgain, onChangeGame, lang }) {
  const isEl = lang === "el";
  const playerNames = mode === "ai"
    ? { 1: isEl ? "Εσύ" : "You", 2: "AI" }
    : { 1: isEl ? "Παίκτης 1" : "Player 1", 2: isEl ? "Παίκτης 2" : "Player 2" };

  const [pos, setPos] = useState({ 1: 0, 2: 0 });
  const [wedges, setWedges] = useState(() => ({ 1: new Set(), 2: new Set() }));
  const [turn, setTurn] = useState(1);
  const [winner, setWinner] = useState(null);
  const [phase, setPhase] = useState("roll");
  const [diceVal, setDiceVal] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [question, setQuestion] = useState(null);
  const [category, setCategory] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const turnRef = useRef(turn);
  const wedgesRef = useRef(wedges);
  const posRef = useRef(pos);
  const timerRef = useRef(null);
  turnRef.current = turn;
  wedgesRef.current = wedges;
  posRef.current = pos;

  const gameOver = winner !== null;

  const doEndTurn = useCallback(() => {
    setPhase("roll");
    setQuestion(null);
    setCategory(null);
    setFeedback(null);
    setDiceVal(null);
    setTurn(t => t === 1 ? 2 : 1);
  }, []);

  const doAnswer = useCallback((optText) => {
    if (!question || feedback) return;
    const correct = txt(question.correct, lang);
    const isCorrect = norm(optText) === norm(correct);

    const fb = {
      selected: optText,
      correct,
      isCorrect,
      explanation: txt(question.explanation, lang),
    };
    setFeedback(fb);

    if (isCorrect && category) {
      const pl = turnRef.current;
      setWedges(prev => {
        const next = new Set(prev[pl]);
        next.add(category);
        if (next.size >= 6) setWinner(pl);
        return { ...prev, [pl]: next };
      });
    }

    timerRef.current = setTimeout(doEndTurn, 2200);
  }, [question, feedback, lang, category, doEndTurn]);

  const doRoll = useCallback(() => {
    if (rolling || gameOver) return;
    setRolling(true);
    setDiceVal(null);

    const interval = setInterval(() => {
      setDiceVal(1 + Math.floor(Math.random() * 6));
    }, 80);

    timerRef.current = setTimeout(() => {
      clearInterval(interval);
      const final = 1 + Math.floor(Math.random() * 6);
      setDiceVal(final);
      setRolling(false);

      const pl = turnRef.current;
      const newPos = (posRef.current[pl] + final) % 30;
      setPos(prev => ({ ...prev, [pl]: newPos }));

      const cat = POS_CAT[newPos];
      const hasWedge = wedgesRef.current[pl].has(cat);

      if (!hasWedge) {
        const q = pickQ(cat);
        if (q) {
          setPhase("answering");
          setCategory(cat);
          setQuestion(q);
          setFeedback(null);
          return;
        }
      }
      timerRef.current = setTimeout(doEndTurn, 600);
    }, 800);
  }, [rolling, gameOver, doEndTurn]);

  // AI auto-roll
  useEffect(() => {
    if (gameOver || mode !== "ai" || turn !== 2 || phase !== "roll" || rolling) return;
    const t = setTimeout(doRoll, 600);
    return () => clearTimeout(t);
  }, [turn, phase, gameOver, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // AI auto-answer
  useEffect(() => {
    if (gameOver || mode !== "ai" || turn !== 2 || phase !== "answering" || !question || feedback) return;
    const rate = AI_RATE[difficulty] || 0.65;
    const opts = question.options[lang] || question.options.en || [];
    const correct = txt(question.correct, lang);
    const correctIdx = opts.findIndex(o => norm(o) === norm(correct));
    const willCorrect = Math.random() < rate;

    const t = setTimeout(() => {
      const idx = willCorrect && correctIdx >= 0 ? correctIdx : Math.floor(Math.random() * opts.length);
      doAnswer(opts[idx] || opts[0]);
    }, 800);
    return () => clearTimeout(t);
  }, [turn, phase, question, feedback, gameOver, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPos({ 1: 0, 2: 0 });
    setWedges({ 1: new Set(), 2: new Set() });
    setTurn(1);
    setWinner(null);
    setPhase("roll");
    setDiceVal(null);
    setRolling(false);
    setQuestion(null);
    setCategory(null);
    setFeedback(null);
    onPlayAgain?.();
  }, [onPlayAgain]);

  const canRoll = !gameOver && !rolling && phase === "roll" && (mode === "local" || turn === 1);
  const isAI = mode === "ai" && turn === 2;

  const WedgePie = ({ pl }) => (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-16 h-16 rounded-full border-2 border-white/10 shrink-0 shadow-xl transition-all"
        style={{
          background: `conic-gradient(${CATS.map((c, i) =>
            `${wedges[pl].has(c) ? WEDGE_COLORS[c] : "#64748b"} ${i*60}deg ${(i+1)*60}deg`
          ).join(",")})`,
        }}
      />
      <span className="text-[10px] font-semibold text-slate-400">{wedges[pl].size}/6</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 w-full">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-2xl shadow-black/30">
        <BoardHeader
          title="Trivial Pursuit"
          turn={gameOver ? null : turn}
          playerNames={playerNames}
          status={gameOver ? `${playerNames[winner]} ${isEl ? "κερδίζει!" : "wins!"}` : null}
        />

        {/* Wedge progress */}
        <div className="flex items-center justify-center gap-8 px-4 py-4 bg-white/10 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full transition-all ${turn === 1 ? "bg-blue-400 ring-[3px] ring-violet-400 ring-offset-2 ring-offset-slate-800" : "bg-slate-600"}`} />
            <span className="text-xs font-semibold text-slate-300">{playerNames[1]}</span>
            <WedgePie pl={1} />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full transition-all ${turn === 2 ? "bg-rose-400 ring-[3px] ring-amber-400 ring-offset-2 ring-offset-slate-800" : "bg-slate-600"}`} />
            <span className="text-xs font-semibold text-slate-300">{playerNames[2]}</span>
            <WedgePie pl={2} />
          </div>
        </div>
      </div>

      {/* Board track */}
      <div className="w-full max-w-3xl">
        <div className="grid grid-cols-10 gap-2 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          {Array.from({ length: 30 }, (_, i) => {
            const cat = POS_CAT[i];
            const cfg = CAT_CFG[cat];
            const p1 = pos[1] === i;
            const p2 = pos[2] === i;
            return (
              <div key={i} className={`relative aspect-square rounded-xl flex items-center justify-center text-lg sm:text-xl min-h-[2.5rem] ${cfg.bg} text-white font-bold shadow-xl border border-white/10 transition-all`}>
                <span className="drop-shadow-md">{cfg.icon}</span>
                {p1 && <div className="absolute -top-0.5 -left-0.5 w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white shadow-xl z-10 ring-[3px] ring-violet-400" />}
                {p2 && <div className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 border-2 border-white shadow-xl z-10 ring-[3px] ring-amber-400" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dice + Roll */}
      {phase === "roll" && (
        <div className="flex flex-col items-center gap-3">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/10 shadow-xl text-white transition-all ${rolling ? "animate-bounce" : ""}`}>
            {diceVal ?? "?"}
          </div>
          <button
            onClick={doRoll}
            disabled={!canRoll}
            className={`px-8 py-4 rounded-xl text-base font-bold text-white shadow-xl transition-all ${
              canRoll
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 hover:-translate-y-0.5"
                : "bg-white/5 text-slate-500 cursor-not-allowed border border-white/10"
            }`}
          >
            {isEl ? "🎲 Ρίξε το ζάρι" : "🎲 Roll Dice"}
          </button>
        </div>
      )}

      {/* Question */}
      {phase === "answering" && question && (
        <div className="w-full max-w-2xl rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl shadow-black/30 overflow-hidden animate-[fadeIn_0.3s_ease-out]">
          <div className="px-6 py-4 bg-gradient-to-r from-slate-800/80 to-violet-900/30 border-b border-white/10 flex items-center gap-2">
            <span className="text-2xl">{category ? CAT_CFG[category]?.icon : "❓"}</span>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              {playerNames[turn]} — {category}
            </span>
          </div>
          <div className="p-6">
            <p className="text-xl sm:text-2xl font-bold text-white mb-6 leading-snug">{txt(question.question, lang)}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {(question.options[lang] || question.options.en || []).map((opt, idx) => {
                const optText = typeof opt === "string" ? opt : txt(opt, lang);
                const isCorrectOpt = feedback && norm(optText) === norm(feedback.correct);
                const isSelectedOpt = feedback && norm(optText) === norm(feedback.selected);

                let cls = "flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all text-left ";
                let lCls = "w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold shrink-0 ";
                let tCls = "text-base font-medium ";

                if (feedback) {
                  if (isCorrectOpt) {
                    cls += "bg-emerald-500/20 border-emerald-400 ring-[3px] ring-emerald-400/50";
                    lCls += "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-xl";
                    tCls += "text-emerald-200";
                  } else if (isSelectedOpt) {
                    cls += "bg-red-500/20 border-red-400 ring-[3px] ring-red-400/50";
                    lCls += "bg-gradient-to-br from-red-400 to-red-600 text-white shadow-xl";
                    tCls += "text-red-200";
                  } else {
                    cls += "bg-white/5 border-white/10 opacity-50";
                    lCls += "bg-white/10 text-slate-400";
                    tCls += "text-slate-400";
                  }
                } else {
                  cls += "bg-white/10 backdrop-blur-sm border-white/10 hover:border-violet-400/50 hover:bg-white/15 cursor-pointer shadow-xl";
                  lCls += "bg-white/10 text-slate-300 border border-white/10";
                  tCls += "text-slate-300";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    className={cls}
                    onClick={() => !feedback && !isAI && doAnswer(optText)}
                    disabled={!!feedback || isAI}
                  >
                    <span className={lCls}>{LETTERS[idx]}</span>
                    <span className={tCls}>{optText}</span>
                    {isCorrectOpt && <span className="ml-auto text-emerald-400 text-lg">✓</span>}
                    {isSelectedOpt && !isCorrectOpt && <span className="ml-auto text-red-400 text-lg">✗</span>}
                  </button>
                );
              })}
            </div>
            {feedback?.explanation && (
              <div className="mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 shadow-xl">
                <p className="text-base text-slate-300 leading-relaxed">{feedback.explanation}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {gameOver && (
        <GameOverModal
          winner={winner}
          playerNames={playerNames}
          onPlayAgain={reset}
          onChangeGame={onChangeGame}
        />
      )}

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}
