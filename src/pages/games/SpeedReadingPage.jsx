import React, { useContext, useEffect, useRef, useState } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const TEXTS = {
  el: [
    { text: "Ένας μικρός δράκος ζούσε σε ένα μαγικό δάσος γεμάτο ψηλά δέντρα και μυστηριώδη πλάσματα. Κάθε πρωί ξυπνούσε νωρίς για να βρει τους φίλους του, ένα κουνέλι, μια αλεπού και ένα ξυπνητήρι κουκουβάγια. Μαζί ζούσαν περιπέτειες και μάθαιναν πάντα κάτι νέο για τον κόσμο γύρω τους.",
      q: "Πού ζούσε ο δράκος;", opts: ["Σε σπηλιά", "Σε δάσος", "Σε κάστρο", "Σε νησί"], a: 1 },
    { text: "Ο πλανήτης Άρης είναι ο τέταρτος από τον Ήλιο και είναι γνωστός ως ο Κόκκινος Πλανήτης λόγω του χρώματος της επιφάνειάς του. Έχει δύο μικρά φεγγάρια, τον Φόβο και τον Δείμο. Οι επιστήμονες πιστεύουν ότι κάποτε υπήρχε νερό στην επιφάνειά του.",
      q: "Πόσα φεγγάρια έχει ο Άρης;", opts: ["1", "2", "3", "4"], a: 1 },
  ],
  en: [
    { text: "A small dragon lived in a magical forest full of tall trees and mysterious creatures. Every morning he woke up early to find his friends, a rabbit, a fox and a wise owl. Together they had adventures and always learned something new about the world around them.",
      q: "Where did the dragon live?", opts: ["In a cave", "In a forest", "In a castle", "On an island"], a: 1 },
    { text: "Mars is the fourth planet from the Sun and is known as the Red Planet due to its surface color. It has two small moons, Phobos and Deimos. Scientists believe water once existed on its surface.",
      q: "How many moons does Mars have?", opts: ["1", "2", "3", "4"], a: 1 },
  ],
};

const WPM_OPTIONS = [200, 300, 400, 500];

export default function SpeedReadingPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const list = TEXTS[lang] || TEXTS.en;
  const [tIdx, setTIdx] = useState(0);
  const [wpm, setWpm] = useState(300);
  const [phase, setPhase] = useState("idle"); // idle | reading | quiz | result
  const [wordIdx, setWordIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const intervalRef = useRef(null);

  const item = list[tIdx % list.length];
  const words = item.text.split(/\s+/);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const start = () => {
    setWordIdx(0); setPhase("reading"); setChosen(null);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setWordIdx((i) => {
        if (i + 1 >= words.length) { clearInterval(intervalRef.current); setPhase("quiz"); return i; }
        return i + 1;
      });
    }, 60000 / wpm);
  };

  const next = () => { setTIdx((i) => i + 1); setPhase("idle"); setChosen(null); };

  return (
    <GameShell title={isEl ? "Γρήγορη Ανάγνωση" : "Speed Reading"} description={isEl ? "Διάβασε λέξη-λέξη και απάντησε" : "Read word-by-word, then answer"} emoji="📚" canonical="/games/speed-reading" back="/games">
      {phase === "idle" && (
        <div className="text-center my-4">
          <div className="text-sm mb-3">{isEl ? "Ταχύτητα" : "Speed"} (WPM)</div>
          <div className="flex justify-center gap-1 mb-4">
            {WPM_OPTIONS.map((w) => (
              <button key={w} onClick={() => setWpm(w)} className={`px-3 py-1 rounded ${wpm === w ? "bg-purple-600 text-white" : "bg-slate-200 dark:bg-slate-700"}`}>{w}</button>
            ))}
          </div>
          <button onClick={start} className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl">▶ {isEl ? "Ξεκίνα" : "Start"}</button>
        </div>
      )}
      {phase === "reading" && (
        <div className="text-center text-4xl font-extrabold py-16 min-h-[180px]">{words[wordIdx]}</div>
      )}
      {phase === "quiz" && (
        <div>
          <div className="text-lg font-bold mb-3">{item.q}</div>
          <div className="grid grid-cols-2 gap-2">
            {item.opts.map((o, i) => (
              <button key={i} onClick={() => { setChosen(i); setPhase("result"); }} className="px-3 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl">{o}</button>
            ))}
          </div>
        </div>
      )}
      {phase === "result" && (
        <div className="text-center my-4">
          <div className="text-3xl font-extrabold mb-2">
            {chosen === item.a ? "✅ " + (isEl ? "Σωστά!" : "Correct!") : "❌ " + (isEl ? "Λάθος" : "Wrong")}
          </div>
          <div className="text-sm text-slate-500 mb-3">{isEl ? "Σωστή απάντηση:" : "Answer:"} {item.opts[item.a]}</div>
          <button onClick={next} className="px-5 py-2 bg-purple-500 text-white font-bold rounded-lg">→ {isEl ? "Επόμενο" : "Next"}</button>
        </div>
      )}
    </GameShell>
  );
}
