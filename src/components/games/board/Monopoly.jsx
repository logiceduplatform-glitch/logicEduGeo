import React, { useState, useCallback } from "react";
import BoardHeader from "./shared/BoardHeader";
import GameOverModal from "./shared/GameOverModal";

const PROP_GRADIENT = {
  purple: "bg-gradient-to-br from-purple-400 to-purple-600 shadow-xl shadow-purple-900/40",
  sky: "bg-gradient-to-br from-sky-400 to-sky-600 shadow-xl shadow-sky-900/40",
  pink: "bg-gradient-to-br from-pink-400 to-pink-600 shadow-xl shadow-pink-900/40",
  orange: "bg-gradient-to-br from-orange-400 to-orange-600 shadow-xl shadow-orange-900/40",
  red: "bg-gradient-to-br from-red-400 to-red-600 shadow-xl shadow-red-900/40",
  green: "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-900/40",
  blue: "bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl shadow-blue-900/40",
};

const PROPERTIES = [
  { name: "Mediterranean Ave", nameEl: "Μεσογείων", price: 60, rent: 10, group: "purple" },
  { name: "Baltic Ave", nameEl: "Βαλτικής", price: 60, rent: 10, group: "purple" },
  { name: "Oriental Ave", nameEl: "Ανατολίτικη", price: 100, rent: 20, group: "sky" },
  { name: "Vermont Ave", nameEl: "Βερμόντ", price: 100, rent: 20, group: "sky" },
  { name: "Connecticut Ave", nameEl: "Κονέκτικατ", price: 120, rent: 24, group: "sky" },
  { name: "St. Charles Pl", nameEl: "Αγ. Κάρολος", price: 140, rent: 30, group: "pink" },
  { name: "Virginia Ave", nameEl: "Βιρτζίνια", price: 160, rent: 32, group: "pink" },
  { name: "St. James Pl", nameEl: "Αγ. Ιάκωβος", price: 180, rent: 36, group: "orange" },
  { name: "Tennessee Ave", nameEl: "Τενεσί", price: 180, rent: 36, group: "orange" },
  { name: "New York Ave", nameEl: "Νέα Υόρκη", price: 200, rent: 40, group: "red" },
  { name: "Kentucky Ave", nameEl: "Κεντάκυ", price: 220, rent: 44, group: "red" },
  { name: "Pacific Ave", nameEl: "Ειρηνικός", price: 300, rent: 52, group: "green" },
  { name: "Boardwalk", nameEl: "Παραλία", price: 400, rent: 80, group: "blue" },
];

const SPECIAL = [
  { type: "go", name: "GO", nameEl: "ΕΚΚΙΝΗΣΗ" },
  { type: "chance", name: "Chance", nameEl: "Τύχη" },
  { type: "tax", name: "Income Tax", nameEl: "Φόρος", amount: 100 },
  { type: "jail", name: "Jail", nameEl: "Φυλακή" },
  { type: "chance", name: "Community", nameEl: "Ταμείο" },
  { type: "tax", name: "Luxury Tax", nameEl: "Φόρος Πολ.", amount: 75 },
  { type: "parking", name: "Free Parking", nameEl: "Στάθμευση" },
];

function buildBoard() {
  const board = [];
  let pi = 0, si = 0;
  for (let i = 0; i < 20; i++) {
    if (i % 3 === 0 && si < SPECIAL.length) board.push({ ...SPECIAL[si++], idx: i });
    else if (pi < PROPERTIES.length) board.push({ ...PROPERTIES[pi++], type: "property", idx: i, owner: 0, houses: 0 });
    else board.push({ type: "empty", idx: i, name: "Rest", nameEl: "Στάση" });
  }
  return board;
}

function rollDice() { return Math.floor(Math.random()*6)+1 + Math.floor(Math.random()*6)+1; }

const CHANCE_CARDS = [
  { en: "Bank pays you $200!", el: "Η τράπεζα σου δίνει 200$!", amount: 200 },
  { en: "Pay hospital bill $100", el: "Πλήρωσε νοσοκομείο 100$", amount: -100 },
  { en: "Won beauty contest $50!", el: "Κέρδισες διαγωνισμό 50$!", amount: 50 },
  { en: "Advance to GO! Collect $200", el: "Πήγαινε στην εκκίνηση! +200$", amount: 200 },
  { en: "Pay school fees $50", el: "Δίδακτρα 50$", amount: -50 },
];

export default function Monopoly({ mode, difficulty, onPlayAgain, onChangeGame, lang }) {
  const isEl = lang === "el";
  const playerNames = mode === "ai"
    ? { 1: isEl ? "Εσύ" : "You", 2: "AI" }
    : { 1: isEl ? "Παίκτης 1" : "Player 1", 2: isEl ? "Παίκτης 2" : "Player 2" };

  const [board, setBoard] = useState(buildBoard);
  const [positions, setPositions] = useState({ 1: 0, 2: 0 });
  const [money, setMoney] = useState({ 1: 1500, 2: 1500 });
  const [turn, setTurn] = useState(1);
  const [diceResult, setDiceResult] = useState(null);
  const [phase, setPhase] = useState("roll");
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState("");
  const [turnCount, setTurnCount] = useState(1);

  const gameOver = winner !== null;
  const canInteract = !gameOver && (mode === "local" || turn === 1);

  const checkBankrupt = useCallback((m) => {
    if (m[1] <= 0) return 2;
    if (m[2] <= 0) return 1;
    return null;
  }, []);

  const landOn = useCallback((player, pos, currentBoard, currentMoney) => {
    const space = currentBoard[pos % currentBoard.length];
    let msg = "";
    const newMoney = { ...currentMoney };

    if (space.type === "property") {
      if (space.owner === 0) {
        if (player === 1 || (player === 2 && mode === "local")) {
          msg = isEl ? `${space.nameEl} (${space.price}$) - αγόρασε ή πέρασε` : `${space.name} ($${space.price}) - buy or pass`;
          return { board: currentBoard, money: newMoney, msg, canBuy: true };
        } else if (player === 2 && mode === "ai") {
          if (newMoney[2] >= space.price && Math.random() > 0.2) {
            newMoney[2] -= space.price;
            const nb = currentBoard.map((s,i) => i === pos % currentBoard.length ? { ...s, owner: 2 } : s);
            msg = `AI ${isEl ? "αγόρασε" : "bought"} ${isEl ? space.nameEl : space.name}`;
            return { board: nb, money: newMoney, msg };
          }
        }
      } else if (space.owner !== player) {
        const rent = space.rent * (1 + space.houses);
        newMoney[player] -= rent;
        newMoney[space.owner] += rent;
        msg = `${isEl ? "Ενοίκιο" : "Rent"}: $${rent}`;
      }
    } else if (space.type === "tax") {
      newMoney[player] -= space.amount;
      msg = `${isEl ? "Φόρος" : "Tax"}: $${space.amount}`;
    } else if (space.type === "chance") {
      const card = CHANCE_CARDS[Math.floor(Math.random()*CHANCE_CARDS.length)];
      newMoney[player] += card.amount;
      msg = isEl ? card.el : card.en;
    } else if (space.type === "go") {
      newMoney[player] += 200;
      msg = isEl ? "+200$ Εκκίνηση!" : "+$200 GO!";
    }

    return { board: currentBoard, money: newMoney, msg };
  }, [isEl, mode]);

  const handleRoll = useCallback(() => {
    if (!canInteract || phase !== "roll") return;
    const dice = rollDice();
    setDiceResult(dice);
    const currentPos = positions[turn];
    const newPos = (currentPos + dice) % board.length;
    if (newPos < currentPos) setMoney(prev => ({ ...prev, [turn]: prev[turn] + 200 }));
    setPositions(prev => ({ ...prev, [turn]: newPos }));

    const result = landOn(turn, newPos, board, money);
    setBoard(result.board);
    setMoney(result.money);
    setMessage(result.msg);

    const w = checkBankrupt(result.money);
    if (w) { setWinner(w); return; }

    setPhase(result.canBuy ? "buy" : "endturn");
  }, [canInteract, phase, positions, board, money, landOn, checkBankrupt, turn]);

  const buyProperty = useCallback(() => {
    if (!canInteract || phase !== "buy") return;
    const pos = positions[turn];
    const space = board[pos % board.length];
    if (space.type !== "property") return;
    if (money[turn] < space.price) { setMessage(isEl ? "Δεν έχεις αρκετά!" : "Not enough money!"); return; }
    setMoney(prev => ({ ...prev, [turn]: prev[turn] - space.price }));
    setBoard(prev => prev.map((s,i) => i === pos % prev.length ? { ...s, owner: turn } : s));
    setMessage(isEl ? `Αγόρασες ${space.nameEl}!` : `Bought ${space.name}!`);
    setPhase("endturn");
  }, [canInteract, phase, positions, board, money, turn, isEl]);

  const endTurn = useCallback(() => {
    if (!canInteract || phase !== "endturn") return;
    if (mode === "ai") {
      // AI turn
      const aiDice = rollDice();
      const aiNewPos = (positions[2] + aiDice) % board.length;
      const aiMoney = { ...money };
      if (aiNewPos < positions[2]) aiMoney[2] += 200;
      setPositions(prev => ({ ...prev, 2: aiNewPos }));

      const result = landOn(2, aiNewPos, board, aiMoney);
      setBoard(result.board);
      setMoney(result.money);

      const w = checkBankrupt(result.money);
      if (w) { setWinner(w); return; }
    } else {
      // Local mode: switch turns
      setTurn(prev => prev === 1 ? 2 : 1);
    }

    if (turnCount >= 30) {
      setWinner(money[1] > money[2] ? 1 : money[2] > money[1] ? 2 : "draw");
      return;
    }

    setPhase("roll");
    setDiceResult(null);
    setMessage("");
    setTurnCount(prev => prev+1);
  }, [canInteract, phase, mode, positions, board, money, landOn, checkBankrupt, turnCount]);

  const reset = useCallback(() => {
    setBoard(buildBoard()); setPositions({ 1: 0, 2: 0 }); setMoney({ 1: 1500, 2: 1500 });
    setTurn(1); setDiceResult(null); setPhase("roll"); setWinner(null);
    setMessage(""); setTurnCount(1);
    onPlayAgain?.();
  }, [onPlayAgain]);

  const ownedBy = (player) => board.filter(s => s.owner === player).length;

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-6 w-full">
      <div className="w-full max-w-2xl rounded-3xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 shadow-2xl shadow-black/30">
        <BoardHeader title="Monopoly" turn={gameOver ? null : turn} playerNames={playerNames}
          scores={{ 1: money[1], 2: money[2] }}
          status={`${isEl ? "Γύρος" : "Turn"} ${turnCount}/30`} />
        <div className="p-4 sm:p-6 space-y-3">
          {/* Board strip */}
          <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
            {board.map((space, i) => {
              const isHere1 = positions[1] % board.length === i;
              const isHere2 = positions[2] % board.length === i;
              return (
                <div key={i} className={[
                  "flex-shrink-0 w-20 h-28 rounded-2xl border-2 flex flex-col items-center justify-center text-xs font-bold p-1 relative transition-all border-white/10",
                  space.type === "property" ? `${PROP_GRADIENT[space.group] || ""} text-white border-white/30` : "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/10 text-slate-300",
                  isHere1 ? "ring-[3px] ring-violet-400 scale-110 z-10" : "",
                  isHere2 ? "ring-[3px] ring-amber-400" : "",
                ].join(" ")}>
                  <span className="truncate w-full text-center leading-tight">
                    {isEl ? (space.nameEl || space.name) : space.name}
                  </span>
                  {space.price && <span className="text-xs opacity-80">${space.price}</span>}
                  {space.owner === 1 && <span className="absolute top-0 right-0 text-xs">🟣</span>}
                  {space.owner === 2 && <span className="absolute top-0 right-0 text-xs">🔴</span>}
                  <div className="flex gap-0.5 absolute bottom-0.5">
                    {isHere1 && <span>🧑</span>}
                    {isHere2 && <span>🤖</span>}
                  </div>
                  {space.type === "go" && <span>🏁</span>}
                  {space.type === "chance" && <span>❓</span>}
                  {space.type === "tax" && <span>💰</span>}
                  {space.type === "jail" && <span>🔒</span>}
                  {space.type === "parking" && <span>🅿️</span>}
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="flex gap-3 justify-center text-sm font-semibold">
            <span className="px-3 py-1.5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-slate-300">
              💰 ${money[1]} | 🏠 {ownedBy(1)}
            </span>
            <span className="px-3 py-1.5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-slate-300">
              🤖 ${money[2]} | 🏠 {ownedBy(2)}
            </span>
          </div>

          {diceResult && <p className="text-center text-lg font-bold text-white">🎲 {diceResult}</p>}
          {message && <p className="text-center text-sm text-slate-400 font-medium">{message}</p>}

          {!gameOver && (
            <div className="flex gap-2 justify-center">
              {phase === "roll" && (
                <button onClick={handleRoll} disabled={!canInteract} className="px-6 py-3 text-base rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold shadow-xl shadow-violet-900/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  🎲 {isEl ? "Ρίξε ζάρια" : "Roll Dice"}
                </button>
              )}
              {phase === "buy" && (
                <>
                  <button onClick={buyProperty} disabled={!canInteract} className="px-5 py-2.5 text-base rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold shadow-xl shadow-violet-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    🏠 {isEl ? "Αγόρασε" : "Buy"}
                  </button>
                  <button onClick={() => setPhase("endturn")} disabled={!canInteract} className="px-5 py-2.5 text-base rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-slate-300 font-semibold hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {isEl ? "Πέρασε" : "Pass"}
                  </button>
                </>
              )}
              {phase === "endturn" && (
                <button onClick={endTurn} disabled={!canInteract} className="px-6 py-3 text-base rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold shadow-xl shadow-violet-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  ⏭️ {mode === "ai" ? (isEl ? "Σειρά AI" : "AI Turn") : (isEl ? "Τέλος γύρου" : "End Turn")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {gameOver && <GameOverModal winner={winner} playerNames={playerNames}
        stats={{ "$": money[1], [isEl ? "Ιδιοκτησίες" : "Properties"]: ownedBy(1), [isEl ? "Γύροι" : "Turns"]: turnCount }}
        onPlayAgain={reset} onChangeGame={onChangeGame} />}
    </div>
  );
}
