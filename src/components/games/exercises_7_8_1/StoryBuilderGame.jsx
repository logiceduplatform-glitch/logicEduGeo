import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

const STORIES = {
  el: [
    { sentence: "Ο ___ πήγε στο σχολείο.", blank: "Γιώργος", options: ["Γιώργος", "σπίτι", "τρέχει"] },
    { sentence: "Η γάτα ___ πάνω στο δέντρο.", blank: "ανέβηκε", options: ["ανέβηκε", "κόκκινο", "βιβλίο"] },
    { sentence: "Σήμερα ο καιρός είναι ___.", blank: "ηλιόλουστος", options: ["ηλιόλουστος", "τρέχω", "παιδί"] },
    { sentence: "Η μαμά μαγείρεψε ___ για βραδινό.", blank: "μακαρόνια", options: ["μακαρόνια", "ύπνος", "μολύβι"] },
    { sentence: "Ο σκύλος ___ στο πάρκο.", blank: "έτρεξε", options: ["έτρεξε", "πράσινο", "τραπέζι"] },
    { sentence: "Τα παιδιά ___ στην αυλή.", blank: "παίζουν", options: ["παίζουν", "ντουλάπα", "μπλε"] },
    { sentence: "Ο μπαμπάς διαβάζει ___.", blank: "εφημερίδα", options: ["εφημερίδα", "πετάει", "κρύο"] },
    { sentence: "Η ___ λάμπει στον ουρανό.", blank: "σελήνη", options: ["σελήνη", "καρέκλα", "τρώω"] },
    { sentence: "Ο Νίκος φοράει το ___ του.", blank: "καπέλο", options: ["καπέλο", "γράφω", "γάλα"] },
    { sentence: "Η τάξη είναι ___.", blank: "ήσυχη", options: ["ήσυχη", "ποδήλατο", "κολυμπάω"] },
    { sentence: "Η γιαγιά ___ ωραίες ιστορίες.", blank: "αφηγείται", options: ["αφηγείται", "πορτοκάλι", "τραγούδι"] },
    { sentence: "Ο ___ ήταν πολύ αστείος.", blank: "κλόουν", options: ["κλόουν", "βρέχει", "πόρτα"] },
    { sentence: "Τα λουλούδια ___ στον κήπο.", blank: "ανθίζουν", options: ["ανθίζουν", "μαξιλάρι", "πέντε"] },
    { sentence: "Η Μαρία ___ ένα ωραίο τραγούδι.", blank: "τραγουδάει", options: ["τραγουδάει", "λεωφορείο", "πίνακας"] },
    { sentence: "Ο δάσκαλος ___ στον πίνακα.", blank: "γράφει", options: ["γράφει", "μπαλόνι", "αρκούδα"] },
  ],
  en: [
    { sentence: "The ___ went to school.", blank: "boy", options: ["boy", "house", "runs"] },
    { sentence: "The cat ___ up the tree.", blank: "climbed", options: ["climbed", "red", "book"] },
    { sentence: "Today the weather is ___.", blank: "sunny", options: ["sunny", "running", "child"] },
    { sentence: "Mom cooked ___ for dinner.", blank: "pasta", options: ["pasta", "sleep", "pencil"] },
    { sentence: "The dog ___ in the park.", blank: "ran", options: ["ran", "green", "table"] },
    { sentence: "The children ___ in the yard.", blank: "play", options: ["play", "closet", "blue"] },
    { sentence: "Dad reads the ___.", blank: "newspaper", options: ["newspaper", "flies", "cold"] },
    { sentence: "The ___ shines in the sky.", blank: "moon", options: ["moon", "chair", "eating"] },
    { sentence: "Nick wears his ___.", blank: "hat", options: ["hat", "write", "milk"] },
    { sentence: "The classroom is ___.", blank: "quiet", options: ["quiet", "bicycle", "swim"] },
    { sentence: "Grandma ___ beautiful stories.", blank: "tells", options: ["tells", "orange", "song"] },
    { sentence: "The ___ was very funny.", blank: "clown", options: ["clown", "raining", "door"] },
    { sentence: "The flowers ___ in the garden.", blank: "bloom", options: ["bloom", "pillow", "five"] },
    { sentence: "Maria ___ a nice song.", blank: "sings", options: ["sings", "bus", "board"] },
    { sentence: "The teacher ___ on the board.", blank: "writes", options: ["writes", "balloon", "bear"] },
  ],
};

export default function StoryBuilderGame({ lang = "el", onComplete, difficulty = 3 }) {
  const { safeTimeout } = useSafeTimeout();
  const isEl = lang === "el";
  const stories = STORIES[isEl ? "el" : "en"];

  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const correctRef = useRef(null);
  const wrongRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const d = Math.max(1, Math.min(5, difficulty));
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];
  const story = stories[round];
  const TARGET_ROUNDS = stories.length;

  useEffect(() => {
    correctRef.current = new Audio("/sounds/correct.mp3");
    wrongRef.current = new Audio("/sounds/wrong.mp3");
  }, []);

  useEffect(() => {
    const text = isEl
      ? `Συμπλήρωσε τη φράση: ${story.sentence.replace("___", "κενό")}`
      : `Complete the sentence: ${story.sentence.replace("___", "blank")}`;
    VoiceService.speak(text, lang);
  }, [round]);

  const handleAnswer = (opt) => {
    if (showResult) return;
    const correct = opt === story.blank;
    setSelected(opt);
    setShowResult(true);

    if (correct) {
      correctRef.current?.play();
      setScore(prev => prev + 1);
      const fullSentence = story.sentence.replace("___", story.blank);
      VoiceService.speak(fullSentence, lang);
    } else {
      wrongRef.current?.play();
    }

    updateProgress({ title: "storyBuilderGame", score: score + (correct ? 1 : 0), total: TARGET_ROUNDS, index: round + 1 });

    safeTimeout(() => {
      if (round + 1 >= TARGET_ROUNDS) {
        setShowCelebration(true);
        const final = score + (correct ? 1 : 0);
        completeQuiz({ title: "storyBuilderGame", score: final, total: TARGET_ROUNDS });
        safeTimeout(() => onComplete?.({ score: final, total: TARGET_ROUNDS }), 2500);
      } else {
        setRound(prev => prev + 1);
        setSelected(null);
        setShowResult(false);
      }
    }, NEXT_DELAY);
  };

  if (showCelebration) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 animate-[fadeIn_0.5s]">
        <span className="text-7xl">📖</span>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          {isEl ? "Τέλεια Ιστορία!" : "Great Story!"}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {isEl ? `Σκόρ: ${score}/${TARGET_ROUNDS}` : `Score: ${score}/${TARGET_ROUNDS}`}
        </p>
      </div>
    );
  }

  const parts = story.sentence.split("___");

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
            {isEl ? "Μικρή Ιστορία" : "Story Builder"} 📖
          </span>
          <span className="text-sm font-bold text-slate-500">{round + 1}/{TARGET_ROUNDS}</span>
        </div>

        <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all" style={{ width: `${((round + 1) / TARGET_ROUNDS) * 100}%` }} />
        </div>

        {/* Sentence with blank */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 text-center mb-4">
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
            {parts[0]}
            <span className={`inline-block min-w-[80px] mx-1 px-3 py-1 rounded-lg border-2 border-dashed text-lg font-bold transition-all ${
              showResult
                ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                : "border-purple-400 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300"
            }`}>
              {showResult ? story.blank : (selected || "___")}
            </span>
            {parts[1]}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2 mb-4">
          {story.options.map(opt => {
            const isCorrect = opt === story.blank;
            const isSel = selected === opt;
            return (
              <button key={opt} onClick={() => handleAnswer(opt)} disabled={showResult}
                className={[
                  "w-full px-4 py-3 rounded-xl text-base font-semibold transition-all border-2 text-center",
                  showResult && isCorrect ? "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 text-emerald-700 dark:text-emerald-300 scale-[1.02]"
                    : showResult && isSel ? "bg-red-100 dark:bg-red-900/40 border-red-400 text-red-700 dark:text-red-300"
                    : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-amber-400 hover:shadow-md",
                ].join(" ")}>
                {opt}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center text-sm font-semibold">
          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700">⭐ {score}/{TARGET_ROUNDS}</span>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}
