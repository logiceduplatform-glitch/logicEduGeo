// src/components/games/FreezeMeltGame.jsx
import React, { useState, useRef, useEffect } from "react";
import { useQuizProgress } from "../../../hooks/useQuizProgress";
import { VoiceService } from "../../../services/VoiceService";

export default function FreezeMeltGame({ lang = "el", difficulty = 3, onComplete }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [meltedAnimals, setMeltedAnimals] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [firePosition, setFirePosition] = useState({ x: 50, y: 90 });
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationEmojis, setCelebrationEmojis] = useState([]);
  const [scorePopup, setScorePopup] = useState(null);
  const correctSoundRef = useRef(null);
  const completeSoundRef = useRef(null);
  const { updateProgress, completeQuiz } = useQuizProgress();

  const TARGET_ROUNDS = 10;

  const roundsData = {
    el: [
      {
        id: 1,
        sceneName: "Δάσος",
        background: "linear-gradient(to bottom, #87CEEB 0%, #E0F2FE 40%, #FFFFFF 100%)",
        description: "Λιώσε τα παγωμένα ζώα με τη φωτιά!",
        animals: [
          { id: "animal1", emoji: "🐻", name: "Αρκούδα", x: 20, y: 30, size: 80 },
          { id: "animal2", emoji: "🦊", name: "Αλεπού", x: 50, y: 25, size: 70 },
          { id: "animal3", emoji: "🐰", name: "Λαγός", x: 80, y: 35, size: 65 },
          { id: "animal4", emoji: "🦌", name: "Ελάφι", x: 35, y: 55, size: 75 },
          { id: "animal5", emoji: "🐿️", name: "Σκίουρος", x: 65, y: 60, size: 60 }
        ]
      },
      {
        id: 2,
        sceneName: "Ζούγκλα",
        background: "linear-gradient(to bottom, #BFDBFE 0%, #D1FAE5 50%, #A7F3D0 100%)",
        description: "Λιώσε τα παγωμένα ζώα με τη φωτιά!",
        animals: [
          { id: "animal1", emoji: "🐒", name: "Πίθηκος", x: 15, y: 25, size: 70 },
          { id: "animal2", emoji: "🦜", name: "Παπαγάλος", x: 40, y: 20, size: 65 },
          { id: "animal3", emoji: "🐆", name: "Λεοπάρδαλη", x: 70, y: 30, size: 75 },
          { id: "animal4", emoji: "🦍", name: "Γορίλας", x: 30, y: 55, size: 80 },
          { id: "animal5", emoji: "🐍", name: "Φίδι", x: 65, y: 60, size: 60 }
        ]
      },
      {
        id: 3,
        sceneName: "Φάρμα",
        background: "linear-gradient(to bottom, #DBEAFE 0%, #FEF3C7 40%, #D2691E 100%)",
        description: "Λιώσε τα παγωμένα ζώα με τη φωτιά!",
        animals: [
          { id: "animal1", emoji: "🐮", name: "Αγελάδα", x: 20, y: 35, size: 75 },
          { id: "animal2", emoji: "🐷", name: "Γουρούνι", x: 45, y: 30, size: 70 },
          { id: "animal3", emoji: "🐴", name: "Άλογο", x: 75, y: 35, size: 80 },
          { id: "animal4", emoji: "🐔", name: "Κότα", x: 30, y: 60, size: 60 },
          { id: "animal5", emoji: "🐑", name: "Πρόβατο", x: 60, y: 58, size: 65 }
        ]
      },
      {
        id: 4,
        sceneName: "Ωκεανός",
        background: "linear-gradient(to bottom, #BFDBFE 0%, #3B82F6 50%, #1E3A8A 100%)",
        description: "Λιώσε τα παγωμένα ζώα με τη φωτιά!",
        animals: [
          { id: "animal1", emoji: "🐋", name: "Φάλαινα", x: 25, y: 30, size: 85 },
          { id: "animal2", emoji: "🐬", name: "Δελφίνι", x: 55, y: 25, size: 75 },
          { id: "animal3", emoji: "🐙", name: "Χταπόδι", x: 80, y: 35, size: 70 },
          { id: "animal4", emoji: "🦈", name: "Καρχαρίας", x: 35, y: 58, size: 78 },
          { id: "animal5", emoji: "🐢", name: "Χελώνα", x: 65, y: 62, size: 65 }
        ]
      },
      {
        id: 5,
        sceneName: "Σαβάνα",
        background: "linear-gradient(to bottom, #FEF3C7 0%, #FDE68A 50%, #F59E0B 100%)",
        description: "Λιώσε τα παγωμένα ζώα με τη φωτιά!",
        animals: [
          { id: "animal1", emoji: "🦁", name: "Λιοντάρι", x: 20, y: 30, size: 80 },
          { id: "animal2", emoji: "🦒", name: "Καμηλοπάρδαλη", x: 50, y: 20, size: 90 },
          { id: "animal3", emoji: "🐘", name: "Ελέφαντας", x: 80, y: 35, size: 85 },
          { id: "animal4", emoji: "🦓", name: "Ζέβρα", x: 35, y: 60, size: 75 },
          { id: "animal5", emoji: "🦏", name: "Ρινόκερος", x: 65, y: 58, size: 78 }
        ]
      },
      {
        id: 6,
        sceneName: "Πουλιά",
        background: "linear-gradient(to bottom, #DBEAFE 0%, #BFDBFE 50%, #93C5FD 100%)",
        description: "Λιώσε τα παγωμένα πουλιά με τη φωτιά!",
        animals: [
          { id: "animal1", emoji: "🦅", name: "Αετός", x: 15, y: 25, size: 75 },
          { id: "animal2", emoji: "🦉", name: "Κουκουβάγια", x: 40, y: 30, size: 70 },
          { id: "animal3", emoji: "🦆", name: "Πάπια", x: 65, y: 28, size: 68 },
          { id: "animal4", emoji: "🦚", name: "Παγόνι", x: 28, y: 58, size: 80 },
          { id: "animal5", emoji: "🦩", name: "Φλαμίνγκο", x: 70, y: 60, size: 75 }
        ]
      },
      {
        id: 7,
        sceneName: "Πόλος",
        background: "linear-gradient(to bottom, #E0F2FE 0%, #F0F9FF 50%, #FFFFFF 100%)",
        description: "Λιώσε τα παγωμένα ζώα με τη φωτιά!",
        animals: [
          { id: "animal1", emoji: "🐧", name: "Πιγκουίνος", x: 20, y: 35, size: 70 },
          { id: "animal2", emoji: "🐻‍❄️", name: "Πολική Αρκούδα", x: 50, y: 30, size: 85 },
          { id: "animal3", emoji: "🦭", name: "Φώκια", x: 78, y: 38, size: 75 },
          { id: "animal4", emoji: "🐺", name: "Λύκος", x: 32, y: 62, size: 72 },
          { id: "animal5", emoji: "🦌", name: "Τάρανδος", x: 65, y: 60, size: 78 }
        ]
      },
      {
        id: 8,
        sceneName: "Έρημος",
        background: "linear-gradient(to bottom, #FEF3C7 0%, #FDE68A 60%, #D97706 100%)",
        description: "Λιώσε τα παγωμένα ζώα με τη φωτιά!",
        animals: [
          { id: "animal1", emoji: "🐪", name: "Καμήλα", x: 22, y: 32, size: 80 },
          { id: "animal2", emoji: "🦎", name: "Σαύρα", x: 48, y: 35, size: 65 },
          { id: "animal3", emoji: "🦂", name: "Σκορπιός", x: 72, y: 40, size: 60 },
          { id: "animal4", emoji: "🐍", name: "Φίδι", x: 30, y: 62, size: 68 },
          { id: "animal5", emoji: "🦅", name: "Γεράκι", x: 60, y: 25, size: 70 }
        ]
      },
      {
        id: 9,
        sceneName: "Κήπος",
        background: "linear-gradient(to bottom, #BFDBFE 0%, #D1FAE5 50%, #86EFAC 100%)",
        description: "Λιώσε τα παγωμένα ζώα με τη φωτιά!",
        animals: [
          { id: "animal1", emoji: "🦋", name: "Πεταλούδα", x: 18, y: 28, size: 65 },
          { id: "animal2", emoji: "🐝", name: "Μέλισσα", x: 42, y: 32, size: 60 },
          { id: "animal3", emoji: "🐞", name: "Πασχαλίτσα", x: 68, y: 30, size: 58 },
          { id: "animal4", emoji: "🐛", name: "Κάμπια", x: 28, y: 60, size: 62 },
          { id: "animal5", emoji: "🦗", name: "Γρύλος", x: 62, y: 62, size: 60 }
        ]
      },
      {
        id: 10,
        sceneName: "Νύχτα",
        background: "linear-gradient(to bottom, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)",
        description: "Λιώσε τα παγωμένα ζώα με τη φωτιά!",
        animals: [
          { id: "animal1", emoji: "🦇", name: "Νυχτερίδα", x: 20, y: 25, size: 68 },
          { id: "animal2", emoji: "🦉", name: "Κουκουβάγια", x: 48, y: 28, size: 72 },
          { id: "animal3", emoji: "🦝", name: "Ρακούν", x: 75, y: 32, size: 70 },
          { id: "animal4", emoji: "🦊", name: "Αλεπού", x: 32, y: 58, size: 68 },
          { id: "animal5", emoji: "🦔", name: "Σκαντζόχοιρος", x: 65, y: 60, size: 65 }
        ]
      }
    ],
    en: [
      {
        id: 1,
        sceneName: "Forest",
        background: "linear-gradient(to bottom, #87CEEB 0%, #E0F2FE 40%, #FFFFFF 100%)",
        description: "Melt the frozen animals with fire!",
        animals: [
          { id: "animal1", emoji: "🐻", name: "Bear", x: 20, y: 30, size: 80 },
          { id: "animal2", emoji: "🦊", name: "Fox", x: 50, y: 25, size: 70 },
          { id: "animal3", emoji: "🐰", name: "Rabbit", x: 80, y: 35, size: 65 },
          { id: "animal4", emoji: "🦌", name: "Deer", x: 35, y: 55, size: 75 },
          { id: "animal5", emoji: "🐿️", name: "Squirrel", x: 65, y: 60, size: 60 }
        ]
      },
      {
        id: 2,
        sceneName: "Jungle",
        background: "linear-gradient(to bottom, #BFDBFE 0%, #D1FAE5 50%, #A7F3D0 100%)",
        description: "Melt the frozen animals with fire!",
        animals: [
          { id: "animal1", emoji: "🐒", name: "Monkey", x: 15, y: 25, size: 70 },
          { id: "animal2", emoji: "🦜", name: "Parrot", x: 40, y: 20, size: 65 },
          { id: "animal3", emoji: "🐆", name: "Leopard", x: 70, y: 30, size: 75 },
          { id: "animal4", emoji: "🦍", name: "Gorilla", x: 30, y: 55, size: 80 },
          { id: "animal5", emoji: "🐍", name: "Snake", x: 65, y: 60, size: 60 }
        ]
      },
      {
        id: 3,
        sceneName: "Farm",
        background: "linear-gradient(to bottom, #DBEAFE 0%, #FEF3C7 40%, #D2691E 100%)",
        description: "Melt the frozen animals with fire!",
        animals: [
          { id: "animal1", emoji: "🐮", name: "Cow", x: 20, y: 35, size: 75 },
          { id: "animal2", emoji: "🐷", name: "Pig", x: 45, y: 30, size: 70 },
          { id: "animal3", emoji: "🐴", name: "Horse", x: 75, y: 35, size: 80 },
          { id: "animal4", emoji: "🐔", name: "Chicken", x: 30, y: 60, size: 60 },
          { id: "animal5", emoji: "🐑", name: "Sheep", x: 60, y: 58, size: 65 }
        ]
      },
      {
        id: 4,
        sceneName: "Ocean",
        background: "linear-gradient(to bottom, #BFDBFE 0%, #3B82F6 50%, #1E3A8A 100%)",
        description: "Melt the frozen animals with fire!",
        animals: [
          { id: "animal1", emoji: "🐋", name: "Whale", x: 25, y: 30, size: 85 },
          { id: "animal2", emoji: "🐬", name: "Dolphin", x: 55, y: 25, size: 75 },
          { id: "animal3", emoji: "🐙", name: "Octopus", x: 80, y: 35, size: 70 },
          { id: "animal4", emoji: "🦈", name: "Shark", x: 35, y: 58, size: 78 },
          { id: "animal5", emoji: "🐢", name: "Turtle", x: 65, y: 62, size: 65 }
        ]
      },
      {
        id: 5,
        sceneName: "Savanna",
        background: "linear-gradient(to bottom, #FEF3C7 0%, #FDE68A 50%, #F59E0B 100%)",
        description: "Melt the frozen animals with fire!",
        animals: [
          { id: "animal1", emoji: "🦁", name: "Lion", x: 20, y: 30, size: 80 },
          { id: "animal2", emoji: "🦒", name: "Giraffe", x: 50, y: 20, size: 90 },
          { id: "animal3", emoji: "🐘", name: "Elephant", x: 80, y: 35, size: 85 },
          { id: "animal4", emoji: "🦓", name: "Zebra", x: 35, y: 60, size: 75 },
          { id: "animal5", emoji: "🦏", name: "Rhino", x: 65, y: 58, size: 78 }
        ]
      },
      {
        id: 6,
        sceneName: "Birds",
        background: "linear-gradient(to bottom, #DBEAFE 0%, #BFDBFE 50%, #93C5FD 100%)",
        description: "Melt the frozen birds with fire!",
        animals: [
          { id: "animal1", emoji: "🦅", name: "Eagle", x: 15, y: 25, size: 75 },
          { id: "animal2", emoji: "🦉", name: "Owl", x: 40, y: 30, size: 70 },
          { id: "animal3", emoji: "🦆", name: "Duck", x: 65, y: 28, size: 68 },
          { id: "animal4", emoji: "🦚", name: "Peacock", x: 28, y: 58, size: 80 },
          { id: "animal5", emoji: "🦩", name: "Flamingo", x: 70, y: 60, size: 75 }
        ]
      },
      {
        id: 7,
        sceneName: "Pole",
        background: "linear-gradient(to bottom, #E0F2FE 0%, #F0F9FF 50%, #FFFFFF 100%)",
        description: "Melt the frozen animals with fire!",
        animals: [
          { id: "animal1", emoji: "🐧", name: "Penguin", x: 20, y: 35, size: 70 },
          { id: "animal2", emoji: "🐻‍❄️", name: "Polar Bear", x: 50, y: 30, size: 85 },
          { id: "animal3", emoji: "🦭", name: "Seal", x: 78, y: 38, size: 75 },
          { id: "animal4", emoji: "🐺", name: "Wolf", x: 32, y: 62, size: 72 },
          { id: "animal5", emoji: "🦌", name: "Reindeer", x: 65, y: 60, size: 78 }
        ]
      },
      {
        id: 8,
        sceneName: "Desert",
        background: "linear-gradient(to bottom, #FEF3C7 0%, #FDE68A 60%, #D97706 100%)",
        description: "Melt the frozen animals with fire!",
        animals: [
          { id: "animal1", emoji: "🐪", name: "Camel", x: 22, y: 32, size: 80 },
          { id: "animal2", emoji: "🦎", name: "Lizard", x: 48, y: 35, size: 65 },
          { id: "animal3", emoji: "🦂", name: "Scorpion", x: 72, y: 40, size: 60 },
          { id: "animal4", emoji: "🐍", name: "Snake", x: 30, y: 62, size: 68 },
          { id: "animal5", emoji: "🦅", name: "Hawk", x: 60, y: 25, size: 70 }
        ]
      },
      {
        id: 9,
        sceneName: "Garden",
        background: "linear-gradient(to bottom, #BFDBFE 0%, #D1FAE5 50%, #86EFAC 100%)",
        description: "Melt the frozen animals with fire!",
        animals: [
          { id: "animal1", emoji: "🦋", name: "Butterfly", x: 18, y: 28, size: 65 },
          { id: "animal2", emoji: "🐝", name: "Bee", x: 42, y: 32, size: 60 },
          { id: "animal3", emoji: "🐞", name: "Ladybug", x: 68, y: 30, size: 58 },
          { id: "animal4", emoji: "🐛", name: "Caterpillar", x: 28, y: 60, size: 62 },
          { id: "animal5", emoji: "🦗", name: "Cricket", x: 62, y: 62, size: 60 }
        ]
      },
      {
        id: 10,
        sceneName: "Night",
        background: "linear-gradient(to bottom, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)",
        description: "Melt the frozen animals with fire!",
        animals: [
          { id: "animal1", emoji: "🦇", name: "Bat", x: 20, y: 25, size: 68 },
          { id: "animal2", emoji: "🦉", name: "Owl", x: 48, y: 28, size: 72 },
          { id: "animal3", emoji: "🦝", name: "Raccoon", x: 75, y: 32, size: 70 },
          { id: "animal4", emoji: "🦊", name: "Fox", x: 32, y: 58, size: 68 },
          { id: "animal5", emoji: "🦔", name: "Hedgehog", x: 65, y: 60, size: 65 }
        ]
      }
    ]
  };

  const rounds = roundsData[lang];
  const round = rounds[currentRound];

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    completeSoundRef.current = new Audio("/sounds/complete.mp3");
    correctSoundRef.current.preload = "auto";
    completeSoundRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    setMeltedAnimals([]);
    setShowAnswer(false);
    setFirePosition({ x: 50, y: 90 });
  }, [currentRound]);

  const createCelebrationEmojis = () => {
    const newEmojis = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      emoji: ["🎉", "⭐", "✨", "🌟", "🔥", "❤️"][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.3,
    }));
    setCelebrationEmojis(newEmojis);

    setTimeout(() => {
      setCelebrationEmojis([]);
    }, 2000);
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const text = `${round.description}`;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'el' ? 'el-GR' : 'en-US';
      utterance.rate = 0.75;
      utterance.pitch = 1.1;
      const voice = VoiceService.getVoice(lang);
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      speakQuestion();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRound, lang]);

  const d = Math.max(1, Math.min(5, difficulty));
  const FIRE_RADIUS = [8, 7, 5, 4, 3][d - 1];
  const NEXT_ROUND_DELAY = [3000, 2800, 2500, 2200, 2000][d - 1];

  const checkCollision = (fireX, fireY, animal) => {
    const fireRadius = FIRE_RADIUS;
    const animalRadius = animal.size / 200 * 10;

    const distance = Math.sqrt(
      Math.pow(fireX - animal.x, 2) + Math.pow(fireY - animal.y, 2)
    );

    return distance < (fireRadius + animalRadius);
  };

  const handleFireMove = (e) => {
    if (!isDragging || showAnswer) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();

    let clientX, clientY;
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    setFirePosition({ x, y });

    // Check collisions with frozen animals
    round.animals.forEach((animal) => {
      if (!meltedAnimals.includes(animal.id) && checkCollision(x, y, animal)) {
        handleMeltAnimal(animal.id);
      }
    });
  };

  const handleMeltAnimal = (animalId) => {
    correctSoundRef.current?.play().catch(() => {});

    const newMelted = [...meltedAnimals, animalId];
    setMeltedAnimals(newMelted);

    // Check if all animals are melted
    if (newMelted.length === round.animals.length) {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setShowAnswer(true);
    completeSoundRef.current?.play().catch(() => {});

    const newScore = score + 1;
    setScore(newScore);

    setScorePopup({ id: Date.now(), x: 50 });
    setTimeout(() => setScorePopup(null), 1000);

    updateProgress({
      title: "Freeze Melt Game",
      score: newScore,
      total: TARGET_ROUNDS,
      index: currentRound + 1,
    });

    completeQuiz({
      title: "Freeze Melt Game",
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
            onComplete({ score: score + 1, total: TARGET_ROUNDS });
          }
        }, 2500);
      }
    }, NEXT_ROUND_DELAY);
  };

  const progressPercent = Math.round((currentRound / TARGET_ROUNDS) * 100);
  const meltedCount = meltedAnimals.length;
  const totalAnimals = round.animals.length;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 p-4 sm:p-8 rounded-xl overflow-hidden">
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
              {lang === "el" ? "Πάγωσε-Λιώσε" : "Freeze-Melt"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              {round.sceneName} - {lang === "el"
                ? `Επίπεδο ${currentRound + 1}/${TARGET_ROUNDS}`
                : `Level ${currentRound + 1}/${TARGET_ROUNDS}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-orange-600">
            🔥 {score}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {progressPercent}%
          </span>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">
            {lang === "el" ? "Πρόοδος:" : "Progress:"}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: totalAnimals }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                  i < meltedCount
                    ? 'bg-orange-400 text-white scale-110'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {i < meltedCount ? '🔥' : '❄️'}
              </div>
            ))}
          </div>
          <span className="text-sm text-slate-600 ml-2">
            {meltedCount}/{totalAnimals}
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <div className="inline-block bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border-4 border-cyan-400">
          <div className="text-7xl mb-3">🔥</div>
          <h2 className="text-3xl font-bold mb-3 text-slate-800">
            {round.description}
          </h2>

          <button
            onClick={speakQuestion}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-orange-500 text-white text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
          >
            🔊 {lang === "el" ? "Άκουσε Ξανά" : "Listen Again"}
          </button>
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-5xl mx-auto mb-6">
        <div
          className="relative rounded-3xl shadow-2xl overflow-hidden border-4 border-white cursor-move select-none"
          style={{ height: '500px', background: round.background }}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseMove={handleFireMove}
          onMouseLeave={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchMove={handleFireMove}
        >
          {/* Animals */}
          {round.animals.map((animal) => {
            const isMelted = meltedAnimals.includes(animal.id);

            return (
              <div
                key={animal.id}
                className="absolute transition-all duration-500"
                style={{
                  left: `${animal.x}%`,
                  top: `${animal.y}%`,
                  transform: 'translate(-50%, -50%)',
                  fontSize: `${animal.size}px`
                }}
              >
                {/* Frozen overlay */}
                {!isMelted && (
                  <div className="relative">
                    <div
                      className="absolute inset-0 bg-cyan-300/50 rounded-full animate-pulse"
                      style={{
                        filter: 'blur(15px)',
                        width: `${animal.size * 1.2}px`,
                        height: `${animal.size * 1.2}px`,
                        transform: 'translate(-10%, -10%)'
                      }}
                    />
                    <div className="relative filter brightness-90 saturate-50">
                      {animal.emoji}
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/40 to-blue-300/40 rounded-full" />
                    </div>
                    <div className="absolute -top-2 -right-2 text-3xl animate-bounce">
                      ❄️
                    </div>
                  </div>
                )}

                {/* Melted animal */}
                {isMelted && (
                  <div className="relative animate-bounce">
                    <div className="filter brightness-110 saturate-150">
                      {animal.emoji}
                    </div>
                    <div className="absolute -top-2 -right-2 text-3xl">
                      ❤️
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Fire/Torch */}
          <div
            className="absolute transition-none pointer-events-none z-10"
            style={{
              left: `${firePosition.x}%`,
              top: `${firePosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="text-6xl animate-pulse filter drop-shadow-lg">
              🔥
            </div>
            {isDragging && (
              <div
                className="absolute inset-0 bg-orange-400/30 rounded-full animate-ping"
                style={{ width: '80px', height: '80px', transform: 'translate(-25%, -25%)' }}
              />
            )}
          </div>

          {/* Instructions overlay */}
          {!isDragging && meltedCount === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-xl animate-pulse">
                <p className="text-2xl font-bold text-slate-800 text-center">
                  {lang === "el"
                    ? "🔥 Σύρε τη φωτιά στα παγωμένα ζώα!"
                    : "🔥 Drag the fire to the frozen animals!"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAnswer && (
        <div className="text-center animate-fadeIn">
          <div className="bg-green-100 rounded-2xl p-6 inline-block border-4 border-green-400">
            <p className="text-3xl font-bold text-green-700">
              {lang === "el"
                ? `🎉 Τέλεια! Έλιωσες όλα τα ζώα στο ${round.sceneName}!`
                : `🎉 Perfect! You melted all the animals in the ${round.sceneName}!`}
            </p>
          </div>
        </div>
      )}

      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/80 to-orange-400/80 flex items-center justify-center rounded-xl z-30 animate-fadeIn">
          <div className="text-center animate-bounce">
            <div className="text-9xl mb-4">🔥❤️</div>
            <h3 className="text-4xl font-bold text-white">
              {lang === "el" ? "Τέλεια! Έσωσες όλα τα ζώα!" : "Perfect! You saved all the animals!"}
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

