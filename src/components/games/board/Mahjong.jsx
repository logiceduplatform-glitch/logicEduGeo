import React, { useState, useCallback, useMemo } from "react";
import BoardHeader from "./shared/BoardHeader";
import GameOverModal from "./shared/GameOverModal";

const TILE_FACES = [
  { id: "b1", display: "🎋1", bg: "from-green-300 to-green-500" },
  { id: "b2", display: "🎋2", bg: "from-green-300 to-green-500" },
  { id: "b3", display: "🎋3", bg: "from-green-300 to-green-500" },
  { id: "b4", display: "🎋4", bg: "from-green-300 to-green-500" },
  { id: "b5", display: "🎋5", bg: "from-green-300 to-green-500" },
  { id: "b6", display: "🎋6", bg: "from-green-300 to-green-500" },
  { id: "b7", display: "🎋7", bg: "from-green-300 to-green-500" },
  { id: "b8", display: "🎋8", bg: "from-green-300 to-green-500" },
  { id: "b9", display: "🎋9", bg: "from-green-300 to-green-500" },
  { id: "c1", display: "🔵1", bg: "from-blue-300 to-blue-500" },
  { id: "c2", display: "🔵2", bg: "from-blue-300 to-blue-500" },
  { id: "c3", display: "🔵3", bg: "from-blue-300 to-blue-500" },
  { id: "c4", display: "🔵4", bg: "from-blue-300 to-blue-500" },
  { id: "c5", display: "🔵5", bg: "from-blue-300 to-blue-500" },
  { id: "c6", display: "🔵6", bg: "from-blue-300 to-blue-500" },
  { id: "c7", display: "🔵7", bg: "from-blue-300 to-blue-500" },
  { id: "c8", display: "🔵8", bg: "from-blue-300 to-blue-500" },
  { id: "c9", display: "🔵9", bg: "from-blue-300 to-blue-500" },
  { id: "w1", display: "🀀", bg: "from-sky-200 to-sky-400" },
  { id: "w2", display: "🀁", bg: "from-sky-200 to-sky-400" },
  { id: "w3", display: "🀂", bg: "from-sky-200 to-sky-400" },
  { id: "w4", display: "🀃", bg: "from-sky-200 to-sky-400" },
  { id: "d1", display: "🀄", bg: "from-red-300 to-red-500" },
  { id: "d2", display: "🀅", bg: "from-emerald-300 to-emerald-500" },
  { id: "d3", display: "🀆", bg: "from-slate-200 to-slate-400" },
  { id: "f1", display: "🌸", bg: "from-pink-300 to-pink-500" },
  { id: "f2", display: "🌺", bg: "from-rose-300 to-rose-500" },
  { id: "f3", display: "🌻", bg: "from-amber-300 to-amber-500" },
  { id: "f4", display: "🍀", bg: "from-lime-300 to-lime-500" },
  { id: "f5", display: "🦋", bg: "from-violet-300 to-violet-500" },
  { id: "f6", display: "🐉", bg: "from-orange-300 to-orange-500" },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LAYOUT = [
  { rows: 8, cols: 10, offsetR: 0, offsetC: 0 },
  { rows: 6, cols: 8,  offsetR: 1, offsetC: 1 },
  { rows: 4, cols: 6,  offsetR: 2, offsetC: 2 },
  { rows: 2, cols: 2,  offsetR: 3, offsetC: 4 },
];

function buildBoard() {
  const totalNeeded = LAYOUT.reduce((s, l) => s + l.rows * l.cols, 0);
  const pairsNeeded = totalNeeded / 2;

  const faces = [];
  let fi = 0;
  while (faces.length < pairsNeeded) {
    faces.push(TILE_FACES[fi % TILE_FACES.length]);
    fi++;
  }
  const pool = shuffle([...faces, ...faces]);

  const tiles = [];
  let idx = 0;
  for (let l = 0; l < LAYOUT.length; l++) {
    const { rows, cols, offsetR, offsetC } = LAYOUT[l];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (idx < pool.length) {
          tiles.push({
            uid: idx,
            faceId: pool[idx].id,
            display: pool[idx].display,
            bg: pool[idx].bg,
            layer: l,
            row: r + offsetR,
            col: c + offsetC,
            removed: false,
          });
          idx++;
        }
      }
    }
  }
  return tiles;
}

function isFree(tile, tiles) {
  if (tile.removed) return false;
  const { layer, row, col } = tile;

  const hasAbove = tiles.some(
    (t) => !t.removed && t.layer === layer + 1 &&
      Math.abs(t.row - row) < 1 && Math.abs(t.col - col) < 1
  );
  if (hasAbove) return false;

  const leftBlocked = tiles.some(
    (t) => !t.removed && t.layer === layer && t.row === row && t.col === col - 1
  );
  const rightBlocked = tiles.some(
    (t) => !t.removed && t.layer === layer && t.row === row && t.col === col + 1
  );
  return !leftBlocked || !rightBlocked;
}

function findMatch(tiles) {
  const free = tiles.filter((t) => !t.removed && isFree(t, tiles));
  for (let i = 0; i < free.length; i++) {
    for (let j = i + 1; j < free.length; j++) {
      if (free[i].faceId === free[j].faceId) {
        return [free[i].uid, free[j].uid];
      }
    }
  }
  return null;
}

const TILE_W = 56;
const TILE_H = 72;
const LAYER_OFFSET = 6;

export default function Mahjong({ mode, difficulty, onPlayAgain, onChangeGame, lang }) {
  const isEl = lang === "el";

  const [tiles, setTiles] = useState(() => buildBoard());
  const [selected, setSelected] = useState(null);
  const [matched, setMatched] = useState(0);
  const [moves, setMoves] = useState(0);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState("");
  const [hintIds, setHintIds] = useState(null);
  const [removeAnim, setRemoveAnim] = useState(new Set());

  const remaining = tiles.filter((t) => !t.removed).length;
  const gameOver = winner !== null;

  const boardBounds = useMemo(() => {
    const active = tiles.filter((t) => !t.removed);
    if (active.length === 0) return { maxR: 8, maxC: 10, maxL: 3 };
    return {
      maxR: Math.max(...active.map((t) => t.row)) + 1,
      maxC: Math.max(...active.map((t) => t.col)) + 1,
      maxL: Math.max(...active.map((t) => t.layer)),
    };
  }, [tiles]);

  const boardWidth = boardBounds.maxC * TILE_W + boardBounds.maxL * LAYER_OFFSET + TILE_W;
  const boardHeight = boardBounds.maxR * TILE_H + boardBounds.maxL * LAYER_OFFSET + TILE_H;

  const handleTileClick = useCallback(
    (tile) => {
      if (gameOver || tile.removed) return;
      if (!isFree(tile, tiles)) {
        setMessage(isEl ? "Το πλακίδιο είναι μπλοκαρισμένο!" : "Tile is blocked!");
        setTimeout(() => setMessage(""), 1500);
        return;
      }

      setHintIds(null);

      if (!selected) {
        setSelected(tile.uid);
        setMessage("");
        return;
      }

      if (selected === tile.uid) {
        setSelected(null);
        return;
      }

      const selTile = tiles.find((t) => t.uid === selected);
      setMoves((p) => p + 1);

      if (selTile && selTile.faceId === tile.faceId) {
        setRemoveAnim(new Set([selTile.uid, tile.uid]));
        setTimeout(() => {
          setTiles((prev) => {
            const next = prev.map((t) =>
              t.uid === selTile.uid || t.uid === tile.uid ? { ...t, removed: true } : t
            );
            const rem = next.filter((t) => !t.removed).length;
            if (rem === 0) setWinner("win");
            else if (!findMatch(next)) {
              setMessage(isEl ? "Δεν υπάρχουν άλλες κινήσεις!" : "No more moves!");
              setWinner("lose");
            }
            return next;
          });
          setRemoveAnim(new Set());
          setSelected(null);
          setMatched((p) => p + 1);
          setMessage(isEl ? "Ταίριασμα! ✅" : "Match! ✅");
          setTimeout(() => setMessage(""), 1200);
        }, 350);
      } else {
        setSelected(null);
        setMessage(isEl ? "Δεν ταιριάζουν!" : "No match!");
        setTimeout(() => setMessage(""), 1200);
      }
    },
    [gameOver, selected, tiles, isEl]
  );

  const showHint = useCallback(() => {
    const match = findMatch(tiles);
    if (match) {
      setHintIds(new Set(match));
      setMessage(isEl ? "Κοίτα τα φωτισμένα πλακίδια!" : "Look at the highlighted tiles!");
    } else {
      setMessage(isEl ? "Δεν υπάρχουν κινήσεις!" : "No moves available!");
      setWinner("lose");
    }
  }, [tiles, isEl]);

  const reset = useCallback(() => {
    setTiles(buildBoard());
    setSelected(null);
    setMatched(0);
    setMoves(0);
    setWinner(null);
    setMessage("");
    setHintIds(null);
    setRemoveAnim(new Set());
    onPlayAgain?.();
  }, [onPlayAgain]);

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 w-full">
      <div className="w-full max-w-3xl rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 via-slate-850 to-slate-900 border border-white/10 shadow-2xl shadow-black/40">
        <BoardHeader
          title="Mahjong"
          turn={null}
          playerNames={{ 1: isEl ? "Παίκτης" : "Player" }}
          status={`${remaining} ${isEl ? "πλακίδια" : "tiles"}`}
        />

        <div className="p-4 sm:p-6 space-y-4">
          {/* Board */}
          <div
            className="relative mx-auto overflow-hidden"
            style={{ width: Math.min(boardWidth, 760), height: boardHeight + 20 }}
          >
            <div
              className="absolute"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                width: boardWidth,
                height: boardHeight,
              }}
            >
              {tiles
                .filter((t) => !t.removed)
                .sort((a, b) => a.layer - b.layer || a.row - b.row || a.col - b.col)
                .map((tile) => {
                  const free = isFree(tile, tiles);
                  const isSel = selected === tile.uid;
                  const isHint = hintIds?.has(tile.uid);
                  const isRemoving = removeAnim.has(tile.uid);

                  const x = tile.col * TILE_W + tile.layer * LAYER_OFFSET;
                  const y = tile.row * TILE_H + tile.layer * LAYER_OFFSET;

                  return (
                    <button
                      key={tile.uid}
                      onClick={() => handleTileClick(tile)}
                      disabled={gameOver}
                      className={[
                        "absolute flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 select-none",
                        isRemoving
                          ? "scale-0 opacity-0"
                          : isSel
                            ? "border-violet-400 ring-[3px] ring-violet-400 scale-105 z-50 shadow-2xl shadow-violet-500/50 bg-gradient-to-br from-violet-400 to-fuchsia-500"
                            : isHint
                              ? "border-amber-400 ring-[3px] ring-amber-400 z-40 shadow-xl shadow-amber-500/40 bg-gradient-to-br from-amber-300 to-amber-500 animate-pulse"
                              : free
                                ? `border-white/30 shadow-xl hover:scale-105 hover:shadow-2xl hover:z-30 cursor-pointer bg-gradient-to-br ${tile.bg}`
                                : "border-white/10 shadow-md cursor-not-allowed bg-gradient-to-br from-slate-500 to-slate-600 opacity-70",
                      ].join(" ")}
                      style={{
                        left: x,
                        top: y,
                        width: TILE_W - 4,
                        height: TILE_H - 4,
                        zIndex: tile.layer * 100 + tile.row * 10 + tile.col,
                      }}
                    >
                      <span className={[
                        "text-xl leading-none",
                        isSel || isHint ? "drop-shadow-lg" : "drop-shadow-md",
                      ].join(" ")}>
                        {tile.display.replace(/[0-9]/g, "")}
                      </span>
                      {/[0-9]/.test(tile.display) && (
                        <span className={[
                          "text-[11px] font-black leading-none mt-0.5",
                          isSel ? "text-white" : "text-slate-800",
                        ].join(" ")}>
                          {tile.display.replace(/[^0-9]/g, "")}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-emerald-300 font-bold text-sm">
              ✅ {matched} {isEl ? "ζευγάρια" : "pairs"}
            </span>
            <span className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-slate-300 font-bold text-sm">
              🎯 {moves} {isEl ? "κινήσεις" : "moves"}
            </span>
            <span className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-amber-300 font-bold text-sm">
              🀄 {remaining} {isEl ? "απομένουν" : "left"}
            </span>
          </div>

          {message && (
            <p className="text-center text-sm font-semibold text-slate-300 animate-pulse">
              {message}
            </p>
          )}

          {!gameOver && (
            <div className="flex justify-center gap-3">
              <button
                onClick={showHint}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:from-amber-400 hover:to-orange-400 shadow-xl shadow-amber-900/30 transition-all active:scale-95"
              >
                💡 {isEl ? "Υπόδειξη" : "Hint"}
              </button>
              <button
                onClick={reset}
                className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-slate-300 font-bold text-sm hover:bg-white/20 transition-all"
              >
                🔄 {isEl ? "Νέο παιχνίδι" : "New game"}
              </button>
            </div>
          )}
        </div>
      </div>

      {gameOver && (
        <GameOverModal
          winner={winner === "win" ? 1 : 2}
          playerNames={{
            1: isEl ? "Νίκη! 🎉" : "You win! 🎉",
            2: isEl ? "Δεν υπάρχουν κινήσεις" : "No moves left",
          }}
          stats={{
            [isEl ? "Ζευγάρια" : "Pairs"]: matched,
            [isEl ? "Κινήσεις" : "Moves"]: moves,
          }}
          onPlayAgain={reset}
          onChangeGame={onChangeGame}
        />
      )}
    </div>
  );
}
