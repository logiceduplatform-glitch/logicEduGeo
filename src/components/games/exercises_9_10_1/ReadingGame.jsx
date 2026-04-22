import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function ReadingGame({ lang = "el", onComplete }) {
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

  const TARGET_ROUNDS = 8;

  const storiesData = {
    el: [
      {
        id: 1,
        text: "Η φωτοσύνθεση είναι η διαδικασία με την οποία τα φυτά μετατρέπουν το φως του ήλιου σε χημική ενέργεια και παράγουν οξυγόνο.",
        question: "Τι παράγουν κυρίως τα φυτά κατά τη φωτοσύνθεση;",
        options: ["Οξυγόνο", "Άνθρακα", "Άζωτο", "Υδρογόνο"],
        correctAnswer: "Οξυγόνο",
        image: "🌱☀️",
      },
      {
        id: 2,
        text: "Ο Ιούλιος Καίσαρας ήταν στρατηγός και πολιτικός της αρχαίας Ρώμης. Το μήνα Ιούλιο τον ονόμασαν προς τιμήν του.",
        question: "Ποιος μήνας συνδέεται με τον Ιούλιο Καίσαρα;",
        options: ["Ιούλιος", "Αύγουστος", "Ιανουάριος", "Μάρτιος"],
        correctAnswer: "Ιούλιος",
        image: "🏛️📜",
      },
      {
        id: 3,
        text: "Το νερό βράζει στους 100°C στην επιφάνεια της θάλασσας στο επίπεδο της θάλασσας, ενώ παγώνει στους 0°C.",
        question: "Σε ποια θερμοκρασία (°C) βράζει καθαρό νερό σε κανονική πίεση;",
        options: ["100", "0", "50", "37"],
        correctAnswer: "100",
        image: "🌡️💧",
      },
      {
        id: 4,
        text: "Η δημοκρατία είναι πολίτευμα όπου οι πολίτες συμμετέχουν στις αποφάσεις, συχνά μέσω εκλεγμένων αντιπροσώπων.",
        question: "Τι σημαίνει ότι ένα κράτος είναι «δημοκρατία»;",
        options: ["Συμμετοχή των πολιτών στις αποφάσεις", "Κυβέρνηση ενός βασιλιά", "Διακυβέρνηση από τον στρατό", "Κανένας νόμος"],
        correctAnswer: "Συμμετοχή των πολιτών στις αποφάσεις",
        image: "🗳️🏛️",
      },
      {
        id: 5,
        text: "Τα κλασικά έργα της αρχαίας ελληνικής τραγωδίας παίζονταν σε αμφιθέατρα και εξέταζαν ηθικά διλήμματα.",
        question: "Πού παρουσιάζονταν συχνά οι αρχαίες ελληνικές τραγωδίες;",
        options: ["Σε αμφιθέατρα", "Σε κλειστά γυμναστήρια", "Σε ναούς μόνο", "Σε αγορές τη νύχτα"],
        correctAnswer: "Σε αμφιθέατρα",
        image: "🎭🏺",
      },
      {
        id: 6,
        text: "Η ανακύκλωση μειώνει τα απορρίμματα και εξοικονομεί πρώτες ύλες, βοηθώντας το περιβάλλον.",
        question: "Ποιος είναι ένας βασικός στόχος της ανακύκλωσης;",
        options: ["Μείωση απορριμμάτων και εξοικονόμηση υλικών", "Αύξηση της κατανάλωσης", "Απόρριψη όλων των μετάλλων", "Κάψιμο πλαστικού χωρίς έλεγχο"],
        correctAnswer: "Μείωση απορριμμάτων και εξοικονόμηση υλικών",
        image: "♻️🌍",
      },
      {
        id: 7,
        text: "Η ταχύτητα περιγράφει πόσο γρήγορα αλλάζει η θέση ενός σώματος. Μονάδα στο SI είναι τα μέτρα ανά δευτερόλεπτο.",
        question: "Ποια μεγέθη συνδέονται άμεσα με την «ταχύτητα»;",
        options: ["Απόσταση και χρόνος", "Μόνο μάζα", "Μόνο θερμοκρασία", "Μόνο όγκος"],
        correctAnswer: "Απόσταση και χρόνος",
        image: "🏃📏",
      },
      {
        id: 8,
        text: "Ένα κείμενο πειθούς προσπαθεί να πείσει τον αναγνώστη με επιχειρήματα, παραδείγματα και λογική δομή.",
        question: "Ποιος είναι ο κύριος σκοπός ενός κειμένου πειθούς;",
        options: ["Να πείσει με επιχειρήματα", "Να περιγράψει μόνο χρώματα", "Να δώσει μόνο συνταγές", "Να λίσταρει τυχαία γεγονότα χωρίς σκοπό"],
        correctAnswer: "Να πείσει με επιχειρήματα",
        image: "✍️📣",
      },
    ],
    en: [
      {
        id: 1,
        text: "Photosynthesis is how plants turn sunlight into chemical energy and release oxygen as a by-product.",
        question: "What do plants mainly release during photosynthesis?",
        options: ["Oxygen", "Carbon", "Nitrogen", "Hydrogen"],
        correctAnswer: "Oxygen",
        image: "🌱☀️",
      },
      {
        id: 2,
        text: "Julius Caesar was a Roman general and statesman. The month July was named in his honor.",
        question: "Which month is linked to Julius Caesar?",
        options: ["July", "August", "January", "March"],
        correctAnswer: "July",
        image: "🏛️📜",
      },
      {
        id: 3,
        text: "Pure water boils at 100°C at sea level and freezes at 0°C under normal pressure.",
        question: "At what temperature (°C) does pure water boil at sea level?",
        options: ["100", "0", "50", "37"],
        correctAnswer: "100",
        image: "🌡️💧",
      },
      {
        id: 4,
        text: "In a democracy, citizens take part in decisions—often by electing representatives.",
        question: "What does it mean that a country is a «democracy»?",
        options: ["Citizens participate in decisions", "A single king rules forever", "The army decides all laws", "There are no laws"],
        correctAnswer: "Citizens participate in decisions",
        image: "🗳️🏛️",
      },
      {
        id: 5,
        text: "Ancient Greek tragedies were often performed in open-air theatres and explored moral dilemmas.",
        question: "Where were ancient Greek tragedies commonly performed?",
        options: ["In theatres", "In indoor gyms only", "Only inside temples", "In markets at night"],
        correctAnswer: "In theatres",
        image: "🎭🏺",
      },
      {
        id: 6,
        text: "Recycling reduces waste and saves raw materials, helping protect the environment.",
        question: "What is a main goal of recycling?",
        options: ["Reduce waste and save materials", "Increase waste on purpose", "Throw all metals away", "Burn plastic without controls"],
        correctAnswer: "Reduce waste and save materials",
        image: "♻️🌍",
      },
      {
        id: 7,
        text: "Speed describes how fast position changes. In SI units, it is measured in meters per second.",
        question: "Which quantities are most directly tied to «speed»?",
        options: ["Distance and time", "Mass only", "Temperature only", "Volume only"],
        correctAnswer: "Distance and time",
        image: "🏃📏",
      },
      {
        id: 8,
        text: "A persuasive text tries to convince the reader using reasons, evidence, and clear structure.",
        question: "What is the main purpose of persuasive writing?",
        options: ["To convince with arguments", "To list colors only", "To share recipes only", "To list random facts with no goal"],
        correctAnswer: "To convince with arguments",
        image: "✍️📣",
      },
    ],
  };

  const stories = storiesData[lang];
  const story = stories[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "📖", "🏆"][Math.floor(Math.random() * 7)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleAnswerSelect = (answer) => {
    if (showAnswer) return;

    setSelectedAnswer(answer);
    setShowAnswer(true);

    const isCorrect = answer === story.correctAnswer;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Reading Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Reading Game",
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
            if (onComplete) {
              onComplete();
            }
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
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-100 via-teal-100 to-blue-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Κατανόηση Ανάγνωσης" : "Reading Comprehension"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Κείμενο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Passage ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-teal-600">
            📖 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-teal-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-teal-400">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-3xl p-8 mb-8 border-4 border-green-300 shadow-lg">
            <div className="text-7xl text-center mb-6">{story.image}</div>
            <p className="text-xl sm:text-2xl leading-relaxed text-slate-800 text-center font-medium">
              {story.text}
            </p>
          </div>

          {!showAnswer && (
            <>
              <p className="text-2xl sm:text-3xl font-bold text-center text-teal-700 mb-6">
                {story.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {story.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(option)}
                    className="p-6 rounded-2xl bg-gradient-to-br from-teal-100 to-green-100 hover:from-teal-200 hover:to-green-200 border-4 border-teal-300 hover:border-teal-500 transition-all duration-200 transform hover:scale-105 shadow-lg text-lg sm:text-xl font-bold text-slate-800"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}

          {showAnswer && selectedAnswer === story.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="text-8xl mb-4">✅</div>
                <p className="text-3xl font-bold text-green-700">
                  {lang === "el"
                    ? `🎉 Σωστά! ${story.correctAnswer}`
                    : `🎉 Correct! ${story.correctAnswer}`}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== story.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Προσπάθησε ξανά! Διάβασε προσεκτικά το κείμενο.`
                    : `Try again! Read the passage carefully.`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-300/80 to-teal-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">📖🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Είσαι άσος στην κατανόηση κειμένου!" : "Perfect! You're a reading comprehension star!"}
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
