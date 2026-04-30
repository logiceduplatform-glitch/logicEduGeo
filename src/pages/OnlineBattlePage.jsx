import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { OnlineBattleService } from "../services/OnlineBattleService";
import { GuildService } from "../services/GuildService";

const T = {
  el: {
    title: "⚔️ Online Quiz Battle",
    subtitle: "Παίξε ζωντανά εναντίον φίλου ή τυχαίου παίκτη!",
    yourName: "Όνομα",
    namePh: "π.χ. Μαρία",
    create: "🎮 Δημιουργία Αγώνα",
    join: "👥 Συμμετοχή",
    quickMatch: "⚡ Γρήγορος αγώνας (matchmaking)",
    code: "Κωδικός (5 χαρακτήρες)",
    start: "▶ Έναρξη",
    waiting: "Αναμονή αντίπαλου...",
    shareCode: "Μοιράσου τον κωδικό:",
    copy: "Αντιγραφή",
    copied: "Αντιγράφηκε!",
    round: "Γύρος",
    of: "από",
    you: "Εσύ",
    opponent: "Αντίπαλος",
    answered: "Απάντησες ✓",
    waitOpp: "Αναμονή αντιπάλου...",
    nextRound: "Επόμενος γύρος",
    finalResult: "Τελικό Αποτέλεσμα",
    youWon: "🏆 Νίκησες!",
    youLost: "Χάμπος... ξανά;",
    draw: "🤝 Ισοπαλία!",
    playAgain: "Νέος αγώνας",
    leave: "← Έξοδος",
    needAuth: "Πρέπει να συνδεθείς για online battles.",
    badCode: "Λάθος κωδικός ή γεμάτο δωμάτιο.",
    score: "Σκορ",
    correct: "✓ Σωστή",
    wrong: "✗ Λάθος",
  },
  en: {
    title: "⚔️ Online Quiz Battle",
    subtitle: "Play live vs a friend or a random opponent!",
    yourName: "Name",
    namePh: "e.g. Maria",
    create: "🎮 Create battle",
    join: "👥 Join battle",
    quickMatch: "⚡ Quick match (matchmaking)",
    code: "Code (5 chars)",
    start: "▶ Start",
    waiting: "Waiting for opponent...",
    shareCode: "Share this code:",
    copy: "Copy",
    copied: "Copied!",
    round: "Round",
    of: "of",
    you: "You",
    opponent: "Opponent",
    answered: "Answered ✓",
    waitOpp: "Waiting for opponent...",
    nextRound: "Next round",
    finalResult: "Final Result",
    youWon: "🏆 You won!",
    youLost: "You lost. Again?",
    draw: "🤝 Draw!",
    playAgain: "New battle",
    leave: "← Leave",
    needAuth: "Sign in to play online battles.",
    badCode: "Wrong code or room is full.",
    score: "Score",
    correct: "✓ Correct",
    wrong: "✗ Wrong",
  },
};

const AVATARS = ["🦊", "🐯", "🐻", "🐼", "🐰", "🦁", "🐶", "🐱", "🐸", "🦉", "🐧", "🦄"];

export default function OnlineBattlePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext) || {};
  const l = T[lang] || T.en;
  const navigate = useNavigate();
  const { code: urlCode } = useParams();

  const [name, setName] = useState(user?.displayName || "");
  const [avatar, setAvatar] = useState(AVATARS[Math.floor(Math.random() * AVATARS.length)]);
  const [code, setCode] = useState(urlCode || "");
  const [battle, setBattle] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const unsubRef = useRef(null);

  // Auto-join from URL
  useEffect(() => {
    if (urlCode && user?.uid && !battle) {
      handleJoin(urlCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCode, user?.uid]);

  // Subscribe when in a battle
  useEffect(() => {
    if (!code || !battle) return;
    if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }
    unsubRef.current = OnlineBattleService.subscribe(code, (data) => {
      if (!data) return;
      setBattle(data);
    });
    return () => { if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; } };
  }, [code, !!battle]);

  const myUid = user?.uid;
  const isPlayer1 = battle?.player1?.uid === myUid;
  const isPlayer2 = battle?.player2?.uid === myUid;
  const me = isPlayer1 ? battle?.player1 : battle?.player2;
  const opp = isPlayer1 ? battle?.player2 : battle?.player1;

  const handleCreate = async () => {
    if (!user?.uid) { setError(l.needAuth); return; }
    setBusy(true); setError("");
    try {
      const c = await OnlineBattleService.createBattle({ uid: user.uid, name: name || user.displayName || "Player", avatar });
      setCode(c);
      const ref = await new Promise((res) => OnlineBattleService.subscribe(c, (d) => { if (d) res(d); }));
      setBattle(ref);
    } catch (e) { setError(e.message || "error"); }
    setBusy(false);
  };

  const handleJoin = async (joinCode) => {
    if (!user?.uid) { setError(l.needAuth); return; }
    const c = (joinCode || code || "").trim().toUpperCase();
    if (!c) return;
    setBusy(true); setError("");
    try {
      await OnlineBattleService.joinBattle({ code: c, uid: user.uid, name: name || user.displayName || "Player", avatar });
      setCode(c);
      const ref = await new Promise((res) => OnlineBattleService.subscribe(c, (d) => { if (d) res(d); }));
      setBattle(ref);
    } catch (e) {
      setError(l.badCode);
    }
    setBusy(false);
  };

  const handleQuickMatch = async () => {
    if (!user?.uid) { setError(l.needAuth); return; }
    setBusy(true); setError("");
    try {
      const c = await OnlineBattleService.findOrCreate({ uid: user.uid, name: name || user.displayName || "Player", avatar });
      setCode(c);
      const ref = await new Promise((res) => OnlineBattleService.subscribe(c, (d) => { if (d) res(d); }));
      setBattle(ref);
    } catch (e) { setError(e.message || "error"); }
    setBusy(false);
  };

  const handleStart = async () => {
    if (!code) return;
    await OnlineBattleService.start(code);
  };

  const handleAnswer = async (idx) => {
    if (!battle || !code || !myUid) return;
    const round = battle.currentRound;
    const key = `round_${round}_${myUid}`;
    if (battle.answers?.[key]) return;
    await OnlineBattleService.submitAnswer({ code, uid: myUid, round, optionIdx: idx });

    // Auto-advance when both players answered
    setTimeout(async () => {
      const fresh = await new Promise((res) => {
        const u = OnlineBattleService.subscribe(code, (d) => { res(d); u(); });
      });
      if (!fresh) return;
      const r = fresh.currentRound;
      const a1 = fresh.answers?.[`round_${r}_${fresh.player1?.uid}`];
      const a2 = fresh.answers?.[`round_${r}_${fresh.player2?.uid}`];
      if (a1 && a2 && fresh.player1?.uid === myUid) {
        // Host triggers next round
        setTimeout(() => OnlineBattleService.nextRound(code), 1500);
      }
    }, 100);
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  const handleLeave = async () => {
    if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }
    setBattle(null);
    setCode("");
    setError("");
    if (urlCode) navigate("/online-battle");
  };

  const round = battle?.currentRound || 0;
  const currentQ = battle?.questions?.[round - 1];

  // When battle finishes, contribute score to user's guilds (best-effort)
  const reportedRef = useRef(false);
  useEffect(() => {
    if (!battle || battle.status !== "done" || !user?.uid || reportedRef.current) return;
    const myScore = me?.score || 0;
    if (myScore <= 0) return;
    reportedRef.current = true;
    (async () => {
      try {
        const myGuilds = await GuildService.getMyGuilds(user.uid);
        for (const g of myGuilds) {
          await GuildService.addScore({ guildId: g.id, uid: user.uid, score: myScore, games: 1 });
        }
      } catch {}
    })();
  }, [battle, user?.uid, me?.score]);

  // ── UI states ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />

      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-2xl">
          {/* Lobby (no battle) */}
          {!battle && (
            <div className="space-y-5">
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-2">{l.title}</h1>
                <p className="text-slate-500 dark:text-slate-400">{l.subtitle}</p>
              </div>

              {!user?.uid && (
                <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4 text-rose-700 dark:text-rose-300 text-sm font-semibold">
                  {l.needAuth}
                </div>
              )}

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{l.yourName}</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={l.namePh}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Avatar</label>
                  <div className="flex flex-wrap gap-1">
                    {AVATARS.map((a) => (
                      <button key={a} onClick={() => setAvatar(a)} className={`w-10 h-10 rounded-lg text-2xl transition ${avatar === a ? "bg-rose-100 dark:bg-rose-900/40 ring-2 ring-rose-400" : "bg-slate-100 dark:bg-slate-700"}`}>{a}</button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleQuickMatch}
                disabled={busy || !user?.uid}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white font-extrabold shadow-lg disabled:opacity-50"
              >
                {l.quickMatch}
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleCreate}
                  disabled={busy || !user?.uid}
                  className="py-3 rounded-2xl bg-violet-500 text-white font-bold shadow-md disabled:opacity-50"
                >
                  {l.create}
                </button>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-100 dark:border-slate-700 flex gap-2">
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder={l.code}
                    maxLength={5}
                    className="flex-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-center font-mono uppercase outline-none"
                  />
                  <button onClick={() => handleJoin()} disabled={busy || !code || !user?.uid} className="px-4 py-1.5 rounded-lg bg-emerald-500 text-white font-bold disabled:opacity-50">
                    {l.join}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-rose-600 text-center font-bold">{error}</p>}
            </div>
          )}

          {/* Waiting room */}
          {battle && battle.status === "waiting" && (
            <div className="space-y-5">
              <button onClick={handleLeave} className="text-sm text-slate-500 hover:underline">{l.leave}</button>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 text-center space-y-4">
                <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">{l.waiting}</h2>
                <p className="text-sm text-slate-500">{l.shareCode}</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-3xl font-mono font-extrabold tracking-widest bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-xl">{code}</code>
                  <button onClick={handleCopy} className="px-3 py-2 rounded-lg bg-violet-500 text-white text-sm font-bold">
                    {copied ? l.copied : l.copy}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <PlayerCard player={battle.player1} fallback={lang === "el" ? "Παίκτης 1" : "Player 1"} />
                  <PlayerCard player={battle.player2} fallback={lang === "el" ? "Αναμονή..." : "Waiting..."} dim={!battle.player2} />
                </div>

                {isPlayer1 && battle.player2 && (
                  <button onClick={handleStart} className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold shadow-md">
                    {l.start}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Playing */}
          {battle && battle.status === "playing" && currentQ && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-600 dark:text-slate-300">
                <span>{l.round} {round} {l.of} {battle.totalRounds}</span>
                <button onClick={handleLeave} className="text-rose-500 hover:underline">{l.leave}</button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <PlayerCard player={me} fallback={l.you} you />
                <PlayerCard player={opp} fallback={l.opponent} />
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700">
                <p className="text-xl font-bold text-slate-800 dark:text-white mb-4 text-center">
                  {currentQ.q[lang] || currentQ.q.en}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.options.map((opt, idx) => {
                    const myAns = battle.answers?.[`round_${round}_${myUid}`];
                    const answered = !!myAns;
                    const myCorrect = answered && myAns.optionIdx === currentQ.answer;
                    const isMyChoice = answered && myAns.optionIdx === idx;
                    const isCorrect = idx === currentQ.answer;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={answered}
                        className={`px-4 py-3 rounded-xl font-bold transition shadow-sm border-2 ${
                          answered
                            ? isCorrect
                              ? "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-400 text-emerald-700"
                              : isMyChoice
                                ? "bg-rose-100 dark:bg-rose-900/30 border-rose-400 text-rose-700"
                                : "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500"
                            : "bg-white dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        <span className="font-mono mr-2">{String.fromCharCode(65 + idx)}.</span>
                        {opt[lang] || opt.en}
                      </button>
                    );
                  })}
                </div>

                {battle.answers?.[`round_${round}_${myUid}`] && (
                  <p className="text-center text-sm font-semibold text-slate-500 mt-3">
                    {battle.answers?.[`round_${round}_${opp?.uid}`] ? l.nextRound : l.waitOpp}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Done */}
          {battle && battle.status === "done" && (
            <div className="space-y-4 text-center">
              <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">{l.finalResult}</h2>
              {(() => {
                const myScore = me?.score || 0;
                const oppScore = opp?.score || 0;
                if (myScore > oppScore) return <p className="text-2xl font-bold text-emerald-600">{l.youWon}</p>;
                if (myScore < oppScore) return <p className="text-2xl font-bold text-rose-500">{l.youLost}</p>;
                return <p className="text-2xl font-bold text-amber-500">{l.draw}</p>;
              })()}
              <div className="grid grid-cols-2 gap-3">
                <PlayerCard player={me} fallback={l.you} you bigScore />
                <PlayerCard player={opp} fallback={l.opponent} bigScore />
              </div>
              <button onClick={handleLeave} className="w-full py-3 rounded-xl bg-violet-500 text-white font-bold shadow">
                {l.playAgain}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlayerCard({ player, fallback, you, dim, bigScore }) {
  return (
    <div className={`rounded-2xl p-3 border-2 ${dim ? "border-dashed border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40" : "border-violet-200 dark:border-violet-800 bg-white dark:bg-slate-800"}`}>
      <div className="flex items-center gap-2">
        <span className="text-3xl">{player?.avatar || "🎮"}</span>
        <div className="min-w-0">
          <p className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm">
            {you && "★ "}{player?.name || fallback}
          </p>
          {!dim && <p className={bigScore ? "text-3xl font-extrabold text-violet-600" : "text-xs text-slate-500"}>{player?.score ?? 0} pts</p>}
        </div>
      </div>
    </div>
  );
}
