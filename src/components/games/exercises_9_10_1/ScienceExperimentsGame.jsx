import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function ScienceExperimentsGame({ lang = "el", onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 10;

  const scienceData = {
    el: [
      { question: "Ποιο σωματίδιο έχει αρνητικό ηλεκτρικό φορτίο σε ένα άτομο;", correct: "Ηλεκτρόνιο", icon: "⚛️", options: ["Ηλεκτρόνιο", "Πρωτόνιο", "Νετρόνιο", "Ιόν"] },
      { question: "Πώς λέγεται η διαδικασία που τα φυτά μετατρέπουν το φως σε χημική ενέργεια;", correct: "Φωτοσύνθεση", icon: "🌿", options: ["Φωτοσύνθεση", "Αναπνοή", "Χώνεψη", "Εξάτμιση"] },
      { question: "Ποιο αέριο κάνει το νερό ελαφρώς όξινο όταν διαλύεται σε αυτό;", correct: "Διοξείδιο του άνθρακα", icon: "🫧", options: ["Διοξείδιο του άνθρακα", "Άζωτο", "Ήλιο", "Υδρογόνο"] },
      { question: "Τι μελετά η οικολογία κυρίως;", correct: "Τις σχέσεις ζωντανών οργανισμών και περιβάλλοντος", icon: "🌍", options: ["Τις σχέσεις ζωντανών οργανισμών και περιβάλλοντος", "Μόνο τα αστέρια", "Μόνο τα ορυκτά", "Μόνο τον καιρό χωρίς ζωή"] },
      { question: "Ποια κλίμακα μετρά συχνά την ένταση ενός σεισμού;", correct: "Ρίχτερ", icon: "🌋", options: ["Ρίχτερ", "Κέλβιν", "pH", "Μποφόρ"] },
      { question: "Τι είναι το DNA σε απλά λόγια;", correct: "Μόριο που κουβαλά γενετικές πληροφορίες", icon: "🧬", options: ["Μόριο που κουβαλά γενετικές πληροφορίες", "Ένας τύπος πρωτεΐνης μόνο", "Μόνο ζάχαρη", "Ένα μέταλλο"] },
      { question: "Γιατί τα αεροπλάνα πετούν σε μεγάλο υψόμετρο;", correct: "Για λιγότερη αντίσταση και καλύτερη οικονομία καυσίμου", icon: "✈️", options: ["Για λιγότερη αντίσταση και καλύτερη οικονομία καυσίμου", "Για να είναι πιο κοντά στον ήλιο πάντα", "Γιατί δεν υπάρχει βαρύτητα", "Για να αποφεύγουν τη βροχή πάντα"] },
      { question: "Ποιο σύστημα στο ανθρώπινο σώμα μεταφέρει οξυγόνο στο αίμα;", correct: "Αναπνευστικό", icon: "🫁", options: ["Αναπνευστικό", "Πεπτικό", "Νευρικό", "Μυοσκελετικό"] },
      { question: "Τι είναι ένα «οικοσύστημα»;", correct: "Κοινότητα ζωντανών οργανισμών και μη ζωντανού περιβάλλοντος", icon: "🦎", options: ["Κοινότητα ζωντανών οργανισμών και μη ζωντανού περιβάλλοντος", "Μόνο ένα δάσος χωρίς ζώα", "Μόνο ένα ποτάμι χωρίς φυτά", "Ένα κτίριο"] },
      { question: "Πώς λέγεται η ενέργεια που έχει ένα σώμα λόγω της κίνησής του;", correct: "Κινητική ενέργεια", icon: "⚡", options: ["Κινητική ενέργεια", "Δυναμική ενέργεια θέσης μόνο", "Θερμική ενέργεια μόνο", "Χημική ενέργεια μόνο"] },
    ],
    en: [
      { question: "Which particle has a negative electric charge in an atom?", correct: "Electron", icon: "⚛️", options: ["Electron", "Proton", "Neutron", "Ion"] },
      { question: "What is the process called when plants turn light into chemical energy?", correct: "Photosynthesis", icon: "🌿", options: ["Photosynthesis", "Respiration", "Digestion", "Evaporation"] },
      { question: "Which gas makes water slightly acidic when dissolved in it?", correct: "Carbon dioxide", icon: "🫧", options: ["Carbon dioxide", "Nitrogen", "Helium", "Hydrogen"] },
      { question: "What does ecology mainly study?", correct: "Relationships of living things and their environment", icon: "🌍", options: ["Relationships of living things and their environment", "Only stars", "Only minerals", "Only weather with no life"] },
      { question: "Which scale often measures earthquake strength?", correct: "Richter", icon: "🌋", options: ["Richter", "Kelvin", "pH", "Beaufort"] },
      { question: "What is DNA, in simple words?", correct: "A molecule that carries genetic information", icon: "🧬", options: ["A molecule that carries genetic information", "Only a kind of sugar", "A metal", "Only a protein"] },
      { question: "Why do airplanes fly at high altitude?", correct: "Less drag and better fuel efficiency", icon: "✈️", options: ["Less drag and better fuel efficiency", "To be closer to the Sun", "Because there is no gravity", "To always avoid rain"] },
      { question: "Which human body system carries oxygen in the blood?", correct: "Respiratory", icon: "🫁", options: ["Respiratory", "Digestive", "Nervous", "Muscular"] },
      { question: "What is an «ecosystem»?", correct: "A community of organisms and their non-living environment", icon: "🦎", options: ["A community of organisms and their non-living environment", "Only a forest without animals", "Only a river without plants", "A building"] },
      { question: "What is the energy an object has because of its motion?", correct: "Kinetic energy", icon: "⚡", options: ["Kinetic energy", "Only potential energy", "Only thermal energy", "Only chemical energy"] },
    ],
  };

  const questions = scienceData[lang];
  const currentQuestion = questions[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    setSelectedAnswer(null);
    setShowAnswer(false);
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🔬", "🧪", "🧬", "🏆"][Math.floor(Math.random() * 7)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);
    setTimeout(() => setCelebrationEmojis([]), 2000);
  };

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    const isCorrect = answer === currentQuestion.correct;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});
      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Science Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Science Game",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 2500);
        }
      }, 2000);
    } else {
      wrongSoundRef.current?.play().catch(() => {});
      setTimeout(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 p-4 sm:p-8 rounded-xl overflow-hidden">
      {celebrationEmojis.map((item) => (
        <div
          key={item.id}
          className="absolute text-4xl animate-float-up pointer-events-none z-20"
          style={{
            left: `${item.x}%`,
            top: "50%",
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.emoji}
        </div>
      ))}

      {scorePopup && (
        <div
          key={scorePopup.id}
          className="absolute text-4xl font-bold text-green-600 pointer-events-none z-50"
          style={{
            left: `${scorePopup.x}%`,
            top: "40%",
            animation: "float-up 1s ease-out forwards",
          }}
        >
          +1 ⭐⭐
        </div>
      )}

      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Επιστήμη" : "Science"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Ερώτηση ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Question ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            🔬 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-purple-400">
          <div className="text-center mb-8">
            <div className="text-9xl mb-6 animate-bounce">{currentQuestion.icon}</div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 px-2">
              {currentQuestion.question}
            </p>
          </div>

          {!showAnswer && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(option)}
                  className="p-5 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200 border-4 border-purple-300 hover:border-purple-500 transition-all duration-200 transform hover:scale-105 shadow-lg text-lg font-bold text-slate-800"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {showAnswer && selectedAnswer === currentQuestion.correct && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="text-8xl mb-4">✅</div>
                <p className="text-3xl font-bold text-green-700">
                  {lang === "el"
                    ? `🎉 Σωστά! ${currentQuestion.correct}`
                    : `🎉 Correct! ${currentQuestion.correct}`}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== currentQuestion.correct && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Προσπάθησε ξανά! Σκέψου επιστημονικά.`
                    : `Try again! Think scientifically.`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-300/80 to-indigo-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔬🏆</div>
            <h3 className="text-4xl font-bold text-white px-4">
              {lang === "el" ? "Τέλεια! Είσαι νέος επιστήμονας!" : "Perfect! You're a young scientist!"}
            </h3>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-200px) scale(1.5); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in;
        }
      `}</style>
    </div>
  );
}
