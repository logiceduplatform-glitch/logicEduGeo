import React, { useContext, useEffect, useState, useCallback } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";
import { VoiceService } from "../../services/VoiceService";

const WORDS = {
  el: ["σχολείο", "βιβλίο", "θάλασσα", "παράθυρο", "καρέκλα", "δάσκαλος", "μολύβι", "παγωτό", "λουλούδι", "ποδήλατο", "πρωινό", "μπαμπάς", "χάρτινος", "γαλάζιος", "κίτρινος"],
  en: ["school", "library", "elephant", "mountain", "kitchen", "teacher", "pencil", "rainbow", "butterfly", "bicycle", "computer", "vegetable", "happiness", "adventure", "celebrate"],
};

export default function SpellingBeePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const isEl = lang === "el";
  const list = WORDS[lang] || WORDS.en;
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [voiceOk, setVoiceOk] = useState(true);

  useEffect(() => { setVoiceOk(VoiceService.isAvailable()); }, []);

  const word = list[idx % list.length];

  const speak = useCallback(() => {
    VoiceService.speak(word, lang);
  }, [word, lang]);

  useEffect(() => {
    const t = setTimeout(speak, 400);
    return () => clearTimeout(t);
  }, [speak]);

  const submit = (e) => {
    e?.preventDefault();
    const ok = input.trim().toLocaleLowerCase(lang === "el" ? "el-GR" : "en-US") === word.toLocaleLowerCase(lang === "el" ? "el-GR" : "en-US");
    if (ok) {
      setScore((s) => s + 1);
      setFeedback(isEl ? "✅ Σωστά!" : "✅ Correct!");
      setTimeout(() => {
        setIdx((i) => i + 1);
        setInput("");
        setFeedback("");
        setReveal(false);
      }, 700);
    } else {
      setFeedback(isEl ? "❌ Δοκίμασε ξανά" : "❌ Try again");
    }
  };

  const skip = () => {
    setIdx((i) => i + 1);
    setInput("");
    setFeedback("");
    setReveal(false);
  };

  return (
    <GameShell
      title={isEl ? "Spelling Bee" : "Spelling Bee"}
      description={isEl ? "Άκου τη λέξη και γράψε την σωστά" : "Listen to the word and spell it"}
      emoji="🐝"
      canonical="/games/spelling-bee"
      back="/games"
    >
      {!voiceOk && (
        <div className="mb-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-sm">
          {isEl ? "⚠️ Ο φυλλομετρητής δεν υποστηρίζει φωνή" : "⚠️ Browser does not support speech"}
        </div>
      )}
      <div className="text-center">
        <div className="text-6xl mb-3">🐝</div>
        <div className="text-sm text-slate-500 mb-2">{isEl ? "Σκορ" : "Score"}: <b>{score}</b> · #{idx + 1}</div>
        <button onClick={speak} className="mb-4 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-lg">
          🔊 {isEl ? "Άκου ξανά" : "Hear again"}
        </button>
        <form onSubmit={submit} className="space-y-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isEl ? "Γράψε τη λέξη..." : "Type the word..."}
            autoFocus
            className="w-full max-w-sm mx-auto block px-4 py-3 text-xl text-center rounded-xl border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white focus:border-amber-500 outline-none"
          />
          <div className="flex justify-center gap-2 flex-wrap">
            <button type="submit" className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg">
              {isEl ? "Έλεγχος" : "Check"}
            </button>
            <button type="button" onClick={() => setReveal(true)} className="px-5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold rounded-lg">
              {isEl ? "Δείξε" : "Reveal"}
            </button>
            <button type="button" onClick={skip} className="px-5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold rounded-lg">
              {isEl ? "Επόμενο" : "Skip"}
            </button>
          </div>
        </form>
        {feedback && <div className="mt-3 text-lg font-bold">{feedback}</div>}
        {reveal && <div className="mt-3 text-amber-600 dark:text-amber-400 font-mono text-2xl">{word}</div>}
      </div>
    </GameShell>
  );
}
