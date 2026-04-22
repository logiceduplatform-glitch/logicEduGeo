import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";
import { VoiceService } from "../../../services/VoiceService";

const EXPERIMENTS = {
  el: [
    {
      title: "Ηφαιστειακή Έκρηξη",
      description: "Θέλουμε να φτιάξουμε μια αντίδραση που μοιάζει με ηφαίστειο. Τι χρειαζόμαστε;",
      correct: "Μαγειρική σόδα + Ξύδι",
      options: ["Μαγειρική σόδα + Ξύδι", "Νερό + Αλάτι", "Ζάχαρη + Λεμόνι", "Αλεύρι + Γάλα"],
      explanation: "Η μαγειρική σόδα (NaHCO₃) αντιδρά με το ξύδι (CH₃COOH) και παράγει CO₂ — φούσκες!",
      icon: "🌋", subject: "Χημεία",
    },
    {
      title: "Αόρατο Μελάνι",
      description: "Πώς μπορούμε να γράψουμε ένα κρυφό μήνυμα;",
      correct: "Χυμός λεμονιού",
      options: ["Χυμός λεμονιού", "Νερό βρύσης", "Λάδι μαγειρικής", "Γάλα σοκολάτας"],
      explanation: "Ο χυμός λεμονιού οξειδώνεται με τη θερμότητα και εμφανίζει το μήνυμα!",
      icon: "🔍", subject: "Χημεία",
    },
    {
      title: "Ηλεκτροστατικό Πείραμα",
      description: "Πώς μπορούμε να μαγνητίσουμε μικρά χαρτάκια χωρίς μαγνήτη;",
      correct: "Τρίβοντας μπαλόνι σε μαλλί",
      options: ["Τρίβοντας μπαλόνι σε μαλλί", "Βρέχοντας τα χαρτάκια", "Φυσώντας δυνατά", "Ζεσταίνοντας τα χαρτάκια"],
      explanation: "Η τριβή δημιουργεί στατικό ηλεκτρισμό που έλκει ελαφριά αντικείμενα!",
      icon: "⚡", subject: "Φυσική",
    },
    {
      title: "Πυκνότητα Υγρών",
      description: "Βάζουμε μέλι, νερό και λάδι σε ποτήρι. Τι συμβαίνει;",
      correct: "Χωρίζονται σε στρώσεις",
      options: ["Χωρίζονται σε στρώσεις", "Αναμειγνύονται τέλεια", "Εξατμίζονται", "Παγώνουν"],
      explanation: "Κάθε υγρό έχει διαφορετική πυκνότητα: μέλι > νερό > λάδι!",
      icon: "🧪", subject: "Φυσική",
    },
    {
      title: "Φωτοσύνθεση",
      description: "Τι χρειάζεται ένα φυτό για να φτιάξει τροφή;",
      correct: "Ήλιο, νερό και CO₂",
      options: ["Ήλιο, νερό και CO₂", "Μόνο νερό", "Μόνο χώμα", "Αέρα και σκοτάδι"],
      explanation: "Φωτοσύνθεση: CO₂ + H₂O + φως → γλυκόζη + O₂",
      icon: "🌱", subject: "Βιολογία",
    },
    {
      title: "Δύναμη Βαρύτητας",
      description: "Αφήνουμε ένα φτερό και μια μπάλα ταυτόχρονα. Στο κενό, τι θα γίνει;",
      correct: "Πέφτουν ταυτόχρονα",
      options: ["Πέφτουν ταυτόχρονα", "Η μπάλα πέφτει πρώτη", "Το φτερό πέφτει πρώτο", "Κανένα δεν πέφτει"],
      explanation: "Στο κενό δεν υπάρχει αντίσταση αέρα — η βαρύτητα τα επιταχύνει ίδια (g ≈ 9,81 m/s²)!",
      icon: "🍎", subject: "Φυσική",
    },
    {
      title: "Ανακλαστήρα Φωτός",
      description: "Πώς μπορούμε να κατευθύνουμε μια ακτίνα φωτός;",
      correct: "Με καθρέφτη",
      options: ["Με καθρέφτη", "Με νερό", "Φυσώντας", "Με μαγνήτη"],
      explanation: "Ο νόμος της ανάκλασης: γωνία πρόσπτωσης = γωνία ανάκλασης!",
      icon: "🔦", subject: "Φυσική",
    },
    {
      title: "Χημική Αλλαγή",
      description: "Ποιο από τα παρακάτω είναι χημική αλλαγή;",
      correct: "Σκουριασμένο σίδερο",
      options: ["Σκουριασμένο σίδερο", "Λιωμένος πάγος", "Κομμένο χαρτί", "Τσαλακωμένο αλουμίνιο"],
      explanation: "Η σκουριά (οξείδωση) δημιουργεί νέα ουσία (Fe₂O₃) — αυτό είναι χημική αλλαγή!",
      icon: "🔬", subject: "Χημεία",
    },
  ],
  en: [
    {
      title: "Volcanic Eruption",
      description: "We want to create a reaction that looks like a volcano. What do we need?",
      correct: "Baking soda + Vinegar",
      options: ["Baking soda + Vinegar", "Water + Salt", "Sugar + Lemon", "Flour + Milk"],
      explanation: "Baking soda (NaHCO₃) reacts with vinegar (CH₃COOH) producing CO₂ — bubbles!",
      icon: "🌋", subject: "Chemistry",
    },
    {
      title: "Invisible Ink",
      description: "How can we write a secret message?",
      correct: "Lemon juice",
      options: ["Lemon juice", "Tap water", "Cooking oil", "Chocolate milk"],
      explanation: "Lemon juice oxidizes with heat and reveals the message!",
      icon: "🔍", subject: "Chemistry",
    },
    {
      title: "Static Electricity",
      description: "How can we attract small pieces of paper without a magnet?",
      correct: "Rubbing a balloon on wool",
      options: ["Rubbing a balloon on wool", "Wetting the papers", "Blowing hard", "Heating the papers"],
      explanation: "Friction creates static electricity that attracts light objects!",
      icon: "⚡", subject: "Physics",
    },
    {
      title: "Liquid Density",
      description: "We pour honey, water and oil in a glass. What happens?",
      correct: "They separate in layers",
      options: ["They separate in layers", "They mix perfectly", "They evaporate", "They freeze"],
      explanation: "Each liquid has different density: honey > water > oil!",
      icon: "🧪", subject: "Physics",
    },
    {
      title: "Photosynthesis",
      description: "What does a plant need to make food?",
      correct: "Sunlight, water and CO₂",
      options: ["Sunlight, water and CO₂", "Only water", "Only soil", "Air and darkness"],
      explanation: "Photosynthesis: CO₂ + H₂O + light → glucose + O₂",
      icon: "🌱", subject: "Biology",
    },
    {
      title: "Gravity",
      description: "We drop a feather and a ball simultaneously. In a vacuum, what happens?",
      correct: "They fall at the same time",
      options: ["They fall at the same time", "The ball falls first", "The feather falls first", "Neither falls"],
      explanation: "In a vacuum there's no air resistance — gravity accelerates them equally (g ≈ 9.81 m/s²)!",
      icon: "🍎", subject: "Physics",
    },
    {
      title: "Light Reflection",
      description: "How can we redirect a beam of light?",
      correct: "With a mirror",
      options: ["With a mirror", "With water", "By blowing", "With a magnet"],
      explanation: "Law of reflection: angle of incidence = angle of reflection!",
      icon: "🔦", subject: "Physics",
    },
    {
      title: "Chemical Change",
      description: "Which of the following is a chemical change?",
      correct: "Rusted iron",
      options: ["Rusted iron", "Melted ice", "Cut paper", "Crumpled foil"],
      explanation: "Rust (oxidation) creates a new substance (Fe₂O₃) — that's a chemical change!",
      icon: "🔬", subject: "Chemistry",
    },
  ],
};

export default function ScienceLabGame({ lang = "el", onComplete, difficulty = 3 }) {
  const { safeTimeout } = useSafeTimeout();
  const isEl = lang === "el";
  const experiments = EXPERIMENTS[isEl ? "el" : "en"];

  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const correctRef = useRef(null);
  const wrongRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const exp = experiments[round % experiments.length];
  const TARGET_ROUNDS = experiments.length;

  useEffect(() => {
    correctRef.current = new Audio("/sounds/correct.mp3");
    wrongRef.current = new Audio("/sounds/wrong.mp3");
  }, []);

  const handleAnswer = (opt) => {
    if (showResult) return;
    setSelected(opt);
    setShowResult(true);
    const correct = opt === exp.correct;

    if (correct) { correctRef.current?.play(); setScore(prev => prev + 1); }
    else { wrongRef.current?.play(); }

    updateProgress({ title: "scienceLabGame", score: score + (correct ? 1 : 0), total: TARGET_ROUNDS, index: round + 1 });

    safeTimeout(() => {
      if (round + 1 >= TARGET_ROUNDS) {
        setShowCelebration(true);
        const final = score + (correct ? 1 : 0);
        completeQuiz({ title: "scienceLabGame", score: final, total: TARGET_ROUNDS });
        safeTimeout(() => onComplete?.({ score: final, total: TARGET_ROUNDS }), 2500);
      } else {
        setRound(prev => prev + 1);
        setSelected(null);
        setShowResult(false);
      }
    }, 3000);
  };

  if (showCelebration) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 animate-[fadeIn_0.5s]">
        <span className="text-7xl">🔬</span>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{isEl ? "Εξαιρετικός Επιστήμονας!" : "Great Scientist!"}</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">{isEl ? `Σκόρ: ${score}/${TARGET_ROUNDS}` : `Score: ${score}/${TARGET_ROUNDS}`}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-2 sm:p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{isEl ? "Εργαστήριο Επιστήμης" : "Science Lab"} 🔬</span>
          <span className="text-sm font-bold text-slate-500">{round + 1}/{TARGET_ROUNDS}</span>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-700 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">{exp.icon}</span>
            <div>
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100">{exp.title}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold">{exp.subject}</span>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{exp.description}</p>
        </div>

        <div className="space-y-2 mb-4">
          {exp.options.map(opt => {
            const isCorrect = opt === exp.correct;
            const isSel = selected === opt;
            return (
              <button key={opt} onClick={() => handleAnswer(opt)} disabled={showResult}
                className={[
                  "w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all border-2 text-left",
                  showResult && isCorrect ? "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 text-emerald-700"
                    : showResult && isSel ? "bg-red-100 dark:bg-red-900/40 border-red-400 text-red-700"
                    : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-purple-400",
                ].join(" ")}>
                {opt}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mb-3 text-sm text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
            📘 {exp.explanation}
          </div>
        )}

        <div className="flex justify-center text-sm font-semibold">
          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700">⭐ {score}/{TARGET_ROUNDS}</span>
        </div>
      </div>
      <style>{`@keyframes fadeIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}
