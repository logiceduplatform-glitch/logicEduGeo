import React, { useState, useCallback, useEffect, useRef } from "react";
import BoardHeader from "./shared/BoardHeader";
import GameOverModal from "./shared/GameOverModal";

const UNO_COLORS = ["red","blue","green","yellow"];
const UNO_VALUES = ["0","1","2","3","4","5","6","7","8","9","Skip","Rev","D2"];
const COLOR_STYLES = {
  red: "bg-gradient-to-br from-red-400 to-red-600 text-white border-white/10 shadow-xl shadow-red-900/40",
  blue: "bg-gradient-to-br from-blue-400 to-blue-600 text-white border-white/10 shadow-xl shadow-blue-900/40",
  green: "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-white/10 shadow-xl shadow-emerald-900/40",
  yellow: "bg-gradient-to-br from-yellow-400 to-yellow-600 text-slate-900 border-white/10 shadow-xl shadow-yellow-900/40",
  wild: "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-purple-600 text-white border-white/10 shadow-xl shadow-purple-900/40",
};

function makeCard() {
  if (Math.random() < 0.08) return { color: "wild", value: "Wild", isWild: true };
  if (Math.random() < 0.04) return { color: "wild", value: "W+4", isWild: true, draw4: true };
  const color = UNO_COLORS[Math.floor(Math.random()*4)];
  const value = UNO_VALUES[Math.floor(Math.random()*UNO_VALUES.length)];
  return { color, value, isWild: false };
}

function deal(n) { return Array.from({length: n}, makeCard); }

function canPlay(card, top, currentColor) {
  if (card.isWild) return true;
  return card.color === currentColor || card.value === top.value;
}

export default function Uno({ mode, difficulty, onPlayAgain, onChangeGame, lang }) {
  const isEl = lang === "el";
  const playerNames = mode === "ai"
    ? { 1: isEl ? "Εσύ" : "You", 2: "AI" }
    : { 1: isEl ? "Παίκτης 1" : "Player 1", 2: isEl ? "Παίκτης 2" : "Player 2" };

  const [hand, setHand] = useState(() => deal(7));
  const [aiHand, setAiHand] = useState(() => deal(7));
  const [discard, setDiscard] = useState(() => [makeCard()]);
  const [currentColor, setCurrentColor] = useState(() => UNO_COLORS[0]);
  const [turn, setTurn] = useState(1);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState("");
  const [pickingColor, setPickingColor] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [passDeviceTo, setPassDeviceTo] = useState(null);
  const pendingCardRef = useRef(null);

  const top = discard[discard.length - 1];
  const gameOver = winner !== null;
  const canInteract = !gameOver && !aiThinking && (mode === "local" || turn === 1);
  const activeHand = turn === 1 ? hand : aiHand;
  const setActiveHand = turn === 1 ? setHand : setAiHand;
  const otherHand = turn === 1 ? aiHand : hand;
  const setOtherHand = turn === 1 ? setAiHand : setHand;

  useEffect(() => {
    if (!top.isWild) setCurrentColor(top.color);
  }, []);

  const playCard = useCallback((idx) => {
    const activeHandNow = turn === 1 ? hand : aiHand;
    const setActiveHandNow = turn === 1 ? setHand : setAiHand;
    const setOtherHandNow = turn === 1 ? setAiHand : setHand;
    if (gameOver || pickingColor || aiThinking) return;
    if (mode === "ai" && turn !== 1) return;
    if (mode === "local" && !canInteract) return;
    const card = activeHandNow[idx];
    if (!canPlay(card, top, currentColor)) { setMessage(isEl ? "Δεν μπορεί αυτή!" : "Can't play that!"); return; }

    const newHand = activeHandNow.filter((_,i) => i !== idx);
    setActiveHandNow(newHand);
    setDiscard(prev => [...prev, card]);

    const currentPlayer = turn;
    if (newHand.length === 0) { setWinner(currentPlayer); return; }

    if (card.isWild) {
      pendingCardRef.current = card;
      setPickingColor(true);
      return;
    }

    setCurrentColor(card.color);
    if (card.value === "D2") {
      setOtherHandNow(prev => [...prev, makeCard(), makeCard()]);
      setTurn(turn);
      setMessage(mode === "ai" ? (isEl ? "AI χάνει σειρά!" : "AI skips turn!") : "");
      return;
    }
    if (card.value === "Skip") {
      if (mode === "ai") { setMessage(isEl ? "AI χάνει σειρά!" : "AI skips turn!"); return; }
      setTurn(turn);
      setMessage("");
      return;
    }
    const nextTurn = turn === 1 ? 2 : 1;
    setTurn(nextTurn);
    if (mode === "local") setPassDeviceTo(nextTurn);
    setMessage("");
  }, [gameOver, turn, hand, aiHand, top, currentColor, pickingColor, aiThinking, isEl, mode, canInteract]);

  const pickColor = useCallback((color) => {
    setCurrentColor(color);
    setPickingColor(false);
    const card = pendingCardRef.current;
    if (card?.draw4) {
      if (turn === 1) setAiHand(prev => [...prev, ...deal(4)]);
      else setHand(prev => [...prev, ...deal(4)]);
    }
    const nextTurn = turn === 1 ? 2 : 1;
    setTurn(nextTurn);
    if (mode === "local") setPassDeviceTo(nextTurn);
    setMessage("");
  }, [turn, mode]);

  const drawCard = useCallback(() => {
    if (gameOver || pickingColor || aiThinking) return;
    if (mode === "ai" && turn !== 1) return;
    if (mode === "local" && !canInteract) return;
    const setActiveHandNow = turn === 1 ? setHand : setAiHand;
    setActiveHandNow(prev => [...prev, makeCard()]);
    const nextTurn = turn === 1 ? 2 : 1;
    setTurn(nextTurn);
    if (mode === "local") setPassDeviceTo(nextTurn);
    setMessage("");
  }, [gameOver, turn, pickingColor, aiThinking, mode, canInteract]);

  useEffect(() => {
    if (gameOver || turn !== 2 || aiThinking || mode !== "ai") return;
    setAiThinking(true);
    const timer = setTimeout(() => {
      const playable = aiHand.map((c,i) => ({c,i})).filter(({c}) => canPlay(c, discard[discard.length-1], currentColor));

      if (playable.length > 0) {
        const {c: card, i: idx} = playable[Math.floor(Math.random()*playable.length)];
        const newHand = aiHand.filter((_,i) => i !== idx);
        setAiHand(newHand);
        setDiscard(prev => [...prev, card]);
        if (newHand.length === 0) { setWinner(2); setAiThinking(false); return; }
        if (card.isWild) setCurrentColor(UNO_COLORS[Math.floor(Math.random()*4)]);
        else setCurrentColor(card.color);
        if (card.value === "D2" || card.draw4) setHand(prev => [...prev, ...deal(card.draw4 ? 4 : 2)]);
        if (card.value === "Skip") { setMessage(isEl ? "Χάνεις σειρά!" : "You skip!"); setAiThinking(false); return; }
      } else {
        setAiHand(prev => [...prev, makeCard()]);
      }
      setTurn(1);
      setAiThinking(false);
      setMessage("");
    }, 600);
    return () => clearTimeout(timer);
  }, [turn, gameOver, aiThinking, mode]);

  const reset = useCallback(() => {
    setHand(deal(7)); setAiHand(deal(7)); const top = makeCard(); setDiscard([top]);
    setCurrentColor(top.isWild ? UNO_COLORS[0] : top.color);
    setTurn(1); setWinner(null); setMessage(""); setPickingColor(false); setAiThinking(false); setPassDeviceTo(null);
    onPlayAgain?.();
  }, [onPlayAgain]);

  if (passDeviceTo && mode === "local" && !gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 p-4 bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-white/10 shadow-2xl shadow-black/30">
        <div className="text-center space-y-4">
          <p className="text-xl font-bold text-slate-200">
            {isEl ? "Περάστε το κινητό στον" : "Pass the device to"} {playerNames[passDeviceTo]}
          </p>
          <button
            onClick={() => setPassDeviceTo(null)}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold text-base shadow-xl hover:scale-105 transition-all">
            {isEl ? "Έτοιμος" : "Ready"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 w-full">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-2xl shadow-black/30">
        <BoardHeader title="UNO" turn={gameOver ? null : turn} playerNames={playerNames}
          scores={{ 1: hand.length, 2: aiHand.length }}
          status={aiThinking ? "AI..." : null} />
        <div className="p-4 sm:p-6 space-y-4 bg-white/5 backdrop-blur-sm">
          {/* Opponent hand (hidden) */}
          <div className="flex justify-center gap-1">
            {otherHand.map((_,i) => (
              <div key={i} className="w-12 h-16 rounded-xl bg-gradient-to-br from-red-500 to-red-700 border border-white/10 shadow-xl shadow-red-900/40" />
            ))}
          </div>

          {/* Discard + draw */}
          <div className="flex items-center justify-center gap-6">
            <button onClick={drawCard} disabled={!canInteract || gameOver || pickingColor}
              className="w-20 h-28 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 text-slate-300 font-bold text-sm shadow-xl hover:bg-white/20 hover:scale-105 transition-all flex items-center justify-center disabled:opacity-50 disabled:hover:bg-white/10 disabled:hover:scale-100">
              🃏<br/>{isEl ? "Τράβα" : "Draw"}
            </button>
            <div className={`w-20 h-28 rounded-2xl ${COLOR_STYLES[top.isWild ? "wild" : top.color]} font-bold text-base flex flex-col items-center justify-center border-2 border-white/10`}>
              <span className="text-lg">{top.value}</span>
            </div>
            <div className={`w-10 h-10 rounded-full border-2 border-white/20 ${currentColor === "red" ? "bg-red-500/80" : currentColor === "blue" ? "bg-blue-500/80" : currentColor === "green" ? "bg-emerald-500/80" : "bg-yellow-400/80"}`} title={`Current: ${currentColor}`} />
          </div>

          {/* Color picker */}
          {pickingColor && (
            <div className="flex gap-3 justify-center">
              {UNO_COLORS.map(c => (
                <button key={c} onClick={() => pickColor(c)}
                  className={`w-14 h-14 rounded-2xl ${COLOR_STYLES[c]} font-bold text-base hover:scale-110 transition-all border-2 border-white/10 shadow-xl`}>
                  {c === "red" ? "🔴" : c === "blue" ? "🔵" : c === "green" ? "🟢" : "🟡"}
                </button>
              ))}
            </div>
          )}

          {/* Player hand */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {activeHand.map((card, i) => {
              const playable = canPlay(card, top, currentColor) && canInteract && !pickingColor;
              return (
                <button key={i} onClick={() => playCard(i)}
                  className={[
                    `w-16 h-24 rounded-2xl ${COLOR_STYLES[card.isWild ? "wild" : card.color]} font-bold text-sm flex flex-col items-center justify-center border-2 border-white/10 transition-all shadow-xl`,
                    playable ? "hover:scale-110 hover:-translate-y-2 cursor-pointer ring-[3px] ring-violet-400/50 hover:ring-violet-400" : "opacity-60 cursor-not-allowed",
                  ].join(" ")}
                  disabled={!playable}>
                  <span>{card.value}</span>
                </button>
              );
            })}
          </div>

          {message && <p className="text-center text-sm text-slate-400 font-medium">{message}</p>}
        </div>
      </div>
      {gameOver && <GameOverModal winner={winner} playerNames={playerNames}
        stats={{ [playerNames[1]]: hand.length, [playerNames[2]]: aiHand.length }}
        onPlayAgain={reset} onChangeGame={onChangeGame} />}
    </div>
  );
}
