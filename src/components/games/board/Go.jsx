import React, { useState, useCallback, useRef, useEffect } from "react";
import BoardHeader from "./shared/BoardHeader";
import GameOverModal from "./shared/GameOverModal";

const SIZE = 9;
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

function createBoard() {
  return Array.from({ length: SIZE }, () => new Array(SIZE).fill(EMPTY));
}

function cloneBoard(b) { return b.map(r => [...r]); }

function getGroup(board, r, c, color) {
  const visited = new Set();
  const group = [];
  let liberties = 0;
  const stack = [[r, c]];

  while (stack.length) {
    const [cr, cc] = stack.pop();
    const key = `${cr},${cc}`;
    if (visited.has(key)) continue;
    visited.add(key);

    if (board[cr][cc] === color) {
      group.push([cr, cc]);
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const nr = cr + dr, nc = cc + dc;
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
          if (board[nr][nc] === EMPTY) liberties++;
          else if (board[nr][nc] === color) stack.push([nr, nc]);
        }
      }
    }
  }
  return { group, liberties };
}

function removeCaptures(board, opponent) {
  const nb = cloneBoard(board);
  let captured = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (nb[r][c] === opponent) {
        const { group, liberties } = getGroup(nb, r, c, opponent);
        if (liberties === 0) {
          for (const [gr, gc] of group) nb[gr][gc] = EMPTY;
          captured += group.length;
        }
      }
    }
  }
  return { board: nb, captured };
}

function countTerritory(board) {
  const visited = new Set();
  let blackScore = 0, whiteScore = 0;

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] !== EMPTY || visited.has(`${r},${c}`)) continue;
      const territory = [];
      let touchesBlack = false, touchesWhite = false;
      const stack = [[r, c]];
      while (stack.length) {
        const [cr, cc] = stack.pop();
        const key = `${cr},${cc}`;
        if (visited.has(key)) continue;
        visited.add(key);
        if (board[cr][cc] === EMPTY) {
          territory.push([cr, cc]);
          for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
            const nr = cr + dr, nc = cc + dc;
            if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) stack.push([nr, nc]);
          }
        } else if (board[cr][cc] === BLACK) touchesBlack = true;
        else touchesWhite = true;
      }
      if (touchesBlack && !touchesWhite) blackScore += territory.length;
      else if (touchesWhite && !touchesBlack) whiteScore += territory.length;
    }
  }
  return { blackTerritory: blackScore, whiteTerritory: whiteScore };
}

function aiMove(board, color) {
  const moves = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] !== EMPTY) continue;
      const hasNeighbor = [[-1,0],[1,0],[0,-1],[0,1]].some(([dr,dc]) => {
        const nr = r+dr, nc = c+dc;
        return nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] !== EMPTY;
      });
      if (hasNeighbor || (r === Math.floor(SIZE/2) && c === Math.floor(SIZE/2))) {
        const nb = cloneBoard(board);
        nb[r][c] = color;
        const { liberties } = getGroup(nb, r, c, color);
        const opp = color === BLACK ? WHITE : BLACK;
        const { captured } = removeCaptures(nb, opp);
        if (liberties > 0 || captured > 0) moves.push({ r, c, score: captured * 10 + liberties });
      }
    }
  }
  if (moves.length === 0) return null;
  moves.sort((a, b) => b.score - a.score);
  const top = moves.slice(0, Math.min(3, moves.length));
  return top[Math.floor(Math.random() * top.length)];
}

export default function Go({ mode, difficulty, onPlayAgain, onChangeGame, lang }) {
  const isEl = lang === "el";
  const playerNames = mode === "ai"
    ? { 1: isEl ? "Εσύ (⚫)" : "You (⚫)", 2: "AI (⚪)" }
    : { 1: isEl ? "Μαύρος" : "Black", 2: isEl ? "Λευκός" : "White" };

  const [board, setBoard] = useState(createBoard);
  const [turn, setTurn] = useState(BLACK);
  const [captures, setCaptures] = useState({ 1: 0, 2: 0 });
  const [passCount, setPassCount] = useState(0);
  const [winner, setWinner] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);
  const boardRef = useRef(board);
  boardRef.current = board;

  const KOMI = 6.5;
  const gameOver = winner !== null;

  const endGame = useCallback((b) => {
    const { blackTerritory, whiteTerritory } = countTerritory(b);
    const blackTotal = blackTerritory + captures[1] || 0;
    const whiteTotal = whiteTerritory + (captures[2] || 0) + KOMI;
    setWinner(blackTotal > whiteTotal ? 1 : whiteTotal > blackTotal ? 2 : "draw");
  }, [captures]);

  const placeStone = useCallback((r, c, color) => {
    const cur = boardRef.current;
    if (cur[r][c] !== EMPTY) return false;
    const nb = cloneBoard(cur);
    nb[r][c] = color;
    const opp = color === BLACK ? WHITE : BLACK;
    const { board: afterCaptures, captured } = removeCaptures(nb, opp);
    const { liberties } = getGroup(afterCaptures, r, c, color);
    if (liberties === 0 && captured === 0) return false;

    setBoard(afterCaptures);
    boardRef.current = afterCaptures;
    setLastMove(`${r},${c}`);
    if (captured > 0) setCaptures(prev => ({ ...prev, [color]: (prev[color] || 0) + captured }));
    setPassCount(0);
    setTurn(opp);
    return true;
  }, []);

  const handlePass = useCallback(() => {
    if (gameOver || aiThinking) return;
    const newCount = passCount + 1;
    if (newCount >= 2) {
      endGame(boardRef.current);
      return;
    }
    setPassCount(newCount);
    setTurn(turn === BLACK ? WHITE : BLACK);
  }, [gameOver, aiThinking, passCount, turn, endGame]);

  const handleCellClick = useCallback((r, c) => {
    if (gameOver || aiThinking) return;
    if (mode === "ai" && turn !== BLACK) return;
    placeStone(r, c, turn);
  }, [gameOver, aiThinking, mode, turn, placeStone]);

  useEffect(() => {
    if (gameOver || mode !== "ai" || turn !== WHITE || aiThinking) return;
    setAiThinking(true);
    const timer = setTimeout(() => {
      const move = aiMove(boardRef.current, WHITE);
      if (move) placeStone(move.r, move.c, WHITE);
      else {
        const newCount = passCount + 1;
        if (newCount >= 2) endGame(boardRef.current);
        else { setPassCount(newCount); setTurn(BLACK); }
      }
      setAiThinking(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [turn, gameOver, mode, aiThinking, placeStone, passCount, endGame]);

  const reset = useCallback(() => {
    setBoard(createBoard());
    boardRef.current = createBoard();
    setTurn(BLACK);
    setCaptures({ 1: 0, 2: 0 });
    setPassCount(0);
    setWinner(null);
    setLastMove(null);
    setAiThinking(false);
    onPlayAgain?.();
  }, [onPlayAgain]);

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 w-full">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 bg-gradient-to-b from-slate-800 via-slate-850 to-slate-900">
        <BoardHeader
          title="Go"
          turn={gameOver ? null : turn}
          playerNames={playerNames}
          scores={captures}
          status={aiThinking ? (isEl ? "AI σκέφτεται..." : "AI thinking...") : null}
        />
        <div className="p-4 sm:p-6">
          <div className="rounded-2xl p-4 border-2 shadow-[inset_0_2px_20px_rgba(0,0,0,0.4)] border-amber-600/30" style={{ backgroundColor: "#c9a84c" }}>
            <div className="grid" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, gap: "0px" }}>
              {Array.from({ length: SIZE * SIZE }, (_, i) => {
                const r = Math.floor(i / SIZE), c = i % SIZE;
                const cell = board[r][c];
                const isLast = lastMove === `${r},${c}`;
                const isStarPoint = [2,4,6].includes(r) && [2,4,6].includes(c);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleCellClick(r, c)}
                    className="aspect-square relative flex items-center justify-center hover:brightness-110 transition-all"
                    style={{ backgroundColor: "#c9a84c", border: "0.5px solid #a68a3a" }}
                  >
                    {cell === EMPTY && isStarPoint && (
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-900/70 absolute shadow-xl" />
                    )}
                    {cell !== EMPTY && (
                      <div className={[
                        "w-[88%] h-[88%] rounded-full transition-transform",
                        cell === BLACK ? "bg-gradient-to-br from-slate-700 to-slate-900 shadow-xl shadow-black/60" : "bg-gradient-to-br from-white to-slate-100 border border-slate-200/50 shadow-xl shadow-white/30",
                        isLast ? "ring-[3px] ring-violet-400 ring-offset-1" : "",
                      ].join(" ")} style={isLast ? { ringOffsetColor: "#c9a84c" } : undefined} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={handlePass}
              disabled={gameOver || aiThinking}
              className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-slate-300 text-base font-semibold hover:bg-white/20 disabled:opacity-40 transition-all border border-white/10"
            >
              {isEl ? "Πάσο" : "Pass"}
            </button>
          </div>
        </div>
      </div>

      {gameOver && (
        <GameOverModal winner={winner} playerNames={playerNames}
          stats={{ [isEl ? "Αιχμάλωτα ⚫" : "Captured ⚫"]: captures[1] || 0, [isEl ? "Αιχμάλωτα ⚪" : "Captured ⚪"]: captures[2] || 0 }}
          onPlayAgain={reset} onChangeGame={onChangeGame} />
      )}
    </div>
  );
}
