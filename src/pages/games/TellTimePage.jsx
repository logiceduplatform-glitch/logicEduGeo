import React, { useContext, useMemo, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

function pad(n) { return String(n).padStart(2, "0"); }

function genQuestion() {
  const h = Math.floor(Math.random() * 12) + 1;
  const m = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55][Math.floor(Math.random() * 12)];
  return { h, m };
}

function genOptions(q) {
  const opts = new Set([`${pad(q.h)}:${pad(q.m)}`]);
  while (opts.size < 4) {
    const r = genQuestion();
    opts.add(`${pad(r.h)}:${pad(r.m)}`);
  }
  return Array.from(opts).sort(() => Math.random() - 0.5);
}

function Clock({ h, m }) {
  const cx = 100, cy = 100, r = 90;
  const hourAngle = ((h % 12) + m / 60) * 30 - 90;
  const minAngle = m * 6 - 90;
  const ha = (hourAngle * Math.PI) / 180;
  const ma = (minAngle * Math.PI) / 180;
  const hx = cx + Math.cos(ha) * 50;
  const hy = cy + Math.sin(ha) * 50;
  const mx = cx + Math.cos(ma) * 75;
  const my = cy + Math.sin(ma) * 75;

  return (
    <svg viewBox="0 0 200 200" className="w-56 h-56 mx-auto">
      <circle cx={cx} cy={cy} r={r} fill="white" stroke="#1e293b" strokeWidth="3" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        const x1 = cx + Math.cos(a) * (r - 10);
        const y1 = cy + Math.sin(a) * (r - 10);
        const x2 = cx + Math.cos(a) * r;
        const y2 = cy + Math.sin(a) * r;
        const tx = cx + Math.cos(a) * (r - 22);
        const ty = cy + Math.sin(a) * (r - 22);
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1e293b" strokeWidth="2" />
            <text x={tx} y={ty + 5} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0f172a">{i === 0 ? 12 : i}</text>
          </g>
        );
      })}
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={mx} y2={my} stroke="#475569" strokeWidth="3" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="5" fill="#1e293b" />
    </svg>
  );
}

export default function TellTimePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const [q, setQ] = useState(() => genQuestion());
  const opts = useMemo(() => genOptions(q), [q]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  const correct = `${pad(q.h)}:${pad(q.m)}`;

  const choose = (opt) => {
    if (opt === correct) {
      setScore((s) => s + 1);
      setFeedback(isEl ? "✅ Σωστά!" : "✅ Correct!");
      setTimeout(() => { setQ(genQuestion()); setFeedback(""); }, 700);
    } else {
      setFeedback(isEl ? "❌ Λάθος" : "❌ Wrong");
    }
  };

  return (
    <GameShell title={isEl ? "Πες την Ώρα" : "Tell the Time"} description={isEl ? "Διάβασε το ρολόι" : "Read the clock"} emoji="🕐" canonical="/games/tell-time" back="/games">
      <div className="text-center">
        <div className="text-sm text-slate-500 mb-2">{isEl ? "Σκορ" : "Score"}: <b>{score}</b></div>
        <Clock h={q.h} m={q.m} />
        <div className="grid grid-cols-2 gap-2 mt-4 max-w-sm mx-auto">
          {opts.map((o) => (
            <button key={o} onClick={() => choose(o)} className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl text-lg font-mono">
              {o}
            </button>
          ))}
        </div>
        {feedback && <div className="mt-3 text-lg font-bold">{feedback}</div>}
      </div>
    </GameShell>
  );
}
