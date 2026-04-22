import React, { useState, useCallback, useRef, useEffect } from "react";
import BoardHeader from "./shared/BoardHeader";
import GameOverModal from "./shared/GameOverModal";

const SIZE = 8;
const EMPTY = 0, R = 1, RK = 3, B = 2, BK = 4;

function init() {
  const b = Array.from({ length: SIZE }, () => new Array(SIZE).fill(EMPTY));
  for (let r = 0; r < 3; r++) for (let c = 0; c < SIZE; c++) if ((r + c) % 2 === 1) b[r][c] = B;
  for (let r = 5; r < 8; r++) for (let c = 0; c < SIZE; c++) if ((r + c) % 2 === 1) b[r][c] = R;
  return b;
}
function clone(b) { return b.map(r => [...r]); }
function isRed(p) { return p === R || p === RK; }
function isBlack(p) { return p === B || p === BK; }
function isKing(p) { return p === RK || p === BK; }
function own(p, player) { return player === 1 ? isRed(p) : isBlack(p); }
function enemy(p, player) { return player === 1 ? isBlack(p) : isRed(p); }

function getCaptures(board, r, c, player) {
  const piece = board[r][c];
  if (!own(piece, player)) return [];
  const dirs = isKing(piece) ? [[-1,-1],[-1,1],[1,-1],[1,1]] : player === 1 ? [[-1,-1],[-1,1]] : [[1,-1],[1,1]];
  const jumps = [];
  for (const [dr, dc] of dirs) {
    const mr = r + dr, mc = c + dc, lr = r + 2*dr, lc = c + 2*dc;
    if (lr >= 0 && lr < SIZE && lc >= 0 && lc < SIZE && enemy(board[mr][mc], player) && board[lr][lc] === EMPTY) {
      jumps.push({ from: [r,c], to: [lr,lc], captured: [mr,mc] });
    }
  }
  return jumps;
}

function getMoves(board, r, c, player) {
  const piece = board[r][c];
  if (!own(piece, player)) return [];
  const dirs = isKing(piece) ? [[-1,-1],[-1,1],[1,-1],[1,1]] : player === 1 ? [[-1,-1],[-1,1]] : [[1,-1],[1,1]];
  const moves = [];
  for (const [dr, dc] of dirs) {
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === EMPTY) {
      moves.push({ from: [r,c], to: [nr,nc] });
    }
  }
  return moves;
}

function getAllCaptures(board, player) {
  const caps = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) caps.push(...getCaptures(board, r, c, player));
  return caps;
}

function getAllMoves(board, player) {
  const caps = getAllCaptures(board, player);
  if (caps.length > 0) return caps;
  const moves = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) moves.push(...getMoves(board, r, c, player));
  return moves;
}

function applyMove(board, move) {
  const nb = clone(board);
  const piece = nb[move.from[0]][move.from[1]];
  nb[move.from[0]][move.from[1]] = EMPTY;
  let placed = piece;
  if (isRed(piece) && move.to[0] === 0) placed = RK;
  if (isBlack(piece) && move.to[0] === 7) placed = BK;
  nb[move.to[0]][move.to[1]] = placed;
  if (move.captured) nb[move.captured[0]][move.captured[1]] = EMPTY;
  return nb;
}

function aiPickMove(board, player) {
  const moves = getAllMoves(board, player);
  if (moves.length === 0) return null;
  const caps = moves.filter(m => m.captured);
  if (caps.length > 0) return caps[Math.floor(Math.random() * caps.length)];
  return moves[Math.floor(Math.random() * moves.length)];
}

export default function Checkers({ mode, difficulty, onPlayAgain, onChangeGame, lang }) {
  const isEl = lang === "el";
  const playerNames = mode === "ai"
    ? { 1: isEl ? "Εσύ (🔴)" : "You (🔴)", 2: "AI (⚫)" }
    : { 1: isEl ? "Κόκκινος" : "Red", 2: isEl ? "Μαύρος" : "Black" };

  const [board, setBoard] = useState(init);
  const [turn, setTurn] = useState(1);
  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [winner, setWinner] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [scores, setScores] = useState({ 1: 12, 2: 12 });
  const boardRef = useRef(board);
  boardRef.current = board;

  const gameOver = winner !== null;

  const checkWinner = useCallback((b, nextTurn) => {
    const red = [], black = [];
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
      if (isRed(b[r][c])) red.push(1);
      if (isBlack(b[r][c])) black.push(1);
    }
    setScores({ 1: red.length, 2: black.length });
    if (red.length === 0) return 2;
    if (black.length === 0) return 1;
    if (getAllMoves(b, nextTurn).length === 0) return nextTurn === 1 ? 2 : 1;
    return null;
  }, []);

  const executeMove = useCallback((move, player) => {
    const nb = applyMove(boardRef.current, move);
    setBoard(nb);
    boardRef.current = nb;
    setSelected(null);
    setValidMoves([]);

    if (move.captured) {
      const moreCaps = getCaptures(nb, move.to[0], move.to[1], player);
      if (moreCaps.length > 0) {
        setSelected(move.to);
        setValidMoves(moreCaps);
        return;
      }
    }

    const nextTurn = player === 1 ? 2 : 1;
    const w = checkWinner(nb, nextTurn);
    if (w) setWinner(w);
    else setTurn(nextTurn);
  }, [checkWinner]);

  const handleCellClick = useCallback((r, c) => {
    if (gameOver || aiThinking) return;
    if (mode === "ai" && turn !== 1) return;

    const piece = boardRef.current[r][c];

    if (selected) {
      const move = validMoves.find(m => m.to[0] === r && m.to[1] === c);
      if (move) { executeMove(move, turn); return; }
    }

    if (own(piece, turn)) {
      const allCaps = getAllCaptures(boardRef.current, turn);
      if (allCaps.length > 0) {
        const pieceCaps = allCaps.filter(m => m.from[0] === r && m.from[1] === c);
        if (pieceCaps.length > 0) { setSelected([r,c]); setValidMoves(pieceCaps); }
      } else {
        const moves = getMoves(boardRef.current, r, c, turn);
        if (moves.length > 0) { setSelected([r,c]); setValidMoves(moves); }
      }
    }
  }, [gameOver, aiThinking, mode, turn, selected, validMoves, executeMove]);

  useEffect(() => {
    if (gameOver || mode !== "ai" || turn !== 2 || aiThinking) return;
    setAiThinking(true);
    const timer = setTimeout(() => {
      const move = aiPickMove(boardRef.current, 2);
      if (move) executeMove(move, 2);
      else setWinner(1);
      setAiThinking(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [turn, gameOver, mode, aiThinking, executeMove]);

  const reset = useCallback(() => {
    setBoard(init()); boardRef.current = init();
    setTurn(1); setSelected(null); setValidMoves([]); setWinner(null);
    setAiThinking(false); setScores({ 1: 12, 2: 12 });
    onPlayAgain?.();
  }, [onPlayAgain]);

  const isValid = (r, c) => validMoves.some(m => m.to[0] === r && m.to[1] === c);
  const isSel = (r, c) => selected && selected[0] === r && selected[1] === c;

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 w-full">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 bg-gradient-to-b from-slate-800 via-slate-850 to-slate-900">
        <BoardHeader title={isEl ? "Ντάμα" : "Checkers"} turn={gameOver ? null : turn}
          playerNames={playerNames} scores={scores}
          status={aiThinking ? (isEl ? "AI σκέφτεται..." : "AI thinking...") : null} />
        <div className="p-4 sm:p-6">
          <div className="grid rounded-2xl overflow-hidden shadow-[inset_0_2px_20px_rgba(0,0,0,0.4)] border-2 border-white/5" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
            {Array.from({ length: SIZE * SIZE }, (_, i) => {
              const r = Math.floor(i / SIZE), c = i % SIZE;
              const isDark = (r + c) % 2 === 1;
              const cell = board[r][c];
              return (
                <button key={i} type="button" onClick={() => handleCellClick(r, c)}
                  className={["aspect-square flex items-center justify-center relative transition-all",
                    isDark ? "bg-gradient-to-br from-emerald-700 to-emerald-900" : "bg-gradient-to-br from-amber-100 to-amber-200",
                    isSel(r,c) ? "ring-[3px] ring-inset ring-amber-400 !bg-amber-500/30" : "",
                    isValid(r,c) ? "ring-[3px] ring-inset ring-violet-400 bg-violet-400/20" : "",
                    isDark ? "hover:brightness-110" : "",
                  ].join(" ")}>
                  {cell !== EMPTY && (
                    <div className={["w-[70%] h-[70%] rounded-full border-2 flex items-center justify-center text-sm sm:text-base transition-transform",
                      isRed(cell) ? "bg-gradient-to-br from-red-400 via-red-500 to-red-700 border-red-300/40 shadow-xl shadow-red-900/50 text-white" : "bg-gradient-to-br from-slate-500 via-slate-700 to-slate-900 border-slate-300/30 shadow-xl shadow-black/50 text-white",
                      isSel(r,c) ? "scale-115" : "",
                    ].join(" ")}>
                      {isKing(cell) ? "👑" : ""}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {gameOver && <GameOverModal winner={winner} playerNames={playerNames}
        stats={{ [isEl ? "Κόκκ. πούλια" : "Red pieces"]: scores[1], [isEl ? "Μαύρ. πούλια" : "Black pieces"]: scores[2] }}
        onPlayAgain={reset} onChangeGame={onChangeGame} />}
    </div>
  );
}
