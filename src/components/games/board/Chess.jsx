import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Chess } from "chess.js";
import BoardHeader from "./shared/BoardHeader";
import GameOverModal from "./shared/GameOverModal";

const PIECE_SYM = {
  w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
  b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" },
};

const VAL = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

const PST = {
  p: [
     0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
     5,  5, 10, 25, 25, 10,  5,  5,
     0,  0,  0, 20, 20,  0,  0,  0,
     5, -5,-10,  0,  0,-10, -5,  5,
     5, 10, 10,-20,-20, 10, 10,  5,
     0,  0,  0,  0,  0,  0,  0,  0,
  ],
  n: [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50,
  ],
  b: [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5, 10, 10,  5,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20,
  ],
  r: [
     0,  0,  0,  0,  0,  0,  0,  0,
     5, 10, 10, 10, 10, 10, 10,  5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
     0,  0,  0,  5,  5,  0,  0,  0,
  ],
  q: [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5,  5,  5,  5,  0,-10,
     -5,  0,  5,  5,  5,  5,  0, -5,
      0,  0,  5,  5,  5,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  0,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20,
  ],
  k: [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
     20, 20,  0,  0,  0,  0, 20, 20,
     20, 30, 10,  0,  0, 10, 30, 20,
  ],
};

function pstIdx(file, rank, isBlack) {
  const r = isBlack ? 7 - rank : rank;
  return r * 8 + file;
}

// Positive = white advantage, negative = black advantage
function evaluate(game) {
  if (game.isGameOver()) {
    if (game.isCheckmate()) return game.turn() === "w" ? -99999 : 99999;
    return 0;
  }
  let score = 0;
  const b = game.board();
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const p = b[r][f];
      if (!p) continue;
      const v = VAL[p.type] + PST[p.type][pstIdx(f, r, p.color === "b")];
      score += p.color === "w" ? v : -v;
    }
  }
  return score;
}

// White maximizes, black minimizes
function minimax(game, depth, alpha, beta, maximizing) {
  if (depth === 0 || game.isGameOver()) return evaluate(game);

  const moves = game.moves();
  if (maximizing) {
    let best = -Infinity;
    for (const m of moves) {
      const g = new Chess(game.fen());
      g.move(m);
      const val = minimax(g, depth - 1, alpha, beta, false);
      best = Math.max(best, val);
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) {
      const g = new Chess(game.fen());
      g.move(m);
      const val = minimax(g, depth - 1, alpha, beta, true);
      best = Math.min(best, val);
      beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function pickAIMove(game, difficulty) {
  const depth = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  const isWhite = game.turn() === "w";
  let bestMove = moves[0];
  let bestVal = isWhite ? -Infinity : Infinity;

  for (const m of moves) {
    const g = new Chess(game.fen());
    g.move(m);
    // After this move, the other side plays next
    const val = minimax(g, depth - 1, -Infinity, Infinity, !isWhite);
    if (isWhite ? val > bestVal : val < bestVal) {
      bestVal = val;
      bestMove = m;
    }
  }
  return bestMove;
}

function getCaptured(game) {
  const w = [], b = [];
  for (const m of game.history({ verbose: true })) {
    if (m.captured) {
      const sym = PIECE_SYM[m.color === "w" ? "b" : "w"][m.captured];
      (m.color === "w" ? b : w).push(sym);
    }
  }
  return { w, b };
}

const FILES = "abcdefgh";

export default function ChessGame({ mode, difficulty, onPlayAgain, onChangeGame, lang }) {
  const isEl = lang === "el";
  const playerNames = useMemo(() =>
    mode === "ai"
      ? { 1: isEl ? "Εσύ" : "You", 2: "AI" }
      : { 1: isEl ? "Λευκός" : "White", 2: isEl ? "Μαύρος" : "Black" },
    [mode, isEl]
  );

  const [game, setGame] = useState(() => new Chess());
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [reason, setReason] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const gameRef = useRef(game);
  const aiTimer = useRef(null);
  gameRef.current = game;

  const board = useMemo(() => game.board(), [game]);
  const turnColor = game.turn();
  const turnPlayer = turnColor === "w" ? 1 : 2;
  const inCheck = game.inCheck();
  const captured = useMemo(() => getCaptured(game), [game]);

  const legalMoves = useMemo(() => {
    if (!selected) return [];
    return game.moves({ verbose: true }).filter(m => m.from === selected);
  }, [game, selected]);

  const kingSquare = useMemo(() => {
    if (!inCheck) return null;
    for (let r = 0; r < 8; r++)
      for (let f = 0; f < 8; f++) {
        const p = board[r][f];
        if (p && p.type === "k" && p.color === turnColor)
          return `${FILES[f]}${8 - r}`;
      }
    return null;
  }, [inCheck, turnColor, board]);

  const canInteract = !gameOver && !aiThinking && (mode === "local" || turnPlayer === 1);

  const checkEnd = useCallback((g) => {
    if (!g.isGameOver()) return false;
    setGameOver(true);
    if (g.isCheckmate()) {
      setWinner(g.turn() === "w" ? 2 : 1);
      setReason(isEl ? "Ματ" : "Checkmate");
    } else if (g.isStalemate()) {
      setWinner("draw");
      setReason(isEl ? "Πατ" : "Stalemate");
    } else if (g.isDraw()) {
      setWinner("draw");
      setReason(isEl ? "Ισοπαλία" : "Draw");
    } else {
      setWinner("draw");
      setReason(isEl ? "Ισοπαλία" : "Draw");
    }
    return true;
  }, [isEl]);

  const applyMove = useCallback((moveObj) => {
    const g = new Chess(gameRef.current.fen());
    const result = g.move(moveObj);
    if (!result) return false;
    setGame(g);
    gameRef.current = g;
    setSelected(null);
    checkEnd(g);
    return true;
  }, [checkEnd]);

  const handleSquareClick = useCallback((file, rank) => {
    if (!canInteract) return;
    const sq = `${FILES[file]}${8 - rank}`;
    const piece = board[rank][file];

    if (selected) {
      const move = legalMoves.find(m => m.to === sq);
      if (move) {
        applyMove(move.promotion ? { ...move, promotion: "q" } : move);
        return;
      }
    }

    const myColor = turnPlayer === 1 ? "w" : "b";
    if (piece && piece.color === myColor) {
      setSelected(sq);
    } else {
      setSelected(null);
    }
  }, [canInteract, board, selected, legalMoves, turnPlayer, applyMove]);

  // AI turn
  useEffect(() => {
    if (gameOver || mode !== "ai" || turnPlayer !== 2 || aiThinking) return;
    if (gameRef.current.isGameOver()) return;

    setAiThinking(true);
    aiTimer.current = setTimeout(() => {
      const best = pickAIMove(gameRef.current, difficulty || "medium");
      if (best) applyMove(best);
      setAiThinking(false);
    }, 400);

    return () => { if (aiTimer.current) clearTimeout(aiTimer.current); };
  }, [turnPlayer, gameOver, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    if (aiTimer.current) clearTimeout(aiTimer.current);
    const g = new Chess();
    setGame(g);
    gameRef.current = g;
    setSelected(null);
    setGameOver(false);
    setWinner(null);
    setReason(null);
    setAiThinking(false);
    onPlayAgain?.();
  }, [onPlayAgain]);

  const title = isEl ? "Σκάκι" : "Chess";
  const status = aiThinking
    ? (isEl ? "AI σκέφτεται..." : "AI thinking...")
    : inCheck && !gameOver
      ? (isEl ? "Σαχ!" : "Check!")
      : null;

  const rowOrder = flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  const fileOrder = flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 w-full">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 bg-gradient-to-b from-slate-800 via-slate-850 to-slate-900">
        <BoardHeader
          title={title}
          turn={gameOver ? null : turnPlayer}
          playerNames={playerNames}
          status={status}
        />

        <div className="p-4 sm:p-6 space-y-4">
          {/* Captured pieces - top (opponent) */}
          <div className="flex justify-between text-xl sm:text-2xl min-h-[2rem] px-1">
            <div className="flex flex-wrap gap-1">
              {(flipped ? captured.w : captured.b).map((s, i) => (
                <span key={i} className="drop-shadow-lg opacity-90">{s}</span>
              ))}
            </div>
          </div>

          {/* Board */}
          <div className="relative">
            {mode === "local" && (
              <button
                type="button"
                onClick={() => setFlipped(f => !f)}
                className="absolute -top-9 right-0 text-xs px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm text-slate-300 font-semibold hover:bg-white/20 transition-all z-10 border border-white/10"
              >
                {isEl ? "Αντιστροφή" : "Flip"}
              </button>
            )}

            <div className="border-2 border-amber-700/40 rounded-2xl overflow-hidden shadow-[inset_0_2px_20px_rgba(0,0,0,0.4)]">
              {/* File labels top */}
              <div className="grid" style={{ gridTemplateColumns: "28px repeat(8, 1fr)" }}>
                <div />
                {fileOrder.map(f => (
                  <div key={f} className="flex items-center justify-center text-xs font-bold text-amber-400/70 py-1">
                    {FILES[f]}
                  </div>
                ))}
              </div>

              {rowOrder.map(rank => (
                <div key={rank} className="grid" style={{ gridTemplateColumns: "28px repeat(8, 1fr)" }}>
                  <div className="flex items-center justify-center text-xs font-bold text-amber-400/70">
                    {8 - rank}
                  </div>
                  {fileOrder.map(file => {
                    const isLight = (rank + file) % 2 === 0;
                    const sq = `${FILES[file]}${8 - rank}`;
                    const piece = board[rank][file];
                    const isSel = selected === sq;
                    const isLegal = legalMoves.some(m => m.to === sq);
                    const isCapture = isLegal && !!piece;
                    const isKing = kingSquare === sq;

                    return (
                      <button
                        key={sq}
                        type="button"
                        onClick={() => handleSquareClick(file, rank)}
                        className={[
                          "relative aspect-square flex items-center justify-center transition-all",
                          isLight ? "bg-gradient-to-br from-amber-100 to-amber-200" : "bg-gradient-to-br from-amber-700 to-amber-900",
                          isSel ? "ring-[3px] ring-inset ring-violet-400 !bg-violet-400/30" : "",
                          isKing ? "!bg-red-500/40 animate-pulse" : "",
                          isCapture ? "ring-[3px] ring-violet-400/70" : "",
                          canInteract ? "cursor-pointer hover:brightness-110" : "cursor-default",
                        ].join(" ")}
                      >
                        {piece && (
                          <span className={[
                            "text-3xl sm:text-4xl lg:text-5xl select-none leading-none transition-transform",
                            piece.color === "w"
                              ? "text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]"
                              : "text-slate-900 drop-shadow-[0_2px_4px_rgba(255,255,255,0.5)]",
                            isSel ? "scale-110" : "",
                          ].join(" ")}>
                            {PIECE_SYM[piece.color][piece.type]}
                          </span>
                        )}
                        {isLegal && !piece && (
                          <div className="absolute w-4 h-4 bg-violet-400/50 rounded-full shadow-lg shadow-violet-500/40 animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Captured pieces - bottom (player) */}
          <div className="flex justify-between text-xl sm:text-2xl min-h-[2rem] px-1">
            <div className="flex flex-wrap gap-1">
              {(flipped ? captured.b : captured.w).map((s, i) => (
                <span key={i} className="drop-shadow-lg opacity-90">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {gameOver && (
        <GameOverModal
          winner={winner}
          playerNames={playerNames}
          stats={reason ? { [isEl ? "Αποτέλεσμα" : "Result"]: reason } : undefined}
          onPlayAgain={reset}
          onChangeGame={onChangeGame}
        />
      )}
    </div>
  );
}
