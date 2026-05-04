import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const T = {
  el: { title: "Καμβάς", desc: "Ζωγράφισε ό,τι θες! Άλλαξε χρώμα και πάχος.", clear: "Καθάρισε", undo: "Αναίρεση", save: "Αποθήκευση", color: "Χρώμα", thickness: "Πάχος", brush: "🖌 Πινέλο", eraser: "⌫ Σβήσιμο" },
  en: { title: "Drawing Pad", desc: "Draw anything! Change color and thickness.", clear: "Clear", undo: "Undo", save: "Save", color: "Color", thickness: "Size", brush: "🖌 Brush", eraser: "⌫ Eraser" },
};

const COLORS = ["#000000", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#ffffff"];
const SIZES = [2, 5, 10, 20];

export default function DrawingPadPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);
  const [eraser, setEraser] = useState(false);
  const drawing = useRef(false);
  const last = useRef(null);
  const history = useRef([]);

  const ctx = useCallback(() => canvasRef.current?.getContext("2d"), []);

  // Initial setup: white background + retina support
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    const x = c.getContext("2d");
    x.scale(dpr, dpr);
    x.fillStyle = "#ffffff";
    x.fillRect(0, 0, rect.width, rect.height);
    saveSnapshot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSnapshot = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    history.current.push(c.toDataURL());
    if (history.current.length > 30) history.current.shift();
  }, []);

  const getPos = (e) => {
    const c = canvasRef.current;
    const rect = c.getBoundingClientRect();
    const t = e.touches?.[0] || e;
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    drawing.current = true;
    last.current = getPos(e);
  };

  const moveDraw = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const x = ctx();
    if (!x) return;
    const pos = getPos(e);
    x.lineCap = "round";
    x.lineJoin = "round";
    x.strokeStyle = eraser ? "#ffffff" : color;
    x.lineWidth = eraser ? size * 2 : size;
    x.beginPath();
    x.moveTo(last.current.x, last.current.y);
    x.lineTo(pos.x, pos.y);
    x.stroke();
    last.current = pos;
  };

  const endDraw = () => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    saveSnapshot();
  };

  const clearCanvas = () => {
    const c = canvasRef.current;
    const x = ctx();
    if (!c || !x) return;
    const rect = c.getBoundingClientRect();
    x.fillStyle = "#ffffff";
    x.fillRect(0, 0, rect.width, rect.height);
    saveSnapshot();
  };

  const undo = () => {
    if (history.current.length < 2) return;
    history.current.pop();
    const prev = history.current[history.current.length - 1];
    if (!prev) return;
    const img = new Image();
    img.onload = () => {
      const c = canvasRef.current;
      const x = ctx();
      if (!c || !x) return;
      const rect = c.getBoundingClientRect();
      x.clearRect(0, 0, rect.width, rect.height);
      x.drawImage(img, 0, 0, rect.width, rect.height);
    };
    img.src = prev;
  };

  const save = () => {
    const c = canvasRef.current;
    if (!c) return;
    const link = document.createElement("a");
    link.download = `kibloo-drawing-${Date.now()}.png`;
    link.href = c.toDataURL();
    link.click();
  };

  return (
    <GameShell title={l.title} description={l.desc} emoji="🎨" canonical="/games/drawing">
      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{l.color}:</span>
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => { setColor(c); setEraser(false); }}
            className={`w-7 h-7 rounded-full border-2 ${color === c && !eraser ? "border-purple-500 ring-2 ring-purple-300" : "border-slate-300"}`}
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{l.thickness}:</span>
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`px-2 py-1 rounded font-bold text-xs ${size === s ? "bg-purple-600 text-white" : "bg-slate-200 dark:bg-slate-700"}`}
          >
            {s}px
          </button>
        ))}
        <button
          onClick={() => setEraser((e) => !e)}
          className={`ml-auto px-2 py-1 rounded font-bold text-xs ${eraser ? "bg-amber-500 text-white" : "bg-slate-200 dark:bg-slate-700"}`}
        >
          {eraser ? l.eraser : l.brush}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full bg-white border-2 border-slate-300 dark:border-slate-600 rounded-xl touch-none cursor-crosshair"
        style={{ aspectRatio: "4/3" }}
        onMouseDown={startDraw}
        onMouseMove={moveDraw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={moveDraw}
        onTouchEnd={endDraw}
      />

      <div className="grid grid-cols-3 gap-2 mt-3">
        <button onClick={undo} className="px-3 py-2 bg-slate-200 dark:bg-slate-700 font-bold rounded-lg">⤺ {l.undo}</button>
        <button onClick={clearCanvas} className="px-3 py-2 bg-rose-500 text-white font-bold rounded-lg">{l.clear}</button>
        <button onClick={save} className="px-3 py-2 bg-emerald-500 text-white font-bold rounded-lg">💾 {l.save}</button>
      </div>
    </GameShell>
  );
}
