import React, { useContext, useEffect, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"];

export default function PhysicsSandboxPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const canvasRef = useRef(null);
  const ballsRef = useRef([]);
  const [gravity, setGravity] = useState(0.4);
  const [bounce, setBounce] = useState(0.75);
  const [friction, setFriction] = useState(0.99);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    const loop = () => {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, W, H);
      // floor
      ctx.fillStyle = "#475569";
      ctx.fillRect(0, H - 4, W, 4);

      ballsRef.current.forEach((b) => {
        b.vy += gravity;
        b.vx *= friction;
        b.vy *= friction;
        b.x += b.vx;
        b.y += b.vy;
        if (b.y + b.r > H - 4) { b.y = H - 4 - b.r; b.vy *= -bounce; }
        if (b.x + b.r > W) { b.x = W - b.r; b.vx *= -bounce; }
        if (b.x - b.r < 0) { b.x = b.r; b.vx *= -bounce; }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
      });
      animRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animRef.current);
  }, [gravity, bounce, friction]);

  const spawn = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = (e.clientX ?? e.touches?.[0]?.clientX);
    const cy = (e.clientY ?? e.touches?.[0]?.clientY);
    if (cx == null) return;
    const x = (cx - rect.left) * (canvas.width / rect.width);
    const y = (cy - rect.top) * (canvas.height / rect.height);
    ballsRef.current.push({
      x, y, vx: (Math.random() - 0.5) * 6, vy: 0,
      r: 8 + Math.random() * 16, color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
    if (ballsRef.current.length > 80) ballsRef.current.shift();
  };

  const clear = () => { ballsRef.current = []; };

  return (
    <GameShell title={isEl ? "Φυσικό Sandbox" : "Physics Sandbox"} description={isEl ? "Ρίξε μπάλες — άλλαξε τους νόμους!" : "Drop balls — tweak the laws of physics!"} emoji="⚙️" canonical="/games/physics" back="/games">
      <canvas
        ref={canvasRef} width={400} height={300}
        onMouseDown={spawn} onMouseMove={(e) => e.buttons && spawn(e)}
        onTouchStart={spawn} onTouchMove={spawn}
        className="w-full bg-slate-900 rounded-xl cursor-pointer touch-none"
      />
      <div className="mt-3 space-y-2 text-sm">
        <label className="flex items-center gap-2"><span className="w-20">{isEl ? "Βαρύτητα" : "Gravity"}</span>
          <input type="range" min="0" max="1.5" step="0.05" value={gravity} onChange={(e) => setGravity(Number(e.target.value))} className="flex-1" />
          <span className="font-mono w-12">{gravity.toFixed(2)}</span>
        </label>
        <label className="flex items-center gap-2"><span className="w-20">{isEl ? "Αναπήδηση" : "Bounce"}</span>
          <input type="range" min="0" max="1" step="0.05" value={bounce} onChange={(e) => setBounce(Number(e.target.value))} className="flex-1" />
          <span className="font-mono w-12">{bounce.toFixed(2)}</span>
        </label>
        <label className="flex items-center gap-2"><span className="w-20">{isEl ? "Τριβή" : "Friction"}</span>
          <input type="range" min="0.85" max="1" step="0.005" value={friction} onChange={(e) => setFriction(Number(e.target.value))} className="flex-1" />
          <span className="font-mono w-12">{friction.toFixed(3)}</span>
        </label>
      </div>
      <div className="text-center mt-3">
        <button onClick={clear} className="px-4 py-2 bg-rose-500 text-white font-bold rounded-lg">↺ {isEl ? "Καθαρισμός" : "Clear"}</button>
      </div>
    </GameShell>
  );
}
