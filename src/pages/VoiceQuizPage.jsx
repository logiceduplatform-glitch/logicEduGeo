import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { VoiceService } from "../services/VoiceService";
import { CoinService } from "../services/CoinService";
import { ProgressService } from "../services/ProgressService";

const T = {
  el: {
    title: "🎤 Φωνητικό Quiz",
    subtitle: "Άκου την ερώτηση & απάντησε προφορικά! Πες τον αριθμό (1-4) ή λέξη-κλειδί.",
    notSupported: "Το πρόγραμμα περιήγησης δεν υποστηρίζει αναγνώριση φωνής. Δοκίμασε Chrome ή Edge.",
    listen: "🔊 Άκου ξανά",
    speakNow: "🎤 Μίλα τώρα...",
    yourAnswer: "Είπες:",
    waiting: "Πάτησε το μικρόφωνο και απάντησε",
    correct: "✓ Σωστό!",
    wrong: "✗ Λάθος",
    next: "Επόμενη",
    finish: "Τέλος",
    finalScore: "Τελικό σκορ",
    rewards: "Ανταμοιβές",
    coins: "νομίσματα",
    xp: "XP",
    playAgain: "Παίξε ξανά",
    back: "← Πίσω",
    micPermission: "Επίτρεψε πρόσβαση στο μικρόφωνο",
    sayNumber: "💡 Πες: \"ένα\", \"δύο\", \"τρία\" ή \"τέσσερα\"",
    or: "ή τη λέξη της απάντησης",
    settings: "Ρυθμίσεις",
    questions: "Ερωτήσεις",
    progress: "Πρόοδος",
    tip: "💡 Συμβουλή: Μίλα καθαρά και κοντά στο μικρόφωνο.",
  },
  en: {
    title: "🎤 Voice Quiz",
    subtitle: "Listen & answer with your voice! Say the number (1-4) or a keyword.",
    notSupported: "Speech recognition not supported in this browser. Try Chrome or Edge.",
    listen: "🔊 Replay",
    speakNow: "🎤 Speak now...",
    yourAnswer: "You said:",
    waiting: "Tap the mic & answer",
    correct: "✓ Correct!",
    wrong: "✗ Wrong",
    next: "Next",
    finish: "Finish",
    finalScore: "Final score",
    rewards: "Rewards",
    coins: "coins",
    xp: "XP",
    playAgain: "Play again",
    back: "← Back",
    micPermission: "Allow microphone access",
    sayNumber: "💡 Say: \"one\", \"two\", \"three\" or \"four\"",
    or: "or the answer keyword",
    settings: "Settings",
    questions: "Questions",
    progress: "Progress",
    tip: "💡 Tip: Speak clearly and close to your microphone.",
  },
};

const NUMBER_KEYWORDS = {
  el: [
    ["1", "ένα", "πρώτο", "πρώτη", "α"],
    ["2", "δύο", "δεύτερο", "δεύτερη", "β"],
    ["3", "τρία", "τρίτο", "τρίτη", "γ"],
    ["4", "τέσσερα", "τέταρτο", "τέταρτη", "δ"],
  ],
  en: [
    ["1", "one", "first", "a"],
    ["2", "two", "second", "b"],
    ["3", "three", "third", "c"],
    ["4", "four", "fourth", "d"],
  ],
};

const QUESTION_BANK = {
  el: [
    { q: "Πόσα πόδια έχει η αράχνη;", options: ["6", "8", "10", "4"], correct: 1 },
    { q: "Ποια είναι η πρωτεύουσα της Ελλάδας;", options: ["Θεσσαλονίκη", "Πάτρα", "Αθήνα", "Λάρισα"], correct: 2 },
    { q: "Πόσοι πλανήτες έχει το ηλιακό μας σύστημα;", options: ["7", "8", "9", "10"], correct: 1 },
    { q: "Ποιος ζωγράφισε τη Μόνα Λίζα;", options: ["Πικάσο", "Ντα Βίντσι", "Βαν Γκογκ", "Μιχαήλ Άγγελος"], correct: 1 },
    { q: "5 + 7 = ;", options: ["10", "11", "12", "13"], correct: 2 },
    { q: "Ποιο ζώο είναι το πιο γρήγορο;", options: ["Λιοντάρι", "Γατόπαρδος", "Αετός", "Δελφίνι"], correct: 1 },
    { q: "Πόσα χρώματα έχει το ουράνιο τόξο;", options: ["5", "6", "7", "8"], correct: 2 },
    { q: "Ποιο είναι το χημικό σύμβολο του νερού;", options: ["CO2", "H2O", "O2", "NaCl"], correct: 1 },
    { q: "9 × 6 = ;", options: ["48", "54", "56", "63"], correct: 1 },
    { q: "Σε ποια ήπειρο είναι η Βραζιλία;", options: ["Αφρική", "Ασία", "Ν. Αμερική", "Ευρώπη"], correct: 2 },
  ],
  en: [
    { q: "How many legs does a spider have?", options: ["6", "8", "10", "4"], correct: 1 },
    { q: "Capital of Greece?", options: ["Thessaloniki", "Patras", "Athens", "Larissa"], correct: 2 },
    { q: "How many planets in our solar system?", options: ["7", "8", "9", "10"], correct: 1 },
    { q: "Who painted the Mona Lisa?", options: ["Picasso", "Da Vinci", "Van Gogh", "Michelangelo"], correct: 1 },
    { q: "5 + 7 = ?", options: ["10", "11", "12", "13"], correct: 2 },
    { q: "Fastest animal?", options: ["Lion", "Cheetah", "Eagle", "Dolphin"], correct: 1 },
    { q: "How many colors in a rainbow?", options: ["5", "6", "7", "8"], correct: 2 },
    { q: "Chemical symbol for water?", options: ["CO2", "H2O", "O2", "NaCl"], correct: 1 },
    { q: "9 × 6 = ?", options: ["48", "54", "56", "63"], correct: 1 },
    { q: "Continent of Brazil?", options: ["Africa", "Asia", "S. America", "Europe"], correct: 2 },
  ],
};

function pickQuestions(lang, count = 5) {
  const bank = QUESTION_BANK[lang] || QUESTION_BANK.en;
  return [...bank].sort(() => Math.random() - 0.5).slice(0, count);
}

function isSpeechRecognitionSupported() {
  return typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
}

export default function VoiceQuizPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const navigate = useNavigate();

  const [questions] = useState(() => pickQuestions(lang, 5));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState(null); // {ok, msg, selected}
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const recRef = useRef(null);
  const supported = useMemo(isSpeechRecognitionSupported, []);

  const current = questions[idx];

  // Speak the question on entry
  useEffect(() => {
    if (current && !done) {
      try {
        VoiceService.speak(current.q + ". " + current.options.map((o, i) => `${i + 1}. ${o}`).join(", "), lang === "el" ? "el-GR" : "en-US");
      } catch {}
    }
    return () => { try { VoiceService.cancel?.(); } catch {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, done]);

  const handleListen = () => {
    if (!supported) return;
    if (listening) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = lang === "el" ? "el-GR" : "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart = () => { setListening(true); setError(""); setTranscript(""); };
    rec.onend = () => setListening(false);
    rec.onerror = (e) => { setListening(false); setError(e.error || "error"); };
    rec.onresult = (e) => {
      const t = Array.from(e.results).map((r) => r[0].transcript).join(" ").trim().toLowerCase();
      setTranscript(t);
      checkAnswer(t);
    };
    try { rec.start(); recRef.current = rec; } catch (e) { setError("start_failed"); }
  };

  const checkAnswer = (t) => {
    if (!current) return;
    const numKw = NUMBER_KEYWORDS[lang] || NUMBER_KEYWORDS.en;
    let selected = -1;
    for (let i = 0; i < 4; i++) {
      if (numKw[i].some((kw) => t.includes(kw))) { selected = i; break; }
    }
    if (selected < 0) {
      // Try matching answer text
      for (let i = 0; i < current.options.length; i++) {
        if (t.includes(current.options[i].toLowerCase())) { selected = i; break; }
      }
    }
    const ok = selected === current.correct;
    setFeedback({ ok, selected });
    if (ok) setScore((s) => s + 1);
    try { VoiceService.speak(ok ? l.correct : l.wrong, lang === "el" ? "el-GR" : "en-US"); } catch {}
  };

  const handleNext = () => {
    setFeedback(null);
    setTranscript("");
    if (idx + 1 >= questions.length) {
      setDone(true);
      try {
        const coins = score * 5;
        const xp = score * 3;
        if (coins) CoinService.earn(coins);
        if (xp) ProgressService.addXP(xp, 2);
      } catch {}
    } else {
      setIdx(idx + 1);
    }
  };

  const handleRestart = () => {
    window.location.reload();
  };

  const handleSpeakAgain = () => {
    if (!current) return;
    try {
      VoiceService.speak(current.q + ". " + current.options.map((o, i) => `${i + 1}. ${o}`).join(", "), lang === "el" ? "el-GR" : "en-US");
    } catch {}
  };

  const progressPct = Math.round(((idx + (feedback ? 1 : 0)) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-2xl space-y-4">
          <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:underline">{l.back}</button>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
          </div>

          {!supported ? (
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-6 text-center">
              <p className="text-rose-700 dark:text-rose-300 font-bold">{l.notSupported}</p>
            </div>
          ) : done ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700 text-center space-y-4">
              <div className="text-7xl">{score === questions.length ? "🏆" : score > questions.length / 2 ? "🎉" : "💪"}</div>
              <p className="text-xl font-bold text-slate-700 dark:text-slate-200">{l.finalScore}</p>
              <p className="text-5xl font-extrabold text-violet-600">{score}/{questions.length}</p>
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl p-3">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{l.rewards}</p>
                <p className="text-lg font-extrabold text-amber-700 dark:text-amber-300">🪙 {score * 5} {l.coins} · ⭐ {score * 3} {l.xp}</p>
              </div>
              <button onClick={handleRestart} className="px-6 py-3 rounded-xl bg-violet-500 text-white font-bold shadow">
                {l.playAgain}
              </button>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="h-2 bg-gradient-to-r from-violet-400 to-fuchsia-500 transition-all" style={{ width: `${progressPct}%` }} />
              </div>
              <p className="text-xs text-center text-slate-400">{l.questions}: {idx + 1}/{questions.length} · 🎯 {score}</p>

              {/* Question card */}
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700">
                <p className="text-2xl font-bold text-slate-800 dark:text-white text-center">{current?.q}</p>
                <button onClick={handleSpeakAgain} className="block mx-auto mt-2 text-sm text-violet-600 hover:underline">{l.listen}</button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-5">
                  {current?.options.map((opt, i) => {
                    const isSel = feedback && feedback.selected === i;
                    const isRight = feedback && i === current.correct;
                    return (
                      <div
                        key={i}
                        className={`px-4 py-3 rounded-xl font-bold border-2 ${
                          feedback
                            ? isRight
                              ? "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-400 text-emerald-700"
                              : isSel
                                ? "bg-rose-100 dark:bg-rose-900/30 border-rose-400 text-rose-700"
                                : "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500"
                            : "bg-violet-50 dark:bg-slate-700 border-violet-200 dark:border-slate-600 text-slate-700 dark:text-slate-200"
                        }`}
                      >
                        <span className="font-mono mr-2">{i + 1}.</span>
                        {opt}
                      </div>
                    );
                  })}
                </div>

                {/* Mic button */}
                <div className="mt-6 text-center space-y-2">
                  {!feedback ? (
                    <button
                      onClick={handleListen}
                      disabled={listening}
                      className={`px-8 py-4 rounded-2xl text-white font-extrabold shadow-lg transition ${
                        listening ? "bg-rose-500 animate-pulse" : "bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:scale-105"
                      }`}
                    >
                      {listening ? l.speakNow : "🎤 " + l.waiting}
                    </button>
                  ) : (
                    <button onClick={handleNext} className="px-8 py-3 rounded-2xl bg-emerald-500 text-white font-extrabold shadow-lg hover:scale-105 transition">
                      {idx + 1 >= questions.length ? l.finish : l.next} →
                    </button>
                  )}

                  {transcript && (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-bold">{l.yourAnswer}</span> "{transcript}"
                    </p>
                  )}
                  {feedback && (
                    <p className={`text-xl font-extrabold ${feedback.ok ? "text-emerald-600" : "text-rose-500"}`}>
                      {feedback.ok ? l.correct : l.wrong}
                    </p>
                  )}
                  {error && <p className="text-xs text-rose-500">⚠️ {error}</p>}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">
                <p>{l.sayNumber}</p>
                <p>{l.tip}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
