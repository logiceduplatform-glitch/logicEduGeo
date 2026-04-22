import React, { useContext, useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { MultiplayerService } from "../services/MultiplayerService";

const T = {
  el: {
    title: "Quiz Battle",
    subtitle: "Προκάλεσε κάποιον σε μονομαχία γνώσεων στην ίδια συσκευή!",
    localNote: "Τοπικό multiplayer – μοιραστείτε τον κωδικό στην ίδια συσκευή",
    back: "Πίσω",
    yourName: "Το όνομά σου",
    namePlaceholder: "π.χ. Μαρία",
    createRoom: "Δημιουργία Αγώνα",
    joinRoom: "Συμμετοχή σε Αγώνα",
    codePlaceholder: "Κωδικός (π.χ. ABC12)",
    join: "Μπες",
    vsBot: "Παίξε vs GeoBot",
    or: "ή",
    waitingTitle: "Αναμονή παικτών...",
    roomCode: "Κωδικός δωματίου",
    copyCode: "Αντιγραφή",
    copied: "Αντιγράφηκε!",
    startBattle: "Ξεκίνα τη Μάχη!",
    players: "Παίκτες",
    question: "Ερώτηση",
    of: "από",
    timeLeft: "Χρόνος",
    correct: "Σωστό!",
    wrong: "Λάθος!",
    results: "Αποτελέσματα",
    winner: "Νικητής!",
    draw: "Ισοπαλία!",
    youWon: "Κέρδισες!",
    youLost: "Ο αντίπαλος κέρδισε",
    score: "Σκορ",
    playAgain: "Παίξε Ξανά",
    goBack: "Πίσω στο Μενού",
    invalidCode: "Δεν βρέθηκε δωμάτιο",
    boardGames: "Ή δοκίμασε Επιτραπέζια",
    goBoard: "Επιτραπέζια",
    points: "πόντοι",
    speedBonus: "Μπόνους ταχύτητας",
  },
  en: {
    title: "Quiz Battle",
    subtitle: "Challenge someone to a knowledge duel on the same device!",
    localNote: "Local multiplayer – share the code on the same device",
    back: "Back",
    yourName: "Your name",
    namePlaceholder: "e.g. Maria",
    createRoom: "Create Match",
    joinRoom: "Join Match",
    codePlaceholder: "Code (e.g. ABC12)",
    join: "Join",
    vsBot: "Play vs GeoBot",
    or: "or",
    waitingTitle: "Waiting for players...",
    roomCode: "Room code",
    copyCode: "Copy",
    copied: "Copied!",
    startBattle: "Start Battle!",
    players: "Players",
    question: "Question",
    of: "of",
    timeLeft: "Time",
    correct: "Correct!",
    wrong: "Wrong!",
    results: "Results",
    winner: "Winner!",
    draw: "Draw!",
    youWon: "You won!",
    youLost: "Opponent won",
    score: "Score",
    playAgain: "Play Again",
    goBack: "Back to Menu",
    invalidCode: "Room not found",
    boardGames: "Or try Board Games",
    goBoard: "Board Games",
    points: "points",
    speedBonus: "Speed bonus",
  },
};

function Lobby({ l, lang, playerName, setPlayerName, onCreateRoom, onJoinRoom, onVsBot, joinError, navigate }) {
  const [joinCode, setJoinCode] = useState("");

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="text-center mb-8">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center text-5xl shadow-2xl shadow-blue-200 dark:shadow-blue-900/40 mx-auto mb-4">
          ⚔️
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{l.title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-2">{l.subtitle}</p>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
          📱 {l.localNote}
        </span>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{l.yourName}</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder={l.namePlaceholder}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white bg-white dark:bg-slate-700 focus:border-purple-400 outline-none transition-colors"
          />
        </div>

        <button
          onClick={onVsBot}
          disabled={!playerName.trim()}
          className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-200 dark:shadow-purple-900/30 disabled:opacity-40 transition-all text-lg"
        >
          🤖 {l.vsBot}
        </button>

        <div className="flex items-center gap-3 text-slate-400 text-sm">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span>{l.or}</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        <button
          onClick={onCreateRoom}
          disabled={!playerName.trim()}
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg disabled:opacity-40 transition-all"
        >
          🏟️ {l.createRoom}
        </button>

        <div className="flex gap-2">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder={l.codePlaceholder}
            maxLength={5}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-white bg-white dark:bg-slate-700 focus:border-blue-400 outline-none text-center tracking-widest font-mono uppercase"
          />
          <button
            onClick={() => onJoinRoom(joinCode)}
            disabled={joinCode.length < 3 || !playerName.trim()}
            className="px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 transition-all"
          >
            {l.join}
          </button>
        </div>
        {joinError && <p className="text-red-500 text-sm text-center font-medium">{l.invalidCode}</p>}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{l.boardGames}</p>
        <button
          onClick={() => navigate("/play/board-games")}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
        >
          🎲 {l.goBoard}
        </button>
      </div>
    </div>
  );
}

function WaitingRoom({ l, room, onStart, onCopy, copied }) {
  const playerCount = Object.keys(room.players).length;

  return (
    <div className="mx-auto max-w-md text-center space-y-6">
      <div className="text-6xl animate-pulse">⏳</div>
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{l.waitingTitle}</h2>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 space-y-4">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{l.roomCode}</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-mono font-extrabold tracking-widest text-purple-600 dark:text-purple-400">{room.code}</span>
            <button
              onClick={onCopy}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              {copied ? "✓" : "📋"} {copied ? l.copied : l.copyCode}
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{l.players} ({playerCount})</p>
          <div className="space-y-2">
            {Object.values(room.players).map((p, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl px-3 py-2">
                <span className="text-lg">{i === 0 ? "👑" : "🎮"}</span>
                <span className="font-semibold text-slate-800 dark:text-white text-sm">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {playerCount >= 2 && (
          <button
            onClick={onStart}
            className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg transition-all text-lg"
          >
            ⚔️ {l.startBattle}
          </button>
        )}
      </div>
    </div>
  );
}

function QuizBattle({ l, lang, room, roomCode, onFinish }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [totalScore, setTotalScore] = useState(0);
  const timerRef = useRef(null);
  const questionStartRef = useRef(Date.now());

  const question = room.questions[currentQ];
  const totalQuestions = room.questions.length;

  useEffect(() => {
    questionStartRef.current = Date.now();
    setTimeLeft(10);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentQ]);

  const handleTimeout = useCallback(() => {
    if (selected !== null) return;
    const result = MultiplayerService.submitAnswer(roomCode, currentQ, -1, 10);
    setFeedback({ correct: false, points: 0 });
    setTimeout(() => nextQuestion(result), 1500);
  }, [currentQ, roomCode, selected]);

  const handleAnswer = useCallback((idx) => {
    if (selected !== null) return;
    clearInterval(timerRef.current);
    setSelected(idx);

    const elapsed = (Date.now() - questionStartRef.current) / 1000;
    const result = MultiplayerService.submitAnswer(roomCode, currentQ, idx, elapsed);

    setFeedback(result ? { correct: result.correct, points: result.points } : { correct: false, points: 0 });
    if (result) setTotalScore(prev => prev + result.points);

    setTimeout(() => nextQuestion(result), 1500);
  }, [currentQ, roomCode, selected]);

  const nextQuestion = useCallback((result) => {
    if (currentQ + 1 >= totalQuestions) {
      onFinish();
    } else {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setFeedback(null);
    }
  }, [currentQ, totalQuestions, onFinish]);

  if (!question) return null;

  const qText = question.q[lang] || question.q.en;

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {l.question} {currentQ + 1} {l.of} {totalQuestions}
        </span>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full font-bold text-sm ${timeLeft <= 3 ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 animate-pulse" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}>
          ⏱️ {timeLeft}s
        </div>
      </div>

      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300" style={{ width: `${((currentQ + 1) / totalQuestions) * 100}%` }} />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-5 text-center">{qText}</h3>

        <div className="grid grid-cols-1 gap-3">
          {question.options.map((opt, i) => {
            const optText = opt[lang] || opt.en;
            const isCorrect = i === question.answer;
            const isSelected = selected === i;
            let style = "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20";

            if (selected !== null) {
              if (isCorrect) style = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30";
              else if (isSelected && !isCorrect) style = "border-red-500 bg-red-50 dark:bg-red-900/30";
              else style = "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 opacity-50";
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
                className={`w-full p-4 rounded-xl border-2 text-left font-semibold text-slate-800 dark:text-white transition-all ${style} disabled:cursor-default`}
              >
                <span className="inline-flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {optText}
                  {selected !== null && isCorrect && <span className="ml-auto text-emerald-500">✓</span>}
                  {isSelected && !isCorrect && <span className="ml-auto text-red-500">✗</span>}
                </span>
              </button>
            );
          })}
        </div>

        {feedback && (
          <div className={`mt-4 text-center py-2 rounded-xl font-bold text-sm ${feedback.correct ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
            {feedback.correct ? `✅ ${l.correct} +${feedback.points} ${l.points}` : `❌ ${l.wrong}`}
          </div>
        )}
      </div>

      <div className="text-center text-sm font-semibold text-slate-600 dark:text-slate-400">
        {l.score}: <span className="text-purple-600 dark:text-purple-400 text-lg">{totalScore}</span>
      </div>
    </div>
  );
}

function ResultsScreen({ l, lang, roomCode, playerId, onPlayAgain, onGoBack }) {
  const results = MultiplayerService.getResults(roomCode);
  if (!results) return null;

  const { rankings } = results;
  const myRank = rankings.findIndex(r => r.id === playerId);
  const isWinner = myRank === 0;
  const isDraw = rankings.length >= 2 && rankings[0].score === rankings[1].score;

  return (
    <div className="mx-auto max-w-md text-center space-y-6">
      <div className="text-6xl mb-2">
        {isDraw ? "🤝" : isWinner ? "🏆" : "😔"}
      </div>
      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">
        {isDraw ? l.draw : isWinner ? l.youWon : l.youLost}
      </h2>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 space-y-3">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{l.results}</h3>
        {rankings.map((r, i) => (
          <div
            key={r.id}
            className={`flex items-center justify-between p-3 rounded-xl border-2 ${
              r.id === playerId
                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
              </span>
              <span className="font-bold text-slate-800 dark:text-white">{r.name}</span>
            </div>
            <span className="font-extrabold text-lg text-purple-600 dark:text-purple-400">{r.score}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        <button
          onClick={onPlayAgain}
          className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg transition-all"
        >
          🔄 {l.playAgain}
        </button>
        <button
          onClick={onGoBack}
          className="px-6 py-3 rounded-xl font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          {l.goBack}
        </button>
      </div>
    </div>
  );
}

export default function OnlineMultiplayerPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const l = T[lang] || T.en;

  const [phase, setPhase] = useState("lobby");
  const [playerName, setPlayerName] = useState(() => {
    try { return JSON.parse(localStorage.getItem("geo:userProfile") || "{}").name || ""; } catch { return ""; }
  });
  const [roomCode, setRoomCode] = useState(null);
  const [room, setRoom] = useState(null);
  const [joinError, setJoinError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    MultiplayerService.cleanOldRooms();
  }, []);

  useEffect(() => {
    if (!roomCode || phase !== "waiting") return;
    const interval = setInterval(() => {
      const r = MultiplayerService.getRoom(roomCode);
      if (r) setRoom(r);
    }, 1000);
    return () => clearInterval(interval);
  }, [roomCode, phase]);

  const handleCreateRoom = () => {
    const r = MultiplayerService.createRoom(playerName.trim(), "general");
    setRoomCode(r.code);
    setRoom(r);
    setPhase("waiting");
  };

  const handleJoinRoom = (code) => {
    setJoinError(false);
    const r = MultiplayerService.joinRoom(code, playerName.trim());
    if (r) {
      setRoomCode(code);
      setRoom(r);
      setPhase("waiting");
    } else {
      setJoinError(true);
    }
  };

  const handleVsBot = () => {
    const r = MultiplayerService.createRoom(playerName.trim(), "general");
    MultiplayerService.simulateOpponent(r.code, "GeoBot 🤖");
    const started = MultiplayerService.startGame(r.code);
    setRoomCode(r.code);
    setRoom(started);
    setPhase("playing");
  };

  const handleStart = () => {
    const started = MultiplayerService.startGame(roomCode);
    setRoom(started);
    setPhase("playing");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const handleFinish = () => setPhase("results");

  const handlePlayAgain = () => {
    setRoomCode(null);
    setRoom(null);
    setPhase("lobby");
  };

  const playerId = MultiplayerService.getPlayerId();

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <SEO title={l.title} />
      <Navbar />

      <div className="pt-20 pb-12 px-4">
        {phase !== "playing" && (
          <div className="mx-auto max-w-md">
            <button
              onClick={() => phase === "lobby" ? navigate(-1) : handlePlayAgain()}
              className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              {l.back}
            </button>
          </div>
        )}

        {phase === "lobby" && (
          <Lobby l={l} lang={lang} playerName={playerName} setPlayerName={setPlayerName}
            onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} onVsBot={handleVsBot}
            joinError={joinError} navigate={navigate} />
        )}

        {phase === "waiting" && room && (
          <WaitingRoom l={l} room={room} onStart={handleStart} onCopy={handleCopy} copied={copied} />
        )}

        {phase === "playing" && room && (
          <QuizBattle l={l} lang={lang} room={room} roomCode={roomCode} onFinish={handleFinish} />
        )}

        {phase === "results" && (
          <ResultsScreen l={l} lang={lang} roomCode={roomCode} playerId={playerId}
            onPlayAgain={handlePlayAgain} onGoBack={() => navigate(-1)} />
        )}
      </div>
    </div>
  );
}
