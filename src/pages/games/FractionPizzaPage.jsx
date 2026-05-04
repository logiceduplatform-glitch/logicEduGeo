import React, { useContext, useMemo, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

function genQ() {
  const denom = [2, 3, 4, 5, 6, 8][Math.floor(Math.random() * 6)];
  const num = Math.floor(Math.random() * (denom - 1)) + 1;
  return { num, denom };
}

function genOpts(q) {
  const set = new Set([`${q.num}/${q.denom}`]);
  while (set.size < 4) {
    const r = genQ();
    set.add(`${r.num}/${r.denom}`);
  }
  return Array.from(set).sort(() => Math.random() - 0.5);
}

function Pizza({ num, denom }) {
  const cx = 100, cy = 100, r = 90;
  const slices = [];
  for (let i = 0; i < denom; i++) {
    const a1 = (i / denom) * 2 * Math.PI - Math.PI / 2;
    const a2 = ((i + 1) / denom) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r;
    const x2 = cx + Math.cos(a2) * r;
    const y2 = cy + Math.sin(a2) * r;
    const large = (a2 - a1) > Math.PI ? 1 : 0;
    const fill = i < num ? "#f97316" : "#fde68a";
    slices.push(
      <path key={i}
        d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
        fill={fill} stroke="#7c2d12" strokeWidth="2" />
    );
  }
  return <svg viewBox="0 0 200 200" className="w-56 h-56 mx-auto">{slices}</svg>;
}

export default function FractionPizzaPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [q, setQ] = useState(() => genQ());
  const opts = useMemo(() => genOpts(q), [q]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const correct = `${q.num}/${q.denom}`;

  const choose = (o) => {
    if (o === correct) {
      setScore((s) => s + 1);
      setFeedback("✅");
      setTimeout(() => { setQ(genQ()); setFeedback(""); }, 600);
    } else setFeedback("❌");
  };

  return (
    <GameShell title={isEl ? "Πίτσα Κλασμάτων" : "Fraction Pizza"} description={isEl ? "Πόσο κομμάτι έφαγε;" : "What fraction was eaten?"} emoji="🍕" canonical="/games/fraction-pizza" back="/games">
      <div className="text-center">
        <div className="text-sm text-slate-500 mb-2">{isEl ? "Σκορ" : "Score"}: <b>{score}</b></div>
        <Pizza num={q.num} denom={q.denom} />
        <div className="grid grid-cols-2 gap-2 mt-4 max-w-sm mx-auto">
          {opts.map((o) => (
            <button key={o} onClick={() => choose(o)} className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-2xl font-mono">
              {o}
            </button>
          ))}
        </div>
        {feedback && <div className="mt-3 text-2xl">{feedback}</div>}
      </div>
    </GameShell>
  );
}
