import React, { useState, useCallback } from "react";
import BoardHeader from "./shared/BoardHeader";
import GameOverModal from "./shared/GameOverModal";

const RESOURCES = ["🌾", "🧱", "🪵", "🐑", "⛰️"];
const RES_NAMES = { el: ["Σιτάρι","Τούβλο","Ξύλο","Μαλλί","Πέτρα"], en: ["Wheat","Brick","Wood","Wool","Ore"] };
const HEX_TYPES = ["wheat","brick","wood","wool","ore","desert"];
const HEX_GRADIENT = {
  wheat: "bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-900/40",
  brick: "bg-gradient-to-br from-red-400 to-red-600 shadow-xl shadow-red-900/40",
  wood: "bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-xl shadow-emerald-900/40",
  wool: "bg-gradient-to-br from-lime-400 to-lime-600 shadow-xl shadow-lime-900/40",
  ore: "bg-gradient-to-br from-slate-400 to-slate-600 shadow-xl shadow-slate-900/40",
  desert: "bg-gradient-to-br from-amber-200 to-stone-400 shadow-xl shadow-amber-900/30",
};

function shuffled(arr) { const a = [...arr]; for (let i = a.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; }

function initHexes() {
  const types = shuffled([...HEX_TYPES, ...HEX_TYPES, ...HEX_TYPES.slice(0,3)].slice(0,7));
  const nums = shuffled([2,3,4,5,6,8,9,10,11,12].slice(0,7));
  return types.map((t,i) => ({ type: t, number: t === "desert" ? 7 : nums[i] || (i+2), hasRobber: t === "desert" }));
}

function rollDice() { return Math.floor(Math.random()*6)+1 + Math.floor(Math.random()*6)+1; }

export default function Catan({ mode, difficulty, onPlayAgain, onChangeGame, lang }) {
  const isEl = lang === "el";
  const playerNames = mode === "ai"
    ? { 1: isEl ? "Εσύ" : "You", 2: "AI" }
    : { 1: isEl ? "Παίκτης 1" : "Player 1", 2: isEl ? "Παίκτης 2" : "Player 2" };

  const [hexes, setHexes] = useState(initHexes);
  const [resources, setResources] = useState([2,2,2,2,2]);
  const [aiResources, setAiResources] = useState([2,2,2,2,2]);
  const [settlements, setSettlements] = useState([]);
  const [aiSettlements, setAiSettlements] = useState([]);
  const [roads, setRoads] = useState(0);
  const [aiRoads, setAiRoads] = useState(0);
  const [diceResult, setDiceResult] = useState(null);
  const [turn, setTurn] = useState(1);
  const [phase, setPhase] = useState("roll");
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState("");

  const playerScore = settlements.length + Math.floor(roads / 3);
  const aiScore = aiSettlements.length + Math.floor(aiRoads / 3);
  const gameOver = winner !== null;

  const checkWin = useCallback((ps, as, pr, ar) => {
    if (ps + Math.floor(pr / 3) >= 5) return 1;
    if (as + Math.floor(ar / 3) >= 5) return 2;
    return null;
  }, []);

  const canInteract = !gameOver && (mode === "local" || turn === 1);
  const currentResources = turn === 1 ? resources : aiResources;
  const setCurrentResources = turn === 1 ? setResources : setAiResources;
  const currentSettlements = turn === 1 ? settlements : aiSettlements;
  const setCurrentSettlements = turn === 1 ? setSettlements : setAiSettlements;
  const currentRoads = turn === 1 ? roads : aiRoads;
  const setCurrentRoads = turn === 1 ? setRoads : setAiRoads;

  const handleRoll = useCallback(() => {
    if (!canInteract || phase !== "roll") return;
    const dice = rollDice();
    setDiceResult(dice);

    if (dice === 7) {
      setMessage(isEl ? "Ρίξατε 7! Ληστής ενεργοποιήθηκε." : "Rolled 7! Robber activated.");
      setPhase("build");
      return;
    }

    const gained = [0,0,0,0,0];
    hexes.forEach(h => {
      if (h.number === dice && !h.hasRobber) {
        const ri = HEX_TYPES.indexOf(h.type);
        if (ri >= 0 && ri < 5) gained[ri] += 1;
      }
    });

    if (turn === 1) {
      setResources(prev => prev.map((v,i) => v + gained[i]));
    } else {
      if (mode === "ai") {
        setAiResources(prev => prev.map((v,i) => v + Math.floor(Math.random()*2)));
      } else {
        setAiResources(prev => prev.map((v,i) => v + gained[i]));
      }
    }
    setMessage(isEl ? `Ζάρι: ${dice}` : `Dice: ${dice}`);
    setPhase("build");
  }, [hexes, isEl, turn, mode, canInteract, phase]);

  const buildSettlement = useCallback(() => {
    if (!canInteract || phase !== "build") return;
    if (currentResources[0] < 1 || currentResources[1] < 1 || currentResources[2] < 1 || currentResources[3] < 1) {
      setMessage(isEl ? "Δεν έχεις αρκετούς πόρους!" : "Not enough resources!");
      return;
    }
    setCurrentResources(prev => [prev[0]-1, prev[1]-1, prev[2]-1, prev[3]-1, prev[4]]);
    const newS = [...currentSettlements, currentSettlements.length];
    setCurrentSettlements(newS);
    const ps = turn === 1 ? newS.length : settlements.length;
    const as = turn === 1 ? aiSettlements.length : newS.length;
    const pr = turn === 1 ? roads : aiRoads;
    const ar = turn === 1 ? aiRoads : roads;
    const w = checkWin(ps, as, pr, ar);
    if (w) { setWinner(w); return; }
    setMessage(isEl ? "Χτίστηκε οικισμός!" : "Settlement built!");
  }, [canInteract, phase, currentResources, currentSettlements, settlements, aiSettlements, roads, aiRoads, turn, isEl, checkWin, setCurrentResources, setCurrentSettlements]);

  const buildRoad = useCallback(() => {
    if (!canInteract || phase !== "build") return;
    if (currentResources[1] < 1 || currentResources[2] < 1) {
      setMessage(isEl ? "Χρειάζεσαι τούβλο + ξύλο!" : "Need brick + wood!");
      return;
    }
    setCurrentResources(prev => [prev[0], prev[1]-1, prev[2]-1, prev[3], prev[4]]);
    const newR = currentRoads + 1;
    setCurrentRoads(newR);
    const pr = turn === 1 ? newR : roads;
    const ar = turn === 1 ? aiRoads : newR;
    const w = checkWin(currentSettlements.length, turn === 1 ? aiSettlements.length : currentSettlements.length, pr, ar);
    if (w) { setWinner(w); return; }
    setMessage(isEl ? "Χτίστηκε δρόμος!" : "Road built!");
  }, [canInteract, phase, currentResources, currentRoads, currentSettlements, settlements, aiSettlements, roads, aiRoads, turn, isEl, checkWin, setCurrentResources, setCurrentRoads]);

  const endTurn = useCallback(() => {
    if (!canInteract || phase !== "build") return;
    if (mode === "ai") {
      // AI builds
      let as = [...aiSettlements], ar = aiRoads, ares = [...aiResources];
      if (ares[0]>=1 && ares[1]>=1 && ares[2]>=1 && ares[3]>=1 && Math.random() > 0.3) {
        ares = [ares[0]-1, ares[1]-1, ares[2]-1, ares[3]-1, ares[4]];
        as = [...as, as.length];
      }
      if (ares[1]>=1 && ares[2]>=1 && Math.random() > 0.4) {
        ares = [ares[0], ares[1]-1, ares[2]-1, ares[3], ares[4]];
        ar++;
      }
      setAiSettlements(as);
      setAiRoads(ar);
      setAiResources(ares);
      const w = checkWin(settlements.length, as.length, roads, ar);
      if (w) { setWinner(w); return; }
    } else {
      // Local mode: switch turns
      setTurn(prev => prev === 1 ? 2 : 1);
    }
    setPhase("roll");
    setDiceResult(null);
    setMessage("");
  }, [canInteract, phase, mode, aiSettlements, aiRoads, aiResources, settlements, roads, checkWin]);

  const reset = useCallback(() => {
    setHexes(initHexes()); setResources([2,2,2,2,2]); setAiResources([2,2,2,2,2]);
    setSettlements([]); setAiSettlements([]); setRoads(0); setAiRoads(0);
    setDiceResult(null); setPhase("roll"); setTurn(1); setWinner(null); setMessage("");
    onPlayAgain?.();
  }, [onPlayAgain]);

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 w-full">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-2xl shadow-black/30">
        <BoardHeader title="Catan" turn={gameOver ? null : turn} playerNames={playerNames}
          scores={{ 1: playerScore, 2: aiScore }} />

        <div className="p-4 sm:p-6 space-y-4">
          {/* Hex grid */}
          <div className="flex flex-wrap justify-center gap-3">
            {hexes.map((h,i) => (
              <div key={i} className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center text-sm font-bold border border-white/10 transition-all ${HEX_GRADIENT[h.type] || ""}`}>
                <span className="text-2xl">{h.type === "desert" ? "🏜️" : RESOURCES[HEX_TYPES.indexOf(h.type)]}</span>
                <span className="text-white drop-shadow">{h.number}</span>
              </div>
            ))}
          </div>

          {/* Resources */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">
              {playerNames[turn]} {isEl ? "πόροι" : "Resources"}
            </p>
            <div className="flex gap-3 justify-center">
              {RESOURCES.map((r,i) => (
                <div key={i} className="text-center">
                  <span className="text-xl">{r}</span>
                  <span className="block text-sm font-bold text-slate-300">{currentResources[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 justify-center text-sm">
            <span className="px-4 py-2 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-slate-300 font-semibold">
              🏠 {settlements.length} | 🛤️ {roads}
            </span>
            <span className="px-4 py-2 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-slate-300 font-semibold">
              {playerNames[2]}: 🏠 {aiSettlements.length} | 🛤️ {aiRoads}
            </span>
          </div>

          {message && <p className="text-center text-sm text-slate-400 font-medium">{message}</p>}

          {/* Actions */}
          {!gameOver && (
            <div className="flex flex-wrap gap-2 justify-center">
              {phase === "roll" && (
                <button onClick={handleRoll} disabled={!canInteract} className="px-6 py-3 text-base rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold shadow-xl shadow-violet-900/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  🎲 {isEl ? "Ρίξε ζάρια" : "Roll Dice"}
                </button>
              )}
              {phase === "build" && (
                <>
                  <button onClick={buildSettlement} disabled={!canInteract} className="px-5 py-2.5 text-base rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold shadow-xl shadow-violet-900/40 hover:from-violet-500 hover:to-fuchsia-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    🏠 {isEl ? "Οικισμός" : "Settlement"}
                  </button>
                  <button onClick={buildRoad} disabled={!canInteract} className="px-5 py-2.5 text-base rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-slate-300 font-semibold hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    🛤️ {isEl ? "Δρόμος" : "Road"}
                  </button>
                  <button onClick={endTurn} disabled={!canInteract} className="px-5 py-2.5 text-base rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-slate-300 font-semibold hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    ⏭️ {isEl ? "Τέλος γύρου" : "End Turn"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {gameOver && <GameOverModal winner={winner} playerNames={playerNames}
        stats={{ [isEl ? "Οικισμοί" : "Settlements"]: settlements.length, [isEl ? "Δρόμοι" : "Roads"]: roads, [isEl ? "Πόντοι" : "Points"]: playerScore }}
        onPlayAgain={reset} onChangeGame={onChangeGame} />}
    </div>
  );
}
