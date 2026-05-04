import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";
import { AuthContext } from "../../auth/AuthContext";
import { db, auth } from "../../auth/firebase";
import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const T = {
  el: {
    title: "Τρίλιζα Online",
    desc: "Παίξε με φίλο online! Μοιράσου το URL.",
    create: "Νέο παιχνίδι",
    creating: "Δημιουργία...",
    join: "Συμμετοχή σε παιχνίδι",
    enterCode: "Κωδικός",
    joinBtn: "Είσοδος",
    waiting: "Περιμένουμε αντίπαλο...",
    yourTurn: "Η σειρά σου ({mark})",
    theirTurn: "Σειρά αντιπάλου ({mark})",
    you: "Εσύ",
    opponent: "Αντίπαλος",
    won: "🏆 Νίκησες!",
    lost: "😔 Έχασες",
    tied: "🤝 Ισοπαλία",
    rematch: "Ρεβάνς",
    leave: "Έξοδος",
    needLogin: "Συνδέσου για να παίξεις online.",
    share: "Αντιγραφή URL",
    copied: "Αντιγράφηκε!",
    notFound: "Το παιχνίδι δεν βρέθηκε.",
  },
  en: {
    title: "Online Tic-Tac-Toe",
    desc: "Play with a friend online! Share the URL.",
    create: "New game",
    creating: "Creating...",
    join: "Join a game",
    enterCode: "Code",
    joinBtn: "Join",
    waiting: "Waiting for opponent...",
    yourTurn: "Your turn ({mark})",
    theirTurn: "Opponent's turn ({mark})",
    you: "You",
    opponent: "Opponent",
    won: "🏆 You won!",
    lost: "😔 You lost",
    tied: "🤝 Tied",
    rematch: "Rematch",
    leave: "Leave",
    needLogin: "Sign in to play online.",
    share: "Copy URL",
    copied: "Copied!",
    notFound: "Game not found.",
  },
};

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function genCode() {
  return Array.from({ length: 6 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
}

const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return { winner: board[a], line };
  }
  if (board.every((c) => c)) return { winner: "draw", line: null };
  return null;
}

function Cell({ value, onClick, highlighted, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !!value}
      className={`aspect-square rounded-xl text-5xl sm:text-6xl font-extrabold border-2 flex items-center justify-center transition-all ${
        highlighted
          ? "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400"
          : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700"
      } ${value === "X" ? "text-blue-600" : value === "O" ? "text-rose-500" : ""} ${
        disabled || value ? "cursor-not-allowed" : "hover:bg-slate-100 dark:hover:bg-slate-700/50"
      }`}
    >
      {value}
    </button>
  );
}

export default function TicTacToeOnlinePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext) || {};
  const { code: codeParam } = useParams();
  const navigate = useNavigate();
  const l = T[lang] || T.en;

  const [code, setCode] = useState(codeParam || "");
  const [joinCode, setJoinCode] = useState("");
  const [game, setGame] = useState(null);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Subscribe
  useEffect(() => {
    if (!code || !db) return;
    const ref = doc(db, "ticTacToe", String(code).toUpperCase());
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setError(l.notFound);
          setGame(null);
        } else {
          setGame({ id: snap.id, ...snap.data() });
          setError("");
        }
      },
      () => setError(l.notFound),
    );
    return () => unsub();
  }, [code, l.notFound]);

  // Auto-join if we land on a code with no slot taken yet.
  useEffect(() => {
    if (!game || !user) return;
    if (game.xUid === user.uid || game.oUid === user.uid) return;
    if (!game.oUid) {
      updateDoc(doc(db, "ticTacToe", game.id), {
        oUid: user.uid,
        oName: user.displayName || user.email?.split("@")[0] || "O",
        updatedAt: serverTimestamp(),
      }).catch(() => {});
    }
  }, [game, user]);

  const handleCreate = useCallback(async () => {
    if (!user) return;
    setCreating(true);
    const newCode = genCode();
    try {
      await setDoc(doc(db, "ticTacToe", newCode), {
        code: newCode,
        xUid: user.uid,
        xName: user.displayName || user.email?.split("@")[0] || "X",
        oUid: null,
        oName: null,
        board: Array(9).fill(""),
        turn: "X",
        winner: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      navigate(`/games/tic-tac-toe/${newCode}`);
    } catch (e) {
      console.warn("ttt create failed", e);
      setError("create_failed");
    } finally {
      setCreating(false);
    }
  }, [user, navigate]);

  const myMark = game?.xUid === user?.uid ? "X" : game?.oUid === user?.uid ? "O" : null;
  const result = game ? checkWinner(game.board) : null;
  const oppName = myMark === "X" ? game?.oName : game?.xName;

  const handleClick = useCallback(async (i) => {
    if (!game || !myMark) return;
    if (game.winner || game.turn !== myMark) return;
    if (game.board[i]) return;
    const newBoard = [...game.board];
    newBoard[i] = myMark;
    const r = checkWinner(newBoard);
    try {
      await updateDoc(doc(db, "ticTacToe", game.id), {
        board: newBoard,
        turn: myMark === "X" ? "O" : "X",
        winner: r ? r.winner : null,
        updatedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn("ttt move failed", e);
    }
  }, [game, myMark]);

  const handleRematch = useCallback(async () => {
    if (!game) return;
    try {
      await updateDoc(doc(db, "ticTacToe", game.id), {
        board: Array(9).fill(""),
        turn: "X",
        winner: null,
        updatedAt: serverTimestamp(),
      });
    } catch (e) { /* */ }
  }, [game]);

  const handleCopy = () => {
    const url = `${window.location.origin}/games/tic-tac-toe/${code}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <GameShell title={l.title} description={l.desc} emoji="❌⭕" canonical="/games/tic-tac-toe">
      {/* Lobby */}
      {!code && (
        <div className="space-y-4">
          {!user && <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-sm text-amber-800 dark:text-amber-200">{l.needLogin}</div>}
          <button
            type="button"
            onClick={handleCreate}
            disabled={!user || creating}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl disabled:opacity-50"
          >
            {creating ? l.creating : `🎲 ${l.create}`}
          </button>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{l.join}</div>
            <div className="flex gap-2">
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder={l.enterCode}
                maxLength={6}
                className="flex-1 px-3 py-2 font-mono tracking-widest text-center border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900"
              />
              <button
                type="button"
                onClick={() => setCode(joinCode)}
                disabled={joinCode.length < 4}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg disabled:opacity-50"
              >
                {l.joinBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-game */}
      {code && game && (
        <div>
          <div className="text-center mb-3">
            <div className="text-xs uppercase text-slate-500 dark:text-slate-400">CODE</div>
            <div className="font-mono text-2xl font-bold text-purple-600 dark:text-purple-400 tracking-widest">{code}</div>
            <button onClick={handleCopy} className="text-xs px-2 py-1 mt-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600">
              {copied ? l.copied : l.share}
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="text-sm">
              <div className="text-blue-600 font-bold">X · {game.xName || "—"}</div>
              <div className="text-rose-500 font-bold">O · {game.oName || "—"}</div>
            </div>
            <div className="text-right">
              {result?.winner === "draw" && <div className="font-bold text-slate-700 dark:text-slate-200">{l.tied}</div>}
              {result?.winner && result.winner !== "draw" && (
                <div className="font-bold">
                  {result.winner === myMark ? l.won : l.lost}
                </div>
              )}
              {!result && myMark && (
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {(game.turn === myMark ? l.yourTurn : l.theirTurn).replace("{mark}", game.turn)}
                </div>
              )}
              {!myMark && !game.oUid && <div className="text-sm text-slate-500">{l.waiting}</div>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 max-w-[360px] mx-auto">
            {game.board.map((v, i) => (
              <Cell
                key={i}
                value={v}
                onClick={() => handleClick(i)}
                highlighted={result?.line?.includes(i)}
                disabled={!myMark || !!result || game.turn !== myMark}
              />
            ))}
          </div>

          {result && (
            <div className="mt-4 flex gap-2 justify-center">
              <button onClick={handleRematch} className="px-4 py-2 bg-purple-600 text-white font-bold rounded-lg">{l.rematch}</button>
              <Link to="/games/tic-tac-toe" className="px-4 py-2 bg-slate-300 dark:bg-slate-600 font-bold rounded-lg">{l.leave}</Link>
            </div>
          )}
        </div>
      )}

      {error && <div className="mt-3 text-center text-rose-600">{error}</div>}
    </GameShell>
  );
}
