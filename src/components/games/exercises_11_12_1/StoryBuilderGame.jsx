import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

const STORIES = {
  el: [
    { sentence: "Η δημοκρατία γεννήθηκε στην αρχαία ___.", blank: "Αθήνα", options: ["Αθήνα", "Ρώμη", "Σπάρτη"] },
    { sentence: "Ο Ήλιος είναι ο πιο κοντινός ___ στη Γη.", blank: "αστέρας", options: ["αστέρας", "πλανήτης", "κομήτης"] },
    { sentence: "Η φωτοσύνθεση παράγει οξυγόνο και ___.", blank: "γλυκόζη", options: ["γλυκόζη", "άζωτο", "υδρογόνο"] },
    { sentence: "Ο Μέγας Αλέξανδρος ήταν μαθητής του ___.", blank: "Αριστοτέλη", options: ["Αριστοτέλη", "Σωκράτη", "Πλάτωνα"] },
    { sentence: "Η ___ είναι η μεγαλύτερη ήπειρος σε έκταση.", blank: "Ασία", options: ["Ασία", "Αφρική", "Ευρώπη"] },
    { sentence: "Το DNA βρίσκεται μέσα στον ___ του κυττάρου.", blank: "πυρήνα", options: ["πυρήνα", "τοίχωμα", "κυτταρόπλασμα"] },
    { sentence: "Ο Πυθαγόρας ανακάλυψε ένα σημαντικό ___ στα μαθηματικά.", blank: "θεώρημα", options: ["θεώρημα", "ποίημα", "φυτό"] },
    { sentence: "Η Σελήνη δεν έχει ___ ατμόσφαιρα.", blank: "δική της", options: ["δική της", "μπλε", "πυκνή"] },
    { sentence: "Ο Παρθενώνας χτίστηκε κατά τη διάρκεια του ___ αιώνα π.Χ.", blank: "5ου", options: ["5ου", "3ου", "1ου"] },
    { sentence: "Η ανακύκλωση βοηθάει στη μείωση της ___.", blank: "ρύπανσης", options: ["ρύπανσης", "βαρύτητας", "θερμοκρασίας"] },
    { sentence: "Ο Ουίλιαμ Σαίξπηρ ήταν σπουδαίος ___.", blank: "δραματουργός", options: ["δραματουργός", "ζωγράφος", "μουσικός"] },
    { sentence: "Η ___ μετρά τη δύναμη ενός σεισμού.", blank: "κλίμακα Ρίχτερ", options: ["κλίμακα Ρίχτερ", "πυξίδα", "θερμοκρασία"] },
    { sentence: "Το νερό αποτελείται από υδρογόνο και ___.", blank: "οξυγόνο", options: ["οξυγόνο", "άζωτο", "άνθρακα"] },
    { sentence: "Η Βιομηχανική Επανάσταση ξεκίνησε στην ___.", blank: "Αγγλία", options: ["Αγγλία", "Γαλλία", "Γερμανία"] },
    { sentence: "Ο ___ εφηύρε τον ηλεκτρικό λαμπτήρα.", blank: "Έντισον", options: ["Έντισον", "Νεύτωνας", "Αϊνστάιν"] },
  ],
  en: [
    { sentence: "Democracy was born in ancient ___.", blank: "Athens", options: ["Athens", "Rome", "Sparta"] },
    { sentence: "The Sun is the closest ___ to Earth.", blank: "star", options: ["star", "planet", "comet"] },
    { sentence: "Photosynthesis produces oxygen and ___.", blank: "glucose", options: ["glucose", "nitrogen", "hydrogen"] },
    { sentence: "Alexander the Great was a student of ___.", blank: "Aristotle", options: ["Aristotle", "Socrates", "Plato"] },
    { sentence: "___ is the largest continent by area.", blank: "Asia", options: ["Asia", "Africa", "Europe"] },
    { sentence: "DNA is found inside the cell's ___.", blank: "nucleus", options: ["nucleus", "wall", "cytoplasm"] },
    { sentence: "Pythagoras discovered an important mathematical ___.", blank: "theorem", options: ["theorem", "poem", "plant"] },
    { sentence: "The Moon has no ___ atmosphere.", blank: "own", options: ["own", "blue", "thick"] },
    { sentence: "The Parthenon was built during the ___ century BC.", blank: "5th", options: ["5th", "3rd", "1st"] },
    { sentence: "Recycling helps reduce ___.", blank: "pollution", options: ["pollution", "gravity", "temperature"] },
    { sentence: "William Shakespeare was a great ___.", blank: "playwright", options: ["playwright", "painter", "musician"] },
    { sentence: "The ___ measures earthquake strength.", blank: "Richter scale", options: ["Richter scale", "compass", "temperature"] },
    { sentence: "Water is made up of hydrogen and ___.", blank: "oxygen", options: ["oxygen", "nitrogen", "carbon"] },
    { sentence: "The Industrial Revolution began in ___.", blank: "England", options: ["England", "France", "Germany"] },
    { sentence: "___ invented the electric light bulb.", blank: "Edison", options: ["Edison", "Newton", "Einstein"] },
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
      setScore((prev) => prev + 1);
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
        setRound((prev) => prev + 1);
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
          {isEl ? "Τέλεια Γνώσεις!" : "Great Knowledge!"}
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
            {isEl ? "Συμπλήρωσε τη Φράση" : "Complete the Sentence"} 📖
          </span>
          <span className="text-sm font-bold text-slate-500">
            {round + 1}/{TARGET_ROUNDS}
          </span>
        </div>

        <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
            style={{ width: `${((round + 1) / TARGET_ROUNDS) * 100}%` }}
          />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 text-center mb-4">
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
            {parts[0]}
            <span
              className={`inline-block min-w-[80px] mx-1 px-3 py-1 rounded-lg border-2 border-dashed text-lg font-bold transition-all ${
                showResult
                  ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                  : "border-purple-400 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300"
              }`}
            >
              {showResult ? story.blank : selected || "___"}
            </span>
            {parts[1]}
          </p>
        </div>

        <div className="space-y-2 mb-4">
          {story.options.map((opt) => {
            const isCorrect = opt === story.blank;
            const isSel = selected === opt;
            return (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={showResult}
                className={[
                  "w-full px-4 py-3 rounded-xl text-base font-semibold transition-all border-2 text-center",
                  showResult && isCorrect
                    ? "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 text-emerald-700 dark:text-emerald-300 scale-[1.02]"
                    : showResult && isSel
                      ? "bg-red-100 dark:bg-red-900/40 border-red-400 text-red-700 dark:text-red-300"
                      : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-amber-400 hover:shadow-md",
                ].join(" ")}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center text-sm font-semibold">
          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700">
            ⭐ {score}/{TARGET_ROUNDS}
          </span>
        </div>
      </div>

      <style>{`@keyframes fadeIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}
