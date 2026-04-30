import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { MINI_GAMES, MiniGamesService } from "../services/MiniGamesService";
import { CoinService } from "../services/CoinService";
import { ProgressService } from "../services/ProgressService";

const T = {
  el: {
    title: "🎲 Καθημερινά Mini-Games",
    subtitle: "Πέντε γρήγορα παιχνίδια, μία φορά την ημέρα. Κέρδισε νομίσματα κάθε μέρα!",
    streak: "Σερί ημερών",
    todayPlays: "Σήμερα έπαιξες",
    available: "Διαθέσιμο",
    claimed: "✓ Ολοκληρώθηκε",
    play: "Παίξε",
    replay: "Παίξε ξανά",
    timeLeft: "Χρόνος",
    score: "Σκορ",
    final: "Τελικό σκορ",
    reward: "Ανταμοιβή",
    coins: "νομίσματα",
    back: "← Πίσω",
    backToHub: "Πίσω στα παιχνίδια",
    start: "Έναρξη",
    instructions: "Οδηγίες",
    confetti: "🎉 Νέο ρεκόρ!",
    alreadyPlayed: "✓ Έπαιξες σήμερα — οι ανταμοιβές απαιτούν αυριανό come-back!",
    sec: "δευ.",
    of: "από",
  },
  en: {
    title: "🎲 Daily Mini-Games",
    subtitle: "Five quick games, one play per day. Earn coins every day!",
    streak: "Day streak",
    todayPlays: "Played today",
    available: "Available",
    claimed: "✓ Done",
    play: "Play",
    replay: "Replay",
    timeLeft: "Time",
    score: "Score",
    final: "Final score",
    reward: "Reward",
    coins: "coins",
    back: "← Back",
    backToHub: "Back to hub",
    start: "Start",
    instructions: "Instructions",
    confetti: "🎉 New record!",
    alreadyPlayed: "✓ You played today — come back tomorrow for rewards!",
    sec: "sec",
    of: "of",
  },
};

export default function MiniGamesPage() {
  const { id } = useParams();
  if (id) return <MiniGameRunner gameId={id} />;
  return <MiniGamesHub />;
}

function MiniGamesHub() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const navigate = useNavigate();
  const plays = MiniGamesService.getTodayPlays();
  const streak = MiniGamesService.getDaysStreak();
  const completedToday = Object.keys(plays).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-rose-50 to-orange-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Stat icon="🔥" label={l.streak} value={`${streak} ${lang === "el" ? "ημέρες" : "days"}`} color="from-rose-400 to-pink-500" />
            <Stat icon="🎯" label={l.todayPlays} value={`${completedToday}/${MINI_GAMES.length}`} color="from-violet-400 to-fuchsia-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MINI_GAMES.map((g) => {
              const claimed = !!plays[g.id]?.claimedReward;
              return (
                <button key={g.id} onClick={() => navigate(`/mini-games/${g.id}`)} className="text-left bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-100 dark:border-slate-700 hover:scale-[1.02] transition">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">{g.title[lang] || g.title.en}</h3>
                    {claimed ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold">{l.claimed}</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-bold">{l.available}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span>⏱ {g.time}{l.sec}</span>
                    <span>🪙 +{g.reward} {l.coins}</span>
                    {plays[g.id] != null && <span>🏆 {plays[g.id].score}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, color }) {
  return (
    <div className={`relative rounded-2xl p-3 bg-gradient-to-br ${color} text-white shadow overflow-hidden`}>
      <div className="absolute -top-2 -right-2 text-4xl opacity-30">{icon}</div>
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-90">{label}</p>
      <p className="text-xl font-extrabold mt-1">{value}</p>
    </div>
  );
}

// ── Runner ──────────────────────────────────────────────────────────────
function MiniGameRunner({ gameId }) {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const navigate = useNavigate();
  const l = T[lang] || T.en;
  const game = MiniGamesService.get(gameId);
  const [phase, setPhase] = useState("intro"); // intro | playing | done
  const [score, setScore] = useState(0);
  const [reward, setReward] = useState(0);

  if (!game) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="pt-20 text-center"><p className="text-slate-500 mt-20">404</p></div>
      </div>
    );
  }

  const handleStart = () => { setScore(0); setPhase("playing"); };

  const handleEnd = (finalScore) => {
    setScore(finalScore);
    const granted = MiniGamesService.recordPlay(gameId, finalScore);
    if (granted) {
      try {
        CoinService.earn(game.reward);
        ProgressService.addXP(Math.floor(game.reward / 2), 1);
        setReward(game.reward);
      } catch {}
    } else {
      setReward(0);
    }
    setPhase("done");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-100 via-rose-100 to-orange-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={game.title[lang] || game.title.en} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-2xl space-y-4">
          <button onClick={() => navigate("/mini-games")} className="text-sm text-slate-500 hover:underline">{l.back}</button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-slate-800 dark:text-white">{game.title[lang] || game.title.en}</h1>

          {phase === "intro" && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 text-center space-y-3">
              <p className="text-slate-600 dark:text-slate-300 text-sm">{l.instructions}:</p>
              <p className="text-base font-medium">{INSTRUCTIONS[gameId]?.[lang] || INSTRUCTIONS[gameId]?.en}</p>
              <p className="text-xs text-slate-500">⏱ {game.time}{l.sec} · 🪙 +{game.reward} {l.coins}</p>
              {MiniGamesService.hasClaimedToday(gameId) && <p className="text-xs text-amber-600 font-bold">{l.alreadyPlayed}</p>}
              <button onClick={handleStart} className="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white text-lg font-extrabold shadow-lg">▶ {l.start}</button>
            </div>
          )}

          {phase === "playing" && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-xl border border-slate-100 dark:border-slate-700">
              {gameId === "memory_flip" && <MemoryFlipGame onEnd={handleEnd} time={game.time} />}
              {gameId === "math_sprint" && <MathSprintGame onEnd={handleEnd} time={game.time} lang={lang} />}
              {gameId === "word_scramble" && <WordScrambleGame onEnd={handleEnd} time={game.time} lang={lang} />}
              {gameId === "reaction_tap" && <ReactionTapGame onEnd={handleEnd} time={game.time} lang={lang} />}
              {gameId === "color_match" && <ColorMatchGame onEnd={handleEnd} time={game.time} lang={lang} />}
            </div>
          )}

          {phase === "done" && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 text-center space-y-3">
              <div className="text-7xl">{score > 0 ? "🎉" : "💪"}</div>
              <p className="text-slate-500 dark:text-slate-300">{l.final}</p>
              <p className="text-5xl font-extrabold text-fuchsia-600">{score}</p>
              {reward > 0 && (
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl p-3">
                  <p className="text-base font-bold text-amber-700 dark:text-amber-300">🪙 +{reward} {l.coins}</p>
                </div>
              )}
              <div className="flex gap-2 justify-center">
                <button onClick={handleStart} className="px-5 py-2.5 rounded-xl bg-violet-500 text-white font-bold">{l.replay}</button>
                <button onClick={() => navigate("/mini-games")} className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold">{l.backToHub}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const INSTRUCTIONS = {
  memory_flip: { el: "Γύρισε τα ζευγάρια ίδιων emoji! Όσο πιο γρήγορα τα βρεις, τόσο μεγαλύτερο το σκορ.", en: "Match pairs of emojis! Faster matches = higher score." },
  math_sprint: { el: "Λύσε όσες πιο πολλές πράξεις μπορείς πριν τελειώσει ο χρόνος!", en: "Solve as many problems as possible before time runs out!" },
  word_scramble: { el: "Ξεμπέρδεψε τα γράμματα και βρες τη λέξη.", en: "Unscramble the letters to find the word." },
  reaction_tap: { el: "Πάτα μόνο τους πράσινους κύκλους! Προσοχή στους κόκκινους.", en: "Tap only green circles! Avoid the red ones." },
  color_match: { el: "Πάτα ΝΑΙ μόνο αν το χρώμα του κειμένου είναι ίδιο με τη λέξη.", en: "Press YES only if the text color matches the word." },
};

// ── Memory Flip Game ────────────────────────────────────────────────────
const MEMORY_EMOJIS = ["🐶", "🐱", "🐰", "🐯", "🐸", "🦊", "🐼", "🐧"];

function MemoryFlipGame({ onEnd, time }) {
  const [cards, setCards] = useState(() => {
    const pool = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS];
    return pool.sort(() => Math.random() - 0.5).map((e, i) => ({ id: i, emoji: e, flipped: false, matched: false }));
  });
  const [picked, setPicked] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(time);

  useEffect(() => {
    if (timeLeft <= 0) { onEnd(score); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, onEnd, score]);

  useEffect(() => {
    if (cards.every((c) => c.matched)) {
      const bonus = timeLeft * 5;
      onEnd(score + bonus + 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  const handleClick = (i) => {
    if (picked.length >= 2) return;
    if (cards[i].flipped || cards[i].matched) return;
    const newCards = [...cards];
    newCards[i].flipped = true;
    setCards(newCards);
    const newPicked = [...picked, i];
    setPicked(newPicked);
    if (newPicked.length === 2) {
      const [a, b] = newPicked;
      if (cards[a].emoji === cards[b].emoji) {
        setTimeout(() => {
          setCards((cs) => cs.map((c, ix) => (ix === a || ix === b ? { ...c, matched: true } : c)));
          setPicked([]);
          setScore((s) => s + 20);
        }, 400);
      } else {
        setTimeout(() => {
          setCards((cs) => cs.map((c, ix) => (ix === a || ix === b ? { ...c, flipped: false } : c)));
          setPicked([]);
        }, 700);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-300 mb-3">
        <span>⏱ {timeLeft}s</span>
        <span>🏆 {score}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((c, i) => (
          <button key={c.id} onClick={() => handleClick(i)} className={`aspect-square text-4xl flex items-center justify-center rounded-xl transition ${c.matched ? "bg-emerald-100 dark:bg-emerald-900/30" : c.flipped ? "bg-violet-100 dark:bg-violet-900/30" : "bg-gradient-to-br from-violet-500 to-fuchsia-500"}`}>
            {(c.flipped || c.matched) ? c.emoji : "?"}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Math Sprint ─────────────────────────────────────────────────────────
function MathSprintGame({ onEnd, time, lang }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(time);
  const [problem, setProblem] = useState(() => makeProblem());
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (timeLeft <= 0) { onEnd(score); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, onEnd, score]);

  function makeProblem() {
    const ops = ["+", "-", "×"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const a = 1 + Math.floor(Math.random() * (op === "×" ? 10 : 50));
    const b = 1 + Math.floor(Math.random() * (op === "×" ? 10 : 50));
    let answer;
    if (op === "+") answer = a + b;
    else if (op === "-") answer = Math.max(a, b) - Math.min(a, b);
    else answer = a * b;
    return { a: op === "-" ? Math.max(a, b) : a, b: op === "-" ? Math.min(a, b) : b, op, answer };
  }

  const handleSubmit = (e) => {
    e?.preventDefault();
    const ans = parseInt(input, 10);
    if (Number.isNaN(ans)) return;
    if (ans === problem.answer) {
      setScore((s) => s + 10);
      setFeedback("ok");
    } else {
      setFeedback("bad");
    }
    setInput("");
    setProblem(makeProblem());
    setTimeout(() => setFeedback(null), 250);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
        <span>⏱ {timeLeft}s</span>
        <span>🏆 {score}</span>
      </div>
      <div className={`text-center p-8 rounded-2xl transition ${feedback === "ok" ? "bg-emerald-100 dark:bg-emerald-900/30" : feedback === "bad" ? "bg-rose-100 dark:bg-rose-900/30" : "bg-fuchsia-50 dark:bg-slate-700"}`}>
        <p className="text-5xl font-extrabold text-slate-800 dark:text-white">
          {problem.a} {problem.op} {problem.b} = ?
        </p>
      </div>
      <input
        ref={inputRef}
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
        className="w-full px-4 py-4 rounded-xl border-2 border-fuchsia-300 dark:border-fuchsia-700 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-center text-3xl font-extrabold outline-none"
      />
    </form>
  );
}

// ── Word Scramble ───────────────────────────────────────────────────────
const SCRAMBLE_WORDS = {
  el: ["ΣΧΟΛΕΙΟ", "ΦΙΛΟΣ", "ΘΑΛΑΣΣΑ", "ΒΙΒΛΙΟ", "ΓΑΤΑ", "ΣΚΥΛΟΣ", "ΗΛΙΟΣ", "ΦΕΓΓΑΡΙ", "ΑΣΤΕΡΙ", "ΛΟΥΛΟΥΔΙ", "ΠΟΥΛΙ", "ΨΑΡΙ", "ΔΕΝΤΡΟ", "ΤΡΑΓΟΥΔΙ"],
  en: ["SCHOOL", "FRIEND", "BEACH", "BOOK", "CAT", "DOG", "SUN", "MOON", "STAR", "FLOWER", "BIRD", "FISH", "TREE", "SONG"],
};

function WordScrambleGame({ onEnd, time, lang }) {
  const words = SCRAMBLE_WORDS[lang] || SCRAMBLE_WORDS.en;
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(time);
  const [target, setTarget] = useState(() => words[Math.floor(Math.random() * words.length)]);
  const [scrambled, setScrambled] = useState("");
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);

  function scramble(word) {
    return word.split("").sort(() => Math.random() - 0.5).join("");
  }

  useEffect(() => { setScrambled(scramble(target)); }, [target]);

  useEffect(() => {
    if (timeLeft <= 0) { onEnd(score); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, onEnd, score]);

  const next = () => setTarget(words[Math.floor(Math.random() * words.length)]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (input.toUpperCase() === target) {
      setScore((s) => s + Math.max(15, target.length * 3));
      setFeedback("ok");
    } else {
      setFeedback("bad");
    }
    setInput("");
    next();
    setTimeout(() => setFeedback(null), 250);
  };

  const handleSkip = () => { next(); setInput(""); };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
        <span>⏱ {timeLeft}s</span>
        <span>🏆 {score}</span>
      </div>
      <div className={`text-center p-6 rounded-2xl transition ${feedback === "ok" ? "bg-emerald-100 dark:bg-emerald-900/30" : feedback === "bad" ? "bg-rose-100 dark:bg-rose-900/30" : "bg-violet-50 dark:bg-slate-700"}`}>
        <p className="text-3xl sm:text-5xl font-extrabold tracking-widest text-slate-800 dark:text-white font-mono">{scrambled}</p>
        <p className="text-xs text-slate-500 mt-2">{target.length} γρ.</p>
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value.toUpperCase())} autoFocus className="w-full px-4 py-3 rounded-xl border-2 border-violet-300 dark:border-violet-700 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-center text-2xl font-extrabold uppercase outline-none" />
      <div className="flex gap-2">
        <button type="submit" className="flex-1 py-2 rounded-xl bg-violet-500 text-white font-bold">OK</button>
        <button type="button" onClick={handleSkip} className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold">Skip</button>
      </div>
    </form>
  );
}

// ── Reaction Tap ────────────────────────────────────────────────────────
function ReactionTapGame({ onEnd, time }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(time);
  const [target, setTarget] = useState({ x: 50, y: 50, type: "good", id: 0 });

  useEffect(() => {
    if (timeLeft <= 0) { onEnd(score); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, onEnd, score]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTarget({
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        type: Math.random() < 0.75 ? "good" : "bad",
        id: Date.now(),
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleTap = (type) => {
    if (type === "good") setScore((s) => s + 10);
    else setScore((s) => Math.max(0, s - 5));
  };

  return (
    <div>
      <div className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-300 mb-3">
        <span>⏱ {timeLeft}s</span>
        <span>🏆 {score}</span>
      </div>
      <div className="relative w-full bg-slate-100 dark:bg-slate-700 rounded-2xl overflow-hidden" style={{ height: 350 }}>
        <button
          key={target.id}
          onClick={() => handleTap(target.type)}
          className={`absolute w-16 h-16 rounded-full shadow-lg transition-transform animate-pulse ${target.type === "good" ? "bg-emerald-500" : "bg-rose-500"}`}
          style={{ left: `${target.x}%`, top: `${target.y}%`, transform: "translate(-50%, -50%)" }}
        />
      </div>
      <p className="text-xs text-slate-500 text-center mt-2">🟢 Tap green (+10) · 🔴 Avoid red (-5)</p>
    </div>
  );
}

// ── Color Match (Stroop) ────────────────────────────────────────────────
const COLORS = [
  { name: { el: "Κόκκινο", en: "Red" }, css: "text-rose-500", key: "red" },
  { name: { el: "Πράσινο", en: "Green" }, css: "text-emerald-500", key: "green" },
  { name: { el: "Μπλε", en: "Blue" }, css: "text-blue-500", key: "blue" },
  { name: { el: "Κίτρινο", en: "Yellow" }, css: "text-amber-500", key: "yellow" },
  { name: { el: "Μωβ", en: "Purple" }, css: "text-violet-500", key: "purple" },
];

function ColorMatchGame({ onEnd, time, lang }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(time);
  const [round, setRound] = useState(() => makeRound());
  const [feedback, setFeedback] = useState(null);

  function makeRound() {
    const word = COLORS[Math.floor(Math.random() * COLORS.length)];
    const display = Math.random() < 0.5 ? word : COLORS[Math.floor(Math.random() * COLORS.length)];
    return { word, display, match: word.key === display.key };
  }

  useEffect(() => {
    if (timeLeft <= 0) { onEnd(score); return; }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, onEnd, score]);

  const answer = (yes) => {
    const ok = (yes && round.match) || (!yes && !round.match);
    if (ok) setScore((s) => s + 10);
    else setScore((s) => Math.max(0, s - 5));
    setFeedback(ok ? "ok" : "bad");
    setRound(makeRound());
    setTimeout(() => setFeedback(null), 200);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm font-bold text-slate-600 dark:text-slate-300">
        <span>⏱ {timeLeft}s</span>
        <span>🏆 {score}</span>
      </div>
      <div className={`text-center p-12 rounded-2xl transition ${feedback === "ok" ? "bg-emerald-100 dark:bg-emerald-900/30" : feedback === "bad" ? "bg-rose-100 dark:bg-rose-900/30" : "bg-cyan-50 dark:bg-slate-700"}`}>
        <p className={`text-5xl sm:text-6xl font-extrabold ${round.display.css}`}>{round.word.name[lang] || round.word.name.en}</p>
      </div>
      <p className="text-xs text-center text-slate-500">{lang === "el" ? "Είναι το χρώμα ίδιο με τη λέξη;" : "Is the color matching the word?"}</p>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => answer(true)} className="py-3 rounded-xl bg-emerald-500 text-white text-xl font-extrabold shadow">{lang === "el" ? "✓ ΝΑΙ" : "✓ YES"}</button>
        <button onClick={() => answer(false)} className="py-3 rounded-xl bg-rose-500 text-white text-xl font-extrabold shadow">{lang === "el" ? "✗ ΟΧΙ" : "✗ NO"}</button>
      </div>
    </div>
  );
}
