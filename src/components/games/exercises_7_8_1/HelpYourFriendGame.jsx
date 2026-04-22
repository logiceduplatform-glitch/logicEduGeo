// src/components/games/exercises_7_8_1/HelpYourFriendGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";

export default function HelpYourFriendGame({ lang = "el", difficulty = 3, onComplete }) {
  const { safeTimeout } = useSafeTimeout();
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
  const d = Math.max(1, Math.min(5, difficulty));
  const WRONG_DELAY = [2000, 1800, 1500, 1200, 1000][d - 1];
  const NEXT_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const TARGET_ROUNDS = 15;

  const roundsData = {
    el: [
      {
        id: 1,
        situation: {
          emoji: "😢📊",
          friend: "👧",
          description: "Η φίλη σου πήρε κακό βαθμό και είναι αναστατωμένη.",
          context: "Στην τάξη"
        },
        correctAnswer: "help1",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🤝", action: "Να την ενθαρρύνεις να μελετήσετε μαζί", isCorrect: true },
          { id: "help2", emoji: "😏", action: "Να της πεις ότι είναι εύκολο", isCorrect: false },
          { id: "help3", emoji: "📱", action: "Να της δώσεις τις απαντήσεις", isCorrect: false }
        ]
      },
      {
        id: 2,
        situation: {
          emoji: "😰🎤",
          friend: "👦",
          description: "Ο φίλος σου είναι αγχωμένος για μια παρουσίαση.",
          context: "Στην αίθουσα"
        },
        correctAnswer: "help2",
        question: "Πώς μπορείς να τον βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🙄", action: "Να του πεις να ηρεμήσει", isCorrect: false },
          { id: "help2", emoji: "📝", action: "Να κάνετε πρόβες μαζί", isCorrect: true },
          { id: "help3", emoji: "😐", action: "Να τον αγνοήσεις", isCorrect: false }
        ]
      },
      {
        id: 3,
        situation: {
          emoji: "🤕⚽",
          friend: "👧",
          description: "Η φίλη σου τραυματίστηκε κατά το ποδόσφαιρο.",
          context: "Στο γήπεδο"
        },
        correctAnswer: "help1",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🏥", action: "Να την πάς στη νοσοκόμα", isCorrect: true },
          { id: "help2", emoji: "😆", action: "Να γελάς μαζί της", isCorrect: false },
          { id: "help3", emoji: "🏃", action: "Να συνεχίσετε να παίζετε", isCorrect: false }
        ]
      },
      {
        id: 4,
        situation: {
          emoji: "😔👫",
          friend: "👦",
          description: "Ο φίλος σου αποκλείεται από τα άλλα παιδιά.",
          context: "Στην αυλή"
        },
        correctAnswer: "help2",
        question: "Πώς μπορείς να τον βοηθήσεις;",
        options: [
          { id: "help1", emoji: "😒", action: "Να του πεις να μην νοιάζεται", isCorrect: false },
          { id: "help2", emoji: "🤗", action: "Να τον συμπεριλάβεις στην ομάδα σου", isCorrect: true },
          { id: "help3", emoji: "😐", action: "Να μην κάνεις τίποτα", isCorrect: false }
        ]
      },
      {
        id: 5,
        situation: {
          emoji: "😢💻",
          friend: "👧",
          description: "Ο υπολογιστής της φίλης σου κατέρρευσε κατά τη διάρκεια του έργου της.",
          context: "Στο εργαστήριο"
        },
        correctAnswer: "help1",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🤝", action: "Να την βοηθήσεις να το ξανακάνει", isCorrect: true },
          { id: "help2", emoji: "😆", action: "Να γελάς", isCorrect: false },
          { id: "help3", emoji: "🏃", action: "Να φύγεις", isCorrect: false }
        ]
      },
      {
        id: 6,
        situation: {
          emoji: "😰📝",
          friend: "👦",
          description: "Ο φίλος σου ξέχασε να μελετήσει για το διαγώνισμα.",
          context: "Στην τάξη"
        },
        correctAnswer: "help2",
        question: "Πώς μπορείς να τον βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🙅", action: "Να του πεις ότι είναι δικό του πρόβλημα", isCorrect: false },
          { id: "help2", emoji: "📚", action: "Να τον βοηθήσεις να κάνει γρήγορη επανάληψη", isCorrect: true },
          { id: "help3", emoji: "😐", action: "Να τον αγνοήσεις", isCorrect: false }
        ]
      },
      {
        id: 7,
        situation: {
          emoji: "😭🐕",
          friend: "👧",
          description: "Το σκυλάκι της φίλης σου είναι άρρωστο.",
          context: "Στο σχολείο"
        },
        correctAnswer: "help1",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🤗", action: "Να την παρηγορήσεις και να είσαι υποστηρικτικός", isCorrect: true },
          { id: "help2", emoji: "😆", action: "Να γελάς", isCorrect: false },
          { id: "help3", emoji: "🙄", action: "Να της πεις ότι είναι απλώς ζώο", isCorrect: false }
        ]
      },
      {
        id: 8,
        situation: {
          emoji: "😔🏃",
          friend: "👦",
          description: "Ο φίλος σου ήρθε τελευταίος στον αγώνα.",
          context: "Στη γυμναστική"
        },
        correctAnswer: "help2",
        question: "Πώς μπορείς να τον βοηθήσεις;",
        options: [
          { id: "help1", emoji: "😒", action: "Να του πεις ότι είναι αδύναμος", isCorrect: false },
          { id: "help2", emoji: "💪", action: "Να του πεις ότι την επόμενη φορά θα τα πάει καλύτερα", isCorrect: true },
          { id: "help3", emoji: "😐", action: "Να τον αγνοήσεις", isCorrect: false }
        ]
      },
      {
        id: 9,
        situation: {
          emoji: "😢🎨",
          friend: "👧",
          description: "Η φίλη σου νομίζει ότι η τέχνη της δεν είναι καλή.",
          context: "Στα εικαστικά"
        },
        correctAnswer: "help1",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "✨", action: "Να της επισημάνεις τι είναι ωραίο σε αυτή", isCorrect: true },
          { id: "help2", emoji: "😐", action: "Να συμφωνήσεις ότι δεν είναι καλή", isCorrect: false },
          { id: "help3", emoji: "🙄", action: "Να της πεις να μην ανησυχεί", isCorrect: false }
        ]
      },
      {
        id: 10,
        situation: {
          emoji: "😰🏊",
          friend: "👦",
          description: "Ο φίλος σου φοβάται το βαθύ νερό.",
          context: "Στο κολυμβητήριο"
        },
        correctAnswer: "help2",
        question: "Πώς μπορείς να τον βοηθήσεις;",
        options: [
          { id: "help1", emoji: "😤", action: "Να τον πιέσεις να μπει", isCorrect: false },
          { id: "help2", emoji: "🤗", action: "Να τον ενθαρρύνεις απαλά", isCorrect: true },
          { id: "help3", emoji: "😆", action: "Να γελάς με το φόβο του", isCorrect: false }
        ]
      },
      {
        id: 11,
        situation: {
          emoji: "😔📚",
          friend: "👧",
          description: "Η φίλη σου δυσκολεύεται με το διάβασμα.",
          context: "Στη βιβλιοθήκη"
        },
        correctAnswer: "help1",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "📖", action: "Να διαβάζετε μαζί με υπομονή", isCorrect: true },
          { id: "help2", emoji: "😒", action: "Να της πεις να διαβάσει μόνη της", isCorrect: false },
          { id: "help3", emoji: "😐", action: "Να την αγνοήσεις", isCorrect: false }
        ]
      },
      {
        id: 12,
        situation: {
          emoji: "😢🎵",
          friend: "👦",
          description: "Ο φίλος σου έκανε λάθος κατά τη διάρκεια της συναυλίας.",
          context: "Στη γιορτή"
        },
        correctAnswer: "help2",
        question: "Πώς μπορείς να τον βοηθήσεις;",
        options: [
          { id: "help1", emoji: "😒", action: "Να του πεις ότι το πρόσεξαν όλοι", isCorrect: false },
          { id: "help2", emoji: "🤗", action: "Να του πεις ότι κανείς δεν το πρόσεξε", isCorrect: true },
          { id: "help3", emoji: "😆", action: "Να γελάς", isCorrect: false }
        ]
      },
      {
        id: 13,
        situation: {
          emoji: "😰🧪",
          friend: "👧",
          description: "Η φίλη σου φοβάται το επιστημονικό πείραμα.",
          context: "Στο εργαστήριο"
        },
        correctAnswer: "help1",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🔬", action: "Να το κάνετε μαζί βήμα βήμα", isCorrect: true },
          { id: "help2", emoji: "😤", action: "Να την πιέσεις να το κάνει", isCorrect: false },
          { id: "help3", emoji: "🙄", action: "Να της πεις ότι είναι παιδιάστικο", isCorrect: false }
        ]
      },
      {
        id: 14,
        situation: {
          emoji: "😔🎒",
          friend: "👦",
          description: "Ο φίλος σου δεν θέλει να πάει σε καμπ.",
          context: "Στο σπίτι"
        },
        correctAnswer: "help2",
        question: "Πώς μπορείς να τον βοηθήσεις;",
        options: [
          { id: "help1", emoji: "😒", action: "Να του πεις ότι είναι μαλακία", isCorrect: false },
          { id: "help2", emoji: "🌟", action: "Να μοιραστείς τη δική σου θετική εμπειρία", isCorrect: true },
          { id: "help3", emoji: "😐", action: "Να τον αγνοήσεις", isCorrect: false }
        ]
      },
      {
        id: 15,
        situation: {
          emoji: "😢👫",
          friend: "👧",
          description: "Η φίλη σου είχε τσακωμό με άλλο παιδί.",
          context: "Στην αυλή"
        },
        correctAnswer: "help1",
        question: "Πώς μπορείς να τη βοηθήσεις;",
        options: [
          { id: "help1", emoji: "🤝", action: "Να την βοηθήσεις να το συζητήσει", isCorrect: true },
          { id: "help2", emoji: "😤", action: "Να της πεις να τσακωθεί με εκείνον", isCorrect: false },
          { id: "help3", emoji: "😐", action: "Να μην ασχοληθείς", isCorrect: false }
        ]
      }
    ],
    en: [
      {
        id: 1,
        situation: {
          emoji: "😢📊",
          friend: "👧",
          description: "Friend got a bad grade and is upset.",
          context: "In the classroom"
        },
        correctAnswer: "help1",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "🤝", action: "Encourage them to study together", isCorrect: true },
          { id: "help2", emoji: "😏", action: "Tell them it's easy", isCorrect: false },
          { id: "help3", emoji: "📱", action: "Give them the answers", isCorrect: false }
        ]
      },
      {
        id: 2,
        situation: {
          emoji: "😰🎤",
          friend: "👦",
          description: "Friend is nervous about a presentation.",
          context: "In the hall"
        },
        correctAnswer: "help2",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "🙄", action: "Tell them to calm down", isCorrect: false },
          { id: "help2", emoji: "📝", action: "Practice with them", isCorrect: true },
          { id: "help3", emoji: "😐", action: "Ignore them", isCorrect: false }
        ]
      },
      {
        id: 3,
        situation: {
          emoji: "🤕⚽",
          friend: "👧",
          description: "Friend got hurt during football.",
          context: "On the field"
        },
        correctAnswer: "help1",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "🏥", action: "Take them to the nurse", isCorrect: true },
          { id: "help2", emoji: "😆", action: "Laugh with them", isCorrect: false },
          { id: "help3", emoji: "🏃", action: "Keep playing", isCorrect: false }
        ]
      },
      {
        id: 4,
        situation: {
          emoji: "😔👫",
          friend: "👦",
          description: "Friend is being left out by other kids.",
          context: "In the yard"
        },
        correctAnswer: "help2",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "😒", action: "Tell them not to care", isCorrect: false },
          { id: "help2", emoji: "🤗", action: "Include them in your group", isCorrect: true },
          { id: "help3", emoji: "😐", action: "Do nothing", isCorrect: false }
        ]
      },
      {
        id: 5,
        situation: {
          emoji: "😢💻",
          friend: "👧",
          description: "Friend's computer crashed during their project.",
          context: "In the lab"
        },
        correctAnswer: "help1",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "🤝", action: "Help them redo it", isCorrect: true },
          { id: "help2", emoji: "😆", action: "Laugh", isCorrect: false },
          { id: "help3", emoji: "🏃", action: "Leave", isCorrect: false }
        ]
      },
      {
        id: 6,
        situation: {
          emoji: "😰📝",
          friend: "👦",
          description: "Friend forgot to study for the test.",
          context: "In the classroom"
        },
        correctAnswer: "help2",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "🙅", action: "Tell them it's their problem", isCorrect: false },
          { id: "help2", emoji: "📚", action: "Help them review quickly", isCorrect: true },
          { id: "help3", emoji: "😐", action: "Ignore them", isCorrect: false }
        ]
      },
      {
        id: 7,
        situation: {
          emoji: "😭🐕",
          friend: "👧",
          description: "Friend's dog is sick.",
          context: "At school"
        },
        correctAnswer: "help1",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "🤗", action: "Comfort them and be supportive", isCorrect: true },
          { id: "help2", emoji: "😆", action: "Laugh", isCorrect: false },
          { id: "help3", emoji: "🙄", action: "Tell them it's just an animal", isCorrect: false }
        ]
      },
      {
        id: 8,
        situation: {
          emoji: "😔🏃",
          friend: "👦",
          description: "Friend came last in the race.",
          context: "In gym class"
        },
        correctAnswer: "help2",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "😒", action: "Tell them they're weak", isCorrect: false },
          { id: "help2", emoji: "💪", action: "Tell them they'll do better next time", isCorrect: true },
          { id: "help3", emoji: "😐", action: "Ignore them", isCorrect: false }
        ]
      },
      {
        id: 9,
        situation: {
          emoji: "😢🎨",
          friend: "👧",
          description: "Friend thinks their art isn't good.",
          context: "In art class"
        },
        correctAnswer: "help1",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "✨", action: "Point out what's great about it", isCorrect: true },
          { id: "help2", emoji: "😐", action: "Agree it's not good", isCorrect: false },
          { id: "help3", emoji: "🙄", action: "Tell them not to worry", isCorrect: false }
        ]
      },
      {
        id: 10,
        situation: {
          emoji: "😰🏊",
          friend: "👦",
          description: "Friend is scared of deep water.",
          context: "At the pool"
        },
        correctAnswer: "help2",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "😤", action: "Push them to get in", isCorrect: false },
          { id: "help2", emoji: "🤗", action: "Encourage them gently", isCorrect: true },
          { id: "help3", emoji: "😆", action: "Laugh at their fear", isCorrect: false }
        ]
      },
      {
        id: 11,
        situation: {
          emoji: "😔📚",
          friend: "👧",
          description: "Friend is struggling with reading.",
          context: "In the library"
        },
        correctAnswer: "help1",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "📖", action: "Read together patiently", isCorrect: true },
          { id: "help2", emoji: "😒", action: "Tell them to read by themselves", isCorrect: false },
          { id: "help3", emoji: "😐", action: "Ignore them", isCorrect: false }
        ]
      },
      {
        id: 12,
        situation: {
          emoji: "😢🎵",
          friend: "👦",
          description: "Friend made a mistake during the concert.",
          context: "At the celebration"
        },
        correctAnswer: "help2",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "😒", action: "Tell them everyone noticed", isCorrect: false },
          { id: "help2", emoji: "🤗", action: "Tell them nobody noticed", isCorrect: true },
          { id: "help3", emoji: "😆", action: "Laugh", isCorrect: false }
        ]
      },
      {
        id: 13,
        situation: {
          emoji: "😰🧪",
          friend: "👧",
          description: "Friend is afraid of the science experiment.",
          context: "In the lab"
        },
        correctAnswer: "help1",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "🔬", action: "Do it together step by step", isCorrect: true },
          { id: "help2", emoji: "😤", action: "Push them to do it", isCorrect: false },
          { id: "help3", emoji: "🙄", action: "Tell them it's childish", isCorrect: false }
        ]
      },
      {
        id: 14,
        situation: {
          emoji: "😔🎒",
          friend: "👦",
          description: "Friend doesn't want to go to camp.",
          context: "At home"
        },
        correctAnswer: "help2",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "😒", action: "Tell them that's silly", isCorrect: false },
          { id: "help2", emoji: "🌟", action: "Share your own positive experience", isCorrect: true },
          { id: "help3", emoji: "😐", action: "Ignore them", isCorrect: false }
        ]
      },
      {
        id: 15,
        situation: {
          emoji: "😢👫",
          friend: "👧",
          description: "Friend had a fight with another kid.",
          context: "In the yard"
        },
        correctAnswer: "help1",
        question: "How can you help them?",
        options: [
          { id: "help1", emoji: "🤝", action: "Help them talk it out", isCorrect: true },
          { id: "help2", emoji: "😤", action: "Tell them to fight them", isCorrect: false },
          { id: "help3", emoji: "😐", action: "Stay out of it", isCorrect: false }
        ]
      }
    ]
  };

  const rounds = roundsData[lang];
  const round = rounds[currentRound];

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
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "🤝"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    safeTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleAnswerSelect = (answerId) => {
    if (showAnswer) return;

    setSelectedAnswer(answerId);
    setShowAnswer(true);

    const isCorrect = answerId === round.correctAnswer;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      safeTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Help Your Friend Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Help Your Friend Game",
        score: 1,
        total: 1,
      });

      safeTimeout(() => {
        if (currentRound + 1 < TARGET_ROUNDS) {
          setCurrentRound(prev => prev + 1);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
          safeTimeout(() => {
            if (onComplete) {
              onComplete({ score: newScore, total: TARGET_ROUNDS });
            }
          }, NEXT_DELAY);
        }
      }, NEXT_DELAY);
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      safeTimeout(() => {
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, WRONG_DELAY);
    }
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);
  const correctOption = round.options.find(opt => opt.id === round.correctAnswer);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-100 via-cyan-100 to-teal-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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

      {/* Header */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              {lang === "el" ? "Βοήθησε τον Φίλο" : "Help Your Friend"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-cyan-600">
            🤝 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-teal-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-cyan-400">
          <div className="text-7xl mb-3">🤝</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.question}
          </h2>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-cyan-400">
          {/* Situation Display */}
          <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-3xl p-10 border-4 border-cyan-400 mb-8 shadow-lg">
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Context Badge */}
              <div className="bg-cyan-500 text-white px-6 py-2 rounded-full font-bold text-lg">
                {round.situation.context}
              </div>

              {/* Friend and Situation */}
              <div className="flex items-center gap-6">
                <div className="text-9xl">{round.situation.friend}</div>
                <div className="text-8xl">{round.situation.emoji}</div>
              </div>

              {/* Description */}
              <div className="bg-white/90 rounded-2xl p-6 border-4 border-cyan-300 max-w-2xl">
                <p className="text-2xl font-bold text-center text-slate-800">
                  {round.situation.description}
                </p>
              </div>
            </div>
          </div>

          {/* Help Options */}
          {!showAnswer && (
            <>
              <p className="text-2xl font-bold text-center text-slate-700 mb-6">
                {round.question}
              </p>

              <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
                {round.options.map((option) => {
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswerSelect(option.id)}
                      className="p-6 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 hover:from-cyan-200 hover:to-blue-200 border-4 border-cyan-300 hover:border-cyan-500 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-6 cursor-pointer text-left"
                    >
                      <div className="text-7xl flex-shrink-0">{option.emoji}</div>
                      <p className="text-xl font-bold text-slate-700 flex-1">{option.action}</p>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Show Answer */}
          {showAnswer && selectedAnswer === round.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="inline-block bg-green-100 rounded-3xl p-8 border-4 border-green-400">
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="text-8xl">{correctOption.emoji}</div>
                  <div className="text-8xl">{round.situation.friend}</div>
                  <div className="text-8xl">✅</div>
                </div>
                <p className="text-3xl font-bold text-green-700 mb-4">
                  {lang === "el"
                    ? `🎉 Μπράβο! Αυτή είναι η καλύτερη βοήθεια!`
                    : `🎉 Well done! This is the best help!`}
                </p>
                <p className="text-xl text-green-600">
                  {correctOption.action}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== round.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Σκέψου ξανά! Πώς θα ήθελες εσύ να σε βοηθήσουν;`
                    : `Think again! How would you want to be helped?`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/80 to-blue-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🤝🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Είσαι πολύ καλός φίλος!" : "Perfect! You're a great friend!"}
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
