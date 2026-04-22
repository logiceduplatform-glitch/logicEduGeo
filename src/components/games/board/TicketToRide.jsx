import React, { useState, useCallback } from "react";
import BoardHeader from "./shared/BoardHeader";
import GameOverModal from "./shared/GameOverModal";

const COLORS = ["🔴","🔵","🟢","🟡","🟣","⚫"];
const COLOR_NAMES = { en: ["Red","Blue","Green","Yellow","Purple","Black"], el: ["Κόκκ.","Μπλε","Πράσ.","Κίτρ.","Μωβ","Μαύρο"] };
const CITIES = ["Athens","Rome","Paris","Berlin","London","Madrid","Vienna","Prague"];

function generateRoutes() {
  const routes = [];
  for (let i = 0; i < CITIES.length; i++) {
    for (let j = i+1; j < CITIES.length; j++) {
      if (Math.random() > 0.5) {
        routes.push({
          from: CITIES[i], to: CITIES[j],
          length: Math.floor(Math.random()*4)+2,
          color: Math.floor(Math.random()*COLORS.length),
          claimed: 0,
        });
      }
    }
  }
  return routes.length < 8 ? [...routes, ...generateRoutes().slice(0, 8-routes.length)] : routes.slice(0,12);
}

function generateTickets() {
  const tickets = [];
  for (let i = 0; i < 3; i++) {
    const a = Math.floor(Math.random()*CITIES.length);
    let b = a;
    while (b === a) b = Math.floor(Math.random()*CITIES.length);
    tickets.push({ from: CITIES[a], to: CITIES[b], points: Math.floor(Math.random()*10)+5, completed: false });
  }
  return tickets;
}

export default function TicketToRide({ mode, difficulty, onPlayAgain, onChangeGame, lang }) {
  const isEl = lang === "el";
  const playerNames = mode === "ai"
    ? { 1: isEl ? "Εσύ" : "You", 2: "AI" }
    : { 1: isEl ? "Παίκτης 1" : "Player 1", 2: isEl ? "Παίκτης 2" : "Player 2" };

  const [routes, setRoutes] = useState(generateRoutes);
  const [cards, setCards] = useState(() => Array.from({length:6}, () => Math.floor(Math.random()*COLORS.length)));
  const [aiCards, setAiCards] = useState(() => Array.from({length:6}, () => Math.floor(Math.random()*COLORS.length)));
  const [tickets, setTickets] = useState(generateTickets);
  const [trains, setTrains] = useState(30);
  const [aiTrains, setAiTrains] = useState(30);
  const [score, setScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [turn, setTurn] = useState(1);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState("");

  const gameOver = winner !== null;
  const canInteract = !gameOver && (mode === "local" || turn === 1);
  const currentCards = turn === 1 ? cards : aiCards;
  const setCurrentCards = turn === 1 ? setCards : setAiCards;
  const currentTrains = turn === 1 ? trains : aiTrains;
  const setCurrentTrains = turn === 1 ? setTrains : setAiTrains;
  const currentScore = turn === 1 ? score : aiScore;
  const setCurrentScore = turn === 1 ? setScore : setAiScore;
  const claimValue = turn === 1 ? 1 : 2;

  const drawCard = useCallback(() => {
    if (!canInteract) return;
    setCurrentCards(prev => [...prev, Math.floor(Math.random()*COLORS.length)]);
    setMessage(isEl ? "Τράβηξες κάρτα!" : "Drew a card!");
    if (mode === "ai") {
      aiTurn();
    } else {
      setTurn(prev => prev === 1 ? 2 : 1);
    }
  }, [gameOver, isEl, canInteract, mode, setCurrentCards]);

  const claimRoute = useCallback((idx) => {
    if (!canInteract) return;
    const route = routes[idx];
    if (route.claimed) { setMessage(isEl ? "Ήδη κατειλημμένη!" : "Already claimed!"); return; }
    if (currentTrains < route.length) { setMessage(isEl ? "Δεν έχεις αρκετά τρένα!" : "Not enough trains!"); return; }

    const colorCards = currentCards.filter(c => c === route.color).length;
    if (colorCards < route.length) { setMessage(isEl ? "Χρειάζεσαι περισσότερες κάρτες!" : "Need more cards of this color!"); return; }

    const newCards = [...currentCards];
    let removed = 0;
    const filtered = newCards.filter(c => { if (c === route.color && removed < route.length) { removed++; return false; } return true; });

    const points = route.length * route.length;
    const newRoutes = routes.map((r,i) => i === idx ? { ...r, claimed: claimValue } : r);

    setCurrentCards(filtered);
    setRoutes(newRoutes);
    setCurrentTrains(prev => prev - route.length);
    setCurrentScore(prev => prev + points);
    setMessage(`+${points} ${isEl ? "πόντοι" : "points"}!`);

    const otherScore = turn === 1 ? aiScore : score;
    const newCurrentScore = currentScore + points;
    const trainsLeft = currentTrains - route.length;
    if (trainsLeft <= 2) {
      setWinner(newCurrentScore > otherScore ? turn : newCurrentScore < otherScore ? (turn === 1 ? 2 : 1) : "draw");
      return;
    }
    if (mode === "ai") {
      aiTurn(newRoutes);
    } else {
      setTurn(prev => prev === 1 ? 2 : 1);
    }
  }, [canInteract, routes, currentCards, currentTrains, currentScore, score, aiScore, turn, isEl, claimValue, setCurrentCards, setCurrentTrains, setCurrentScore, mode]);

  const aiTurn = useCallback((currentRoutes) => {
    if (mode !== "ai") return;
    const rs = currentRoutes || routes;
    const available = rs.filter(r => !r.claimed && aiTrains >= r.length);
    if (available.length > 0 && Math.random() > 0.4) {
      const pick = available[Math.floor(Math.random()*available.length)];
      const idx = rs.indexOf(pick);
      const points = pick.length * pick.length;
      setRoutes(prev => prev.map((r,i) => i === idx ? { ...r, claimed: 2 } : r));
      setAiTrains(prev => prev - pick.length);
      setAiScore(prev => prev + points);
      if (aiTrains - pick.length <= 2) {
        setWinner(score > aiScore + points ? 1 : score < aiScore + points ? 2 : "draw");
      }
    }
  }, [routes, aiTrains, aiScore, score, mode]);

  const reset = useCallback(() => {
    setRoutes(generateRoutes()); setCards(Array.from({length:6}, () => Math.floor(Math.random()*COLORS.length)));
    setAiCards(Array.from({length:6}, () => Math.floor(Math.random()*COLORS.length)));
    setTickets(generateTickets()); setTrains(30); setAiTrains(30);
    setScore(0); setAiScore(0); setTurn(1); setWinner(null); setMessage("");
    onPlayAgain?.();
  }, [onPlayAgain]);

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 w-full">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-2xl shadow-black/30">
        <BoardHeader title="Ticket to Ride" turn={gameOver ? null : turn} playerNames={playerNames}
          scores={{ 1: score, 2: aiScore }} />
        <div className="p-4 sm:p-6 space-y-4">
          {/* Routes */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {routes.map((r,i) => (
              <button key={i} onClick={() => claimRoute(i)} disabled={!!r.claimed || gameOver || !canInteract}
                className={["w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-base font-medium transition-all border",
                  r.claimed === 1 ? "bg-gradient-to-br from-violet-500/30 to-violet-600/20 border-violet-400/30 text-violet-300 ring-[3px] ring-violet-400/50"
                  : r.claimed === 2 ? "bg-gradient-to-br from-amber-500/30 to-amber-600/20 border-amber-400/30 text-amber-300 ring-[3px] ring-amber-400/50"
                  : "bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border-white/10 hover:bg-white/10 text-slate-300"
                ].join(" ")}>
                <span className="text-xl">{COLORS[r.color]}</span>
                <span className="flex-1 text-left">{r.from} → {r.to}</span>
                <span className="text-sm bg-white/10 border border-white/10 px-3 py-1 rounded-full text-slate-300">🚂 {r.length}</span>
                {r.claimed === 1 && <span className="text-xs">✅</span>}
                {r.claimed === 2 && <span className="text-xs">🤖</span>}
              </button>
            ))}
          </div>

          {/* Hand */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">{playerNames[turn]} {isEl ? "κάρτες" : "Cards"}</p>
            <div className="flex flex-wrap gap-1">
              {currentCards.map((c,i) => <span key={i} className="text-2xl drop-shadow-md">{COLORS[c]}</span>)}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3 justify-center text-sm font-semibold">
            <span className="px-4 py-2 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-slate-300">{playerNames[1]}: 🚂 {trains}</span>
            <span className="px-4 py-2 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-slate-300">{playerNames[2]}: 🚂 {aiTrains}</span>
          </div>

          {message && <p className="text-center text-sm text-slate-400">{message}</p>}

          {!gameOver && (
            <div className="flex gap-2 justify-center">
              <button onClick={drawCard} disabled={!canInteract} className="px-6 py-3 text-base rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-slate-300 font-bold shadow-xl hover:bg-white/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                🃏 {isEl ? "Τράβηξε κάρτα" : "Draw Card"}
              </button>
            </div>
          )}
        </div>
      </div>
      {gameOver && <GameOverModal winner={winner} playerNames={playerNames}
        stats={{ [isEl ? "Πόντοι" : "Score"]: score, [isEl ? "Τρένα" : "Trains left"]: trains }}
        onPlayAgain={reset} onChangeGame={onChangeGame} />}
    </div>
  );
}
