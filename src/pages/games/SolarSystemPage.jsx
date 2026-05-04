import React, { useContext, useEffect, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const PLANETS = [
  { id: "mercury", el: "Ερμής",   en: "Mercury", color: "#94a3b8", r: 4,  d: 50,  speed: 4.74, fact: { el: "Πιο κοντά στον Ήλιο", en: "Closest to the Sun" } },
  { id: "venus",   el: "Αφροδίτη", en: "Venus",   color: "#fbbf24", r: 6,  d: 75,  speed: 3.50, fact: { el: "Πιο ζεστός πλανήτης", en: "Hottest planet" } },
  { id: "earth",   el: "Γη",       en: "Earth",   color: "#3b82f6", r: 6,  d: 100, speed: 2.98, fact: { el: "Σπίτι μας 🌍", en: "Our home 🌍" } },
  { id: "mars",    el: "Άρης",     en: "Mars",    color: "#ef4444", r: 5,  d: 130, speed: 2.41, fact: { el: "Ο κόκκινος πλανήτης", en: "The Red Planet" } },
  { id: "jupiter", el: "Δίας",     en: "Jupiter", color: "#f59e0b", r: 14, d: 175, speed: 1.30, fact: { el: "Μεγαλύτερος πλανήτης", en: "Largest planet" } },
  { id: "saturn",  el: "Κρόνος",   en: "Saturn",  color: "#fde68a", r: 12, d: 220, speed: 0.97, fact: { el: "Δαχτυλίδια από πάγο", en: "Has icy rings" } },
  { id: "uranus",  el: "Ουρανός",  en: "Uranus",  color: "#67e8f9", r: 8,  d: 255, speed: 0.68, fact: { el: "Περιστρέφεται πλάγια", en: "Rotates on its side" } },
  { id: "neptune", el: "Ποσειδώνας", en: "Neptune", color: "#1d4ed8", r: 8, d: 285, speed: 0.54, fact: { el: "Πιο μακρινός πλανήτης", en: "Farthest planet" } },
];

export default function SolarSystemPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const canvasRef = useRef(null);
  const animRef = useRef(0);
  const [speed, setSpeed] = useState(1);
  const [selected, setSelected] = useState(null);
  const [paused, setPaused] = useState(false);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const positions = {};

    const loop = () => {
      ctx.fillStyle = "#020617"; ctx.fillRect(0, 0, W, H);
      // stars
      for (let i = 0; i < 50; i++) {
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.7})`;
        ctx.fillRect((i * 73 + 11) % W, (i * 113 + 47) % H, 1, 1);
      }
      // sun
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 24);
      grad.addColorStop(0, "#fef08a"); grad.addColorStop(1, "#f59e0b");
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fill();

      PLANETS.forEach((p) => {
        ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.beginPath(); ctx.arc(cx, cy, p.d, 0, Math.PI * 2); ctx.stroke();
        const angle = (tRef.current * p.speed * speed) / 200;
        const x = cx + Math.cos(angle) * p.d;
        const y = cy + Math.sin(angle) * p.d;
        positions[p.id] = { x, y };
        if (p.id === "saturn") {
          ctx.strokeStyle = "#fde68a"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.ellipse(x, y, p.r + 6, 3, 0, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(x, y, p.r, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
        if (selected === p.id) {
          ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(x, y, p.r + 4, 0, Math.PI * 2); ctx.stroke();
        }
      });

      if (!paused) tRef.current += 1;
      animRef.current = requestAnimationFrame(loop);
    };
    loop();

    const onClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const cxx = (e.clientX - rect.left) * (canvas.width / rect.width);
      const cyy = (e.clientY - rect.top) * (canvas.height / rect.height);
      let closest = null, dist = 999;
      PLANETS.forEach((p) => {
        const pos = positions[p.id]; if (!pos) return;
        const d = Math.hypot(cxx - pos.x, cyy - pos.y);
        if (d < p.r + 8 && d < dist) { closest = p.id; dist = d; }
      });
      setSelected(closest);
    };
    canvas.addEventListener("click", onClick);
    return () => { cancelAnimationFrame(animRef.current); canvas.removeEventListener("click", onClick); };
  }, [speed, selected, paused]);

  const planet = PLANETS.find((p) => p.id === selected);

  return (
    <GameShell title={isEl ? "Ηλιακό Σύστημα" : "Solar System"} description={isEl ? "Πάτα πλανήτη για πληροφορίες" : "Tap a planet for info"} emoji="🌌" canonical="/games/solar-system" back="/games">
      <canvas ref={canvasRef} width={400} height={400} className="w-full max-w-md mx-auto block bg-slate-950 rounded-xl cursor-pointer" />
      <div className="mt-3 space-y-2">
        <label className="flex items-center gap-2 text-sm"><span className="w-20">{isEl ? "Ταχύτητα" : "Speed"}</span>
          <input type="range" min="0.1" max="3" step="0.1" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="flex-1" />
          <span className="font-mono w-10">{speed.toFixed(1)}×</span>
        </label>
        <div className="flex gap-2 justify-center">
          <button onClick={() => setPaused((p) => !p)} className={`px-4 py-2 ${paused ? "bg-emerald-500" : "bg-rose-500"} text-white font-bold rounded-lg`}>{paused ? "▶" : "❚❚"}</button>
        </div>
        {planet && (
          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
            <div className="font-extrabold text-lg" style={{ color: planet.color }}>{isEl ? planet.el : planet.en}</div>
            <div className="text-sm text-slate-600 dark:text-slate-300">{planet.fact[lang] || planet.fact.en}</div>
          </div>
        )}
      </div>
    </GameShell>
  );
}
