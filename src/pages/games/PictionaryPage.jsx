import React, { useContext, useEffect, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const WORDS = {
  el: ["σπίτι", "δέντρο", "ήλιος", "φεγγάρι", "αυτοκίνητο", "γάτα", "σκύλος", "λουλούδι", "ψάρι", "καράβι", "μπαλόνι", "πιάνο", "παγωτό", "ποδήλατο", "αερόπλανο", "ομπρέλα", "γιρλάντα", "καπέλο"],
  en: ["house", "tree", "sun", "moon", "car", "cat", "dog", "flower", "fish", "boat", "balloon", "piano", "ice cream", "bicycle", "airplane", "umbrella", "robot", "hat"],
};

const ROUND_TIME = 60;

export default function PictionaryPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const list = WORDS[lang] || WORDS.en;
  const [phase, setPhase] = useState("setup"); // setup | drawing | guess | done
  const [drawer, setDrawer] = useState("p1");
  const [score, setScore] = useState({ p1: 0, p2: 0 });
  const [word, setWord] = useState("");
  const [time, setTime] = useState(ROUND_TIME);
  const [round, setRound] = useState(0);
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const interval = useRef(null);

  useEffect(() => () => clearInterval(interval.current), []);

  const startRound = () => {
    const w = list[Math.floor(Math.random() * list.length)];
    setWord(w);
    setPhase("drawing");
    setTime(ROUND_TIME);
    clear();
    clearInterval(interval.current);
    interval.current = setInterval(() => setTime((t) => {
      if (t <= 1) { clearInterval(interval.current); setPhase("guess"); return 0; }
      return t - 1;
    }), 1000);
  };

  const guesser = drawer === "p1" ? "p2" : "p1";

  const award = (correct) => {
    if (correct) setScore((s) => ({ ...s, [guesser]: s[guesser] + 1 }));
    setRound((r) => r + 1);
    setDrawer((d) => d === "p1" ? "p2" : "p1");
    setPhase("setup");
  };

  const clear = () => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
  };

  const startDraw = (e) => {
    drawing.current = true;
    const c = canvasRef.current; if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = ((e.touches?.[0]?.clientX ?? e.clientX) - rect.left) * (c.width / rect.width);
    const y = ((e.touches?.[0]?.clientY ?? e.clientY) - rect.top) * (c.height / rect.height);
    const ctx = c.getContext("2d"); ctx.beginPath(); ctx.moveTo(x, y);
  };
  const draw = (e) => {
    if (!drawing.current) return;
    e.preventDefault?.();
    const c = canvasRef.current; if (!c) return;
    const rect = c.getBoundingClientRect();
    const x = ((e.touches?.[0]?.clientX ?? e.clientX) - rect.left) * (c.width / rect.width);
    const y = ((e.touches?.[0]?.clientY ?? e.clientY) - rect.top) * (c.height / rect.height);
    const ctx = c.getContext("2d"); ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.strokeStyle = "#000"; ctx.lineTo(x, y); ctx.stroke();
  };
  const endDraw = () => { drawing.current = false; };

  return (
    <GameShell title="Pictionary 1v1" description={isEl ? "Ζωγράφισε εσύ — μάντεψε ο άλλος" : "One draws, the other guesses"} emoji="🖌️" canonical="/games/pictionary" back="/games">
      <div className="text-center mb-2 text-sm">
        🔵 P1: <b>{score.p1}</b> · 🔴 P2: <b>{score.p2}</b> · {isEl ? "Γύρος" : "Round"} {round + 1}
      </div>
      {phase === "setup" && (
        <div className="text-center my-4">
          <div className="text-lg font-bold mb-2">
            {isEl ? "Ζωγραφίζει:" : "Drawer:"} {drawer === "p1" ? "🔵 P1" : "🔴 P2"}
          </div>
          <button onClick={startRound} className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl">
            {isEl ? "▶ Ξεκίνα Γύρο" : "▶ Start Round"}
          </button>
        </div>
      )}
      {(phase === "drawing" || phase === "guess") && (
        <>
          <div className="text-center mb-2">
            <span className="text-sm">⏱️ {time}s</span>
            <div className="text-xl font-extrabold mt-1">
              {phase === "drawing" ? (
                <>{isEl ? "Ζωγραφίζεις:" : "Draw:"} <span className="text-purple-600">{word}</span></>
              ) : (
                <>{isEl ? "Η λέξη ήταν:" : "Word was:"} {word}</>
              )}
            </div>
          </div>
          <canvas
            ref={canvasRef} width={400} height={300}
            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
            onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
            className="w-full border-2 border-slate-700 rounded-lg bg-white touch-none"
          />
          <div className="flex gap-2 justify-center mt-2 flex-wrap">
            {phase === "drawing" && <button onClick={clear} className="px-3 py-1 text-sm bg-slate-200 dark:bg-slate-700 rounded">{isEl ? "Καθαρισμός" : "Clear"}</button>}
            {phase === "guess" && (
              <>
                <button onClick={() => award(true)} className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg">✅ {isEl ? "Σωστά!" : "Correct!"}</button>
                <button onClick={() => award(false)} className="px-4 py-2 bg-rose-500 text-white font-bold rounded-lg">❌ {isEl ? "Λάθος" : "Wrong"}</button>
              </>
            )}
          </div>
        </>
      )}
    </GameShell>
  );
}
