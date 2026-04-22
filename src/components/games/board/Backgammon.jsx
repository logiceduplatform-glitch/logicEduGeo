import React, { useState, useEffect, useCallback, useRef } from "react";
import BoardHeader from "./shared/BoardHeader";
import GameOverModal from "./shared/GameOverModal";

const HOME_P1 = [0, 1, 2, 3, 4, 5];
const HOME_P2 = [18, 19, 20, 21, 22, 23];

function initPoints() {
  const p = Array.from({ length: 24 }, () => ({ player: null, count: 0 }));
  p[0]  = { player: 2, count: 2 };
  p[5]  = { player: 1, count: 5 };
  p[7]  = { player: 1, count: 3 };
  p[11] = { player: 2, count: 5 };
  p[12] = { player: 1, count: 5 };
  p[16] = { player: 2, count: 3 };
  p[18] = { player: 2, count: 5 };
  p[23] = { player: 1, count: 2 };
  return p;
}

function initState() {
  return { points: initPoints(), bar: { 1: 0, 2: 0 }, off: { 1: 0, 2: 0 } };
}

function clone(s) {
  return {
    points: s.points.map(p => ({ ...p })),
    bar: { ...s.bar },
    off: { ...s.off },
  };
}

function allInHome(s, pl) {
  if (s.bar[pl] > 0) return false;
  const home = pl === 1 ? HOME_P1 : HOME_P2;
  for (let i = 0; i < 24; i++) {
    if (home.includes(i)) continue;
    if (s.points[i].player === pl && s.points[i].count > 0) return false;
  }
  return true;
}

function movesFromBar(s, pl, die) {
  if (s.bar[pl] === 0) return [];
  const dest = pl === 1 ? 24 - die : die - 1;
  if (dest < 0 || dest > 23) return [];
  const d = s.points[dest];
  if (d.count <= 1 || d.player === pl) return [{ from: "bar", to: dest }];
  return [];
}

function movesFromPoint(s, pl, idx, die) {
  if (s.points[idx].player !== pl || s.points[idx].count === 0) return [];
  const dest = pl === 1 ? idx - die : idx + die;

  if (allInHome(s, pl)) {
    const exact = pl === 1 ? -1 : 24;
    if (dest === exact) return [{ from: idx, to: "off" }];
    if ((pl === 1 && dest < 0) || (pl === 2 && dest > 23)) {
      const home = pl === 1 ? HOME_P1 : HOME_P2;
      const furthest = pl === 1
        ? Math.max(...home.filter(i => s.points[i].player === pl && s.points[i].count > 0))
        : Math.min(...home.filter(i => s.points[i].player === pl && s.points[i].count > 0));
      if (idx === furthest) return [{ from: idx, to: "off" }];
      return [];
    }
  }

  if (dest < 0 || dest > 23) return [];
  const d = s.points[dest];
  if (d.count <= 1 || d.player === pl) return [{ from: idx, to: dest }];
  return [];
}

function singleDieMoves(s, pl, die) {
  if (s.bar[pl] > 0) return movesFromBar(s, pl, die);
  const moves = [];
  for (let i = 0; i < 24; i++) moves.push(...movesFromPoint(s, pl, i, die));
  return moves;
}

function applyMove(s, pl, move) {
  const ns = clone(s);
  const opp = pl === 1 ? 2 : 1;

  if (move.from === "bar") {
    ns.bar[pl]--;
  } else {
    ns.points[move.from].count--;
    if (ns.points[move.from].count === 0) ns.points[move.from].player = null;
  }

  if (move.to === "off") {
    ns.off[pl]++;
    return ns;
  }

  const d = ns.points[move.to];
  if (d.player === opp && d.count === 1) {
    ns.bar[opp]++;
    d.count = 0;
    d.player = null;
  }
  if (d.player === pl) {
    d.count++;
  } else {
    d.player = pl;
    d.count = 1;
  }
  return ns;
}

function diceList(dice) {
  return dice[0] === dice[1] ? [dice[0], dice[0], dice[0], dice[0]] : [dice[0], dice[1]];
}

function findAllSequences(s, pl, dice) {
  const dl = diceList(dice);
  const results = [];
  const search = (st, usedIdx, seq) => {
    let found = false;
    for (let i = 0; i < dl.length; i++) {
      if (usedIdx.has(i)) continue;
      const moves = singleDieMoves(st, pl, dl[i]);
      for (const m of moves) {
        found = true;
        const ns = applyMove(st, pl, m);
        const nextUsed = new Set(usedIdx);
        nextUsed.add(i);
        search(ns, nextUsed, [...seq, { dieIdx: i, die: dl[i], move: m }]);
      }
    }
    if (!found || seq.length > 0) results.push(seq);
  };
  search(s, new Set(), []);
  return results;
}

function bestSequences(s, pl, dice) {
  const all = findAllSequences(s, pl, dice);
  if (all.length === 0) return [];
  const maxLen = Math.max(...all.map(sq => sq.length));
  if (maxLen === 0) return [];
  let best = all.filter(sq => sq.length === maxLen);
  if (dice[0] !== dice[1] && maxLen === 1) {
    const larger = Math.max(dice[0], dice[1]);
    const usesLarger = best.filter(sq => sq[0]?.die === larger);
    if (usesLarger.length > 0) best = usesLarger;
  }
  return best;
}

function evaluateState(s, pl) {
  const opp = pl === 1 ? 2 : 1;
  let score = s.off[pl] * 100;
  score -= s.bar[pl] * 50;
  score += s.bar[opp] * 30;
  const home = pl === 1 ? HOME_P1 : HOME_P2;
  for (let i = 0; i < 24; i++) {
    if (s.points[i].player === pl) {
      if (home.includes(i)) score += s.points[i].count * 3;
      if (s.points[i].count === 1) score -= 8;
      if (s.points[i].count >= 2) score += 5;
      const pip = pl === 1 ? i + 1 : 24 - i;
      score -= pip * s.points[i].count * 0.4;
    }
  }
  return score;
}

function pickAISequence(s, pl, dice, difficulty) {
  const seqs = bestSequences(s, pl, dice);
  if (seqs.length === 0) return null;
  if (difficulty === "easy") return seqs[Math.floor(Math.random() * seqs.length)];

  let bestSeq = seqs[0], bestScore = -Infinity;
  for (const seq of seqs) {
    let st = clone(s);
    for (const step of seq) st = applyMove(st, pl, step.move);
    const sc = evaluateState(st, pl);
    if (sc > bestScore) { bestScore = sc; bestSeq = seq; }
  }
  return bestSeq;
}

function rollTwoDice() {
  return [1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)];
}

function DiceFace({ value }) {
  const dots = {
    1: [[50,50]], 2: [[25,25],[75,75]], 3: [[25,25],[50,50],[75,75]],
    4: [[25,25],[75,25],[25,75],[75,75]], 5: [[25,25],[75,25],[50,50],[25,75],[75,75]],
    6: [[25,25],[75,25],[25,50],[75,50],[25,75],[75,75]],
  }[value] || [];
  return (
    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm rounded-xl shadow-xl border border-white/10 flex items-center justify-center transition-all">
      <svg viewBox="0 0 100 100" className="w-8 h-8 sm:w-10 sm:h-10">
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={8} className="fill-slate-300" />
        ))}
      </svg>
    </div>
  );
}

export default function Backgammon({ mode, difficulty, onPlayAgain, onChangeGame, lang }) {
  const isEl = lang === "el";
  const playerNames = mode === "ai"
    ? { 1: isEl ? "Εσύ" : "You", 2: "AI" }
    : { 1: isEl ? "Λευκός" : "White", 2: isEl ? "Μαύρος" : "Black" };

  const [gameState, setGameState] = useState(initState);
  const [turn, setTurn] = useState(1);
  const [dice, setDice] = useState(null);
  const [remaining, setRemaining] = useState([]);
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [needsRoll, setNeedsRoll] = useState(true);

  const stateRef = useRef(gameState);
  const turnRef = useRef(turn);
  const aiTimer = useRef(null);
  stateRef.current = gameState;
  turnRef.current = turn;

  const canRoll = !gameOver && !aiThinking && needsRoll && (mode === "local" || turn === 1);

  const validDests = (() => {
    if (selected == null || remaining.length === 0) return [];
    const dests = new Set();
    for (const die of remaining) {
      const moves = selected === "bar"
        ? movesFromBar(gameState, turn, die)
        : movesFromPoint(gameState, turn, selected, die);
      for (const m of moves) dests.add(m.to);
    }
    return [...dests];
  })();

  const doRoll = useCallback(() => {
    const d = rollTwoDice();
    setDice(d);
    setRemaining(diceList(d));
    setNeedsRoll(false);
    return d;
  }, []);

  const nextTurn = useCallback(() => {
    setTurn(t => t === 1 ? 2 : 1);
    setDice(null);
    setRemaining([]);
    setSelected(null);
    setNeedsRoll(true);
  }, []);

  const executeMove = useCallback((move, pl) => {
    const s = stateRef.current;
    const ns = applyMove(s, pl, move);
    setGameState(ns);
    stateRef.current = ns;
    setSelected(null);

    if (ns.off[pl] === 15) {
      setGameOver(true);
      setWinner(pl);
      return "won";
    }

    const dieUsed = move.from === "bar"
      ? (pl === 1 ? 24 - move.to : move.to + 1)
      : move.to === "off"
        ? (pl === 1 ? move.from + 1 : 24 - move.from)
        : Math.abs(move.to - move.from);

    setRemaining(prev => {
      const next = [...prev];
      const idx = next.indexOf(dieUsed);
      if (idx >= 0) next.splice(idx, 1);

      if (next.length === 0 || !next.some(d => singleDieMoves(ns, pl, d).length > 0)) {
        setTimeout(nextTurn, 200);
        return [];
      }
      return next;
    });

    return "ok";
  }, [nextTurn]);

  const handlePointClick = useCallback((idx) => {
    if (gameOver || aiThinking || needsRoll) return;
    if (mode === "ai" && turn !== 1) return;

    if (selected != null) {
      if (validDests.includes(idx) || idx === "off") {
        for (const die of remaining) {
          const moves = selected === "bar"
            ? movesFromBar(gameState, turn, die)
            : movesFromPoint(gameState, turn, selected, die);
          const m = moves.find(mv => mv.to === idx);
          if (m) { executeMove(m, turn); return; }
        }
      }
      if (gameState.points[idx]?.player === turn) {
        setSelected(idx);
        return;
      }
      setSelected(null);
      return;
    }

    if (gameState.points[idx]?.player === turn && gameState.points[idx]?.count > 0) {
      if (gameState.bar[turn] > 0) return;
      setSelected(idx);
    }
  }, [gameOver, aiThinking, needsRoll, mode, turn, selected, validDests, remaining, gameState, executeMove]);

  const handleBarClick = useCallback(() => {
    if (gameOver || aiThinking || needsRoll) return;
    if (mode === "ai" && turn !== 1) return;
    if (gameState.bar[turn] > 0) setSelected(s => s === "bar" ? null : "bar");
  }, [gameOver, aiThinking, needsRoll, mode, turn, gameState.bar]);

  // AI auto-roll
  useEffect(() => {
    if (gameOver || mode !== "ai" || turn !== 2 || !needsRoll || aiThinking) return;
    const t = setTimeout(() => {
      const d = rollTwoDice();
      setDice(d);
      setRemaining(diceList(d));
      setNeedsRoll(false);
    }, 400);
    return () => clearTimeout(t);
  }, [turn, needsRoll, gameOver, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // AI play moves
  useEffect(() => {
    if (gameOver || mode !== "ai" || turn !== 2 || needsRoll || aiThinking || !dice) return;

    const s = stateRef.current;
    const seqs = bestSequences(s, 2, dice);
    if (seqs.length === 0 || seqs[0].length === 0) {
      setRemaining([]);
      setTimeout(nextTurn, 300);
      return;
    }

    setAiThinking(true);
    setRemaining([]);
    const timer = setTimeout(() => {
      const seq = pickAISequence(stateRef.current, 2, dice, difficulty || "medium");
      if (seq && seq.length > 0) {
        let st = stateRef.current;
        for (const step of seq) {
          st = applyMove(st, 2, step.move);
        }
        setGameState(st);
        stateRef.current = st;
        setRemaining([]);
        if (st.off[2] === 15) {
          setGameOver(true);
          setWinner(2);
          setAiThinking(false);
          return;
        }
      }
      setAiThinking(false);
      nextTurn();
    }, 600);
    aiTimer.current = timer;
    return () => { clearTimeout(timer); };
  }, [turn, needsRoll, dice, gameOver, mode, nextTurn]); // eslint-disable-line react-hooks/exhaustive-deps

  // Human has no valid moves after rolling
  useEffect(() => {
    if (gameOver || needsRoll || !dice || aiThinking) return;
    if (mode === "ai" && turn === 2) return;
    const dl = diceList(dice);
    const hasAny = dl.some(d => singleDieMoves(stateRef.current, turn, d).length > 0);
    if (!hasAny) setTimeout(nextTurn, 800);
  }, [dice, needsRoll, gameOver, turn, mode, aiThinking, gameState]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    if (aiTimer.current) clearTimeout(aiTimer.current);
    const s = initState();
    setGameState(s);
    stateRef.current = s;
    setTurn(1);
    setDice(null);
    setRemaining([]);
    setSelected(null);
    setGameOver(false);
    setWinner(null);
    setAiThinking(false);
    setNeedsRoll(true);
    onPlayAgain?.();
  }, [onPlayAgain]);

  const title = isEl ? "Τάβλι" : "Backgammon";
  const status = aiThinking ? (isEl ? "AI σκέφτεται..." : "AI thinking...")
    : needsRoll && !gameOver ? (isEl ? "Ρίξε τα ζάρια" : "Roll dice") : null;

  const CHECKER_SIZE = "w-6 h-6 sm:w-7 sm:h-7";

  const renderCheckers = (idx, isTop) => {
    const p = gameState.points[idx];
    if (!p || p.count === 0) return null;
    const shown = Math.min(p.count, 5);
    return (
      <div className={`absolute left-1/2 -translate-x-1/2 flex ${isTop ? "flex-col top-0 pt-0.5" : "flex-col-reverse bottom-0 pb-0.5"}`}
        style={{ gap: "-2px" }}
      >
        {Array.from({ length: shown }, (_, i) => (
          <div key={i} className={[
            CHECKER_SIZE, "rounded-full border-2 shrink-0 transition-shadow",
            p.player === 1
              ? "bg-gradient-to-b from-white to-slate-100 border-slate-300 shadow-xl"
              : "bg-gradient-to-b from-slate-700 to-slate-900 border-slate-500 shadow-xl",
            selected === idx ? "ring-[3px] ring-violet-400 ring-offset-1" : "",
          ].join(" ")} style={{ marginTop: isTop && i > 0 ? "-4px" : "0", marginBottom: !isTop && i > 0 ? "-4px" : "0" }} />
        ))}
        {p.count > 5 && (
          <div className="text-[10px] font-bold text-white bg-black/60 rounded-full w-5 h-5 flex items-center justify-center mx-auto" style={{ marginTop: isTop ? "-4px" : "0", marginBottom: !isTop ? "-4px" : "0" }}>
            {p.count}
          </div>
        )}
      </div>
    );
  };

  const renderTriangle = (idx, isTop, posInGroup) => {
    const isSel = selected === idx;
    const isDest = validDests.includes(idx);
    const dark = posInGroup % 2 === 0;
    const triColor = dark
      ? (isTop ? "border-b-red-900" : "border-t-red-900")
      : (isTop ? "border-b-amber-300" : "border-t-amber-300");

    return (
      <button
        key={idx}
        type="button"
        onClick={() => handlePointClick(idx)}
        className={[
          "relative flex-1 min-w-0",
          isDest ? "z-10" : "",
        ].join(" ")}
        style={{ height: "140px" }}
      >
        {/* Triangle shape via CSS borders */}
        <div className={[
          "absolute inset-x-0",
          isTop ? "top-0" : "bottom-0",
          "h-[120px]",
        ].join(" ")}>
          <div className={[
            "w-0 h-0 mx-auto",
            isTop
              ? `border-l-[18px] sm:border-l-[22px] border-r-[18px] sm:border-r-[22px] border-b-[120px] border-l-transparent border-r-transparent ${triColor}`
              : `border-l-[18px] sm:border-l-[22px] border-r-[18px] sm:border-r-[22px] border-t-[120px] border-l-transparent border-r-transparent ${triColor}`,
          ].join(" ")} />
        </div>
        {/* Highlight ring for selection/destination */}
        {(isSel || isDest) && (
          <div className={[
            "absolute inset-x-0 top-0 bottom-0 rounded-sm",
            isSel ? "bg-violet-400/20 ring-1 ring-inset ring-violet-400" : "",
            isDest ? "bg-amber-400/20 ring-1 ring-inset ring-amber-400" : "",
          ].join(" ")} />
        )}
        {/* Checkers */}
        {renderCheckers(idx, isTop)}
        {/* Point number */}
        <span className={`absolute text-[8px] font-bold text-amber-400/60 ${isTop ? "bottom-0.5" : "top-0.5"} left-1/2 -translate-x-1/2`}>
          {idx + 1}
        </span>
      </button>
    );
  };

  // Standard Portes layout (White/P1 perspective):
  // Top: 13,14,15,16,17,18 | bar | 19,20,21,22,23,24
  // Bot: 12,11,10, 9, 8, 7 | bar |  6, 5, 4, 3, 2, 1
  const topLeft  = [12, 13, 14, 15, 16, 17];
  const topRight = [18, 19, 20, 21, 22, 23];
  const botLeft  = [11, 10, 9, 8, 7, 6];
  const botRight = [5, 4, 3, 2, 1, 0];

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 w-full">
      <div className="w-full max-w-3xl rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-2xl shadow-black/30">
        <BoardHeader
          title={title}
          turn={gameOver ? null : turn}
          playerNames={playerNames}
          scores={{ 1: gameState.off[1], 2: gameState.off[2] }}
          status={status}
        />

        {/* Controls: Dice + Roll */}
        <div className="flex items-center gap-3 justify-center py-3 sm:py-4 bg-white/10 backdrop-blur-sm border-b border-white/10">
          {dice && (
            <div className="flex gap-2">
              <DiceFace value={dice[0]} />
              <DiceFace value={dice[1]} />
            </div>
          )}
          {canRoll && (
            <button
              onClick={doRoll}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-base shadow-xl transition-all hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isEl ? "🎲 Ρίξε" : "🎲 Roll"}
            </button>
          )}
          {remaining.length > 0 && (
            <span className="text-xs text-slate-300 font-mono bg-white/5 px-2 py-1 rounded border border-white/5">
              {remaining.join(" · ")}
            </span>
          )}
        </div>

        {/* Board */}
        <div className="bg-gradient-to-b from-green-900 to-green-950 relative">
          {/* Top half */}
          <div className="flex border-b-2 border-amber-900/80" style={{ height: "160px" }}>
            {/* Left 6 points */}
            <div className="flex flex-1 bg-green-800/60 px-1 pt-2">
              {topLeft.map((idx, i) => renderTriangle(idx, true, i))}
            </div>
            {/* Center bar */}
            <div className="w-10 sm:w-14 bg-amber-900/90 border-x-2 border-amber-950/80 flex flex-col items-center justify-start gap-1 pt-2">
              {gameState.bar[2] > 0 && Array.from({ length: Math.min(gameState.bar[2], 4) }, (_, i) => (
                <div key={i}
                  onClick={handleBarClick}
                  className={`w-6 h-6 rounded-full bg-gradient-to-b from-slate-700 to-slate-900 border-2 border-slate-500 shadow-xl shadow-slate-900/40 cursor-pointer transition-all ${selected === "bar" && turn === 2 ? "ring-[3px] ring-violet-400" : ""}`}
                />
              ))}
              {gameState.bar[2] > 4 && <span className="text-[10px] text-white font-bold">{gameState.bar[2]}</span>}
            </div>
            {/* Right 6 points */}
            <div className="flex flex-1 bg-green-800/60 px-1 pt-2">
              {topRight.map((idx, i) => renderTriangle(idx, true, i))}
            </div>
          </div>

          {/* Bottom half */}
          <div className="flex" style={{ height: "160px" }}>
            <div className="flex flex-1 bg-green-800/60 px-1 pb-2">
              {botLeft.map((idx, i) => renderTriangle(idx, false, i))}
            </div>
            {/* Center bar */}
            <div className="w-10 sm:w-14 bg-amber-900/90 border-x-2 border-amber-950/80 flex flex-col items-center justify-end gap-1 pb-2">
              {gameState.bar[1] > 0 && Array.from({ length: Math.min(gameState.bar[1], 4) }, (_, i) => (
                <div key={i}
                  onClick={handleBarClick}
                  className={`w-6 h-6 rounded-full bg-gradient-to-b from-white to-slate-200 border-2 border-slate-400 shadow-xl shadow-slate-900/20 cursor-pointer transition-all ${selected === "bar" && turn === 1 ? "ring-[3px] ring-violet-400" : ""}`}
                />
              ))}
              {gameState.bar[1] > 4 && <span className="text-[10px] text-white font-bold">{gameState.bar[1]}</span>}
            </div>
            <div className="flex flex-1 bg-green-800/60 px-1 pb-2">
              {botRight.map((idx, i) => renderTriangle(idx, false, i))}
            </div>
          </div>
        </div>

        {/* Bottom info */}
        <div className="bg-white/10 backdrop-blur-sm border-t border-white/10 px-4 sm:px-6 py-4 space-y-2">
          {/* Bear off button */}
          {validDests.includes("off") && !gameOver && !aiThinking && (
            <button
              onClick={() => {
                for (const die of remaining) {
                  const moves = movesFromPoint(gameState, turn, selected, die);
                  const m = moves.find(mv => mv.to === "off");
                  if (m) { executeMove(m, turn); break; }
                }
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-base shadow-xl ring-[3px] ring-amber-400 transition-all hover:opacity-90"
            >
              {isEl ? "🏠 Μάζεμα" : "🏠 Bear Off"}
            </button>
          )}
          {/* Borne off */}
          <div className="flex justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gradient-to-b from-white to-slate-200 border border-white/20" />
              {playerNames[1]}: {gameState.off[1]}/15
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gradient-to-b from-slate-700 to-slate-900 border border-white/10" />
              {playerNames[2]}: {gameState.off[2]}/15
            </span>
          </div>
        </div>
      </div>

      {gameOver && (
        <GameOverModal
          winner={winner}
          playerNames={playerNames}
          stats={{ [isEl ? "Μάζεμα" : "Borne off"]: `${gameState.off[winner]}/15` }}
          onPlayAgain={reset}
          onChangeGame={onChangeGame}
        />
      )}
    </div>
  );
}
