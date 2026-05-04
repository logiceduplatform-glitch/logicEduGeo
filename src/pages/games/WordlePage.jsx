import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import GameShell from "../../components/games/GameShell";
import { LanguageContext } from "../../i18n/LanguageContext";

const WORDS_EL = [
  "ΣΧΟΛΗ", "ΦΥΣΗΣ", "ΠΟΛΗΣ", "ΓΡΑΜΜΑ", "ΦΑΓΑΜΕ",
  "ΛΟΓΟΣΟ", "ΚΗΠΟΣΟ", // 5+ letter words pruned to length 5
];
// Curated 5-letter Greek words (uppercase, no accents).
const FIVES_EL = [
  "ΣΠΙΤΙ", "ΑΓΑΠΗ", "ΤΡΕΧΩ", "ΦΙΛΙΑ", "ΠΑΙΔΙ",
  "ΟΥΡΑΝ", "ΘΑΛΑΣ", "ΦΥΛΛΟ", "ΧΑΡΤΗ", "ΣΧΟΛΗ",
  "ΓΥΝΑΙ", "ΑΝΔΡΑ", "ΜΗΤΡΑ", "ΠΑΤΕΡ", "ΣΩΜΑΤ",
  "ΓΛΩΣΣ", "ΓΡΑΦΩ", "ΑΚΟΥΩ", "ΒΛΕΠΩ", "ΖΩΓΡΑ",
  "ΛΕΦΤΑ", "ΦΩΤΟΣ", "ΦΡΑΟΥ", "ΜΗΛΟΥ", "ΛΕΜΟΝ",
  "ΧΑΡΑΣ", "ΛΥΠΗΣ", "ΓΕΛΙΟ", "ΚΛΑΜΑ", "ΥΠΝΟΣ",
];
const FIVES_EN = [
  "APPLE", "BRAVE", "CRANE", "DRIVE", "EAGLE",
  "FLAME", "GRAPE", "HOUSE", "INDEX", "JOKER",
  "KNIFE", "LEMON", "MOUSE", "NORTH", "OCEAN",
  "PIANO", "QUEEN", "RIVER", "STORM", "TIGER",
  "URBAN", "VIVID", "WATER", "XENON", "YACHT",
  "ZEBRA", "BREAD", "CHESS", "DREAM", "EARTH",
];

const ROWS = 6;
const COLS = 5;

const KB_EL = [
  "ΕΡΤΥΘΙΟΠ", // 8
  "ΑΣΔΦΓΗΞΚΛ",
  "ΖΧΨΩΒΝΜ",
];
const KB_EN = [
  "QWERTYUIOP",
  "ASDFGHJKL",
  "ZXCVBNM",
];

function gradeGuess(guess, target) {
  const result = Array(COLS).fill("absent");
  const targetArr = target.split("");
  // First pass: greens
  guess.split("").forEach((ch, i) => {
    if (ch === targetArr[i]) {
      result[i] = "correct";
      targetArr[i] = null;
    }
  });
  // Second pass: yellows (consume one occurrence)
  guess.split("").forEach((ch, i) => {
    if (result[i] !== "correct") {
      const idx = targetArr.indexOf(ch);
      if (idx !== -1) {
        result[i] = "present";
        targetArr[idx] = null;
      }
    }
  });
  return result;
}

function pickWord(lang) {
  const list = lang === "el" ? FIVES_EL : FIVES_EN;
  // Pick deterministically per day so everyone gets the same word.
  const today = new Date();
  const seed = today.getFullYear() * 1000 + today.getMonth() * 31 + today.getDate();
  return list[seed % list.length];
}

const T = {
  el: {
    title: "Wordle",
    desc: "Μάντεψε τη λέξη 5 γραμμάτων σε 6 προσπάθειες.",
    win: "Μπράβο! Τη βρήκες!",
    lose: "Η λέξη ήταν",
    play: "Νέο παιχνίδι",
    notWord: "Συμπλήρωσε 5 γράμματα.",
    enter: "ENTER",
    del: "DEL",
  },
  en: {
    title: "Wordle",
    desc: "Guess the 5-letter word in 6 tries.",
    win: "Great! You found it!",
    lose: "The word was",
    play: "New game",
    notWord: "Fill in 5 letters.",
    enter: "ENTER",
    del: "DEL",
  },
};

export default function WordlePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;

  const [target, setTarget] = useState(() => pickWord(lang));
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState("playing"); // playing | won | lost
  const [toast, setToast] = useState("");

  useEffect(() => {
    setTarget(pickWord(lang));
    setGuesses([]);
    setCurrent("");
    setStatus("playing");
  }, [lang]);

  const submit = useCallback(() => {
    if (current.length !== COLS) {
      setToast(l.notWord);
      setTimeout(() => setToast(""), 1200);
      return;
    }
    const next = [...guesses, current];
    setGuesses(next);
    if (current === target) setStatus("won");
    else if (next.length >= ROWS) setStatus("lost");
    setCurrent("");
  }, [current, guesses, target, l.notWord]);

  const press = useCallback((key) => {
    if (status !== "playing") return;
    if (key === "ENTER") return submit();
    if (key === "DEL" || key === "BACKSPACE") {
      setCurrent((c) => c.slice(0, -1));
      return;
    }
    if (current.length >= COLS) return;
    if (/^[A-ZΑ-Ω]$/.test(key)) {
      setCurrent((c) => c + key);
    }
  }, [current.length, status, submit]);

  // Hardware keyboard
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key.toUpperCase();
      if (k === "ENTER" || k === "BACKSPACE") press(k);
      else press(k);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  const grades = useMemo(
    () => guesses.map((g) => gradeGuess(g, target)),
    [guesses, target]
  );

  // Build per-letter status from past guesses (for keyboard hints)
  const letterStatus = useMemo(() => {
    const map = {};
    guesses.forEach((g, gi) => {
      g.split("").forEach((ch, ci) => {
        const grade = grades[gi][ci];
        const prev = map[ch];
        const rank = { correct: 3, present: 2, absent: 1 };
        if (!prev || rank[grade] > rank[prev]) map[ch] = grade;
      });
    });
    return map;
  }, [guesses, grades]);

  const reset = () => {
    // Pick a random new word (not just today's)
    const list = lang === "el" ? FIVES_EL : FIVES_EN;
    setTarget(list[Math.floor(Math.random() * list.length)]);
    setGuesses([]);
    setCurrent("");
    setStatus("playing");
  };

  const cells = useMemo(() => {
    const rows = [];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      const guess = guesses[r] || (r === guesses.length ? current.padEnd(COLS, " ") : "     ");
      for (let c = 0; c < COLS; c++) {
        const ch = guess[c] || "";
        const grade = grades[r]?.[c];
        const filled = ch.trim() !== "";
        let cls = "border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900";
        if (grade === "correct") cls = "bg-emerald-500 text-white border-emerald-600";
        else if (grade === "present") cls = "bg-amber-400 text-white border-amber-500";
        else if (grade === "absent") cls = "bg-slate-500 text-white border-slate-600";
        else if (filled) cls = "border-slate-500 dark:border-slate-400 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900";
        row.push(
          <div
            key={`${r}-${c}`}
            className={`w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-md flex items-center justify-center text-2xl font-extrabold uppercase ${cls}`}
          >
            {ch.trim()}
          </div>
        );
      }
      rows.push(<div key={r} className="flex gap-1.5 justify-center">{row}</div>);
    }
    return rows;
  }, [guesses, current, grades]);

  const kb = lang === "el" ? KB_EL : KB_EN;

  return (
    <GameShell title={l.title} description={l.desc} emoji="🟩" canonical="/games/wordle">
      <div className="space-y-3">
        <div className="space-y-1.5">{cells}</div>

        {toast && <div className="text-center text-sm font-bold text-amber-700">{toast}</div>}

        {status !== "playing" && (
          <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
            <div className="font-bold text-lg text-slate-800 dark:text-slate-100">
              {status === "won" ? `🎉 ${l.win}` : `😔 ${l.lose}: ${target}`}
            </div>
            <button
              type="button"
              onClick={reset}
              className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg"
            >
              {l.play}
            </button>
          </div>
        )}

        {/* On-screen keyboard */}
        <div className="space-y-1 mt-3">
          {kb.map((row, ri) => (
            <div key={ri} className="flex justify-center gap-1 flex-wrap">
              {ri === kb.length - 1 && (
                <button onClick={() => press("ENTER")} className="px-2 py-2.5 rounded bg-slate-300 dark:bg-slate-600 font-bold text-xs">{l.enter}</button>
              )}
              {row.split("").map((ch) => {
                const s = letterStatus[ch];
                let cls = "bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100";
                if (s === "correct") cls = "bg-emerald-500 text-white";
                else if (s === "present") cls = "bg-amber-400 text-white";
                else if (s === "absent") cls = "bg-slate-500 text-white";
                return (
                  <button
                    key={ch}
                    onClick={() => press(ch)}
                    className={`w-7 sm:w-9 h-10 rounded font-bold ${cls} active:scale-95`}
                  >
                    {ch}
                  </button>
                );
              })}
              {ri === kb.length - 1 && (
                <button onClick={() => press("DEL")} className="px-2 py-2.5 rounded bg-slate-300 dark:bg-slate-600 font-bold text-xs">⌫</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
