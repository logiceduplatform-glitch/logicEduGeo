import React, { useState, useCallback } from "react";
import BoardHeader from "./shared/BoardHeader";
import GameOverModal from "./shared/GameOverModal";

const CITIES = ["Athens","Paris","London","Berlin","Rome","Madrid","Istanbul","Cairo"];
const DISEASES = ["🔴","🔵","🟡","⚫"];

function initMap() {
  return CITIES.map((name, i) => ({
    name, cubes: { 0: Math.floor(Math.random()*2), 1: 0, 2: 0, 3: 0 },
    station: i === 0, connections: [CITIES[(i+1)%CITIES.length], CITIES[(i+CITIES.length-1)%CITIES.length], CITIES[(i+3)%CITIES.length]],
  }));
}

export default function Pandemic({ mode, difficulty, onPlayAgain, onChangeGame, lang }) {
  const isEl = lang === "el";

  const [cities, setCities] = useState(initMap);
  const [position, setPosition] = useState("Athens");
  const [hand, setHand] = useState(() => CITIES.slice(0,4));
  const [cured, setCured] = useState([false,false,false,false]);
  const [outbreaks, setOutbreaks] = useState(0);
  const [actionsLeft, setActionsLeft] = useState(4);
  const [infectionRate, setInfectionRate] = useState(2);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState(isEl ? "4 ενέργειες ανά γύρο" : "4 actions per turn");
  const [turnCount, setTurnCount] = useState(1);

  const gameOver = winner !== null;
  const totalCubes = cities.reduce((s, c) => s + Object.values(c.cubes).reduce((a,b) => a+b, 0), 0);

  const currentCity = cities.find(c => c.name === position);

  const infect = useCallback((cs) => {
    const newCities = cs.map(c => ({...c, cubes: {...c.cubes}}));
    let ob = outbreaks;
    for (let i = 0; i < infectionRate; i++) {
      const idx = Math.floor(Math.random()*newCities.length);
      const disease = Math.floor(Math.random()*4);
      if (newCities[idx].cubes[disease] >= 3) { ob++; } else { newCities[idx].cubes[disease]++; }
    }
    setOutbreaks(ob);
    if (ob >= 8) { setWinner("lose"); }
    return newCities;
  }, [infectionRate, outbreaks]);

  const endTurn = useCallback(() => {
    const drawn = CITIES[Math.floor(Math.random()*CITIES.length)];
    setHand(prev => [...prev, drawn].slice(-7));
    const nc = infect(cities);
    setCities(nc);
    setActionsLeft(4);
    setTurnCount(prev => prev+1);
    setMessage(isEl ? "Νέος γύρος! 4 ενέργειες." : "New turn! 4 actions.");
  }, [cities, infect, isEl]);

  const moveTo = useCallback((city) => {
    if (gameOver || actionsLeft <= 0) return;
    if (!currentCity.connections.includes(city)) { setMessage(isEl ? "Δεν συνδέεται!" : "Not connected!"); return; }
    setPosition(city);
    const left = actionsLeft - 1;
    setActionsLeft(left);
    if (left <= 0) endTurn();
  }, [gameOver, actionsLeft, currentCity, endTurn, isEl]);

  const treat = useCallback(() => {
    if (gameOver || actionsLeft <= 0) return;
    const city = cities.find(c => c.name === position);
    const diseaseIdx = Object.entries(city.cubes).find(([,v]) => v > 0)?.[0];
    if (diseaseIdx === undefined) { setMessage(isEl ? "Καθαρή πόλη!" : "City is clean!"); return; }
    const nc = cities.map(c => c.name === position ? {...c, cubes: {...c.cubes, [diseaseIdx]: c.cubes[diseaseIdx]-1}} : c);
    setCities(nc);
    setMessage(`${isEl ? "Θεράπευσες" : "Treated"} ${DISEASES[diseaseIdx]}!`);
    const left = actionsLeft - 1;
    setActionsLeft(left);
    if (left <= 0) endTurn();
  }, [gameOver, actionsLeft, cities, position, endTurn, isEl]);

  const buildStation = useCallback(() => {
    if (gameOver || actionsLeft <= 0) return;
    if (!hand.includes(position)) { setMessage(isEl ? "Χρειάζεσαι κάρτα πόλης!" : "Need city card!"); return; }
    setCities(prev => prev.map(c => c.name === position ? {...c, station: true} : c));
    setHand(prev => prev.filter(c => c !== position));
    setMessage(isEl ? "Σταθμός χτίστηκε!" : "Station built!");
    const left = actionsLeft - 1;
    setActionsLeft(left);
    if (left <= 0) endTurn();
  }, [gameOver, actionsLeft, hand, position, endTurn, isEl]);

  const cure = useCallback(() => {
    if (gameOver || actionsLeft <= 0) return;
    if (!currentCity.station) { setMessage(isEl ? "Χρειάζεσαι σταθμό!" : "Need a station!"); return; }
    if (hand.length < 4) { setMessage(isEl ? "Χρειάζεσαι 4 κάρτες!" : "Need 4 cards!"); return; }
    const diseaseIdx = cured.findIndex(c => !c);
    if (diseaseIdx < 0) return;
    const nc = [...cured]; nc[diseaseIdx] = true;
    setCured(nc);
    setHand(prev => prev.slice(4));
    setMessage(`${isEl ? "Θεραπεύτηκε" : "Cured"} ${DISEASES[diseaseIdx]}!`);
    if (nc.every(Boolean)) { setWinner("win"); return; }
    const left = actionsLeft - 1;
    setActionsLeft(left);
    if (left <= 0) endTurn();
  }, [gameOver, actionsLeft, currentCity, hand, cured, endTurn, isEl]);

  const reset = useCallback(() => {
    setCities(initMap()); setPosition("Athens"); setHand(CITIES.slice(0,4));
    setCured([false,false,false,false]); setOutbreaks(0); setActionsLeft(4);
    setInfectionRate(2); setWinner(null); setTurnCount(1);
    setMessage(isEl ? "4 ενέργειες ανά γύρο" : "4 actions per turn");
    onPlayAgain?.();
  }, [isEl, onPlayAgain]);

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 w-full">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-2xl shadow-black/30">
        <BoardHeader title="Pandemic" turn={null} playerNames={{ 1: isEl ? "Ομάδα" : "Team" }}
          status={`${isEl ? "Γύρος" : "Turn"} ${turnCount} | ${isEl ? "Ενέργειες" : "Actions"}: ${actionsLeft}`} />
        <div className="p-4 sm:p-6 space-y-5">
          {/* Map */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cities.map(c => {
              const isHere = c.name === position;
              const cubeTotal = Object.values(c.cubes).reduce((a,b) => a+b, 0);
              return (
                <button key={c.name} onClick={() => moveTo(c.name)}
                  className={["rounded-2xl p-4 text-center text-sm font-bold transition-all border-2 min-h-[100px] flex flex-col items-center justify-center gap-2",
                    isHere ? "border-violet-400/80 bg-gradient-to-br from-violet-500/30 to-fuchsia-500/20 backdrop-blur-sm shadow-xl scale-105 ring-[3px] ring-violet-400"
                    : cubeTotal > 2 ? "border-red-400/60 bg-gradient-to-br from-red-500/30 to-red-700/20 backdrop-blur-sm hover:bg-red-500/40 shadow-xl"
                    : "border-white/10 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm hover:bg-white/20 shadow-xl",
                  ].join(" ")}>
                  <div className="font-bold text-white text-base truncate max-w-full">{c.name}</div>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {Object.entries(c.cubes).map(([d,v]) => v > 0 && (
                      <span key={d} className="inline-flex items-center justify-center min-w-[1.75rem] h-6 rounded-lg bg-gradient-to-br from-red-500/50 to-red-700/50 text-xs font-bold shadow-md border border-white/20">
                        {DISEASES[d]}×{v}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center mt-1">
                    {c.station && <span className="text-base">🏥</span>}
                    {isHere && <span className="text-base">📍</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Status */}
          <div className="flex flex-wrap gap-3 justify-center text-sm font-semibold">
            {cured.map((c,i) => (
              <span key={i} className={`px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10 transition-all shadow-xl ${c ? "bg-gradient-to-r from-emerald-500/40 to-teal-500/30 text-emerald-300 border-emerald-400/40" : "bg-white/5 text-slate-400"}`}>
                {DISEASES[i]} {c ? "✅" : "❌"}
              </span>
            ))}
            <span className={`px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10 transition-all shadow-xl ${outbreaks > 5 ? "bg-gradient-to-r from-red-500/40 to-rose-600/30 text-red-300 border-red-400/40" : "bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-300 border-amber-400/40"}`}>
              💥 {outbreaks}/8
            </span>
          </div>

          {/* Hand */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-xl">
            <p className="text-sm font-bold text-slate-400 uppercase mb-2 tracking-wide">{isEl ? "Κάρτες" : "Hand"} ({hand.length})</p>
            <div className="flex flex-wrap gap-2">{hand.map((c,i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-slate-300 text-sm font-medium transition-all shadow-md">{c}</span>
            ))}</div>
          </div>

          {message && <p className="text-center text-sm text-slate-400 font-medium">{message}</p>}

          {!gameOver && (
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={treat} className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-base font-bold shadow-xl transition-all hover:from-emerald-600 hover:to-teal-700 hover:-translate-y-0.5">💊 {isEl ? "Θεράπευσε" : "Treat"}</button>
              <button onClick={buildStation} className="px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-slate-300 text-base font-bold shadow-xl transition-all hover:bg-white/20">🏥 {isEl ? "Σταθμός" : "Station"}</button>
              <button onClick={cure} className="px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-base font-bold shadow-xl transition-all hover:from-violet-700 hover:to-fuchsia-700 hover:-translate-y-0.5">🧬 {isEl ? "Εμβόλιο" : "Cure"}</button>
              <button onClick={endTurn} className="px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-slate-300 text-base font-bold shadow-xl transition-all hover:bg-white/20">⏭️ {isEl ? "Τέλος" : "End"}</button>
            </div>
          )}
        </div>
      </div>
      {gameOver && <GameOverModal
        winner={winner === "win" ? 1 : winner === "lose" ? 2 : "draw"}
        playerNames={{ 1: isEl ? "Ομάδα" : "Team", 2: isEl ? "Ιός" : "Virus" }}
        stats={{ [isEl ? "Γύροι" : "Turns"]: turnCount, [isEl ? "Εξάρσεις" : "Outbreaks"]: outbreaks, [isEl ? "Θεραπείες" : "Cured"]: cured.filter(Boolean).length }}
        onPlayAgain={reset} onChangeGame={onChangeGame} />}
    </div>
  );
}
