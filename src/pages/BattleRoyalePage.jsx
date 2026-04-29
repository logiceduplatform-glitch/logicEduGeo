import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { ProgressService } from "../services/ProgressService";
import { CoinService } from "../services/CoinService";
import { BOT_PERSONAS, BR_QUESTIONS } from "../config/battleRoyaleConfig";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ROUND_TIME = 12;

const T = {
  el: {
    title: "Battle Royale",
    subtitle: "Ο τελευταίος που θα μείνει κερδίζει!",
    play: "Παίξε!",
    round: "Γύρος",
    of: "από",
    eliminated: "Αποκλείστηκε!",
    survived: "Επιβίωσες!",
    wonRound: "Πέρασες τον γύρο!",
    youWin: "ΝΙΚΗΤΗΣ! 🏆",
    youLose: "Αποκλείστηκες!",
    finishedAt: "Τελείωσες στη θέση",
    yourPosition: "Η θέση σου",
    rank: "Κατάταξη",
    playAgain: "Νέα μάχη",
    backHome: "Αρχική",
    pickAnswer: "Διάλεξε γρήγορα!",
    timeUp: "Τέλος χρόνου!",
    correct: "Σωστό!",
    wrong: "Λάθος!",
    survivors: "Επιζώντες",
    you: "Εσύ",
    answering: "απαντά...",
    bonus: "Bonus",
  },
  en: {
    title: "Battle Royale",
    subtitle: "Last one standing wins!",
    play: "Play!",
    round: "Round",
    of: "of",
    eliminated: "Eliminated!",
    survived: "Survived!",
    wonRound: "You passed the round!",
    youWin: "WINNER! 🏆",
    youLose: "Eliminated!",
    finishedAt: "Finished at position",
    yourPosition: "Your position",
    rank: "Rank",
    playAgain: "New battle",
    backHome: "Home",
    pickAnswer: "Choose quickly!",
    timeUp: "Time's up!",
    correct: "Correct!",
    wrong: "Wrong!",
    survivors: "Survivors",
    you: "You",
    answering: "answering...",
    bonus: "Bonus",
  },
};

export default function BattleRoyalePage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const l = T[lang] || T.en;
  const isEl = lang === "el";

  const [gameState, setGameState] = useState("intro"); // intro | playing | result
  const [bots, setBots] = useState([]);
  const [round, setRound] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [timer, setTimer] = useState(ROUND_TIME);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [eliminated, setEliminated] = useState(false);
  const [finishPosition, setFinishPosition] = useState(null);
  const [roundResult, setRoundResult] = useState(null);
  const [showRoundResult, setShowRoundResult] = useState(false);

  const timerRef = useRef(null);

  const getOpt = (opt) => typeof opt === "string" ? opt : (isEl ? opt.el : opt.en);

  const startGame = () => {
    const initialBots = shuffle(BOT_PERSONAS).slice(0, 9).map(b => ({ ...b, alive: true, currentAnswer: null, currentTime: 0 }));
    setBots(initialBots);
    setQuestions(shuffle(BR_QUESTIONS).slice(0, 10));
    setRound(0);
    setEliminated(false);
    setFinishPosition(null);
    setGameState("playing");
    setSelected(null);
    setFeedback(null);
    setTimer(ROUND_TIME);
  };

  // Timer countdown
  useEffect(() => {
    if (gameState !== "playing" || feedback !== null || showRoundResult) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (selected === null && !eliminated) handleAnswer(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState, feedback, round, showRoundResult]);

  const handleAnswer = (idx) => {
    if (feedback !== null || eliminated) return;
    setSelected(idx);
    const q = questions[round];
    const isCorrect = idx === q.correct;
    setFeedback(isCorrect);
    const myTimeUsed = ROUND_TIME - timer;

    setTimeout(() => resolveRound(isCorrect, myTimeUsed), 1500);
  };

  const resolveRound = (myCorrect, myTime) => {
    const aliveBots = bots.filter(b => b.alive);
    const q = questions[round];
    const botResults = aliveBots.map(bot => {
      const willAnswerCorrect = Math.random() < bot.accuracy;
      const responseTime = ROUND_TIME * (1 - bot.speed) + Math.random() * 3;
      return { ...bot, currentAnswer: willAnswerCorrect ? q.correct : (q.correct + 1) % q.opts.length, currentTime: responseTime, gotItRight: willAnswerCorrect };
    });

    const allParticipants = [
      { id: "player", name: l.you, emoji: "🧑", isPlayer: true, gotItRight: myCorrect, time: myCorrect ? myTime : ROUND_TIME + 1 },
      ...botResults.map(b => ({ id: b.id, name: isEl ? b.name.el : b.name.en, emoji: b.emoji, isPlayer: false, gotItRight: b.gotItRight, time: b.gotItRight ? b.currentTime : ROUND_TIME + 1 })),
    ];

    const wrong = allParticipants.filter(p => !p.gotItRight);
    const correct = allParticipants.filter(p => p.gotItRight).sort((a, b) => b.time - a.time);

    let toEliminate = [];
    if (wrong.length > 0) {
      toEliminate = wrong;
    } else if (correct.length > 1) {
      toEliminate = [correct[0]];
    }

    const eliminatedIds = new Set(toEliminate.map(p => p.id));
    const playerEliminated = eliminatedIds.has("player");

    const updatedBots = bots.map(b => eliminatedIds.has(b.id) ? { ...b, alive: false } : b);
    setBots(updatedBots);

    setRoundResult({
      eliminated: toEliminate,
      myCorrect,
      playerEliminated,
      totalAlive: updatedBots.filter(b => b.alive).length + (playerEliminated ? 0 : 1),
    });
    setShowRoundResult(true);

    if (playerEliminated) {
      const survivors = updatedBots.filter(b => b.alive).length + 1;
      setFinishPosition(survivors);
      setEliminated(true);
    }
  };

  const handleNextRound = () => {
    setShowRoundResult(false);
    if (eliminated) {
      const earnedXP = Math.max(5, (10 - finishPosition) * 5);
      ProgressService.addXP(earnedXP, 1);
      setGameState("result");
      return;
    }

    const aliveCount = bots.filter(b => b.alive).length;
    if (aliveCount === 0) {
      ProgressService.addXP(50, 3);
      CoinService.earn(15);
      setFinishPosition(1);
      setGameState("result");
      return;
    }

    if (round + 1 >= questions.length) {
      ProgressService.addXP(30, 2);
      CoinService.earn(10);
      setFinishPosition(aliveCount + 1);
      setGameState("result");
      return;
    }

    setRound(prev => prev + 1);
    setSelected(null);
    setFeedback(null);
    setTimer(ROUND_TIME);
  };

  // --- INTRO ---
  if (gameState === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <SEO title={l.title} />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="text-7xl mb-2 animate-bounce">⚔️</div>
            <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400">{l.subtitle}</p>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-500 mb-3">{isEl ? "Οι αντίπαλοί σου:" : "Your opponents:"}</h3>
              <div className="grid grid-cols-3 gap-2">
                {BOT_PERSONAS.slice(0, 9).map(b => (
                  <div key={b.id} className={`bg-gradient-to-br ${b.color} rounded-xl p-2 text-white text-xs flex flex-col items-center gap-1`}>
                    <span className="text-2xl">{b.emoji}</span>
                    <span className="font-bold truncate w-full text-center">{isEl ? b.name.el : b.name.en}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300">
              💡 {isEl ? "Απάντησε γρήγορα και σωστά! Όσοι αργούν αποκλείονται." : "Answer fast and correctly! The slowest get eliminated."}
            </div>

            <button onClick={startGame} className="px-10 py-4 rounded-2xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white font-extrabold text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
              ⚔️ {l.play}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RESULT ---
  if (gameState === "result") {
    const won = finishPosition === 1;
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Navbar />
        <SEO title={l.title} />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="text-7xl">{won ? "🏆" : finishPosition <= 3 ? "🥉" : "💀"}</div>
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">
              {won ? l.youWin : `${l.finishedAt} #${finishPosition}`}
            </h2>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 space-y-4">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                #{finishPosition}/10
              </div>
              <p className="text-sm text-slate-500">{l.yourPosition}</p>
              {won && (
                <div className="flex justify-center gap-4 text-sm">
                  <span className="px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold">+50 XP</span>
                  <span className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 font-bold">+15 🪙</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center">
              <button onClick={startGame} className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold shadow-md">
                {l.playAgain}
              </button>
              <button onClick={() => navigate("/")} className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                {l.backHome}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- PLAYING ---
  const q = questions[round];
  if (!q) return null;
  const aliveCount = bots.filter(b => b.alive).length + (eliminated ? 0 : 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-2xl">
          {/* HUD */}
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 shadow">
              {l.round} {round + 1}/{questions.length}
            </span>
            <span className={`px-4 py-2 rounded-full font-black text-2xl shadow ${timer <= 4 ? "bg-red-500 text-white animate-pulse" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"}`}>
              ⏱️ {timer}
            </span>
            <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 shadow">
              💀 {l.survivors}: {aliveCount}/10
            </span>
          </div>

          {/* Survivors row */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 shadow border border-slate-100 dark:border-slate-700 mb-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <span className={`text-2xl ${eliminated ? "opacity-20 grayscale" : ""}`} title={l.you}>🧑</span>
              {bots.map(b => (
                <span key={b.id} className={`text-2xl transition-all ${!b.alive ? "opacity-20 grayscale" : ""}`} title={isEl ? b.name.el : b.name.en}>{b.emoji}</span>
              ))}
            </div>
          </div>

          {/* Question */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-100 dark:border-slate-700 space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white text-center leading-snug">
              {isEl ? q.q.el : q.q.en}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.opts.map((opt, i) => {
                let cls = "border-slate-200 dark:border-slate-600 hover:border-orange-400 hover:scale-[1.02]";
                if (feedback !== null) {
                  if (i === q.correct) cls = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30";
                  else if (i === selected && !feedback) cls = "border-red-500 bg-red-50 dark:bg-red-900/30";
                }
                return (
                  <button key={i} onClick={() => handleAnswer(i)} disabled={feedback !== null || eliminated} className={`px-5 py-4 rounded-xl border-2 font-bold text-slate-700 dark:text-slate-200 transition-all ${cls} disabled:cursor-default`}>
                    <span className="text-slate-400 mr-2">{String.fromCharCode(65 + i)}</span>{getOpt(opt)}
                  </button>
                );
              })}
            </div>

            {eliminated && <p className="text-center text-red-500 font-bold animate-pulse">💀 {l.eliminated}</p>}
          </div>
        </div>
      </div>

      {/* Round result modal */}
      {showRoundResult && roundResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="text-5xl">{roundResult.playerEliminated ? "💀" : roundResult.myCorrect ? "✅" : "⚠️"}</div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
              {roundResult.playerEliminated ? l.youLose : roundResult.myCorrect ? l.wonRound : l.survived}
            </h3>
            {roundResult.eliminated.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-2">{l.eliminated}:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {roundResult.eliminated.map(p => (
                    <div key={p.id} className="flex items-center gap-1 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full text-sm">
                      <span>{p.emoji}</span>
                      <span className="text-red-600 dark:text-red-400 font-medium">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button onClick={handleNextRound} className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold shadow-md hover:shadow-lg transition-all">
              {roundResult.playerEliminated ? (isEl ? "Δες αποτέλεσμα" : "See result") : (isEl ? "Επόμενος γύρος →" : "Next round →")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
