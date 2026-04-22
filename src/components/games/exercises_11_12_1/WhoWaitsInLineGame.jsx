// src/components/games/exercises_11_12_1/WhoWaitsInLineGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import useSafeTimeout from "../../../hooks/useSafeTimeout";

export default function WhoWaitsInLineGame({ lang = "el", difficulty = 3, onComplete }) {
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

  const TARGET_ROUNDS = 12;

  const roundsData = {
    el: [
      {
        id: 1,
        scenario: {
          description: "Ομάδα κάνει ομαδική εργασία. Ποιος συνεργάζεται καλά;",
          context: "Στο σχολείο"
        },
        correctAnswer: "child2",
        question: "Ποιος δείχνει ωριμότητα σε συνεργασία;",
        children: [
          { id: "child1", emoji: "😤", behavior: "Επικρατεί σε όλα και δεν ακούει άλλους", isPatient: false },
          { id: "child2", emoji: "😊", behavior: "Ακούει τις ιδέες των άλλων", isPatient: true },
          { id: "child3", emoji: "😒", behavior: "Παραπονιέται συνεχώς", isPatient: false },
          { id: "child4", emoji: "😴", behavior: "Δεν συμμετέχει καθόλου", isPatient: false }
        ]
      },
      {
        id: 2,
        scenario: {
          description: "Τελειώνει αγώνας αθλήματος. Ποιος δείχνει αθλητικό πνεύμα;",
          context: "Στο γήπεδο"
        },
        correctAnswer: "child3",
        question: "Ποιος δείχνει ωριμότητα στον αγώνα;",
        children: [
          { id: "child1", emoji: "😤", behavior: "Τσακώνεται με τον αντίπαλο", isPatient: false },
          { id: "child2", emoji: "🙄", behavior: "Κατηγορεί τους συμπαίκτες", isPatient: false },
          { id: "child3", emoji: "🤝", behavior: "Συγχαίρει τον αντίπαλο", isPatient: true },
          { id: "child4", emoji: "😠", behavior: "Κάνει αντικαταβολή", isPatient: false }
        ]
      },
      {
        id: 3,
        scenario: {
          description: "Κάνουν online gaming και χάνουν. Ποιος διαχειρίζεται την ήττα καλά;",
          context: "Online"
        },
        correctAnswer: "child1",
        question: "Ποιος δείχνει ωριμότητα στο gaming;",
        children: [
          { id: "child1", emoji: "😊", behavior: "Λέει «καλό παιχνίδι» και συνεχίζει", isPatient: true },
          { id: "child2", emoji: "😤", behavior: "Βγάζει θυμό και φωνάζει", isPatient: false },
          { id: "child3", emoji: "👋", behavior: "Παρουσιάζει quit χωρίς αντίο", isPatient: false },
          { id: "child4", emoji: "😠", behavior: "Προσβάλλει τους άλλους παίκτες", isPatient: false }
        ]
      },
      {
        id: 4,
        scenario: {
          description: "Χρησιμοποιούν τα social media. Ποιος τα χρησιμοποιεί υπεύθυνα;",
          context: "Online"
        },
        correctAnswer: "child4",
        question: "Ποιος δείχνει ωριμότητα στα social media;",
        children: [
          { id: "child1", emoji: "😏", behavior: "Κυβερνοεκφοβίζει άλλους", isPatient: false },
          { id: "child2", emoji: "😈", behavior: "Διαδίδει φήμες", isPatient: false },
          { id: "child3", emoji: "🙄", behavior: "Κάνει trolling στα σχόλια", isPatient: false },
          { id: "child4", emoji: "😊", behavior: "Μοιράζεται θετικό περιεχόμενο", isPatient: true }
        ]
      },
      {
        id: 5,
        scenario: {
          description: "Υπάρχει διαμάχη μεταξύ δύο παιδιών. Ποιος μεσολαβεί ωριμά;",
          context: "Στην αυλή"
        },
        correctAnswer: "child2",
        question: "Ποιος δείχνει ωριμότητα στη λύση συγκρούσεων;",
        children: [
          { id: "child1", emoji: "😤", behavior: "Πιάνονται στα χέρια", isPatient: false },
          { id: "child2", emoji: "🤝", behavior: "Προτείνει συμβιβασμό", isPatient: true },
          { id: "child3", emoji: "😠", behavior: "Φωνάζει και βρίζει", isPatient: false },
          { id: "child4", emoji: "😶", behavior: "Δίνει σιωπηρή αγνόηση", isPatient: false }
        ]
      },
      {
        id: 6,
        scenario: {
          description: "Νέος μαθητής έρχεται στην τάξη. Ποιος τον καλωσορίζει;",
          context: "Στην τάξη"
        },
        correctAnswer: "child3",
        question: "Ποιος δείχνει ωριμότητα στη συμπερίληψη;",
        children: [
          { id: "child1", emoji: "😒", behavior: "Τον αγνοεί", isPatient: false },
          { id: "child2", emoji: "😏", behavior: "Τον κοροϊδεύει", isPatient: false },
          { id: "child3", emoji: "🤗", behavior: "Παρουσιάζεται και τον καλωσορίζει", isPatient: true },
          { id: "child4", emoji: "🤫", behavior: "Ψιθυρίζει για εκείνον", isPatient: false }
        ]
      },
      {
        id: 7,
        scenario: {
          description: "Ομάδα μελέτης στη βιβλιοθήκη. Ποιος βοηθάει όλους;",
          context: "Στη βιβλιοθήκη"
        },
        correctAnswer: "child1",
        question: "Ποιος δείχνει ωριμότητα στη μελέτη;",
        children: [
          { id: "child1", emoji: "📚", behavior: "Εξηγεί με υπομονή σε όλους", isPatient: true },
          { id: "child2", emoji: "⏰", behavior: "Βιάζεται και δεν εξηγεί καλά", isPatient: false },
          { id: "child3", emoji: "😒", behavior: "Παραπονιέται για το θέμα", isPatient: false },
          { id: "child4", emoji: "🚪", behavior: "Αποκλείει κάποιον από την ομάδα", isPatient: false }
        ]
      },
      {
        id: 8,
        scenario: {
          description: "Τρώνε δείπνο στην καντίνα. Ποιος δείχνει σεβασμό;",
          context: "Στην καντίνα"
        },
        correctAnswer: "child4",
        question: "Ποιος δείχνει ωριμότητα στο δείπνο;",
        children: [
          { id: "child1", emoji: "🗑️", behavior: "Αφήνει τα σκουπίδια παντού", isPatient: false },
          { id: "child2", emoji: "😤", behavior: "Περνάει μπροστά στη σειρά", isPatient: false },
          { id: "child3", emoji: "🍽️", behavior: "Πετάει φαγητό σαν παιχνίδι", isPatient: false },
          { id: "child4", emoji: "🧹", behavior: "Καθαρίζει μετά τον εαυτό του", isPatient: true }
        ]
      },
      {
        id: 9,
        scenario: {
          description: "Ο καθηγητής κάνει λάθος στον πίνακα. Ποιος το χειρίζεται καλά;",
          context: "Στην τάξη"
        },
        correctAnswer: "child2",
        question: "Ποιος δείχνει ωριμότητα απέναντι στο λάθος;",
        children: [
          { id: "child1", emoji: "😂", behavior: "Γελάει δυνατά", isPatient: false },
          { id: "child2", emoji: "🙋", behavior: "Το διορθώνει ευγενικά", isPatient: true },
          { id: "child3", emoji: "😏", behavior: "Κάνει πλάκα με το λάθος", isPatient: false },
          { id: "child4", emoji: "📢", behavior: "Την διακόπτει δυνατά", isPatient: false }
        ]
      },
      {
        id: 10,
        scenario: {
          description: "Φίλος μοιράστηκε μυστικό με εσένα. Ποιος το σεβάζεται;",
          context: "Στην παρέα"
        },
        correctAnswer: "child1",
        question: "Ποιος δείχνει ωριμότητα με τα μυστικά;",
        children: [
          { id: "child1", emoji: "🤐", behavior: "Το κρατά ιδιωτικό", isPatient: true },
          { id: "child2", emoji: "🗣️", behavior: "Κουτσομπολεύει με άλλους", isPatient: false },
          { id: "child3", emoji: "😏", behavior: "Κάνει αστεία για αυτό", isPatient: false },
          { id: "child4", emoji: "📱", behavior: "Το μοιράζεται online", isPatient: false }
        ]
      },
      {
        id: 11,
        scenario: {
          description: "Είναι στο λεωφορείο. Ποιος δείχνει προσοχή;",
          context: "Στο λεωφορείο"
        },
        correctAnswer: "child3",
        question: "Ποιος δείχνει ωριμότητα στο λεωφορείο;",
        children: [
          { id: "child1", emoji: "📢", behavior: "Φωνάζει και κάνει θόρυβο", isPatient: false },
          { id: "child2", emoji: "🚪", behavior: "Μπλοκάρει το διάδρομο", isPatient: false },
          { id: "child3", emoji: "💺", behavior: "Προσφέρει τη θέση σε ηλικιωμένο", isPatient: true },
          { id: "child4", emoji: "😴", behavior: "Αγνοεί τους γύρω του", isPatient: false }
        ]
      },
      {
        id: 12,
        scenario: {
          description: "Μετά το σχολείο σε δραστηριότητα. Ποιος ενθαρρύνει τους άλλους;",
          context: "Στη δραστηριότητα"
        },
        correctAnswer: "child2",
        question: "Ποιος δείχνει ωριμότητα και ενθαρρύνει;",
        children: [
          { id: "child1", emoji: "😩", behavior: "Λέει ότι θέλει να σταματήσει", isPatient: false },
          { id: "child2", emoji: "💪", behavior: "Μοτιβάρει τους άλλους", isPatient: true },
          { id: "child3", emoji: "😒", behavior: "Παραπονιέται συνεχώς", isPatient: false },
          { id: "child4", emoji: "😏", behavior: "Κοροϊδεύει τους αρχάριους", isPatient: false }
        ]
      }
    ],
    en: [
      {
        id: 1,
        scenario: {
          description: "A group is doing a group project. Who collaborates well?",
          context: "At school"
        },
        correctAnswer: "child2",
        question: "Who shows social maturity in collaboration?",
        children: [
          { id: "child1", emoji: "😤", behavior: "Dominates everything and doesn't listen to others", isPatient: false },
          { id: "child2", emoji: "😊", behavior: "Listens to others' ideas", isPatient: true },
          { id: "child3", emoji: "😒", behavior: "Constantly complains", isPatient: false },
          { id: "child4", emoji: "😴", behavior: "Doesn't participate at all", isPatient: false }
        ]
      },
      {
        id: 2,
        scenario: {
          description: "A sports game just ended. Who shows sportsmanship?",
          context: "On the field"
        },
        correctAnswer: "child3",
        question: "Who shows social maturity in the game?",
        children: [
          { id: "child1", emoji: "😤", behavior: "Argues with the opponent", isPatient: false },
          { id: "child2", emoji: "🙄", behavior: "Blames teammates", isPatient: false },
          { id: "child3", emoji: "🤝", behavior: "Congratulates opponents", isPatient: true },
          { id: "child4", emoji: "😠", behavior: "Cheats", isPatient: false }
        ]
      },
      {
        id: 3,
        scenario: {
          description: "They're playing online games and lose. Who handles losing well?",
          context: "Online"
        },
        correctAnswer: "child1",
        question: "Who shows social maturity in gaming?",
        children: [
          { id: "child1", emoji: "😊", behavior: "Says \"good game\" and continues", isPatient: true },
          { id: "child2", emoji: "😤", behavior: "Rages and yells", isPatient: false },
          { id: "child3", emoji: "👋", behavior: "Quits without saying goodbye", isPatient: false },
          { id: "child4", emoji: "😠", behavior: "Insults other players", isPatient: false }
        ]
      },
      {
        id: 4,
        scenario: {
          description: "They use social media. Who uses it responsibly?",
          context: "Online"
        },
        correctAnswer: "child4",
        question: "Who shows social maturity on social media?",
        children: [
          { id: "child1", emoji: "😏", behavior: "Cyberbullies others", isPatient: false },
          { id: "child2", emoji: "😈", behavior: "Spreads rumors", isPatient: false },
          { id: "child3", emoji: "🙄", behavior: "Trolls in comments", isPatient: false },
          { id: "child4", emoji: "😊", behavior: "Shares positive content", isPatient: true }
        ]
      },
      {
        id: 5,
        scenario: {
          description: "There's a conflict between two kids. Who mediates?",
          context: "In the yard"
        },
        correctAnswer: "child2",
        question: "Who shows social maturity in conflict resolution?",
        children: [
          { id: "child1", emoji: "😤", behavior: "Fights physically", isPatient: false },
          { id: "child2", emoji: "🤝", behavior: "Suggests compromise", isPatient: true },
          { id: "child3", emoji: "😠", behavior: "Yells and curses", isPatient: false },
          { id: "child4", emoji: "😶", behavior: "Gives silent treatment", isPatient: false }
        ]
      },
      {
        id: 6,
        scenario: {
          description: "A new student arrives in class. Who welcomes them?",
          context: "In the classroom"
        },
        correctAnswer: "child3",
        question: "Who shows social maturity in inclusion?",
        children: [
          { id: "child1", emoji: "😒", behavior: "Ignores them", isPatient: false },
          { id: "child2", emoji: "😏", behavior: "Mocks them", isPatient: false },
          { id: "child3", emoji: "🤗", behavior: "Introduces themselves and welcomes them", isPatient: true },
          { id: "child4", emoji: "🤫", behavior: "Whispers about them", isPatient: false }
        ]
      },
      {
        id: 7,
        scenario: {
          description: "Study group at the library. Who helps everyone?",
          context: "At the library"
        },
        correctAnswer: "child1",
        question: "Who shows social maturity in studying?",
        children: [
          { id: "child1", emoji: "📚", behavior: "Explains patiently to everyone", isPatient: true },
          { id: "child2", emoji: "⏰", behavior: "Rushes and doesn't explain well", isPatient: false },
          { id: "child3", emoji: "😒", behavior: "Complains about the topic", isPatient: false },
          { id: "child4", emoji: "🚪", behavior: "Excludes someone from the group", isPatient: false }
        ]
      },
      {
        id: 8,
        scenario: {
          description: "Having lunch in the cafeteria. Who shows respect?",
          context: "In the cafeteria"
        },
        correctAnswer: "child4",
        question: "Who shows social maturity at lunch?",
        children: [
          { id: "child1", emoji: "🗑️", behavior: "Leaves mess everywhere", isPatient: false },
          { id: "child2", emoji: "😤", behavior: "Cuts in line", isPatient: false },
          { id: "child3", emoji: "🍽️", behavior: "Wastes food as a game", isPatient: false },
          { id: "child4", emoji: "🧹", behavior: "Cleans up after themselves", isPatient: true }
        ]
      },
      {
        id: 9,
        scenario: {
          description: "The teacher makes a mistake on the board. Who handles it well?",
          context: "In the classroom"
        },
        correctAnswer: "child2",
        question: "Who shows social maturity with the mistake?",
        children: [
          { id: "child1", emoji: "😂", behavior: "Laughs loudly", isPatient: false },
          { id: "child2", emoji: "🙋", behavior: "Politely corrects it", isPatient: true },
          { id: "child3", emoji: "😏", behavior: "Makes fun of the mistake", isPatient: false },
          { id: "child4", emoji: "📢", behavior: "Interrupts loudly", isPatient: false }
        ]
      },
      {
        id: 10,
        scenario: {
          description: "A friend shared a secret with you. Who respects it?",
          context: "With friends"
        },
        correctAnswer: "child1",
        question: "Who shows social maturity with secrets?",
        children: [
          { id: "child1", emoji: "🤐", behavior: "Keeps it private", isPatient: true },
          { id: "child2", emoji: "🗣️", behavior: "Gossips to others", isPatient: false },
          { id: "child3", emoji: "😏", behavior: "Jokes about it", isPatient: false },
          { id: "child4", emoji: "📱", behavior: "Shares it online", isPatient: false }
        ]
      },
      {
        id: 11,
        scenario: {
          description: "On the bus. Who is considerate?",
          context: "On the bus"
        },
        correctAnswer: "child3",
        question: "Who shows social maturity on the bus?",
        children: [
          { id: "child1", emoji: "📢", behavior: "Is loud and makes noise", isPatient: false },
          { id: "child2", emoji: "🚪", behavior: "Blocks the aisle", isPatient: false },
          { id: "child3", emoji: "💺", behavior: "Offers seat to elderly", isPatient: true },
          { id: "child4", emoji: "😴", behavior: "Ignores people around", isPatient: false }
        ]
      },
      {
        id: 12,
        scenario: {
          description: "After-school activity. Who encourages others?",
          context: "At the activity"
        },
        correctAnswer: "child2",
        question: "Who shows social maturity and encourages?",
        children: [
          { id: "child1", emoji: "😩", behavior: "Says they want to quit", isPatient: false },
          { id: "child2", emoji: "💪", behavior: "Motivates others", isPatient: true },
          { id: "child3", emoji: "😒", behavior: "Constantly complains", isPatient: false },
          { id: "child4", emoji: "😏", behavior: "Mocks beginners", isPatient: false }
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
      emoji: ["🎉", "⭐", "✨", "🌟", "✅", "😊"][Math.floor(Math.random() * 6)],
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
        title: "Who Waits In Line Game",
        score: newScore,
        total: TARGET_ROUNDS,
        index: currentRound + 1,
      });

      completeQuiz({
        title: "Who Waits In Line Game",
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
  const correctChild = round.children.find(child => child.id === round.correctAnswer);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Ποιος Δείχνει Ωριμότητα;" : "Who Shows Social Maturity?"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            😊 {score}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-red-500 transition-all duration-500 ease-out"
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
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-orange-400">
          <div className="text-7xl mb-3">🙋</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.question}
          </h2>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border-4 border-orange-400">
          {/* Scenario Display */}
          <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl p-10 border-4 border-orange-400 mb-8 shadow-lg">
            <div className="flex flex-col items-center justify-center gap-6">
              {/* Context Badge */}
              <div className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold text-lg">
                {round.scenario.context}
              </div>

              {/* Description */}
              <div className="bg-white/90 rounded-2xl p-6 border-4 border-orange-300 max-w-2xl">
                <p className="text-2xl font-bold text-center text-slate-800">
                  {round.scenario.description}
                </p>
              </div>
            </div>
          </div>

          {/* Children Options */}
          {!showAnswer && (
            <>
              <p className="text-2xl font-bold text-center text-slate-700 mb-6">
                {round.question}
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
                {round.children.map((child, index) => {
                  return (
                    <button
                      key={child.id}
                      onClick={() => handleAnswerSelect(child.id)}
                      className="p-6 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 border-4 border-yellow-300 hover:border-yellow-500 transition-all duration-200 transform hover:scale-105 shadow-lg flex flex-col items-center cursor-pointer"
                    >
                      <div className="text-8xl mb-4">{child.emoji}</div>
                      <div className="bg-orange-500 text-white px-4 py-1 rounded-full font-bold text-sm mb-2">
                        {lang === "el" ? `Παιδί ${index + 1}` : `Child ${index + 1}`}
                      </div>
                      <p className="text-lg font-bold text-slate-700 text-center">
                        {child.behavior}
                      </p>
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
                  <div className="text-9xl">{correctChild.emoji}</div>
                  <div className="text-8xl">✅</div>
                </div>
                <p className="text-3xl font-bold text-green-700 mb-4">
                  {lang === "el"
                    ? `🎉 Μπράβο! Αυτό το παιδί δείχνει ωριμότητα!`
                    : `🎉 Well done! This child shows social maturity!`}
                </p>
                <p className="text-xl text-green-600">
                  {correctChild.behavior}
                </p>
              </div>
            </div>
          )}

          {showAnswer && selectedAnswer !== round.correctAnswer && (
            <div className="text-center animate-fadeIn">
              <div className="bg-red-100 rounded-2xl p-6 inline-block border-4 border-red-400">
                <p className="text-3xl font-bold text-red-700">
                  {lang === "el"
                    ? `Σκέψου ξανά! Ποιο παιδί δείχνει ωριμότητα;`
                    : `Think again! Which child shows maturity?`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300/80 to-orange-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">😊🏆</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Ξέρεις να αναγνωρίζεις την ωριμότητα!" : "Perfect! You know how to recognize maturity!"}
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
