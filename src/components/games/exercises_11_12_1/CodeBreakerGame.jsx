import React, { useState, useRef, useEffect, useCallback } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

const ALPHABET_EL = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
const ALPHABET_EN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const MESSAGES = {
  el: [
    "ΜΑΘΗΜΑΤΙΚΑ ΕΙΝΑΙ ΠΑΙΧΝΙΔΙ",
    "Η ΓΝΩΣΗ ΕΙΝΑΙ ΔΥΝΑΜΗ",
    "ΣΚΕΨΟΥ ΛΟΓΙΚΑ",
    "ΛΥΣΕ ΤΟ ΜΥΣΤΗΡΙΟ",
    "ΕΞΥΠΝΟ ΠΑΙΔΙ",
    "ΚΩΔΙΚΟΣ ΕΠΙΤΥΧΙΑΣ",
    "ΜΥΑΛΟ ΑΤΣΑΛΙ",
    "ΚΡΥΦΟ ΜΗΝΥΜΑ",
  ],
  en: [
    "MATH IS FUN",
    "KNOWLEDGE IS POWER",
    "THINK LOGICALLY",
    "SOLVE THE MYSTERY",
    "SMART KID",
    "CODE OF SUCCESS",
    "STEEL MIND",
    "SECRET MESSAGE",
  ],
};

function caesarEncrypt(text, shift, alphabet) {
  return text.split("").map(ch => {
    const idx = alphabet.indexOf(ch);
    if (idx === -1) return ch;
    return alphabet[(idx + shift) % alphabet.length];
  }).join("");
}

function caesarDecrypt(text, shift, alphabet) {
  return caesarEncrypt(text, alphabet.length - shift, alphabet);
}

function shuffled(arr) { const a = [...arr]; for (let i = a.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; }

export default function CodeBreakerGame({ lang = "el", onComplete, difficulty = 3 }) {
  const { safeTimeout } = useSafeTimeout();
  const isEl = lang === "el";
  const alphabet = isEl ? ALPHABET_EL : ALPHABET_EN;
  const messages = MESSAGES[isEl ? "el" : "en"];

  const [rounds] = useState(() => shuffled(messages).slice(0, 6));
  const [round, setRound] = useState(0);
  const [shift] = useState(() => Math.floor(Math.random() * 5) + 1);
  const [encrypted, setEncrypted] = useState(() => caesarEncrypt(rounds[0], shift, alphabet));
  const [userInput, setUserInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentShift, setCurrentShift] = useState(shift);
  const [triedShifts, setTriedShifts] = useState([]);
  const [hintLevel, setHintLevel] = useState(0);
  const correctRef = useRef(null);
  const wrongRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 6;
  const originalMessage = rounds[round];

  useEffect(() => {
    correctRef.current = new Audio("/sounds/correct.mp3");
    wrongRef.current = new Audio("/sounds/wrong.mp3");
  }, []);

  const tryShift = useCallback((s) => {
    const decrypted = caesarDecrypt(encrypted, s, alphabet);
    setUserInput(decrypted);
    setTriedShifts(prev => [...new Set([...prev, s])]);
  }, [encrypted, alphabet]);

  const submitAnswer = useCallback(() => {
    if (showResult) return;
    const correct = userInput.toUpperCase().trim() === originalMessage;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      correctRef.current?.play();
      setScore(prev => prev + 1);
      VoiceService.speak(isEl ? `Σωστά! ${originalMessage}` : `Correct! ${originalMessage}`, lang);
    } else {
      wrongRef.current?.play();
      setUserInput(originalMessage);
    }

    updateProgress({ title: "codeBreakerGame", score: score + (correct ? 1 : 0), total: TARGET_ROUNDS, index: round + 1 });

    safeTimeout(() => {
      if (round + 1 >= TARGET_ROUNDS) {
        setShowCelebration(true);
        const final = score + (correct ? 1 : 0);
        completeQuiz({ title: "codeBreakerGame", score: final, total: TARGET_ROUNDS });
        safeTimeout(() => onComplete?.({ score: final, total: TARGET_ROUNDS }), 2500);
      } else {
        const next = round + 1;
        const newShift = Math.floor(Math.random() * 5) + 1;
        setRound(next);
        setCurrentShift(newShift);
        setEncrypted(caesarEncrypt(rounds[next], newShift, alphabet));
        setUserInput("");
        setShowResult(false);
        setTriedShifts([]);
        setHintLevel(0);
      }
    }, 2500);
  }, [showResult, userInput, originalMessage, round, score, rounds, alphabet, isEl, lang, safeTimeout, updateProgress, completeQuiz, onComplete]);

  const giveHint = useCallback(() => {
    if (hintLevel === 0) {
      setHintLevel(1);
    } else if (hintLevel === 1) {
      setHintLevel(2);
    }
  }, [hintLevel]);

  if (showCelebration) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 animate-[fadeIn_0.5s]">
        <span className="text-7xl">🔓</span>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{isEl ? "Μάστερ Κρυπτογράφος!" : "Master Codebreaker!"}</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">{isEl ? `Σκόρ: ${score}/${TARGET_ROUNDS}` : `Score: ${score}/${TARGET_ROUNDS}`}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{isEl ? "Κρυπτογράφος" : "Code Breaker"} 🔐</span>
          <span className="text-sm font-bold text-slate-500">{round + 1}/{TARGET_ROUNDS}</span>
        </div>

        {/* Encrypted message */}
        <div className="bg-gray-900 rounded-2xl p-5 shadow-lg mb-4 border border-green-500/30">
          <p className="text-xs text-green-400 font-mono mb-2">{isEl ? "// ΚΡΥΠΤΟΓΡΑΦΗΜΕΝΟ ΜΗΝΥΜΑ" : "// ENCRYPTED MESSAGE"}</p>
          <p className="text-lg font-mono text-green-300 tracking-wider break-all">{encrypted}</p>
          <p className="text-xs text-green-500/60 mt-2 font-mono">{isEl ? `Κρυπτογράφηση: Caesar Cipher` : `Encryption: Caesar Cipher`}</p>
        </div>

        {/* Hints */}
        {hintLevel >= 1 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 mb-3 text-sm text-amber-800 dark:text-amber-200 border border-amber-200">
            💡 {isEl ? `Μετατόπιση κατά ${currentShift} γράμματα (Caesar Cipher: κάθε γράμμα αντικαθίσταται με αυτό που είναι ${currentShift} θέσεις μετά)` : `Shift of ${currentShift} letters (Caesar Cipher: each letter is replaced by the one ${currentShift} positions ahead)`}
          </div>
        )}
        {hintLevel >= 2 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mb-3 text-sm text-blue-800 dark:text-blue-200 border border-blue-200">
            🔑 {isEl ? `Πρώτο γράμμα: ${originalMessage[0]}` : `First letter: ${originalMessage[0]}`}
          </div>
        )}

        {/* Shift buttons */}
        <div className="mb-4">
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">{isEl ? "Δοκίμασε μετατόπιση:" : "Try shift:"}</p>
          <div className="flex gap-1.5 flex-wrap">
            {[1,2,3,4,5,6,7,8].map(s => (
              <button key={s} onClick={() => tryShift(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${triedShifts.includes(s) ? "bg-purple-100 text-purple-700 border border-purple-300" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-purple-50 border border-transparent"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Decoded result */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-4 border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-500 mb-1">{isEl ? "Αποκωδικοποιημένο:" : "Decoded:"}</p>
          <input
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value.toUpperCase())}
            className="w-full text-lg font-mono font-bold text-slate-800 dark:text-slate-200 bg-transparent border-b-2 border-slate-300 dark:border-slate-600 focus:border-purple-500 outline-none py-1"
            placeholder={isEl ? "Γράψε το μήνυμα..." : "Type the message..."}
            disabled={showResult}
          />
        </div>

        {showResult && (
          <div className={`mb-3 p-3 rounded-xl text-center font-bold ${isCorrect ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
            {isCorrect ? "✅ " : "❌ "}{originalMessage}
          </div>
        )}

        <div className="flex gap-2 justify-center mb-3">
          <button onClick={submitAnswer} disabled={showResult || !userInput}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold shadow-lg disabled:opacity-40 hover:-translate-y-0.5 transition-all">
            🔓 {isEl ? "Υποβολή" : "Submit"}
          </button>
          <button onClick={giveHint} disabled={showResult || hintLevel >= 2}
            className="px-4 py-2.5 rounded-xl bg-amber-400 text-amber-900 font-bold disabled:opacity-40 transition-all">
            💡 {isEl ? "Βοήθεια" : "Hint"}
          </button>
        </div>

        <div className="flex justify-center text-sm font-semibold">
          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700">🔐 {score}/{TARGET_ROUNDS}</span>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}
