// src/components/games/exercises_4_5/EmotionalStories.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";

export default function EmotionalStories({ lang = "el", onComplete }) {
  const [currentStory, setCurrentStory] = useState(0);
  const [selectedReaction, setSelectedReaction] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_STORIES = 8; // 8 ιστορίες

  const storiesData = {
    el: [
      {
        id: 1,
        title: "Το Σπασμένο Παιχνίδι",
        story: "Η Μαρία έπαιζε με το αγαπημένο της αυτοκινητάκι. Ο Νίκος την έσπρωξε κατά λάθος και το αυτοκινητάκι έσπασε.",
        emoji: "🚗💔",
        color: "#EC4899",
        correctReaction: "comfort",
        options: [
          { id: "comfort", emoji: "🤗", text: "Ο Νίκος λέει «Λυπάμαι πολύ» και τη βοηθάει να το φτιάξουν" },
          { id: "laugh", emoji: "😆", text: "Ο Νίκος γελάει και φεύγει τρέχοντας" },
          { id: "ignore", emoji: "🙄", text: "Ο Νίκος κάνει πως δεν έγινε τίποτα" },
        ]
      },
      {
        id: 2,
        title: "Το Νέο Παιδί",
        story: "Η Ελένη είναι νέα στο σχολείο και κάθεται μόνη της στο διάλειμμα. Φαίνεται λυπημένη.",
        emoji: "😢",
        color: "#3B82F6",
        correctReaction: "invite",
        options: [
          { id: "invite", emoji: "🤝", text: "Της λέω «Θες να παίξουμε μαζί;»" },
          { id: "stare", emoji: "👀", text: "Την κοιτάζω από μακριά" },
          { id: "leave", emoji: "🚶", text: "Παίζω με τους φίλους μου και την αγνοώ" },
        ]
      },
      {
        id: 3,
        title: "Η Επιτυχία του Φίλου",
        story: "Ο Γιώργος κέρδισε το πρώτο βραβείο στον διαγωνισμό ζωγραφικής. Είναι πολύ χαρούμενος!",
        emoji: "🏆🎨",
        color: "#F59E0B",
        correctReaction: "congratulate",
        options: [
          { id: "congratulate", emoji: "👏", text: "Τον συγχαίρω και χαίρομαι μαζί του" },
          { id: "jealous", emoji: "😒", text: "Ζηλεύω και είμαι στενοχωρημένος" },
          { id: "dismiss", emoji: "🤷", text: "Λέω «Δεν είναι και τίποτα το σπουδαίο»" },
        ]
      },
      {
        id: 4,
        title: "Ο Φοβισμένος Φίλος",
        story: "Ο Κώστας φοβάται τις μεγάλες τσουλήθρες. Τα άλλα παιδιά τον πιέζουν να πάει.",
        emoji: "😨🎢",
        color: "#EF4444",
        correctReaction: "respect",
        options: [
          { id: "respect", emoji: "🤝", text: "Λέω «Δεν πειράζει, ας παίξουμε κάτι άλλο»" },
          { id: "mock", emoji: "😏", text: "Τον κοροϊδεύω που φοβάται" },
          { id: "force", emoji: "😤", text: "Τον σπρώχνω να πάει γιατί δεν είναι τίποτα" },
        ]
      },
      {
        id: 5,
        title: "Το Μυστικό",
        story: "Η Σοφία σου είπε ένα μυστικό και σου ζήτησε να μην το πεις σε κανέναν.",
        emoji: "🤫",
        color: "#8B5CF6",
        correctReaction: "keep",
        options: [
          { id: "keep", emoji: "🔒", text: "Κρατάω το μυστικό γιατί της το υποσχέθηκα" },
          { id: "tell", emoji: "🗣️", text: "Το λέω σε όλους γιατί είναι ενδιαφέρον" },
          { id: "tease", emoji: "😜", text: "Την πειράζω ότι θα το πω" },
        ]
      },
      {
        id: 6,
        title: "Η Αδικία",
        story: "Ο δάσκαλος κατηγόρησε εσένα για κάτι που έκανε άλλος. Νιώθεις άδικα.",
        emoji: "😠",
        color: "#10B981",
        correctReaction: "explain",
        options: [
          { id: "explain", emoji: "🗨️", text: "Εξηγώ ήρεμα στον δάσκαλο τι πραγματικά έγινε" },
          { id: "yell", emoji: "😡", text: "Φωνάζω και θυμώνω πολύ" },
          { id: "cry", emoji: "😭", text: "Κλαίω και δεν μιλάω" },
        ]
      },
      {
        id: 7,
        title: "Το Μοιράζω;",
        story: "Έφερες στο σχολείο τα αγαπημένα σου μπισκότα. Ένας φίλος δεν έχει κολατσιό.",
        emoji: "🍪",
        color: "#06B6D4",
        correctReaction: "share",
        options: [
          { id: "share", emoji: "🤲", text: "Μοιράζομαι μαζί του τα μπισκότα μου" },
          { id: "hide", emoji: "🙈", text: "Κρύβω τα μπισκότα για να μην τα δει" },
          { id: "refuse", emoji: "🙅", text: "Λέω «Όχι, είναι δικά μου»" },
        ]
      },
      {
        id: 8,
        title: "Το Λάθος",
        story: "Έσπασες κατά λάθος το μολύβι του συμμαθητή σου. Τι κάνεις;",
        emoji: "✏️💔",
        color: "#F97316",
        correctReaction: "apologize",
        options: [
          { id: "apologize", emoji: "🙏", text: "Ζητάω συγγνώμη και προσφέρομαι να το αντικαταστήσω" },
          { id: "blame", emoji: "👉", text: "Λέω ότι φταίει αυτός που το άφησε εκεί" },
          { id: "runaway", emoji: "🏃", text: "Το κρύβω και φεύγω γρήγορα" },
        ]
      }
    ],
    en: [
      {
        id: 1,
        title: "The Broken Toy",
        story: "Maria was playing with her favorite toy car. Nick accidentally pushed her and the car broke.",
        emoji: "🚗💔",
        color: "#EC4899",
        correctReaction: "comfort",
        options: [
          { id: "comfort", emoji: "🤗", text: "Nick says 'I'm so sorry' and helps her fix it" },
          { id: "laugh", emoji: "😆", text: "Nick laughs and runs away" },
          { id: "ignore", emoji: "🙄", text: "Nick pretends nothing happened" },
        ]
      },
      {
        id: 2,
        title: "The New Kid",
        story: "Helen is new at school and sits alone during break. She looks sad.",
        emoji: "😢",
        color: "#3B82F6",
        correctReaction: "invite",
        options: [
          { id: "invite", emoji: "🤝", text: "I say 'Do you want to play with us?'" },
          { id: "stare", emoji: "👀", text: "I stare at her from far away" },
          { id: "leave", emoji: "🚶", text: "I play with my friends and ignore her" },
        ]
      },
      {
        id: 3,
        title: "Friend's Success",
        story: "George won first prize in the drawing contest. He is very happy!",
        emoji: "🏆🎨",
        color: "#F59E0B",
        correctReaction: "congratulate",
        options: [
          { id: "congratulate", emoji: "👏", text: "I congratulate him and feel happy for him" },
          { id: "jealous", emoji: "😒", text: "I feel jealous and upset" },
          { id: "dismiss", emoji: "🤷", text: "I say 'It's not a big deal'" },
        ]
      },
      {
        id: 4,
        title: "The Scared Friend",
        story: "Kostas is scared of big slides. The other kids pressure him to go.",
        emoji: "😨🎢",
        color: "#EF4444",
        correctReaction: "respect",
        options: [
          { id: "respect", emoji: "🤝", text: "I say 'That's okay, let's play something else'" },
          { id: "mock", emoji: "😏", text: "I make fun of him for being scared" },
          { id: "force", emoji: "😤", text: "I push him to go because it's nothing" },
        ]
      },
      {
        id: 5,
        title: "The Secret",
        story: "Sophia told you a secret and asked you not to tell anyone.",
        emoji: "🤫",
        color: "#8B5CF6",
        correctReaction: "keep",
        options: [
          { id: "keep", emoji: "🔒", text: "I keep the secret because I promised" },
          { id: "tell", emoji: "🗣️", text: "I tell everyone because it's interesting" },
          { id: "tease", emoji: "😜", text: "I tease her that I'll tell" },
        ]
      },
      {
        id: 6,
        title: "The Injustice",
        story: "The teacher blamed you for something someone else did. You feel it's unfair.",
        emoji: "😠",
        color: "#10B981",
        correctReaction: "explain",
        options: [
          { id: "explain", emoji: "🗨️", text: "I calmly explain to the teacher what really happened" },
          { id: "yell", emoji: "😡", text: "I yell and get very angry" },
          { id: "cry", emoji: "😭", text: "I cry and don't talk" },
        ]
      },
      {
        id: 7,
        title: "Should I Share?",
        story: "You brought your favorite cookies to school. A friend has no snack.",
        emoji: "🍪",
        color: "#06B6D4",
        correctReaction: "share",
        options: [
          { id: "share", emoji: "🤲", text: "I share my cookies with him" },
          { id: "hide", emoji: "🙈", text: "I hide the cookies so he won't see them" },
          { id: "refuse", emoji: "🙅", text: "I say 'No, they're mine'" },
        ]
      },
      {
        id: 8,
        title: "The Mistake",
        story: "You accidentally broke your classmate's pencil. What do you do?",
        emoji: "✏️💔",
        color: "#F97316",
        correctReaction: "apologize",
        options: [
          { id: "apologize", emoji: "🙏", text: "I apologize and offer to replace it" },
          { id: "blame", emoji: "👉", text: "I say it's their fault for leaving it there" },
          { id: "runaway", emoji: "🏃", text: "I hide it and leave quickly" },
        ]
      }
    ]
  };

  const stories = storiesData[lang];
  const story = stories[currentStory];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.mp3");
    correctSoundRef.current.preload = "auto";
    wrongSoundRef.current.preload = "auto";
  }, []);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "❤️", "😊"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const handleReactionSelect = (reaction) => {
    if (showAnswer) return;

    setSelectedReaction(reaction);
    setShowAnswer(true);

    const isCorrect = reaction.id === story.correctReaction;

    if (isCorrect) {
      correctSoundRef.current?.play().catch(() => {});

      const newScore = score + 1;
      setScore(newScore);

      setScorePopup({ id: Date.now(), x: 50 });
      setTimeout(() => setScorePopup(null), 1000);

      updateProgress({
        title: "Emotional Stories",
        score: newScore,
        total: TARGET_STORIES,
        index: currentStory + 1,
      });

      completeQuiz({
        title: "Emotional Stories",
        score: 1,
        total: 1,
      });

      setTimeout(() => {
        if (currentStory + 1 < TARGET_STORIES) {
          setCurrentStory(prev => prev + 1);
          setSelectedReaction(null);
          setShowAnswer(false);
        } else {
          createCelebrationEmojis();
          setShowCelebration(true);
          setTimeout(() => {
            if (onComplete) {
              onComplete();
            }
          }, 2500);
        }
      }, 2500);
    } else {
      wrongSoundRef.current?.play().catch(() => {});

      setTimeout(() => {
        setSelectedReaction(null);
        setShowAnswer(false);
      }, 1500);
    }
  };

  const progressPercent = Math.round(((currentStory + 1) / TARGET_STORIES) * 100);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Ιστορίες Συναισθημάτων" : "Emotional Stories"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Ιστορία ${currentStory + 1}/${TARGET_STORIES}`
                : `Story ${currentStory + 1}/${TARGET_STORIES}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-amber-600">
            ❤️ {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl border-4" style={{ borderColor: story.color }}>
          <div className="text-8xl mb-4 text-center">{story.emoji}</div>
          <h2 className="text-3xl font-bold mb-4 text-center" style={{ color: story.color }}>
            {story.title}
          </h2>
          <p className="text-xl text-slate-700 leading-relaxed mb-6 text-center">
            {story.story}
          </p>
          <p className="text-xl font-bold text-slate-800 text-center">
            {lang === "el" ? "Ποια είναι η σωστή αντίδραση;" : "What is the right reaction?"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-1 gap-4">
          {story.options.map((reaction) => {
            const isSelected = selectedReaction && selectedReaction.id === reaction.id;
            const isCorrect = showAnswer && reaction.id === story.correctReaction;
            const isWrong = showAnswer && isSelected && reaction.id !== story.correctReaction;

            return (
              <button
                key={reaction.id}
                onClick={() => handleReactionSelect(reaction)}
                disabled={showAnswer}
                className={`
                  relative p-6 rounded-2xl border-4 transition-all duration-300 transform
                  ${isCorrect ? "bg-green-100 border-green-500 scale-105" : ""}
                  ${isWrong ? "bg-red-100 border-red-500 animate-shake" : ""}
                  ${!showAnswer ? "bg-white border-slate-300 hover:border-amber-400 hover:scale-102 cursor-pointer" : "cursor-not-allowed"}
                  ${showAnswer && !isSelected && reaction.id !== story.correctReaction ? "opacity-50" : ""}
                `}
              >
                <div className="flex items-center gap-6">
                  <div className="text-7xl flex-shrink-0">{reaction.emoji}</div>
                  <p className="text-xl font-bold text-slate-800 text-left flex-1">{reaction.text}</p>

                  {isCorrect && (
                    <div className="text-6xl flex-shrink-0 animate-bounce">
                      ✅
                    </div>
                  )}
                  {isWrong && (
                    <div className="text-6xl flex-shrink-0">
                      ❌
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          {selectedReaction && selectedReaction.id === story.correctReaction ? (
            <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
              <p className="text-3xl font-bold text-green-700">
                {lang === "el" ? "🎉 Μπράβο! Αυτή είναι η σωστή αντίδραση!" : "🎉 Great! That's the right reaction!"}
              </p>
            </div>
          ) : (
            <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
              <p className="text-3xl font-bold text-red-700">
                {lang === "el" ? "Σκέψου πάλι! Τι θα ήταν καλύτερο;" : "Think again! What would be better?"}
              </p>
            </div>
          )}
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-300/80 to-orange-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">❤️🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Καταπληκτικά! Ξέρεις να αντιδράς σωστά!" : "Amazing! You know how to react properly!"}
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}

