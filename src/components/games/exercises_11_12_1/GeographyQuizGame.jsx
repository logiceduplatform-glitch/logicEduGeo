import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

const COUNTRIES = {
  el: [
    { name: "Ελλάδα", capital: "Αθήνα", continent: "Ευρώπη", flag: "🇬🇷", fact: "Γενέτειρα της δημοκρατίας" },
    { name: "Γαλλία", capital: "Παρίσι", continent: "Ευρώπη", flag: "🇫🇷", fact: "Ο Πύργος του Άιφελ βρίσκεται εδώ" },
    { name: "Ιαπωνία", capital: "Τόκιο", continent: "Ασία", flag: "🇯🇵", fact: "Η χώρα του Ανατέλλοντος Ήλιου" },
    { name: "Βραζιλία", capital: "Μπραζίλια", continent: "Ν. Αμερική", flag: "🇧🇷", fact: "Ο Αμαζόνιος βρίσκεται εδώ" },
    { name: "Αίγυπτος", capital: "Κάιρο", continent: "Αφρική", flag: "🇪🇬", fact: "Οι Πυραμίδες της Γκίζας" },
    { name: "Αυστραλία", capital: "Καμπέρα", continent: "Ωκεανία", flag: "🇦🇺", fact: "Ήπειρος και χώρα μαζί" },
    { name: "Ιταλία", capital: "Ρώμη", continent: "Ευρώπη", flag: "🇮🇹", fact: "Το Κολοσσαίο βρίσκεται εδώ" },
    { name: "Κίνα", capital: "Πεκίνο", continent: "Ασία", flag: "🇨🇳", fact: "Το Σινικό Τείχος" },
    { name: "Μεξικό", capital: "Πόλη Μεξικό", continent: "Β. Αμερική", flag: "🇲🇽", fact: "Πολιτισμός Μάγια και Αζτέκων" },
    { name: "Γερμανία", capital: "Βερολίνο", continent: "Ευρώπη", flag: "🇩🇪", fact: "Η Πύλη Βρανδεμβούργου" },
    { name: "Ινδία", capital: "Νέο Δελχί", continent: "Ασία", flag: "🇮🇳", fact: "Το Ταζ Μαχάλ" },
    { name: "Καναδάς", capital: "Οτάβα", continent: "Β. Αμερική", flag: "🇨🇦", fact: "2η μεγαλύτερη χώρα σε έκταση" },
  ],
  en: [
    { name: "Greece", capital: "Athens", continent: "Europe", flag: "🇬🇷", fact: "Birthplace of democracy" },
    { name: "France", capital: "Paris", continent: "Europe", flag: "🇫🇷", fact: "Home of the Eiffel Tower" },
    { name: "Japan", capital: "Tokyo", continent: "Asia", flag: "🇯🇵", fact: "Land of the Rising Sun" },
    { name: "Brazil", capital: "Brasilia", continent: "S. America", flag: "🇧🇷", fact: "Amazon rainforest" },
    { name: "Egypt", capital: "Cairo", continent: "Africa", flag: "🇪🇬", fact: "Pyramids of Giza" },
    { name: "Australia", capital: "Canberra", continent: "Oceania", flag: "🇦🇺", fact: "A country and a continent" },
    { name: "Italy", capital: "Rome", continent: "Europe", flag: "🇮🇹", fact: "Home of the Colosseum" },
    { name: "China", capital: "Beijing", continent: "Asia", flag: "🇨🇳", fact: "The Great Wall" },
    { name: "Mexico", capital: "Mexico City", continent: "N. America", flag: "🇲🇽", fact: "Maya and Aztec civilizations" },
    { name: "Germany", capital: "Berlin", continent: "Europe", flag: "🇩🇪", fact: "Brandenburg Gate" },
    { name: "India", capital: "New Delhi", continent: "Asia", flag: "🇮🇳", fact: "The Taj Mahal" },
    { name: "Canada", capital: "Ottawa", continent: "N. America", flag: "🇨🇦", fact: "2nd largest country by area" },
  ],
};

function shuffled(arr) { const a = [...arr]; for (let i = a.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; }

function generateQuestion(country, allCountries) {
  const types = ["capital", "continent", "flag"];
  const type = types[Math.floor(Math.random() * types.length)];
  const others = allCountries.filter(c => c.name !== country.name);

  if (type === "capital") {
    const opts = shuffled([country.capital, ...shuffled(others).slice(0, 3).map(c => c.capital)]);
    return { type, question: country.name, answer: country.capital, options: opts, icon: "🏛️" };
  } else if (type === "continent") {
    const conts = [...new Set(allCountries.map(c => c.continent))];
    return { type, question: country.name, answer: country.continent, options: shuffled(conts).slice(0, 4), icon: "🌍" };
  } else {
    const opts = shuffled([country.flag, ...shuffled(others).slice(0, 3).map(c => c.flag)]);
    return { type, question: country.name, answer: country.flag, options: opts, icon: "🏳️" };
  }
}

export default function GeographyQuizGame({ lang = "el", onComplete, difficulty = 3 }) {
  const { safeTimeout } = useSafeTimeout();
  const isEl = lang === "el";
  const allCountries = COUNTRIES[isEl ? "el" : "en"];
  const [countries] = useState(() => shuffled(allCountries));

  const [round, setRound] = useState(0);
  const [question, setQuestion] = useState(() => generateQuestion(countries[0], allCountries));
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [streak, setStreak] = useState(0);
  const correctRef = useRef(null);
  const wrongRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 12;
  const country = countries[round % countries.length];

  useEffect(() => {
    correctRef.current = new Audio("/sounds/correct.mp3");
    wrongRef.current = new Audio("/sounds/wrong.mp3");
  }, []);

  const handleAnswer = (opt) => {
    if (showResult) return;
    setSelected(opt);
    setShowResult(true);
    const correct = opt === question.answer;

    if (correct) {
      correctRef.current?.play();
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      wrongRef.current?.play();
      setStreak(0);
    }

    updateProgress({ title: "geographyQuizGame", score: score + (correct ? 1 : 0), total: TARGET_ROUNDS, index: round + 1 });

    safeTimeout(() => {
      if (round + 1 >= TARGET_ROUNDS) {
        setShowCelebration(true);
        const final = score + (correct ? 1 : 0);
        completeQuiz({ title: "geographyQuizGame", score: final, total: TARGET_ROUNDS });
        safeTimeout(() => onComplete?.({ score: final, total: TARGET_ROUNDS }), 2500);
      } else {
        const next = round + 1;
        setRound(next);
        const nextCountry = countries[next % countries.length];
        setQuestion(generateQuestion(nextCountry, allCountries));
        setSelected(null);
        setShowResult(false);
      }
    }, 2000);
  };

  if (showCelebration) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 animate-[fadeIn_0.5s]">
        <span className="text-7xl">🌍</span>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{isEl ? "Εξαιρετικά!" : "Excellent!"}</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">{isEl ? `Σκόρ: ${score}/${TARGET_ROUNDS}` : `Score: ${score}/${TARGET_ROUNDS}`}</p>
      </div>
    );
  }

  const typeLabel = question.type === "capital" ? (isEl ? "Ποια είναι η πρωτεύουσα;" : "What is the capital?")
    : question.type === "continent" ? (isEl ? "Σε ποια ήπειρο;" : "Which continent?")
    : (isEl ? "Ποια είναι η σημαία;" : "Which is the flag?");

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{isEl ? "Γεωγραφικό Quiz" : "Geography Quiz"} 🌍</span>
          <span className="text-sm font-bold text-slate-500">{round + 1}/{TARGET_ROUNDS}</span>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 text-center mb-4">
          <span className="text-5xl mb-2 block">{country.flag}</span>
          <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{question.question}</h3>
          <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold mt-1">{question.icon} {typeLabel}</p>
          {showResult && <p className="text-xs text-slate-500 mt-2 italic">💡 {country.fact}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {question.options.map(opt => {
            const isCorrect = opt === question.answer;
            const isSel = selected === opt;
            return (
              <button key={opt} onClick={() => handleAnswer(opt)} disabled={showResult}
                className={[
                  "px-4 py-3 rounded-xl font-semibold transition-all border-2 text-center",
                  question.type === "flag" ? "text-3xl" : "text-sm",
                  showResult && isCorrect ? "bg-emerald-100 border-emerald-400 text-emerald-700 scale-105"
                    : showResult && isSel ? "bg-red-100 border-red-400 text-red-700"
                    : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-purple-400",
                ].join(" ")}>
                {opt}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center gap-3 text-sm font-semibold">
          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700">⭐ {score}</span>
          {streak >= 3 && <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-700">🔥 {streak}</span>}
        </div>
      </div>
      <style>{`@keyframes fadeIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}
