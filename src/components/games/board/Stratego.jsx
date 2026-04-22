import React, { useState, useCallback, useEffect, useRef } from "react";
import BoardHeader from "./shared/BoardHeader";
import GameOverModal from "./shared/GameOverModal";

const RANKS = [
  { rank: "F", name: { en: "Flag", el: "Σημαία" }, icon: "🚩", power: 0, count: 1 },
  { rank: "B", name: { en: "Bomb", el: "Βόμβα" }, icon: "💣", power: 11, count: 2 },
  { rank: "S", name: { en: "Spy", el: "Κατάσκοπος" }, icon: "🕵️", power: 1, count: 1 },
  { rank: "2", name: { en: "Scout", el: "Ανιχνευτής" }, icon: "🏃", power: 2, count: 2 },
  { rank: "3", name: { en: "Miner", el: "Ναρκαλιευτής" }, icon: "⛏️", power: 3, count: 2 },
  { rank: "4", name: { en: "Sergeant", el: "Λοχίας" }, icon: "🎖️", power: 4, count: 2 },
  { rank: "5", name: { en: "Captain", el: "Λοχαγός" }, icon: "⭐", power: 5, count: 2 },
  { rank: "6", name: { en: "Major", el: "Ταγμ/ρχης" }, icon: "🌟", power: 6, count: 1 },
  { rank: "7", name: { en: "Colonel", el: "Συντ/ρχης" }, icon: "💫", power: 7, count: 1 },
  { rank: "8", name: { en: "General", el: "Στρατηγός" }, icon: "👑", power: 8, count: 1 },
  { rank: "10", name: { en: "Marshal", el: "Αρχιστράτηγος" }, icon: "🏅", power: 10, count: 1 },
];

const COLS = 6;
const ROWS = 6;
const WATER = [[2,2],[2,3],[3,2],[3,3]];

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isWater(r, c) {
  return WATER.some(([wr, wc]) => wr === r && wc === c);
}

function createArmy(player) {
  const pieces = [];
  for (const rank of RANKS) {
    for (let i = 0; i < rank.count; i++) {
      pieces.push({ ...rank, player, revealed: false, id: `${player}-${rank.rank}-${i}` });
    }
  }
  return shuffled(pieces);
}

function initBoard() {
  const board = Array.from({ length: ROWS }, () => new Array(COLS).fill(null));
  const p1 = createArmy(1);
  const p2 = createArmy(2);
  let idx1 = 0, idx2 = 0;

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!isWater(r, c) && idx2 < p2.length) board[r][c] = p2[idx2++];
    }
  }
  for (let r = ROWS - 2; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!isWater(r, c) && idx1 < p1.length) board[r][c] = p1[idx1++];
    }
  }
  return board;
}

function resolveBattle(attacker, defender) {
  if (defender.rank === "F") return "flag_captured";
  if (defender.rank === "B") {
    return attacker.rank === "3" ? "attacker_wins" : "attacker_loses";
  }
  if (attacker.rank === "S" && defender.rank === "10") return "attacker_wins";
  if (attacker.power > defender.power) return "attacker_wins";
  if (attacker.power < defender.power) return "attacker_loses";
  return "both_die";
}

export default function Stratego({ mode, difficulty, onPlayAgain, onChangeGame, lang }) {
  const isEl = lang === "el";
  const playerNames = { 1: isEl ? "Εσύ (🔵)" : "You (🔵)", 2: "AI (🔴)" };

  const [board, setBoard] = useState(initBoard);
  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [turn, setTurn] = useState(1);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState("");
  const [aiThinking, setAiThinking] = useState(false);
  const [battleLog, setBattleLog] = useState([]);
  const boardRef = useRef(board);
  boardRef.current = board;

  const gameOver = winner !== null;

  const getMoves = useCallback((r, c, b) => {
    const piece = b[r][c];
    if (!piece || piece.rank === "F" || piece.rank === "B") return [];
    const moves = [];
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
      if (isWater(nr, nc)) continue;
      const target = b[nr][nc];
      if (target && target.player === piece.player) continue;
      moves.push([nr, nc]);
    }
    return moves;
  }, []);

  const handleClick = useCallback((r, c) => {
    if (gameOver || aiThinking || turn !== 1) return;
    const cell = board[r][c];

    if (selected) {
      const move = validMoves.find(([mr, mc]) => mr === r && mc === c);
      if (move) {
        const nb = board.map(row => [...row]);
        const piece = nb[selected[0]][selected[1]];
        const target = nb[r][c];

        if (target) {
          const result = resolveBattle(piece, target);
          piece.revealed = true;
          target.revealed = true;

          if (result === "flag_captured") {
            nb[selected[0]][selected[1]] = null;
            nb[r][c] = piece;
            setBoard(nb);
            setWinner(1);
            setBattleLog(prev => [...prev, `${isEl ? "Σημαία κατελήφθη!" : "Flag captured!"}`]);
            setSelected(null);
            setValidMoves([]);
            return;
          } else if (result === "attacker_wins") {
            nb[selected[0]][selected[1]] = null;
            nb[r][c] = piece;
            setBattleLog(prev => [...prev, `${piece.icon} > ${target.icon}`]);
          } else if (result === "attacker_loses") {
            nb[selected[0]][selected[1]] = null;
            setBattleLog(prev => [...prev, `${piece.icon} < ${target.icon}`]);
          } else {
            nb[selected[0]][selected[1]] = null;
            nb[r][c] = null;
            setBattleLog(prev => [...prev, `${piece.icon} = ${target.icon}`]);
          }
        } else {
          nb[selected[0]][selected[1]] = null;
          nb[r][c] = piece;
        }

        setBoard(nb);
        boardRef.current = nb;
        setSelected(null);
        setValidMoves([]);
        setMessage("");
        setTurn(2);
        return;
      }
    }

    if (cell && cell.player === 1) {
      const moves = getMoves(r, c, board);
      if (moves.length > 0) {
        setSelected([r, c]);
        setValidMoves(moves);
      } else {
        setMessage(isEl ? "Αυτό δεν κινείται!" : "Can't move this piece!");
      }
    } else {
      setSelected(null);
      setValidMoves([]);
    }
  }, [gameOver, aiThinking, turn, board, selected, validMoves, getMoves, isEl]);

  useEffect(() => {
    if (gameOver || turn !== 2 || aiThinking) return;
    setAiThinking(true);
    const timer = setTimeout(() => {
      const b = boardRef.current;
      const aiMoves = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (b[r][c]?.player === 2) {
            for (const [nr, nc] of getMoves(r, c, b)) {
              aiMoves.push({ from: [r,c], to: [nr,nc] });
            }
          }
        }
      }
      if (aiMoves.length === 0) { setWinner(1); setAiThinking(false); return; }

      const move = aiMoves[Math.floor(Math.random() * aiMoves.length)];
      const nb = b.map(row => [...row]);
      const piece = nb[move.from[0]][move.from[1]];
      const target = nb[move.to[0]][move.to[1]];

      if (target) {
        const result = resolveBattle(piece, target);
        piece.revealed = true;
        target.revealed = true;
        if (result === "flag_captured") {
          nb[move.from[0]][move.from[1]] = null;
          nb[move.to[0]][move.to[1]] = piece;
          setBoard(nb); boardRef.current = nb;
          setWinner(2);
          setBattleLog(prev => [...prev, `AI ${isEl ? "κατέλαβε τη σημαία!" : "captured the flag!"}`]);
          setAiThinking(false);
          return;
        } else if (result === "attacker_wins") {
          nb[move.from[0]][move.from[1]] = null;
          nb[move.to[0]][move.to[1]] = piece;
        } else if (result === "attacker_loses") {
          nb[move.from[0]][move.from[1]] = null;
        } else {
          nb[move.from[0]][move.from[1]] = null;
          nb[move.to[0]][move.to[1]] = null;
        }
      } else {
        nb[move.from[0]][move.from[1]] = null;
        nb[move.to[0]][move.to[1]] = piece;
      }

      setBoard(nb);
      boardRef.current = nb;
      setTurn(1);
      setAiThinking(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [turn, gameOver, aiThinking, getMoves, isEl]);

  const reset = useCallback(() => {
    const b = initBoard();
    setBoard(b); boardRef.current = b;
    setSelected(null); setValidMoves([]); setTurn(1);
    setWinner(null); setMessage(""); setAiThinking(false); setBattleLog([]);
    onPlayAgain?.();
  }, [onPlayAgain]);

  const isValidTarget = (r, c) => validMoves.some(([mr, mc]) => mr === r && mc === c);
  const isSel = (r, c) => selected && selected[0] === r && selected[1] === c;

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 w-full">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-2xl shadow-black/30">
        <BoardHeader title="Stratego" turn={gameOver ? null : turn} playerNames={playerNames}
          status={aiThinking ? (isEl ? "AI σκέφτεται..." : "AI thinking...") : null} />

        <div className="p-4 sm:p-6">
          <div className="grid gap-2 rounded-2xl overflow-hidden" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
            {Array.from({ length: ROWS * COLS }, (_, i) => {
              const r = Math.floor(i / COLS), c = i % COLS;
              const cell = board[r][c];
              const water = isWater(r, c);
              return (
                <button key={i} onClick={() => handleClick(r, c)}
                  className={[
                    "aspect-square flex items-center justify-center text-xl sm:text-2xl relative transition-all border-2 border-white/10 min-h-[48px]",
                    water ? "bg-gradient-to-br from-blue-600 to-blue-800 border-blue-500/50 cursor-not-allowed shadow-xl"
                      : isSel(r,c) ? "bg-white/25 backdrop-blur-sm ring-[3px] ring-amber-400 border-amber-400/60 shadow-xl"
                      : isValidTarget(r,c) ? "bg-white/10 backdrop-blur-sm border-violet-400/50 hover:bg-white/15 shadow-xl"
                      : cell?.player === 1 ? "bg-gradient-to-br from-blue-500/40 to-blue-700/50 backdrop-blur-sm border-blue-400/40 hover:bg-blue-500/50 shadow-xl"
                      : cell?.player === 2 ? "bg-gradient-to-br from-rose-500/40 to-rose-700/50 backdrop-blur-sm border-rose-400/40 shadow-xl"
                      : "bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10",
                  ].join(" ")}
                  disabled={water}
                >
                  {water && <span className="text-blue-200/90 text-2xl sm:text-3xl drop-shadow-md">🌊</span>}
                  {cell && !water && (
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-xl sm:text-2xl drop-shadow-lg">{cell.player === 1 || cell.revealed ? cell.icon : "❓"}</span>
                      {cell.player === 1 && <span className="text-[10px] sm:text-xs font-bold text-blue-300">{cell.rank}</span>}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {(message || battleLog.length > 0) && (
          <div className="px-4 pb-3 space-y-2">
            {message && <p className="text-center text-sm text-slate-400">{message}</p>}
            {battleLog.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center">
                {battleLog.slice(-5).map((l, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/10 backdrop-blur-sm border border-white/10 text-slate-300 transition-all">{l}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {gameOver && <GameOverModal winner={winner} playerNames={playerNames}
        stats={{ [isEl ? "Μάχες" : "Battles"]: battleLog.length }}
        onPlayAgain={reset} onChangeGame={onChangeGame} />}
    </div>
  );
}
