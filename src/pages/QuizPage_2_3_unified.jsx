import React, { useState, useContext, useEffect, useCallback, useRef } from "react";
import QuizRunner from "../components/quiz/QuizRunner";
import FunDragDropAnimals from "../components/quiz/FunDragDropAnimals";
import DrawingExercise from "../components/quiz/DrawingExercise";
import RightPanel from "../components/quiz/RightPanel";
import Navbar from "../components/Navbar";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { useProgress } from "../contexts/ProgressContext";
import { checkNewAchievements } from "../services/RewardsService";
import AchievementPopup from "../components/rewards/AchievementPopup";
import ShareScoreCard from "../components/ShareScoreCard";
import HowToPlayModal, { shouldShowTutorial } from "../components/HowToPlayModal";
import DifficultyNotification from "../components/DifficultyNotification";
import { DifficultyService } from "../services/DifficultyService";
import { shuffleArray } from "../utils/shuffle";
import { EmptySearchState } from "../components/SkeletonLoader";

import TapPuzzle from "../components/puzzles/TapPuzzle";
import PuzzleBoard from "../components/puzzles/PuzzleBoard";
import BubblePop from "../components/games/exercises_2_3_1/BubblePop";
import ShapeMatch from "../components/games/exercises_2_3_1/ShapeMatch";
import ColorMatch from "../components/games/exercises_2_3_1/ColorMatch";
import AnimalSounds from "../components/games/exercises_2_3_1/AnimalSounds";
import CountAndLearn from "../components/games/exercises_2_3_1/CountAndLearn";
import MusicalPiano from "../components/games/exercises_2_3_1/MusicalPiano";
import EmotionsMatch from "../components/games/exercises_2_3_1/EmotionsMatch";
import AnimalTracks from "../components/games/exercises_2_3_1/AnimalTracks";
import VehicleSounds from "../components/games/exercises_2_3_1/VehicleSounds";
import ColorDrawing from "../components/games/exercises_2_3_1/ColorDrawing";
import SpotDifference from "../components/games/exercises_2_3_1/SpotDifference";
import MemoryMatch from "../components/games/exercises_2_3_1/MemoryMatch";
import AnimalHabitats from "../components/games/exercises_2_3_1/AnimalHabitats";
import FoodSorting from "../components/games/exercises_2_3_1/FoodSorting";
import PatternMatch from "../components/games/exercises_2_3_1/PatternMatch";
import AlphabetMatch from "../components/games/exercises_2_3_1/AlphabetMatch";
import BodyParts from "../components/games/exercises_2_3_1/BodyParts";
import WeatherClothes from "../components/games/exercises_2_3_1/WeatherClothes";
import BalloonCatch from "../components/games/exercises_2_3_1/BalloonCatch";
import OddOneOut from "../components/games/exercises_2_3_1/OddOneOut";
import SizeSorting from "../components/games/exercises_2_3_1/SizeSorting";

import { shapesQuizzes } from "../components/quiz/data/shapesQuizzes";
import { animalQuizzes } from "../components/quiz/data/animalQuizzes";
import { colorsQuizzes } from "../components/quiz/data/colorsQuizzes";
import { numbersQuizzes } from "../components/quiz/data/numbersQuizzes";
import { firstWordsQuizzes } from "../components/quiz/data/firstWordsQuizzes";
import { funGamesQuizzes } from "../components/quiz/data/funGamesQuizzes";
import puzzlesData from "../components/puzzles/data/puzzles.json";

const MODE_CONFIG = {
  school: {
    title: { el: "Προετοιμασία για Σχολείο", en: "School Preparation" },
    icon: "🏫",
    gradient: "from-blue-600 to-indigo-600",
    bg: "from-blue-50 via-indigo-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800",
    accent: "from-blue-500 to-indigo-500",
  },
  fun: {
    title: { el: "Διασκέδαση & Παιχνίδι", en: "Fun & Play" },
    icon: "🎉",
    gradient: "from-pink-600 to-rose-600",
    bg: "from-pink-50 via-rose-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800",
    accent: "from-pink-500 to-rose-500",
  },
  logic: {
    title: { el: "Λογική Σκέψη", en: "Logical Thinking" },
    icon: "🧩",
    gradient: "from-purple-600 to-violet-600",
    bg: "from-purple-50 via-violet-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800",
    accent: "from-purple-500 to-violet-500",
  },
};

const SCHOOL_GAMES = [
  { id: "shapesQuiz", title: { el: "Κουίζ Σχημάτων", en: "Shapes Quiz" }, icon: "🔷", description: { el: "Μάθε τα σχήματα", en: "Learn the shapes" }, color: "from-cyan-400 to-blue-500", type: "quizSet", data: "shapes" },
  { id: "colorsQuiz", title: { el: "Κουίζ Χρωμάτων", en: "Colors Quiz" }, icon: "🎨", description: { el: "Μάθε τα χρώματα", en: "Learn the colors" }, color: "from-pink-400 to-rose-500", type: "quizSet", data: "colors" },
  { id: "numbersQuiz", title: { el: "Κουίζ Αριθμών", en: "Numbers Quiz" }, icon: "🔢", description: { el: "Μάθε τους αριθμούς", en: "Learn the numbers" }, color: "from-emerald-400 to-teal-500", type: "quizSet", data: "numbers" },
  { id: "firstWordsQuiz", title: { el: "Πρώτες Λέξεις", en: "First Words" }, icon: "📝", description: { el: "Μάθε τις πρώτες λέξεις", en: "Learn your first words" }, color: "from-amber-400 to-orange-500", type: "quizSet", data: "firstWords" },
  { id: "animalsQuiz", title: { el: "Κουίζ Ζώων", en: "Animals Quiz" }, icon: "🐾", description: { el: "Μάθε τα ζώα", en: "Learn the animals" }, color: "from-green-400 to-emerald-500", type: "quizSet", data: "animals" },
  { id: "drawing", title: { el: "Ζωγραφική", en: "Drawing" }, icon: "✏️", description: { el: "Ζωγράφισε ό,τι θέλεις", en: "Draw whatever you like" }, color: "from-purple-400 to-pink-500", type: "exercise" },
  { id: "alphabetMatch", title: { el: "Αλφάβητο", en: "Alphabet Match" }, icon: "🔤", description: { el: "Ταίριαξε γράμματα με εικόνες", en: "Match letters with images" }, color: "from-violet-400 to-purple-500", type: "exercise" },
  { id: "countAndLearn", title: { el: "Μέτρησε και Μάθε", en: "Count and Learn" }, icon: "🔟", description: { el: "Μέτρα τα αντικείμενα", en: "Count the objects" }, color: "from-indigo-400 to-blue-500", type: "exercise" },
  { id: "bodyParts", title: { el: "Μέρη Σώματος", en: "Body Parts" }, icon: "👤", description: { el: "Μάθε τα μέρη του σώματος", en: "Learn body parts" }, color: "from-orange-400 to-red-500", type: "exercise" },
  { id: "colorMatch", title: { el: "Μάθε τα Χρώματα", en: "Learn Colors" }, icon: "🌈", description: { el: "Βρες το σωστό χρώμα", en: "Find the right color" }, color: "from-rose-400 to-pink-500", type: "exercise" },
  { id: "shapeMatch", title: { el: "Μάθε τα Σχήματα", en: "Learn Shapes" }, icon: "🔶", description: { el: "Βάλε σχήματα στις θέσεις τους", en: "Place shapes in position" }, color: "from-teal-400 to-green-500", type: "exercise" },
  { id: "emotionsMatch", title: { el: "Μάθε Συναισθήματα", en: "Learn Emotions" }, icon: "😊", description: { el: "Αναγνώρισε τα συναισθήματα", en: "Recognize emotions" }, color: "from-yellow-400 to-orange-500", type: "exercise" },
  { id: "weatherClothes", title: { el: "Καιρός & Ρούχα", en: "Weather & Clothes" }, icon: "☀️", description: { el: "Μάθε τι φοράμε κάθε εποχή", en: "Learn what to wear each season" }, color: "from-sky-400 to-blue-500", type: "exercise" },
  { id: "foodSorting", title: { el: "Υγιεινή Διατροφή", en: "Healthy Food" }, icon: "🥗", description: { el: "Ταξινόμησε τα φαγητά", en: "Sort healthy foods" }, color: "from-lime-400 to-green-500", type: "exercise" },
  { id: "sizeSorting", title: { el: "Μικρό-Μεγάλο", en: "Small to Big" }, icon: "📏", description: { el: "Βάλε σε σειρά μεγέθους", en: "Sort by size" }, color: "from-amber-400 to-yellow-500", type: "exercise" },
  { id: "patternMatch", title: { el: "Μάθε Μοτίβα", en: "Learn Patterns" }, icon: "🔲", description: { el: "Συνέχισε το μοτίβο", en: "Continue the pattern" }, color: "from-cyan-400 to-indigo-500", type: "exercise" },
  { id: "memoryMatch", title: { el: "Εξάσκηση Μνήμης", en: "Memory Training" }, icon: "🧠", description: { el: "Βρες τα ίδια ζευγάρια", en: "Find matching pairs" }, color: "from-violet-400 to-fuchsia-500", type: "exercise" },
  { id: "animalSounds", title: { el: "Μάθε τους Ήχους Ζώων", en: "Learn Animal Sounds" }, icon: "🐕", description: { el: "Ποιο ζώο κάνει αυτό τον ήχο;", en: "Which animal makes this sound?" }, color: "from-emerald-400 to-green-500", type: "exercise" },
  { id: "animalHabitats", title: { el: "Σπίτια Ζώων", en: "Animal Homes" }, icon: "🏠", description: { el: "Μάθε πού μένει κάθε ζώο", en: "Learn where each animal lives" }, color: "from-green-400 to-teal-500", type: "exercise" },
  { id: "animalTracks", title: { el: "Ίχνη Ζώων", en: "Animal Tracks" }, icon: "🐾", description: { el: "Ταίριαξε ζώα με τα ίχνη τους", en: "Match animals with their tracks" }, color: "from-lime-400 to-emerald-500", type: "exercise" },
  { id: "oddOneOut", title: { el: "Βρες το Διαφορετικό", en: "Find the Different" }, icon: "🤔", description: { el: "Ποιο δεν ταιριάζει;", en: "Which one doesn't belong?" }, color: "from-orange-400 to-amber-500", type: "exercise" },
  { id: "spotDifference", title: { el: "Βρες τις Διαφορές", en: "Spot Differences" }, icon: "🔍", description: { el: "Βρες τι είναι διαφορετικό", en: "Find what's different" }, color: "from-pink-400 to-rose-500", type: "exercise" },
  { id: "vehicleSounds", title: { el: "Μάθε τα Οχήματα", en: "Learn Vehicles" }, icon: "🚌", description: { el: "Ποιο όχημα κάνει αυτό τον ήχο;", en: "Which vehicle makes this sound?" }, color: "from-blue-400 to-indigo-500", type: "exercise" },
  { id: "colorDrawing", title: { el: "Χρωμάτισε", en: "Coloring" }, icon: "🖍️", description: { el: "Ζωγράφισε με χρώματα", en: "Color with crayons" }, color: "from-fuchsia-400 to-pink-500", type: "exercise" },
];

const FUN_GAMES = [
  { id: "tapPuzzle", title: { el: "Tap Παζλ", en: "Tap Puzzle" }, icon: "🧩", description: { el: "Πάτα τα κομμάτια με τη σειρά", en: "Tap the pieces in order" }, color: "from-blue-400 to-purple-500", type: "exercise" },
  { id: "puzzleBoard", title: { el: "Παζλ Εικόνων", en: "Image Puzzle" }, icon: "🖼️", description: { el: "Σύρε τα κομμάτια", en: "Drag pieces to complete" }, color: "from-indigo-400 to-blue-500", type: "exercise" },
  { id: "bubblePop", title: { el: "Φούσκες", en: "Bubble Pop" }, icon: "🫧", description: { el: "Σκάσε τις φούσκες!", en: "Pop all the bubbles!" }, color: "from-cyan-400 to-blue-500", type: "exercise" },
  { id: "balloonCatch", title: { el: "Πιάσε Μπαλόνια", en: "Balloon Catch" }, icon: "🎈", description: { el: "Πιάσε τα μπαλόνια!", en: "Catch the balloons!" }, color: "from-red-400 to-pink-500", type: "exercise" },
  { id: "shapeMatch", title: { el: "Σχήματα", en: "Shape Match" }, icon: "🔷", description: { el: "Βάλε σχήματα στις θέσεις", en: "Place shapes correctly" }, color: "from-teal-400 to-green-500", type: "exercise" },
  { id: "colorMatch", title: { el: "Χρώματα", en: "Color Match" }, icon: "🎨", description: { el: "Βρες το σωστό χρώμα", en: "Find the right color" }, color: "from-pink-400 to-rose-500", type: "exercise" },
  { id: "colorDrawing", title: { el: "Ζωγραφική", en: "Color Drawing" }, icon: "🖍️", description: { el: "Ζωγράφισε με χρώματα", en: "Draw with colors" }, color: "from-purple-400 to-pink-500", type: "exercise" },
  { id: "musicalPiano", title: { el: "Πιάνο", en: "Musical Piano" }, icon: "🎹", description: { el: "Παίξε μουσική", en: "Play music" }, color: "from-yellow-400 to-orange-500", type: "exercise" },
  { id: "vehicleSounds", title: { el: "Ήχοι Οχημάτων", en: "Vehicle Sounds" }, icon: "🚗", description: { el: "Βρες το όχημα", en: "Find the vehicle" }, color: "from-amber-400 to-yellow-500", type: "exercise" },
  { id: "animalSounds", title: { el: "Ήχοι Ζώων", en: "Animal Sounds" }, icon: "🐶", description: { el: "Βρες ποιο ζώο κάνει τον ήχο", en: "Find which animal" }, color: "from-emerald-400 to-lime-500", type: "exercise" },
  { id: "funGamesQuiz", title: { el: "Παιχνίδια Ζώων", en: "Animal Fun Games" }, icon: "🐻", description: { el: "Drag & drop ζώα", en: "Drag & drop animals" }, color: "from-lime-400 to-green-500", type: "quizSet", data: "funGames" },
];

const LOGIC_GAMES = [
  { id: "memoryMatch", title: { el: "Μνήμη", en: "Memory Match" }, icon: "🧠", description: { el: "Βρες τα ζευγάρια", en: "Find matching pairs" }, color: "from-violet-400 to-fuchsia-500", type: "exercise" },
  { id: "patternMatch", title: { el: "Μοτίβα", en: "Pattern Match" }, icon: "🔲", description: { el: "Βρες το μοτίβο", en: "Find the pattern" }, color: "from-cyan-400 to-blue-500", type: "exercise" },
  { id: "oddOneOut", title: { el: "Βρες το Διαφορετικό", en: "Odd One Out" }, icon: "🤔", description: { el: "Ποιο δεν ταιριάζει;", en: "Which doesn't belong?" }, color: "from-orange-400 to-amber-500", type: "exercise" },
  { id: "sizeSorting", title: { el: "Ταξινόμηση Μεγέθους", en: "Size Sorting" }, icon: "📏", description: { el: "Βάλε σε σειρά μεγέθους", en: "Sort by size" }, color: "from-teal-400 to-emerald-500", type: "exercise" },
  { id: "spotDifference", title: { el: "Βρες Διαφορές", en: "Spot Difference" }, icon: "🔍", description: { el: "Βρες τις διαφορές", en: "Find the differences" }, color: "from-pink-400 to-red-500", type: "exercise" },
  { id: "foodSorting", title: { el: "Ταξινόμηση Φαγητού", en: "Food Sorting" }, icon: "🍎", description: { el: "Ταξινόμησε τα φαγητά", en: "Sort the foods" }, color: "from-red-400 to-orange-500", type: "exercise" },
  { id: "emotionsMatch", title: { el: "Συναισθήματα", en: "Emotions Match" }, icon: "😊", description: { el: "Μάθε τα συναισθήματα", en: "Learn emotions" }, color: "from-yellow-400 to-orange-500", type: "exercise" },
  { id: "animalHabitats", title: { el: "Σπίτια Ζώων", en: "Animal Habitats" }, icon: "🏡", description: { el: "Βάλε κάθε ζώο στο σπίτι", en: "Put animals in homes" }, color: "from-green-400 to-emerald-500", type: "exercise" },
  { id: "animalTracks", title: { el: "Ίχνη Ζώων", en: "Animal Tracks" }, icon: "🐾", description: { el: "Ταίριαξε ζώο με ίχνη", en: "Match animal tracks" }, color: "from-lime-400 to-green-500", type: "exercise" },
  { id: "weatherClothes", title: { el: "Ρούχα Καιρού", en: "Weather Clothes" }, icon: "☀️", description: { el: "Διάλεξε τα σωστά ρούχα", en: "Choose the right clothes" }, color: "from-blue-400 to-cyan-500", type: "exercise" },
];

const QUIZ_DATA_MAP = {
  shapes: shapesQuizzes,
  colors: colorsQuizzes,
  numbers: numbersQuizzes,
  firstWords: firstWordsQuizzes,
  animals: animalQuizzes,
  funGames: funGamesQuizzes,
};

const GAMES_BY_MODE = { school: SCHOOL_GAMES, fun: FUN_GAMES, logic: LOGIC_GAMES };

export default function QuizPage_2_3_unified({ mode = "fun" }) {
  const { lang } = useContext(LanguageContext);
  const { guest } = useContext(AuthContext);
  const progress = useProgress();
  const isEl = lang === "el";

  const config = MODE_CONFIG[mode] || MODE_CONFIG.fun;
  const games = GAMES_BY_MODE[mode] || FUN_GAMES;
  const gameMap = Object.fromEntries(games.map((g) => [g.id, g]));

  const [activeGame, setActiveGame] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);
  const [newBadge, setNewBadge] = useState(null);
  const [tutorialGame, setTutorialGame] = useState(null);
  const [diffNotif, setDiffNotif] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("geo:progress:favorites")) || []; } catch { return []; }
  });
  const sessionStartRef = useRef(null);

  const [quizSet, setQuizSet] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    if (activeGame) {
      sessionStartRef.current = Date.now();
    } else if (sessionStartRef.current) {
      const minutes = Math.round((Date.now() - sessionStartRef.current) / 60000);
      if (minutes > 0) {
        import("../services/ProgressService").then(({ ProgressService }) => {
          ProgressService.addMinutesPlayed(minutes);
        });
      }
      sessionStartRef.current = null;
    }
  }, [activeGame]);

  const filteredGames = searchQuery.trim()
    ? games.filter((g) => {
        const q = searchQuery.toLowerCase();
        const t = g.title;
        const d = g.description;
        return (
          (t[lang] || "").toLowerCase().includes(q) ||
          (t.el || "").toLowerCase().includes(q) ||
          (t.en || "").toLowerCase().includes(q) ||
          (d[lang] || "").toLowerCase().includes(q)
        );
      })
    : games;

  const recentGames = React.useMemo(() => {
    try {
      const list = JSON.parse(localStorage.getItem("geo:progress:recentList")) || [];
      return list.slice(0, 4);
    } catch { return []; }
  }, [activeGame]);

  const handleToggleFavorite = (e, gameId) => {
    e.stopPropagation();
    import("../services/ProgressService").then(({ ProgressService }) => {
      const updated = ProgressService.toggleFavorite(gameId);
      setFavorites([...updated]);
    });
  };

  const favoriteGames = games.filter((g) => favorites.includes(g.id));

  const startQuizSet = (dataKey) => {
    const quizzes = QUIZ_DATA_MAP[dataKey] || [];
    setQuizSet(shuffleArray(quizzes));
    setQuizIndex(0);
    setQuizScore(0);
  };

  const handleGameStart = (gameId) => {
    const gameDef = games.find((g) => g.id === gameId);
    setActiveGame(gameId);
    setResetCounter((p) => p + 1);
    setShowCompletionModal(false);
    if (gameDef?.type === "quizSet" && gameDef.data) {
      startQuizSet(gameDef.data);
    }
  };

  const currentDifficulty = activeGame ? DifficultyService.getDifficulty(activeGame) : 1;

  const startGame = useCallback((gameId) => {
    if (shouldShowTutorial(gameId)) {
      setTutorialGame(gameId);
    } else {
      handleGameStart(gameId);
    }
  }, []);

  const handleTutorialStart = useCallback(() => {
    const id = tutorialGame;
    setTutorialGame(null);
    handleGameStart(id);
  }, [tutorialGame]);

  const handleGameComplete = useCallback((result) => {
    if (activeGame) {
      progress.recordGameComplete({
        gameId: activeGame,
        title: activeGame,
        score: result?.score || 0,
        total: result?.total || 0,
        category: mode,
        difficulty: currentDifficulty,
      });
      const diffResult = DifficultyService.evaluate(activeGame);
      if (diffResult.changed) {
        setDiffNotif({ direction: diffResult.direction, newLevel: diffResult.newLevel });
      }
      const badges = checkNewAchievements(progress);
      if (badges.length > 0) {
        badges.forEach((id) => progress.unlockAchievement(id));
        setNewBadge(badges[0]);
      }
    }
    if (result) setLastResult({ score: result.score || 0, total: result.total || 0 });
    setShowCompletionModal(true);
  }, [activeGame, mode, currentDifficulty, progress]);

  const handleQuizNext = (score = 0) => {
    setQuizScore((p) => p + score);
    if (quizIndex + 1 < quizSet.length) {
      setQuizIndex((i) => i + 1);
    } else {
      if (quizSet.length > 0) {
        setLastResult({ score: quizScore + score, total: quizSet.length });
      }
      setShowCompletionModal(true);
    }
  };

  const handlePlayAgain = () => {
    setShowCompletionModal(false);
    const gameDef = games.find((g) => g.id === activeGame);
    if (gameDef?.type === "quizSet" && gameDef.data) {
      startQuizSet(gameDef.data);
    }
    setResetCounter((p) => p + 1);
  };

  const handleBackToGames = () => {
    setShowCompletionModal(false);
    setActiveGame(null);
    setQuizSet([]);
    setQuizIndex(0);
    setQuizScore(0);
  };

  const resolveTitle = (title) =>
    typeof title === "string" ? title : title?.[lang] || title?.en || "Quiz";

  const renderActiveGame = () => {
    const gameDef = games.find((g) => g.id === activeGame);

    if (gameDef?.type === "quizSet") {
      const quiz = quizSet[quizIndex];
      if (!quiz) return null;
      if (quiz.type === "dragdrop") {
        return (
          <FunDragDropAnimals
            key={`${activeGame}-${quizIndex}-${resetCounter}`}
            title={resolveTitle(quiz.title)}
            lang={lang}
            data={quiz.data || quiz.items || []}
            onNext={handleQuizNext}
          />
        );
      }
      return (
        <QuizRunner
          key={`${activeGame}-${quizIndex}-${resetCounter}`}
          {...quiz}
          title={resolveTitle(quiz.title)}
          lang={lang}
          onFinish={handleQuizNext}
        />
      );
    }

    const k = resetCounter;
    const props = { key: k, lang, onComplete: handleGameComplete };

    switch (activeGame) {
      case "drawing": return <DrawingExercise {...props} title={{ en: "Drawing", el: "Ζωγραφική" }} width={700} height={500} />;
      case "tapPuzzle": return <TapPuzzle {...props} puzzles={puzzlesData} />;
      case "puzzleBoard": return <PuzzleBoard {...props} piecesCount={4} />;
      case "bubblePop": return <BubblePop {...props} />;
      case "balloonCatch": return <BalloonCatch {...props} />;
      case "shapeMatch": return <ShapeMatch {...props} />;
      case "colorMatch": return <ColorMatch {...props} />;
      case "colorDrawing": return <ColorDrawing {...props} />;
      case "musicalPiano": return <MusicalPiano {...props} />;
      case "vehicleSounds": return <VehicleSounds {...props} />;
      case "animalSounds": return <AnimalSounds {...props} />;
      case "memoryMatch": return <MemoryMatch {...props} />;
      case "patternMatch": return <PatternMatch {...props} />;
      case "oddOneOut": return <OddOneOut {...props} />;
      case "sizeSorting": return <SizeSorting {...props} />;
      case "spotDifference": return <SpotDifference {...props} />;
      case "foodSorting": return <FoodSorting {...props} />;
      case "emotionsMatch": return <EmotionsMatch {...props} />;
      case "animalHabitats": return <AnimalHabitats {...props} />;
      case "animalTracks": return <AnimalTracks {...props} />;
      case "weatherClothes": return <WeatherClothes {...props} />;
      case "alphabetMatch": return <AlphabetMatch {...props} />;
      case "countAndLearn": return <CountAndLearn {...props} />;
      case "bodyParts": return <BodyParts {...props} />;
      default: return null;
    }
  };

  return (
    <div id="main-content" className={`min-h-screen bg-gradient-to-br ${config.bg}`}>
      <Navbar />

      <div className={`pt-16 ${activeGame ? "grid grid-cols-1 lg:grid-cols-[1fr_18rem]" : "grid grid-cols-1 lg:grid-cols-[auto_1fr_18rem]"}`}>
        {/* Sidebar -- matches FunQuizPage style */}
        {!activeGame && (
          <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-900">
            <div className="p-3">
              <h2 className={`px-3 py-2 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r ${config.gradient} uppercase tracking-wide`}>
                {config.icon} {config.title[isEl ? "el" : "en"]}
              </h2>
              <nav className="space-y-2 mt-4">
                {games.map((g) => {
                  const isActive = activeGame === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleGameStart(g.id)}
                      className={[
                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform",
                        isActive
                          ? `bg-gradient-to-r ${g.color} text-white shadow-lg scale-105`
                          : "text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-102 shadow-sm",
                      ].join(" ")}
                    >
                      <span className="text-2xl">{g.icon}</span>
                      <span className="truncate flex-1 text-left">{resolveTitle(g.title)}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>
        )}

        {/* Main content */}
        <main className="p-4 lg:p-6">
          {/* Title bar */}
          <div className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-2xl p-4 shadow-lg">
            <h1 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${config.gradient}`}>
              {config.icon} {activeGame
                ? resolveTitle(games.find((g) => g.id === activeGame)?.title || "")
                : `${isEl ? "Ηλικία 2-3" : "Age 2-3"}: ${config.title[isEl ? "el" : "en"]}`}
            </h1>
            {guest?.age && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isEl ? "Ηλικία" : "Age"}: {guest.age}
                {guest.objective && <> — {isEl ? "Στόχος" : "Goal"}: {guest.objective}</>}
              </p>
            )}
          </div>

          <div className="max-w-6xl mx-auto">
            {!activeGame ? (
              <div>
                {/* Search bar */}
                <div className="mb-6">
                  <div className="relative max-w-md mx-auto">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isEl ? "Αναζήτηση παιχνιδιού..." : "Search games..."}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur border-2 border-white/50 dark:border-slate-700 shadow-md focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 outline-none transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Recently played */}
                {!searchQuery && recentGames.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                      <span>🕐</span>
                      {isEl ? "Πρόσφατα" : "Recently Played"}
                    </h3>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {recentGames.map((rg) => {
                        const gameData = gameMap[rg.gameId];
                        if (!gameData) return null;
                        return (
                          <button
                            key={rg.gameId}
                            onClick={() => handleGameStart(rg.gameId)}
                            className="shrink-0 flex items-center gap-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-2xl px-4 py-3 shadow-sm border border-white/50 dark:border-slate-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                          >
                            <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gameData.color} flex items-center justify-center text-lg shadow-sm`}>
                              {gameData.icon}
                            </span>
                            <div className="text-left">
                              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{resolveTitle(gameData.title)}</p>
                              <p className="text-xs text-slate-400">{rg.score}/{rg.total}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Favorites */}
                {!searchQuery && favoriteGames.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                      <span>⭐</span>
                      {isEl ? "Αγαπημένα" : "Favorites"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favoriteGames.map((game) => (
                        <button
                          key={game.id}
                          onClick={() => handleGameStart(game.id)}
                          className="group relative bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-amber-200 dark:border-amber-800 p-4 flex items-center gap-3"
                        >
                          <span className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-2xl shadow-sm shrink-0`}>
                            {game.icon}
                          </span>
                          <div className="text-left">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-white">{resolveTitle(game.title)}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{game.description[lang]}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search results count */}
                {searchQuery && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-4">
                    {filteredGames.length} {isEl ? "αποτελέσματα" : "results"}
                  </p>
                )}

                {searchQuery && filteredGames.length === 0 && (
                  <EmptySearchState lang={lang} onClear={() => setSearchQuery("")} />
                )}

                {/* Game grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGames.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => handleGameStart(game.id)}
                      className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-slate-900/40 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => handleToggleFavorite(e, game.id)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleToggleFavorite(e, game.id); } }}
                        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white dark:bg-slate-700 shadow-md flex items-center justify-center hover:scale-110 transition-all cursor-pointer border border-slate-200 dark:border-slate-600"
                        title={isEl ? "Αγαπημένο" : "Favorite"}
                      >
                        <span className={`text-base ${favorites.includes(game.id) ? "text-amber-400" : "text-slate-400 dark:text-slate-500"}`}>
                          {favorites.includes(game.id) ? "★" : "☆"}
                        </span>
                      </div>
                      <div className="relative p-6">
                        <div className="text-6xl mb-4">{game.icon}</div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                          {resolveTitle(game.title)}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {game.description[lang]}
                        </p>
                        <div className={`mt-4 inline-block px-4 py-2 bg-gradient-to-r ${game.color} text-white rounded-full text-sm font-semibold`}>
                          {isEl ? "Παίξε" : "Play"} →
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={handleBackToGames}
                  className="mb-6 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  <span className="text-xl">←</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {isEl ? "Πίσω στα Παιχνίδια" : "Back to Games"}
                  </span>
                </button>

                {renderActiveGame()}
              </div>
            )}
          </div>
        </main>

        <RightPanel />
      </div>

      {newBadge && (
        <AchievementPopup
          achievementId={newBadge}
          lang={lang}
          onClose={() => setNewBadge(null)}
        />
      )}

      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl text-center max-w-md animate-fadeIn">
            <div className="text-7xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold mb-2 text-slate-800 dark:text-white">
              {isEl ? "Συγχαρητήρια!" : "Congratulations!"}
            </h2>
            <p className="text-xl text-slate-700 dark:text-slate-300 mb-6">
              {isEl ? "Τα πήγες υπέροχα!" : "You did great!"}
            </p>
            {lastResult.total > 0 && (
              <div className="mb-4">
                <ShareScoreCard
                  score={lastResult.score}
                  total={lastResult.total}
                  gameName={activeGame || ""}
                  icon="🎮"
                />
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handlePlayAgain}
                className={`px-6 py-3 bg-gradient-to-r ${config.accent} text-white text-lg font-semibold rounded-full hover:scale-105 transition-transform shadow-lg`}
              >
                {isEl ? "🔄 Παίξε Ξανά" : "🔄 Play Again"}
              </button>
              <button
                onClick={handleBackToGames}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-lg font-semibold rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                {isEl ? "← Πίσω" : "← Back"}
              </button>
            </div>
          </div>
        </div>
      )}

      {tutorialGame && (
        <HowToPlayModal
          gameId={tutorialGame}
          gameTitle={games.find(g => g.id === tutorialGame)?.title[lang] || tutorialGame}
          gameIcon={games.find(g => g.id === tutorialGame)?.icon}
          difficulty={DifficultyService.getDifficulty(tutorialGame)}
          onStart={handleTutorialStart}
          onClose={() => setTutorialGame(null)}
        />
      )}

      {diffNotif && (
        <DifficultyNotification
          direction={diffNotif.direction}
          newLevel={diffNotif.newLevel}
          onDone={() => setDiffNotif(null)}
        />
      )}
    </div>
  );
}
