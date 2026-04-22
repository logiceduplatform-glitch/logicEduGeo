import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import BoardHeader from "./shared/BoardHeader";
import GameOverModal from "./shared/GameOverModal";

const SIZE = 8;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

const DIRS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

const POS_WEIGHT = [
  [100, -30, 10,  5,  5, 10, -30, 100],
  [-30, -50, -2, -2, -2, -2, -50, -30],
  [ 10,  -2,  1,  1,  1,  1,  -2,  10],
  [  5,  -2,  1,  0,  0,  1,  -2,   5],
  [  5,  -2,  1,  0,  0,  1,  -2,   5],
  [ 10,  -2,  1,  1,  1,  1,  -2,  10],
  [-30, -50, -2, -2, -2, -2, -50, -30],
  [100, -30, 10,  5,  5, 10, -30, 100],
];

const DEPTH_MAP = { easy: 2, medium: 4, hard: 5 };

function createBoard() {
  const b = Array.from({ length: SIZE }, () => new Array(SIZE).fill(EMPTY));
  b[3][3] = WHITE; b[3][4] = BLACK;
  b[4][3] = BLACK; b[4][4] = WHITE;
  return b;
}

function cloneBoard(b) { return b.map(r => [...r]); }

function inBounds(r, c) { return r >= 0 && r < SIZE && c >= 0 && c < SIZE; }

function getFlips(board, r, c, player) {
  if (board[r][c] !== EMPTY) return [];
  const opp = player === BLACK ? WHITE : BLACK;
  const all = [];
  for (const [dr, dc] of DIRS) {
    const run = [];
    let nr = r + dr, nc = c + dc;
    while (inBounds(nr, nc) && board[nr][nc] === opp) {
      run.push([nr, nc]);
      nr += dr; nc += dc;
    }
    if (run.length > 0 && inBounds(nr, nc) && board[nr][nc] === player) {
      all.push(...run);
    }
  }
  return all;
}

function getValidMoves(board, player) {
  const moves = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (getFlips(board, r, c, player).length > 0) moves.push([r, c]);
  return moves;
}

function applyMove(board, r, c, player) {
  const nb = cloneBoard(board);
  nb[r][c] = player;
  for (const [fr, fc] of getFlips(board, r, c, player)) nb[fr][fc] = player;
  return nb;
}

function countPieces(board) {
  let b = 0, w = 0;
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === BLACK) b++;
      else if (board[r][c] === WHITE) w++;
    }
  return [b, w];
}

function evaluate(board) {
  let score = 0;
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === WHITE) score += POS_WEIGHT[r][c] + 1;
      else if (board[r][c] === BLACK) score -= POS_WEIGHT[r][c] + 1;
    }
  return score;
}

function minimax(board, depth, alpha, beta, maximizing) {
  const player = maximizing ? WHITE : BLACK;
  const moves = getValidMoves(board, player);

  if (depth === 0 || moves.length === 0) {
    if (moves.length === 0) {
      const oppMoves = getValidMoves(board, maximizing ? BLACK : WHITE);
      if (oppMoves.length === 0) {
        const [b, w] = countPieces(board);
        return (w - b) * 10000;
      }
      if (depth > 0) return minimax(board, depth - 1, alpha, beta, !maximizing);
    }
    return evaluate(board);
  }

  if (maximizing) {
    let best = -Infinity;
    for (const [r, c] of moves) {
      const val = minimax(applyMove(board, r, c, WHITE), depth - 1, alpha, beta, false);
      best = Math.max(best, val);
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const [r, c] of moves) {
      const val = minimax(applyMove(board, r, c, BLACK), depth - 1, alpha, beta, true);
      best = Math.min(best, val);
      beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function aiPickMove(board, difficulty) {
  const moves = getValidMoves(board, WHITE);
  if (moves.length === 0) return null;
  const depth = DEPTH_MAP[difficulty] || 4;
  let bestMove = moves[0];
  let bestVal = -Infinity;
  for (const [r, c] of moves) {
    const val = minimax(applyMove(board, r, c, WHITE), depth - 1, -Infinity, Infinity, false);
    if (val > bestVal) { bestVal = val; bestMove = [r, c]; }
  }
  return bestMove;
}

export default function Othello({ mode, difficulty, onPlayAgain, onChangeGame, lang }) {
  const isEl = lang === "el";
  const playerNames = useMemo(() =>
    mode === "ai"
      ? { 1: isEl ? "Εσύ" : "You", 2: "AI" }
      : { 1: isEl ? "Μαύρος" : "Black", 2: isEl ? "Λευκός" : "White" },
    [mode, isEl]
  );

  const [board, setBoard] = useState(createBoard);
  const [turn, setTurn] = useState(BLACK);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState(null);
  const [lastPlaced, setLastPlaced] = useState(null);
  const [lastFlipped, setLastFlipped] = useState(new Set());
  const [aiThinking, setAiThinking] = useState(false);
  const aiTimer = useRef(null);
  const boardRef = useRef(board);
  const turnRef = useRef(turn);
  boardRef.current = board;
  turnRef.current = turn;

  const validMoves = useMemo(() => gameOver ? [] : getValidMoves(board, turn), [board, turn, gameOver]);
  const [bCount, wCount] = useMemo(() => countPieces(board), [board]);

  const advanceTurn = useCallback((nextBoard, currentTurn) => {
    const opp = currentTurn === BLACK ? WHITE : BLACK;
    const oppMoves = getValidMoves(nextBoard, opp);
    if (oppMoves.length > 0) {
      setTurn(opp);
      return;
    }
    const sameMoves = getValidMoves(nextBoard, currentTurn);
    if (sameMoves.length > 0) {
      setMessage(
        isEl
          ? `${playerNames[opp]} δεν έχει κίνηση — παραλείπεται`
          : `${playerNames[opp]} has no moves — skipped`
      );
      setTimeout(() => setMessage(null), 1800);
      setTurn(currentTurn);
      return;
    }
    const [b, w] = countPieces(nextBoard);
    setGameOver(true);
    setWinner(b > w ? BLACK : w > b ? WHITE : "draw");
  }, [isEl, playerNames]);

  const makeMove = useCallback((r, c, player) => {
    const curBoard = boardRef.current;
    const flips = getFlips(curBoard, r, c, player);
    if (flips.length === 0) return;

    const flipSet = new Set(flips.map(([fr, fc]) => `${fr},${fc}`));
    setLastPlaced(`${r},${c}`);
    setLastFlipped(flipSet);

    const nextBoard = applyMove(curBoard, r, c, player);
    setBoard(nextBoard);

    setTimeout(() => {
      setLastPlaced(null);
      setLastFlipped(new Set());
      advanceTurn(nextBoard, player);
    }, 350);
  }, [advanceTurn]);

  const handleClick = useCallback((r, c) => {
    if (gameOver || aiThinking) return;
    if (mode === "ai" && turn !== BLACK) return;
    if (getFlips(boardRef.current, r, c, turn).length === 0) return;
    makeMove(r, c, turn);
  }, [gameOver, aiThinking, mode, turn, makeMove]);

  useEffect(() => {
    if (gameOver || mode !== "ai" || turn !== WHITE || aiThinking) return;
    const moves = getValidMoves(boardRef.current, WHITE);
    if (moves.length === 0) return;

    setAiThinking(true);
    aiTimer.current = setTimeout(() => {
      const move = aiPickMove(boardRef.current, difficulty || "medium");
      if (move) makeMove(move[0], move[1], WHITE);
      setAiThinking(false);
    }, 450);

    return () => { if (aiTimer.current) clearTimeout(aiTimer.current); };
  }, [turn, gameOver, mode]);  // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    if (aiTimer.current) clearTimeout(aiTimer.current);
    setBoard(createBoard());
    setTurn(BLACK);
    setGameOver(false);
    setWinner(null);
    setMessage(null);
    setLastPlaced(null);
    setLastFlipped(new Set());
    setAiThinking(false);
    onPlayAgain?.();
  }, [onPlayAgain]);

  const title = isEl ? "Όθελο" : "Othello";
  const status = message
    ? message
    : aiThinking
      ? (isEl ? "AI σκέφτεται..." : "AI thinking...")
      : null;

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 w-full">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 bg-gradient-to-b from-slate-800 via-slate-850 to-slate-900">
        <BoardHeader
          title={title}
          turn={gameOver ? null : turn}
          playerNames={playerNames}
          scores={{ 1: bCount, 2: wCount }}
          status={status}
        />

        {/* Piece count bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5">
          <span className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-500 shrink-0 shadow-xl" />
          <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-slate-500 to-slate-700 rounded-full transition-all duration-500"
              style={{ width: `${(bCount + wCount) > 0 ? (bCount / (bCount + wCount)) * 100 : 50}%` }}
            />
          </div>
          <span className="w-5 h-5 rounded-full bg-white border border-slate-300 shrink-0 shadow-xl" />
          <span className="text-xs font-bold text-slate-400 min-w-[4ch] text-right">{bCount}-{wCount}</span>
        </div>

        <div className="p-4 sm:p-6">
          <div
            className="grid bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl overflow-hidden border-2 border-emerald-600/30 shadow-[inset_0_2px_20px_rgba(0,0,0,0.4)]"
            style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: "1px" }}
          >
            {Array.from({ length: SIZE * SIZE }, (_, i) => {
              const r = Math.floor(i / SIZE);
              const c = i % SIZE;
              const cell = board[r][c];
              const key = `${r},${c}`;
              const isValid = !gameOver && !aiThinking && (mode === "local" || turn === BLACK)
                && validMoves.some(([vr, vc]) => vr === r && vc === c);
              const isFlip = lastFlipped.has(key);
              const isNew = lastPlaced === key;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleClick(r, c)}
                  className={[
                    "relative aspect-square flex items-center justify-center bg-gradient-to-br from-emerald-700 to-emerald-900",
                    isValid ? "cursor-pointer hover:from-emerald-600 hover:to-emerald-800" : "cursor-default",
                  ].join(" ")}
                >
                  {cell !== EMPTY && (
                    <div
                      className={[
                        "w-[85%] h-[85%] rounded-full transition-all duration-300",
                        cell === BLACK
                          ? "bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-500/30 shadow-xl shadow-black/50"
                          : "bg-gradient-to-br from-white to-slate-100 border border-slate-200/50 shadow-xl shadow-white/20",
                        isFlip || isNew ? "scale-0 animate-[popIn_0.35s_ease-out_forwards]" : "",
                      ].join(" ")}
                    />
                  )}
                  {isValid && cell === EMPTY && (
                    <div className="absolute w-[36%] h-[36%] rounded-full bg-emerald-400/50 shadow-xl shadow-emerald-400/40 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {gameOver && (
        <GameOverModal
          winner={winner}
          playerNames={playerNames}
          stats={{
            [isEl ? "Μαύρα" : "Black"]: bCount,
            [isEl ? "Λευκά" : "White"]: wCount,
          }}
          onPlayAgain={reset}
          onChangeGame={onChangeGame}
        />
      )}

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0); }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
