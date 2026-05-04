import React, { useContext, useEffect, useMemo, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const QUESTIONS = {
  el: [
    { q: "2 + 2 × 3 = ;", opts: ["8", "12", "10", "6"], a: 0 },
    { q: "Πρωτεύουσα Γαλλίας;", opts: ["Λονδίνο", "Ρώμη", "Παρίσι", "Μαδρίτη"], a: 2 },
    { q: "Πόσοι ήπειροι υπάρχουν;", opts: ["5", "6", "7", "8"], a: 2 },
    { q: "Συγγραφέας 'Ιλιάδας';", opts: ["Σαίξπηρ", "Όμηρος", "Πλάτων", "Σωκράτης"], a: 1 },
    { q: "Χημικό σύμβολο νερού;", opts: ["O2", "H2O", "CO2", "NaCl"], a: 1 },
    { q: "Πόσα πόδια έχει η αράχνη;", opts: ["6", "8", "10", "4"], a: 1 },
    { q: "Πόσοι μήνες έχει ο χρόνος;", opts: ["10", "11", "12", "13"], a: 2 },
    { q: "Μεγαλύτερος πλανήτης;", opts: ["Άρης", "Δίας", "Κρόνος", "Ποσειδώνας"], a: 1 },
    { q: "Πόσα χρώματα ουράνιο τόξο;", opts: ["5", "6", "7", "8"], a: 2 },
    { q: "15 × 3 = ;", opts: ["35", "45", "55", "30"], a: 1 },
  ],
  en: [
    { q: "2 + 2 × 3 = ?", opts: ["8", "12", "10", "6"], a: 0 },
    { q: "Capital of France?", opts: ["London", "Rome", "Paris", "Madrid"], a: 2 },
    { q: "How many continents?", opts: ["5", "6", "7", "8"], a: 2 },
    { q: "Author of 'Iliad'?", opts: ["Shakespeare", "Homer", "Plato", "Socrates"], a: 1 },
    { q: "Chemical symbol of water?", opts: ["O2", "H2O", "CO2", "NaCl"], a: 1 },
    { q: "How many legs does a spider have?", opts: ["6", "8", "10", "4"], a: 1 },
    { q: "How many months in a year?", opts: ["10", "11", "12", "13"], a: 2 },
    { q: "Largest planet?", opts: ["Mars", "Jupiter", "Saturn", "Neptune"], a: 1 },
    { q: "Colors in a rainbow?", opts: ["5", "6", "7", "8"], a: 2 },
    { q: "15 × 3 = ?", opts: ["35", "45", "55", "30"], a: 1 },
  ],
};

const ROUNDS = 7;

export default function BattleQuizPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const list = QUESTIONS[lang] || QUESTIONS.en;
  const order = useMemo(() => list.slice().sort(() => Math.random() - 0.5).slice(0, ROUNDS), [list]);
  const [r, setR] = useState(0);
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [chosen, setChosen] = useState({ p1: null, p2: null });
  const q = order[r];
  const done = r >= order.length;

  const choose = (p, i) => {
    if (chosen[p] !== null || done) return;
    setChosen((c) => ({ ...c, [p]: i }));
  };

  useEffect(() => {
    if (chosen.p1 !== null && chosen.p2 !== null && !done) {
      const t = setTimeout(() => {
        setScore((s) => ({
          p1: s.p1 + (chosen.p1 === q.a ? 1 : 0),
          p2: s.p2 + (chosen.p2 === q.a ? 1 : 0),
        }));
        setR((n) => n + 1);
        setChosen({ p1: null, p2: null });
      }, 800);
      return () => clearTimeout(t);
    }
  }, [chosen, q, done]);

  const reset = () => { setR(0); setScore({ p1: 0, p2: 0 }); setChosen({ p1: null, p2: null }); };

  const PlayerPanel = ({ p, color, rotate }) => (
    <div className={`${color} text-white rounded-xl p-3 ${rotate ? "rotate-180" : ""}`}>
      <div className="text-xs opacity-90 text-center mb-1">{p === "p1" ? (isEl ? "Παίκτης 1" : "Player 1") : (isEl ? "Παίκτης 2" : "Player 2")}</div>
      <div className="text-center text-2xl font-bold mb-2">⭐ {score[p]}</div>
      {!done && (
        <div className="grid grid-cols-2 gap-1">
          {q.opts.map((o, i) => {
            const picked = chosen[p] === i;
            const correct = chosen[p] !== null && i === q.a;
            const wrong = picked && i !== q.a;
            return (
              <button key={i} onClick={() => choose(p, i)}
                className={`px-2 py-2 rounded font-bold text-sm ${correct ? "bg-emerald-600" : wrong ? "bg-rose-700" : picked ? "bg-white/40" : "bg-white/20 hover:bg-white/30"}`}>
                {o}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <GameShell title={isEl ? "Battle Quiz 1v1" : "Battle Quiz 1v1"} description={isEl ? "Δυο παίκτες σε ίδια συσκευή — γρήγορες ερωτήσεις" : "Two players on same device — fast quiz"} emoji="⚔️" canonical="/games/battle-quiz" back="/games">
      <PlayerPanel p="p2" color="bg-rose-500" rotate />
      <div className="text-center my-3">
        {!done && <div className="text-lg font-bold">{r + 1}/{order.length}</div>}
        {!done && <div className="text-xl font-extrabold mt-1">{q.q}</div>}
        {done && (
          <div>
            <div className="text-2xl font-extrabold mb-2">
              {score.p1 > score.p2 ? "🏆 " + (isEl ? "Νικητής Παίκτης 1" : "Player 1 wins") :
               score.p2 > score.p1 ? "🏆 " + (isEl ? "Νικητής Παίκτης 2" : "Player 2 wins") :
               "🤝 " + (isEl ? "Ισοπαλία" : "Tie")}
            </div>
            <button onClick={reset} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg">
              {isEl ? "Ξανά" : "Play again"}
            </button>
          </div>
        )}
      </div>
      <PlayerPanel p="p1" color="bg-blue-500" />
    </GameShell>
  );
}
