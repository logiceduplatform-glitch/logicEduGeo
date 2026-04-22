import React, { useState, useCallback } from "react";

const DISK_COLORS = [
  "bg-rose-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-sky-500",
];
const PEG_COLOR = "bg-amber-200 dark:bg-amber-900/50";

function minMoves(n) {
  return Math.pow(2, n) - 1;
}

export default function TowersOfHanoiGame({ lang = "el" }) {
  const isEl = lang === "el";
  const NUM_DISKS = 4;
  const [pegs, setPegs] = useState([[4, 3, 2, 1], [], []]);
  const [selectedPeg, setSelectedPeg] = useState(null);
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

  const T = {
    title: isEl ? "Πύργοι του Ανόι" : "Towers of Hanoi",
    moves: isEl ? "Κινήσεις" : "Moves",
    minMoves: isEl ? "Ελάχιστες κινήσεις" : "Min moves",
    solved: isEl ? "Συγχαρητήρια! Τερμάτισες με ελάχιστες κινήσεις!" : "Congratulations! You solved it optimally!",
    solvedSub: isEl ? "Μπορείς να το ξαναλύσεις με λιγότερες κινήσεις;" : "Can you solve it with fewer moves?",
    playAgain: isEl ? "Ξαναπαίξτε" : "Play Again",
  };

  const handlePegClick = useCallback(
    (pegIndex) => {
      if (solved) return;
      const disk = pegs[pegIndex][pegs[pegIndex].length - 1];

      if (selectedPeg === null) {
        if (!disk) return;
        setSelectedPeg(pegIndex);
        return;
      }

      if (selectedPeg === pegIndex) {
        setSelectedPeg(null);
        return;
      }

      const targetTop = pegs[pegIndex][pegs[pegIndex].length - 1];
      const sourceTop = pegs[selectedPeg][pegs[selectedPeg].length - 1];

      if (targetTop && targetTop < sourceTop) {
        setSelectedPeg(null);
        return;
      }

      const next = pegs.map((p, i) => {
        if (i === selectedPeg) return p.slice(0, -1);
        if (i === pegIndex) return [...p, sourceTop];
        return p;
      });

      setPegs(next);
      setMoves((m) => m + 1);
      setSelectedPeg(null);

      if (next[2].length === NUM_DISKS) setSolved(true);
    },
    [pegs, selectedPeg, solved]
  );

  const initGame = useCallback(() => {
    setPegs([[4, 3, 2, 1], [], []]);
    setSelectedPeg(null);
    setMoves(0);
    setSolved(false);
  }, []);

  const minM = minMoves(NUM_DISKS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 text-center">{T.title}</h1>
        <p className="text-slate-600 dark:text-slate-400 text-center text-sm mb-6">
          {isEl ? "Μετακίνησε όλους τους δίσκους στη δεξιά κολόνα. Μικρότερος πάνω σε μεγαλύτερο μόνο." : "Move all disks to the right peg. No larger disk on smaller."}
        </p>
        <div className="flex justify-center gap-6 mb-6">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.moves}</span>
            <span className="ml-2 font-bold text-amber-600 dark:text-amber-400">{moves}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
            <span className="text-slate-500 dark:text-slate-400 text-sm">{T.minMoves}</span>
            <span className="ml-2 font-bold text-slate-600 dark:text-slate-400">{minM}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-8 mb-6">
          <div className="flex justify-around items-end gap-4 min-h-[220px]">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => handlePegClick(i)}
                className={`flex flex-col items-center flex-1 min-w-0 transition-all ${
                  selectedPeg === i ? "ring-4 ring-amber-400 dark:ring-amber-500 rounded-t-xl" : ""
                }`}
              >
                <div className={`w-full h-3 rounded-t ${PEG_COLOR}`} />
                <div className={`w-2 h-24 rounded-b ${PEG_COLOR}`} />
                <div className="flex flex-col-reverse items-center gap-0.5 pt-2">
                  {pegs[i].map((size) => (
                    <div
                      key={`${i}-${size}`}
                      className={`h-6 rounded ${DISK_COLORS[size - 1]} border border-slate-700/20`}
                      style={{ width: `${size * 28 + 24}px`, minWidth: "32px" }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {solved && (
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 p-6 text-center mb-6">
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
              {moves === minM ? T.solved : T.solvedSub}
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              {moves} {isEl ? "κινήσεις" : "moves"}
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={initGame}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition"
          >
            {T.playAgain}
          </button>
        </div>
      </div>
    </div>
  );
}
