import React, { useState, useCallback } from "react";

export default function RiverCrossingGame({ lang = "el" }) {
  const isEl = lang === "el";
  const [leftBank, setLeftBank] = useState(["fox", "chicken", "grain"]);
  const [rightBank, setRightBank] = useState([]);
  const [boat, setBoat] = useState([]);
  const [boatSide, setBoatSide] = useState("left");
  const [gameOver, setGameOver] = useState(null);
  const [moves, setMoves] = useState(0);

  const T = {
    title: isEl ? "Διέλευση Ποταμού" : "River Crossing",
    fox: isEl ? "Αλεπού" : "Fox",
    chicken: isEl ? "Κοτόπουλο" : "Chicken",
    grain: isEl ? "Σιτάρι" : "Grain",
    farmer: isEl ? "Αγρότης" : "Farmer",
    cross: isEl ? "Πέρασμα" : "Cross",
    newGame: isEl ? "Νέο παιχνίδι" : "New Game",
    win: isEl ? "Συγχαρητήρια! Όλοι στο άλλο όχθη!" : "Congratulations! Everyone on the other side!",
    loseFox: isEl ? "Η αλεπού έφαγε το κοτόπουλο!" : "The fox ate the chicken!",
    loseGrain: isEl ? "Το κοτόπουλο έφαγε το σιτάρι!" : "The chicken ate the grain!",
    left: isEl ? "Αριστερή όχθη" : "Left bank",
    right: isEl ? "Δεξιά όχθη" : "Right bank",
    boatText: isEl ? "Πλοίο" : "Boat",
  };

  const labels = { fox: T.fox, chicken: T.chicken, grain: T.grain };
  const emoji = { fox: "🦊", chicken: "🐔", grain: "🌾", farmer: "👨‍🌾" };

  const checkDanger = useCallback((bank, hasFarmer) => {
    if (hasFarmer) return null;
    if (bank.includes("fox") && bank.includes("chicken")) return "fox";
    if (bank.includes("chicken") && bank.includes("grain")) return "grain";
    return null;
  }, []);

  const reset = useCallback(() => {
    setLeftBank(["fox", "chicken", "grain"]);
    setRightBank([]);
    setBoat([]);
    setBoatSide("left");
    setGameOver(null);
    setMoves(0);
  }, []);

  const currentBank = boatSide === "left" ? leftBank : rightBank;
  const otherBank = boatSide === "left" ? rightBank : leftBank;

  const toggleInBoat = useCallback(
    (item) => {
      if (gameOver) return;
      const bank = boatSide === "left" ? leftBank : rightBank;
      if (!bank.includes(item)) return;
      if (boat.length >= 2 && !boat.includes(item)) return;

      if (boat.includes(item)) {
        setBoat((b) => b.filter((x) => x !== item));
      } else {
        setBoat((b) => (b.length < 2 ? [...b, item] : b));
      }
    },
    [boatSide, leftBank, rightBank, boat, gameOver]
  );

  const crossRiver = useCallback(() => {
    if (gameOver) return;
    if (boat.length === 0) return;

    const bank = boatSide === "left" ? [...leftBank] : [...rightBank];
    const other = boatSide === "left" ? [...rightBank] : [...leftBank];

    for (const item of boat) {
      const idx = bank.indexOf(item);
      if (idx >= 0) bank.splice(idx, 1);
      other.push(item);
    }

    if (boatSide === "left") {
      setLeftBank(bank);
      setRightBank(other);
    } else {
      setRightBank(bank);
      setLeftBank(other);
    }
    setBoat([]);
    setBoatSide((s) => (s === "left" ? "right" : "left"));
    setMoves((m) => m + 1);

    const newLeft = boatSide === "left" ? bank : other;
    const newRight = boatSide === "left" ? other : bank;
    const leftHasFarmer = boatSide === "right";
    const rightHasFarmer = boatSide === "left";
    const dangerLeft = checkDanger(newLeft, leftHasFarmer);
    const dangerRight = checkDanger(newRight, rightHasFarmer);
    if (dangerLeft === "fox" || dangerRight === "fox") setGameOver("fox");
    else if (dangerLeft === "grain" || dangerRight === "grain") setGameOver("grain");
    else if (newRight.length === 3) setGameOver("win");
  }, [boatSide, leftBank, rightBank, boat, gameOver, checkDanger]);

  const renderBank = (bank, side) => {
    const items = ["fox", "chicken", "grain"].filter((x) => bank.includes(x));
    const hasFarmer = boatSide === side;
    return (
      <div className="flex flex-col items-center gap-3 min-h-[140px]">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
          {side === "left" ? T.left : T.right}
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {hasFarmer && (
            <span className="px-3 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-medium">
              {emoji.farmer}
            </span>
          )}
          {items.map((item) => (
            <span
              key={item}
              className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium"
            >
              {emoji[item]} {labels[item]}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderBoat = () => {
    const bank = boatSide === "left" ? leftBank : rightBank;
    const inBoatItems = ["fox", "chicken", "grain"].filter((x) => bank.includes(x));
    return (
      <div className="flex flex-col items-center gap-2 my-4">
        <div className="px-6 py-4 rounded-xl bg-amber-200/80 dark:bg-amber-800/50 border-2 border-amber-400 dark:border-amber-600">
          <span className="text-xs font-medium text-amber-800 dark:text-amber-200 block mb-2">{T.boatText}</span>
          <div className="flex gap-2 flex-wrap justify-center min-w-[120px]">
            {inBoatItems.map((item) => (
              <button
                key={item}
                onClick={() => toggleInBoat(item)}
                disabled={gameOver}
                className={`px-3 py-2 rounded-lg font-medium transition ${
                  boat.includes(item)
                    ? "bg-amber-600 text-white ring-2 ring-amber-800 dark:ring-amber-200"
                    : "bg-amber-100/80 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-800/50"
                }`}
              >
                {emoji[item]}
              </button>
            ))}
          </div>
          <button
            onClick={crossRiver}
            disabled={gameOver || boat.length === 0}
            className="mt-2 w-full py-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition"
          >
            {T.cross} →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50/50 to-sky-50 dark:from-slate-900 dark:via-teal-950/20 dark:to-slate-900 p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-4">
          {isEl
            ? "Μετάφερε όλους στην άλλη όχθη. Αλεπού+κοτόπουλο ή κοτόπουλο+σιτάρι χωρίς αγρότη = ήττα."
            : "Transport everyone across. Fox+chicken or chicken+grain without farmer = lose."}
        </p>

        {gameOver && (
          <div
            className={`mb-4 p-4 rounded-xl font-semibold text-center ${
              gameOver === "win"
                ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200"
                : "bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200"
            }`}
          >
            {gameOver === "win" && `${T.win} (${moves} ${isEl ? "κινήσεις" : "moves"})`}
            {gameOver === "fox" && T.loseFox}
            {gameOver === "grain" && T.loseGrain}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-6">
          <div className="flex-1 rounded-xl bg-white/80 dark:bg-slate-800/80 p-4 shadow-lg">
            {renderBank(leftBank, "left")}
          </div>
          {renderBoat()}
          <div className="flex-1 rounded-xl bg-white/80 dark:bg-slate-800/80 p-4 shadow-lg">
            {renderBank(rightBank, "right")}
          </div>
        </div>

        <div className="mt-6 text-center">
          <span className="text-slate-500 dark:text-slate-400 mr-4">{moves} {isEl ? "κινήσεις" : "moves"}</span>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-300 dark:hover:bg-slate-500 transition"
          >
            {T.newGame}
          </button>
        </div>
      </div>
    </div>
  );
}
