import React, { useState, useEffect, useCallback, useRef } from "react";
import BoardHeader from "./shared/BoardHeader";
import GameOverModal from "./shared/GameOverModal";

const COLS = 7;
const ROWS = 6;
const EMPTY = 0;
const P1 = 1;
const P2 = 2;

const DEPTH_MAP = { easy: 2, medium: 4, hard: 6 };

function createBoard() {
  return Array.from({ length: ROWS }, () => new Array(COLS).fill(EMPTY));
}

function lowestRow(board, col) {
  for (let r = ROWS - 1; r >= 0; r--) if (board[r][col] === EMPTY) return r;
  return -1;
}

function cloneBoard(b) { return b.map(r => [...r]); }

function checkWin(board) {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const p = board[r][c];
      if (p === EMPTY) continue;
      for (const [dr, dc] of dirs) {
        const cells = [[r, c]];
        for (let i = 1; i < 4; i++) {
          const nr = r + dr * i, nc = c + dc * i;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== p) break;
          cells.push([nr, nc]);
        }
        if (cells.length === 4) return { winner: p, cells };
      }
    }
  }
  return null;
}

function isFull(board) { return board[0].every(c => c !== EMPTY); }

function evaluate(board) {
  let score = 0;
  const center = Math.floor(COLS / 2);
  for (let r = 0; r < ROWS; r++) {
    if (board[r][center] === P2) score += 3;
    else if (board[r][center] === P1) score -= 3;
  }
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (const [dr, dc] of dirs) {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        let p2c = 0, p1c = 0, emp = 0;
        for (let i = 0; i < 4; i++) {
          const nr = r + dr * i, nc = c + dc * i;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) { p2c = -1; break; }
          if (board[nr][nc] === P2) p2c++;
          else if (board[nr][nc] === P1) p1c++;
          else emp++;
        }
        if (p2c < 0) continue;
        if (p1c === 0 && p2c >= 2) score += p2c * 5;
        if (p2c === 0 && p1c >= 2) score -= p1c * 5;
      }
    }
  }
  return score;
}

function minimax(board, depth, alpha, beta, maximizing) {
  const w = checkWin(board);
  if (w) return w.winner === P2 ? 100000 + depth : -100000 - depth;
  if (isFull(board)) return 0;
  if (depth === 0) return evaluate(board);

  const available = [];
  for (let c = 0; c < COLS; c++) if (lowestRow(board, c) >= 0) available.push(c);

  if (maximizing) {
    let best = -Infinity;
    for (const col of available) {
      const nb = cloneBoard(board);
      nb[lowestRow(board, col)][col] = P2;
      const val = minimax(nb, depth - 1, alpha, beta, false);
      best = Math.max(best, val);
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const col of available) {
      const nb = cloneBoard(board);
      nb[lowestRow(board, col)][col] = P1;
      const val = minimax(nb, depth - 1, alpha, beta, true);
      best = Math.min(best, val);
      beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function pickAICol(board, difficulty) {
  const depth = DEPTH_MAP[difficulty] || 4;
  const available = [];
  for (let c = 0; c < COLS; c++) if (lowestRow(board, c) >= 0) available.push(c);
  if (available.length === 0) return -1;

  let bestCol = available[0];
  let bestVal = -Infinity;
  for (const col of available) {
    const nb = cloneBoard(board);
    nb[lowestRow(board, col)][col] = P2;
    const val = minimax(nb, depth - 1, -Infinity, Infinity, false);
    if (val > bestVal) { bestVal = val; bestCol = col; }
  }
  return bestCol;
}

export default function Connect4({ mode, difficulty, onPlayAgain, onChangeGame, lang }) {
  const isEl = lang === "el";
  const playerNames = mode === "ai"
    ? { 1: isEl ? "Εσύ" : "You", 2: "AI" }
    : { 1: isEl ? "Κόκκινος" : "Red", 2: isEl ? "Κίτρινος" : "Yellow" };

  const [board, setBoard] = useState(createBoard);
  const [turn, setTurn] = useState(P1);
  const [winner, setWinner] = useState(null);
  const [winCells, setWinCells] = useState([]);
  const [hoverCol, setHoverCol] = useState(null);
  const [lastDrop, setLastDrop] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);
  const boardRef = useRef(board);
  const aiTimer = useRef(null);
  boardRef.current = board;

  const gameOver = winner !== null;
  const canClick = !gameOver && !aiThinking && (mode === "local" || turn === P1);

  const placePiece = useCallback((col, player) => {
    const cur = boardRef.current;
    const row = lowestRow(cur, col);
    if (row < 0) return;

    const nb = cloneBoard(cur);
    nb[row][col] = player;
    setBoard(nb);
    boardRef.current = nb;
    setLastDrop(`${row},${col}`);

    const w = checkWin(nb);
    if (w) {
      setWinner(w.winner);
      setWinCells(w.cells);
      return;
    }
    if (isFull(nb)) {
      setWinner("draw");
      return;
    }
    setTurn(player === P1 ? P2 : P1);
  }, []);

  const handleColumnClick = useCallback((col) => {
    if (!canClick) return;
    if (lowestRow(boardRef.current, col) < 0) return;
    placePiece(col, turn);
  }, [canClick, turn, placePiece]);

  useEffect(() => {
    if (gameOver || mode !== "ai" || turn !== P2 || aiThinking) return;

    setAiThinking(true);
    aiTimer.current = setTimeout(() => {
      const col = pickAICol(boardRef.current, difficulty || "medium");
      if (col >= 0) placePiece(col, P2);
      setAiThinking(false);
    }, 350);

    return () => { if (aiTimer.current) clearTimeout(aiTimer.current); };
  }, [turn, gameOver, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    if (aiTimer.current) clearTimeout(aiTimer.current);
    setBoard(createBoard());
    boardRef.current = createBoard();
    setTurn(P1);
    setWinner(null);
    setWinCells([]);
    setLastDrop(null);
    setHoverCol(null);
    setAiThinking(false);
    onPlayAgain?.();
  }, [onPlayAgain]);

  const isWinCell = (r, c) => winCells.some(([wr, wc]) => wr === r && wc === c);

  const title = isEl ? "Σκορ 4" : "Connect 4";
  const status = aiThinking ? (isEl ? "AI σκέφτεται..." : "AI thinking...") : null;

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 w-full">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 bg-gradient-to-b from-slate-800 via-slate-850 to-slate-900">
        <BoardHeader
          title={title}
          turn={gameOver ? null : turn}
          playerNames={playerNames}
          status={gameOver
            ? (winner === "draw"
              ? (isEl ? "Ισοπαλία!" : "Draw!")
              : `${playerNames[winner]} ${isEl ? "κερδίζει!" : "wins!"}`)
            : status}
        />

        <div className="p-4 sm:p-6">
          <div className="rounded-2xl border-2 bg-gradient-to-b from-blue-600 to-blue-800 p-3 shadow-[inset_0_2px_20px_rgba(0,0,0,0.4)] border-blue-500/20">
            {/* Hover preview row */}
            <div className="grid mb-2" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: "8px" }}>
              {Array.from({ length: COLS }, (_, col) => (
                <div key={col} className="flex items-center justify-center h-10">
                  {hoverCol === col && canClick && lowestRow(boardRef.current, col) >= 0 && (
                    <div className={`w-10 h-10 rounded-full border-2 border-white/30 ${turn === P1 ? "bg-red-500/60 shadow-xl shadow-red-500/30" : "bg-yellow-400/60 shadow-xl shadow-yellow-400/30"}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Board */}
            <div className="grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: "8px" }}>
              {Array.from({ length: ROWS * COLS }, (_, i) => {
                const r = Math.floor(i / COLS);
                const c = i % COLS;
                const cell = board[r][c];
                const winning = isWinCell(r, c);
                const isNew = lastDrop === `${r},${c}`;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleColumnClick(c)}
                    onMouseEnter={() => setHoverCol(canClick ? c : null)}
                    onMouseLeave={() => setHoverCol(null)}
                    className="aspect-square rounded-full bg-gradient-to-br from-blue-700 to-blue-900 p-1.5 cursor-pointer"
                  >
                    <div className={[
                      "w-full h-full rounded-full transition-all duration-200",
                      cell === EMPTY ? "bg-slate-900/40 shadow-inner shadow-black/30"
                        : cell === P1 ? "bg-gradient-to-br from-red-400 to-red-600 shadow-xl shadow-red-700/40"
                        : "bg-gradient-to-br from-yellow-300 to-amber-500 shadow-xl shadow-amber-600/40",
                      winning ? "ring-[3px] ring-white/80 animate-pulse" : "",
                      isNew ? "animate-[dropIn_0.3s_ease-out]" : "",
                    ].join(" ")} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {gameOver && (
        <GameOverModal
          winner={winner}
          playerNames={playerNames}
          onPlayAgain={reset}
          onChangeGame={onChangeGame}
        />
      )}

      <style>{`
        @keyframes dropIn {
          0% { transform: translateY(-200%); opacity: 0.5; }
          60% { transform: translateY(8%); }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
