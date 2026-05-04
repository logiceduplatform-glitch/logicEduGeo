import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { LiveRoomService } from "../services/LiveRoomService";

const T = {
  el: {
    title: "Live Classroom",
    subtitle: "Παίξε quiz σε πραγματικό χρόνο με την τάξη σου.",
    create: "Δημιούργησε αίθουσα",
    creating: "Δημιουργία...",
    join: "Συμμετοχή σε αίθουσα",
    code: "Κωδικός",
    nickname: "Ψευδώνυμο",
    enterCode: "ABC123",
    enterName: "Όνομα",
    joinBtn: "Είσοδος",
    needLogin: "Συνδέσου για να δημιουργήσεις αίθουσα.",
    sampleQuiz: "Sample γρήγορου quiz (5 ερωτήσεις)",
    waiting: "Περιμένουμε παίκτες...",
    players: "παίκτες",
    startGame: "Έναρξη",
    nextQ: "Επόμενη",
    revealLb: "Δείξε leaderboard",
    closeRoom: "Τερματισμός",
    leaderboard: "Leaderboard",
    waitingHost: "Περιμένουμε τον δάσκαλο...",
    chooseAnswer: "Διάλεξε απάντηση",
    answered: "✓ Καταγράφηκε",
    finalResults: "Τελικά αποτελέσματα",
    you: "Εσύ",
    notFound: "Η αίθουσα δεν βρέθηκε.",
    joinUrl: "URL συμμετοχής",
    copyUrl: "Αντιγραφή",
    copied: "Αντιγράφηκε!",
  },
  en: {
    title: "Live Classroom",
    subtitle: "Play quizzes in real time with your class.",
    create: "Create room",
    creating: "Creating...",
    join: "Join a room",
    code: "Code",
    nickname: "Nickname",
    enterCode: "ABC123",
    enterName: "Name",
    joinBtn: "Join",
    needLogin: "Sign in to create a room.",
    sampleQuiz: "Sample quick quiz (5 questions)",
    waiting: "Waiting for players...",
    players: "players",
    startGame: "Start",
    nextQ: "Next",
    revealLb: "Show leaderboard",
    closeRoom: "End",
    leaderboard: "Leaderboard",
    waitingHost: "Waiting for the teacher...",
    chooseAnswer: "Pick an answer",
    answered: "✓ Recorded",
    finalResults: "Final results",
    you: "You",
    notFound: "Room not found.",
    joinUrl: "Join URL",
    copyUrl: "Copy",
    copied: "Copied!",
  },
};

const SAMPLE_QUESTIONS = [
  { q: "2 + 2 = ?", choices: ["3", "4", "5", "6"], correct: 1 },
  { q: "Πρωτεύουσα της Ελλάδας;", choices: ["Πάτρα", "Αθήνα", "Ηράκλειο", "Λάρισα"], correct: 1 },
  { q: "Πόσες ώρες έχει η μέρα;", choices: ["12", "20", "24", "60"], correct: 2 },
  { q: "Το νερό βράζει στους...", choices: ["50°C", "75°C", "100°C", "120°C"], correct: 2 },
  { q: "Πόσοι πλανήτες είναι στο ηλιακό μας σύστημα;", choices: ["6", "7", "8", "9"], correct: 2 },
];

const COLOR_CHOICES = [
  "from-rose-500 to-rose-600",
  "from-blue-500 to-blue-600",
  "from-amber-500 to-amber-600",
  "from-emerald-500 to-emerald-600",
];

function HostView({ room, code, lang, onNext, onReveal, onClose }) {
  const l = T[lang] || T.en;
  const [copied, setCopied] = useState(false);
  const joinUrl = LiveRoomService.buildJoinUrl(code);
  const players = useMemo(() => Object.entries(room?.players || {}).map(([id, p]) => ({ id, ...p })), [room]);
  const sortedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));

  const copyUrl = () => {
    navigator.clipboard?.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const currentQ = (room?.questions || [])[room?.currentQ] || null;

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 text-center">
        <div className="text-xs uppercase text-slate-500 dark:text-slate-400">{l.code}</div>
        <div className="text-5xl font-extrabold tracking-widest font-mono text-purple-600 dark:text-purple-400">
          {code}
        </div>
        <div className="mt-3 text-sm text-slate-600 dark:text-slate-400 break-all">
          {l.joinUrl}: <code>{joinUrl}</code>
          <button
            type="button"
            onClick={copyUrl}
            className="ml-2 text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            {copied ? l.copied : l.copyUrl}
          </button>
        </div>
      </div>

      {/* Lobby */}
      {room?.phase === "lobby" && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="text-center text-slate-600 dark:text-slate-400 mb-3">
            {players.length} {l.players}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {players.map((p) => (
              <div key={p.id} className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-2 text-center font-semibold text-purple-800 dark:text-purple-200">
                {p.name}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onNext}
            disabled={players.length === 0}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow disabled:opacity-50"
          >
            {l.startGame}
          </button>
        </div>
      )}

      {/* Question */}
      {room?.phase === "question" && currentQ && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Q{(room.currentQ || 0) + 1} / {room.questions.length}
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">{currentQ.q}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {currentQ.choices.map((c, i) => (
              <div
                key={i}
                className={`bg-gradient-to-r ${COLOR_CHOICES[i % COLOR_CHOICES.length]} text-white font-bold p-4 rounded-xl text-center`}
              >
                {c}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={onReveal} className="flex-1 px-3 py-2 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600">{l.revealLb}</button>
            <button onClick={onNext} className="flex-1 px-3 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700">{l.nextQ}</button>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {(room?.phase === "results" || room?.phase === "done") && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">
            {room.phase === "done" ? l.finalResults : l.leaderboard}
          </h3>
          <ol className="space-y-2">
            {sortedPlayers.slice(0, 10).map((p, i) => (
              <li
                key={p.id}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  i === 0 ? "bg-amber-100 dark:bg-amber-900/40" : "bg-slate-50 dark:bg-slate-900/40"
                }`}
              >
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {i + 1}. {p.name}
                </span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{p.score || 0}</span>
              </li>
            ))}
          </ol>
          {room.phase === "results" && (
            <button onClick={onNext} className="mt-3 w-full px-4 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700">{l.nextQ}</button>
          )}
          {room.phase === "done" && (
            <button onClick={onClose} className="mt-3 w-full px-4 py-2 bg-rose-500 text-white font-bold rounded-lg hover:bg-rose-600">{l.closeRoom}</button>
          )}
        </div>
      )}
    </div>
  );
}

function PlayerView({ room, code, playerId, lang }) {
  const l = T[lang] || T.en;
  const [submitted, setSubmitted] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const currentQ = (room?.questions || [])[room?.currentQ] || null;

  useEffect(() => {
    setSubmitted(false);
    setLastResult(null);
  }, [room?.currentQ]);

  const handleAnswer = async (choiceIdx) => {
    if (submitted || !currentQ) return;
    setSubmitted(true);
    const startedAt = (room?.updatedAt?.toMillis ? room.updatedAt.toMillis() : Date.now());
    const timeMs = Date.now() - startedAt;
    const res = await LiveRoomService.answer({
      code,
      playerId,
      qIdx: room.currentQ,
      choice: choiceIdx,
      correctChoice: currentQ.correct,
      timeMs,
    });
    setLastResult(res);
  };

  const me = room?.players?.[playerId];

  return (
    <div className="space-y-4">
      {me && (
        <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400">{l.you}: {me.name}</div>
          <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">{me.score || 0}</div>
        </div>
      )}

      {room?.phase === "lobby" && (
        <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          {l.waiting}
        </div>
      )}

      {room?.phase === "question" && currentQ && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Q{(room.currentQ || 0) + 1} / {room.questions.length}
          </div>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{currentQ.q}</div>
          {!submitted ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentQ.choices.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAnswer(i)}
                  className={`bg-gradient-to-r ${COLOR_CHOICES[i % COLOR_CHOICES.length]} text-white font-bold p-4 rounded-xl text-left hover:scale-[1.02] active:scale-95 transition-transform`}
                >
                  {c}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-3xl mb-1">{lastResult?.correct ? "✅" : "❌"}</div>
              <div className="font-bold text-slate-800 dark:text-slate-100">
                {l.answered}{lastResult?.points ? ` (+${lastResult.points})` : ""}
              </div>
            </div>
          )}
        </div>
      )}

      {(room?.phase === "results" || room?.phase === "done") && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3">
            {room.phase === "done" ? l.finalResults : l.leaderboard}
          </h3>
          <ol className="space-y-2">
            {Object.entries(room.players || {})
              .map(([id, p]) => ({ id, ...p }))
              .sort((a, b) => (b.score || 0) - (a.score || 0))
              .slice(0, 10)
              .map((p, i) => (
                <li
                  key={p.id}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    p.id === playerId
                      ? "bg-purple-100 dark:bg-purple-900/40"
                      : "bg-slate-50 dark:bg-slate-900/40"
                  }`}
                >
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {i + 1}. {p.name} {p.id === playerId && `(${l.you})`}
                  </span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{p.score || 0}</span>
                </li>
              ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default function LiveClassroomPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext) || {};
  const { code: codeParam } = useParams();
  const navigate = useNavigate();
  const l = T[lang] || T.en;

  const [code, setCode] = useState(codeParam || "");
  const [name, setName] = useState("");
  const [room, setRoom] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [creating, setCreating] = useState(false);
  const [playerId, setPlayerId] = useState(null);

  const isHost = user && room && room.hostUid === user.uid;

  // Subscribe when we have a code
  useEffect(() => {
    if (!code) return;
    const unsub = LiveRoomService.subscribe(code, (r) => {
      if (!r) setLoadError(l.notFound);
      setRoom(r);
    });
    return () => unsub();
  }, [code, l.notFound]);

  const handleCreate = useCallback(async () => {
    if (!user) return;
    setCreating(true);
    const res = await LiveRoomService.create({
      topic: "sample",
      questions: SAMPLE_QUESTIONS,
      hostName: user.displayName || user.email,
    });
    setCreating(false);
    if (res.ok) {
      navigate(`/live/${res.code}`);
    }
  }, [user, navigate]);

  const handleJoin = useCallback(async () => {
    if (!code || !name.trim()) return;
    const res = await LiveRoomService.join(code, name.trim());
    if (res.ok) setPlayerId(res.playerId);
  }, [code, name]);

  return (
    <>
      <Navbar />
      <SEO title={l.title} description={l.subtitle} canonical="/live" />
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">📡</div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{l.subtitle}</p>
          </div>

          {/* No code yet → show create / join */}
          {!code && (
            <>
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5 mb-4">
                <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{l.create}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{l.sampleQuiz}</p>
                {!user && <div className="text-sm text-amber-600 mb-2">{l.needLogin}</div>}
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={!user || creating}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg disabled:opacity-50"
                >
                  {creating ? l.creating : l.create}
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5">
                <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-3">{l.join}</h2>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder={l.enterCode}
                  maxLength={6}
                  className="w-full mb-2 px-3 py-2 font-mono text-lg tracking-widest text-center border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setCode((c) => c.trim().toUpperCase())}
                  disabled={code.length < 4}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-lg disabled:opacity-50"
                >
                  {l.joinBtn}
                </button>
              </div>
            </>
          )}

          {/* Have a code, but not yet joined as player and not host */}
          {code && room && !isHost && !playerId && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5 mb-4">
              <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-3">{l.nickname}</h2>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={l.enterName}
                maxLength={20}
                className="w-full mb-2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900"
              />
              <button
                type="button"
                onClick={handleJoin}
                disabled={!name.trim()}
                className="w-full px-4 py-2 bg-purple-600 text-white font-bold rounded-lg disabled:opacity-50"
              >
                {l.joinBtn}
              </button>
            </div>
          )}

          {/* Host or player view */}
          {room && isHost && (
            <HostView
              room={room}
              code={code}
              lang={lang}
              onNext={() => LiveRoomService.next(code)}
              onReveal={() => LiveRoomService.reveal(code)}
              onClose={() => LiveRoomService.close(code)}
            />
          )}
          {room && !isHost && playerId && (
            <PlayerView room={room} code={code} playerId={playerId} lang={lang} />
          )}

          {loadError && <div className="text-center text-rose-600 mt-4">{loadError}</div>}
        </div>
      </main>
    </>
  );
}
