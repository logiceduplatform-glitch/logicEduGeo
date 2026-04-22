import React, { useState, useContext, useEffect, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import CategoryQuiz from "../components/quiz/CategoryQuiz";
import { LanguageContext } from "../i18n/LanguageContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import LockedGameOverlay from "../components/LockedGameOverlay";
import PaywallModal from "../components/PaywallModal";
import Breadcrumb from "../components/Breadcrumb";
import DifficultyBadge from "../components/DifficultyBadge";
import { ProgressService } from "../services/ProgressService";
import { ADULT_GAME_CATEGORIES } from "../config/adultGameConfig";
import { GameSkeleton } from "../components/SkeletonLoader";

// Lazy load all game components
const MemoryCardsGame = React.lazy(() => import("../components/games/adult/MemoryCardsGame"));
const RememberSequenceGame = React.lazy(() => import("../components/games/adult/RememberSequenceGame"));
const SimonGame = React.lazy(() => import("../components/games/adult/SimonGame"));
const FindDifferenceGame = React.lazy(() => import("../components/games/adult/FindDifferenceGame"));
const QuickReactionGame = React.lazy(() => import("../components/games/adult/QuickReactionGame"));
const VisualMemoryGame = React.lazy(() => import("../components/games/adult/VisualMemoryGame"));
const SpeedMathGame = React.lazy(() => import("../components/games/adult/SpeedMathGame"));
const MemoryPathGame = React.lazy(() => import("../components/games/adult/MemoryPathGame"));
const MatchSymbolsGame = React.lazy(() => import("../components/games/adult/MatchSymbolsGame"));
const MissingItemGame = React.lazy(() => import("../components/games/adult/MissingItemGame"));
const WordScrambleGame = React.lazy(() => import("../components/games/adult/WordScrambleGame"));
const EmojiQuizGame = React.lazy(() => import("../components/games/adult/EmojiQuizGame"));
const TriviaQuizGame = React.lazy(() => import("../components/games/adult/TriviaQuizGame"));
const GuessImageGame = React.lazy(() => import("../components/games/adult/GuessImageGame"));
const HangmanGame = React.lazy(() => import("../components/games/adult/HangmanGame"));
const FourPicsOneWordGame = React.lazy(() => import("../components/games/adult/FourPicsOneWordGame"));
const GuessTheSoundGame = React.lazy(() => import("../components/games/adult/GuessTheSoundGame"));
const TrueOrFalseGame = React.lazy(() => import("../components/games/adult/TrueOrFalseGame"));
const DailyChallengeGame = React.lazy(() => import("../components/games/adult/DailyChallengeGame"));
const WordSearchGame = React.lazy(() => import("../components/games/adult/WordSearchGame"));
const SudokuGame = React.lazy(() => import("../components/games/adult/SudokuGame"));
const LogicGridPuzzleGame = React.lazy(() => import("../components/games/adult/LogicGridPuzzleGame"));
const RiverCrossingGame = React.lazy(() => import("../components/games/adult/RiverCrossingGame"));
const MatchstickPuzzleGame = React.lazy(() => import("../components/games/adult/MatchstickPuzzleGame"));
const WhoTellsTruthGame = React.lazy(() => import("../components/games/adult/WhoTellsTruthGame"));
const MathPatternsGame = React.lazy(() => import("../components/games/adult/MathPatternsGame"));
const TowersOfHanoiGame = React.lazy(() => import("../components/games/adult/TowersOfHanoiGame"));
const PathFinderGame = React.lazy(() => import("../components/games/adult/PathFinderGame"));
const LightUpPuzzleGame = React.lazy(() => import("../components/games/adult/LightUpPuzzleGame"));
const NumberLogicGame = React.lazy(() => import("../components/games/adult/NumberLogicGame"));
// New Brain Training games
const StroopTestGame = React.lazy(() => import("../components/games/adult/StroopTestGame"));
const NBackGame = React.lazy(() => import("../components/games/adult/NBackGame"));
const MentalRotationGame = React.lazy(() => import("../components/games/adult/MentalRotationGame"));
const AttentionGridGame = React.lazy(() => import("../components/games/adult/AttentionGridGame"));
const ChunkingGame = React.lazy(() => import("../components/games/adult/ChunkingGame"));
const PatternSpeedGame = React.lazy(() => import("../components/games/adult/PatternSpeedGame"));
const DigitSpanGame = React.lazy(() => import("../components/games/adult/DigitSpanGame"));
const FocusFilterGame = React.lazy(() => import("../components/games/adult/FocusFilterGame"));
const ColorSequenceGame = React.lazy(() => import("../components/games/adult/ColorSequenceGame"));
const NumberBondsGame = React.lazy(() => import("../components/games/adult/NumberBondsGame"));
const WordMemoryGame = React.lazy(() => import("../components/games/adult/WordMemoryGame"));
const ReactionChainGame = React.lazy(() => import("../components/games/adult/ReactionChainGame"));
// New Fun games
const RiddlesGame = React.lazy(() => import("../components/games/adult/RiddlesGame"));
const AnagramGame = React.lazy(() => import("../components/games/adult/AnagramGame"));
const FlagQuizGame = React.lazy(() => import("../components/games/adult/FlagQuizGame"));
const CapitalCitiesGame = React.lazy(() => import("../components/games/adult/CapitalCitiesGame"));
const MovieQuizGame = React.lazy(() => import("../components/games/adult/MovieQuizGame"));
const SynonymAntonymGame = React.lazy(() => import("../components/games/adult/SynonymAntonymGame"));
const ProverbsGame = React.lazy(() => import("../components/games/adult/ProverbsGame"));
const SpotThePatternGame = React.lazy(() => import("../components/games/adult/SpotThePatternGame"));
const AcronymGame = React.lazy(() => import("../components/games/adult/AcronymGame"));
const ChainWordsGame = React.lazy(() => import("../components/games/adult/ChainWordsGame"));
const NumberCrossGame = React.lazy(() => import("../components/games/adult/NumberCrossGame"));
const PictogramGame = React.lazy(() => import("../components/games/adult/PictogramGame"));
// New Logic games
const NonogramGame = React.lazy(() => import("../components/games/adult/NonogramGame"));
const KenKenGame = React.lazy(() => import("../components/games/adult/KenKenGame"));
const MasterMindGame = React.lazy(() => import("../components/games/adult/MasterMindGame"));
const SyllogismGame = React.lazy(() => import("../components/games/adult/SyllogismGame"));
const BalanceScaleGame = React.lazy(() => import("../components/games/adult/BalanceScaleGame"));
const CryptarithmeticGame = React.lazy(() => import("../components/games/adult/CryptarithmeticGame"));
const SequencePuzzleGame = React.lazy(() => import("../components/games/adult/SequencePuzzleGame"));
const MineSweepGame = React.lazy(() => import("../components/games/adult/MineSweepGame"));
const SetPuzzleGame = React.lazy(() => import("../components/games/adult/SetPuzzleGame"));
const LogicGatesGame = React.lazy(() => import("../components/games/adult/LogicGatesGame"));
const GridDeductionGame = React.lazy(() => import("../components/games/adult/GridDeductionGame"));
const BinaryPuzzleGame = React.lazy(() => import("../components/games/adult/BinaryPuzzleGame"));

const GAME_COMPONENTS = {
  memoryCards: MemoryCardsGame,
  rememberSequence: RememberSequenceGame,
  simon: SimonGame,
  findDifference: FindDifferenceGame,
  quickReaction: QuickReactionGame,
  visualMemory: VisualMemoryGame,
  speedMath: SpeedMathGame,
  memoryPath: MemoryPathGame,
  matchSymbols: MatchSymbolsGame,
  missingItem: MissingItemGame,
  wordScramble: WordScrambleGame,
  emojiQuiz: EmojiQuizGame,
  triviaQuiz: TriviaQuizGame,
  guessImage: GuessImageGame,
  hangman: HangmanGame,
  fourPics: FourPicsOneWordGame,
  guessSound: GuessTheSoundGame,
  trueOrFalse: TrueOrFalseGame,
  dailyChallenge: DailyChallengeGame,
  wordSearch: WordSearchGame,
  sudoku: SudokuGame,
  logicGrid: LogicGridPuzzleGame,
  riverCrossing: RiverCrossingGame,
  matchstick: MatchstickPuzzleGame,
  whoTellsTruth: WhoTellsTruthGame,
  mathPatterns: MathPatternsGame,
  towersOfHanoi: TowersOfHanoiGame,
  pathFinder: PathFinderGame,
  lightUp: LightUpPuzzleGame,
  numberLogic: NumberLogicGame,
  // New Brain Training
  stroopTest: StroopTestGame,
  nBack: NBackGame,
  mentalRotation: MentalRotationGame,
  attentionGrid: AttentionGridGame,
  chunking: ChunkingGame,
  patternSpeed: PatternSpeedGame,
  digitSpan: DigitSpanGame,
  focusFilter: FocusFilterGame,
  colorSequence: ColorSequenceGame,
  numberBonds: NumberBondsGame,
  wordMemory: WordMemoryGame,
  reactionChain: ReactionChainGame,
  // New Fun
  riddles: RiddlesGame,
  anagram: AnagramGame,
  flagQuiz: FlagQuizGame,
  capitalCities: CapitalCitiesGame,
  movieQuiz: MovieQuizGame,
  synonymAntonym: SynonymAntonymGame,
  proverbs: ProverbsGame,
  spotThePattern: SpotThePatternGame,
  acronym: AcronymGame,
  chainWords: ChainWordsGame,
  numberCross: NumberCrossGame,
  pictogram: PictogramGame,
  // New Logic
  nonogram: NonogramGame,
  kenKen: KenKenGame,
  masterMind: MasterMindGame,
  syllogism: SyllogismGame,
  balanceScale: BalanceScaleGame,
  cryptarithmetic: CryptarithmeticGame,
  sequencePuzzle: SequencePuzzleGame,
  mineSweep: MineSweepGame,
  setPuzzle: SetPuzzleGame,
  logicGates: LogicGatesGame,
  gridDeduction: GridDeductionGame,
  binaryPuzzle: BinaryPuzzleGame,
};

const URL_TO_CATEGORY = {
  brain: "brainTraining",
  fun: "funGames",
  logic: "logicThinking",
};
const CATEGORY_TO_URL = {
  brainTraining: "brain",
  funGames: "fun",
  logicThinking: "logic",
};

const CATEGORY_CARDS = [
  { id: "brainTraining", title: { el: "Εξάσκηση Μυαλού", en: "Brain Training" }, icon: "🧠", gradient: "from-violet-500 to-purple-600", desc: { el: "Quiz γνώσεων, μνήμη, αντίδραση & συγκέντρωση", en: "Knowledge quizzes, memory, reaction & focus" } },
  { id: "funGames",      title: { el: "Διασκέδαση & Παιχνίδι", en: "Fun & Games" }, icon: "🎮", gradient: "from-amber-500 to-orange-600", desc: { el: "Λέξεις, γρίφοι, trivia και πολλά ακόμα", en: "Words, puzzles, trivia and more" } },
  { id: "logicThinking", title: { el: "Λογική Σκέψη", en: "Logic Thinking" }, icon: "🧩", gradient: "from-cyan-500 to-blue-600", desc: { el: "Sudoku, γρίφοι λογικής & στρατηγική", en: "Sudoku, logic puzzles & strategy" } },
  { id: "boardGames",    title: { el: "Επιτραπέζια Παιχνίδια", en: "Board Games" }, icon: "♟️", gradient: "from-emerald-500 to-teal-600", desc: { el: "Σκάκι, ντάμα, τάβλι και πολλά ακόμα", en: "Chess, checkers, backgammon and more" } },
];

const QUIZ_CATEGORIES = [
  { id: "LogicMath",    label: { el: "Λογική & Μαθηματικά", en: "Logic & Math" },           icon: "🔢" },
  { id: "NaturalWorld", label: { el: "Φυσικός Κόσμος", en: "Natural World" },                icon: "🌿" },
  { id: "Adventures",   label: { el: "Γεωγραφία & Ιστορία", en: "Geography & History" },     icon: "🧭" },
  { id: "BrainTeasers", label: { el: "Γρίφοι & Αινίγματα", en: "Puzzles & Riddles" },        icon: "🧩" },
  { id: "Edutainment",  label: { el: "Τεχνολογία & Πολιτισμός", en: "Tech & Culture" },      icon: "🎮" },
  { id: "History",      label: { el: "Ιστορία & Πολιτισμός", en: "History & Civilization" },  icon: "📚" },
  { id: "Language",     label: { el: "Γλώσσα & Λογοτεχνία", en: "Language & Literature" },   icon: "💬" },
  { id: "Space",        label: { el: "Επιστήμη & Διάστημα", en: "Science & Space" },          icon: "🚀" },
  { id: "Politics",     label: { el: "Κόσμος & Πολιτική", en: "World & Politics" },           icon: "🌍" },
  { id: "Health",       label: { el: "Υγεία & Ευεξία", en: "Health & Wellness" },             icon: "❤️" },
  { id: "Art",          label: { el: "Τέχνη & Μουσική", en: "Art & Music" },                  icon: "🎨" },
];

const ALL_GAMES = ADULT_GAME_CATEGORIES.flatMap(c => c.games);

function Sidebar({ activeCategory, activeGame, activeQuiz, onSelectGame, onSelectQuiz, lang, onBack, favorites, onToggleFav }) {
  const isEl = lang === "el";
  const cat = ADULT_GAME_CATEGORIES.find(c => c.id === activeCategory);
  if (!cat) return null;

  return (
    <aside className="hidden lg:block w-72 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-purple-50/50 dark:from-slate-900 dark:to-slate-900 overflow-y-auto h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-3">
        <button onClick={onBack}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all mb-2">
          ← {isEl ? "Όλες οι κατηγορίες" : "All categories"}
        </button>
        <h2 className={`px-3 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r ${cat.gradient} text-white shadow-md flex items-center gap-2`}>
          <span className="text-lg">{cat.icon}</span>
          {cat.title[isEl ? "el" : "en"]}
        </h2>
        <nav className="mt-3 space-y-0.5">
          {cat.hasQuiz && (
            <>
              <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                📝 Quiz {isEl ? "Γνώσεων" : "Categories"}
              </div>
              {QUIZ_CATEGORIES.map(q => {
                const quizGameId = `quiz_${q.id}`;
                return (
                  <button key={q.id} onClick={() => onSelectQuiz(q.id)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeQuiz === q.id ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                  >
                    <span>{q.icon}</span>
                    <span className="truncate flex-1">{q.label[isEl ? "el" : "en"]}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); onToggleFav(e, quizGameId); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); onToggleFav(e, quizGameId); } }}
                      className={`text-sm cursor-pointer hover:scale-125 transition-transform shrink-0 ${favorites.includes(quizGameId) ? "text-amber-400" : "text-slate-400 dark:text-slate-600 hover:text-amber-300"}`}
                      title={isEl ? "Αγαπημένο" : "Favorite"}
                    >
                      {favorites.includes(quizGameId) ? "★" : "☆"}
                    </span>
                  </button>
                );
              })}
              <div className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                🎮 {isEl ? "Παιχνίδια" : "Games"}
              </div>
            </>
          )}
          {cat.games.map(g => (
            <button key={g.id} onClick={() => onSelectGame(g.id)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeGame === g.id ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              <span>{g.icon}</span>
              <span className="truncate">{g.title[isEl ? "el" : "en"]}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default function AdultGamesPage() {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const { category: urlCategory } = useParams();
  const navigate = useNavigate();

  const hasCategoryInUrl = urlCategory && URL_TO_CATEGORY[urlCategory];
  const initialCat = hasCategoryInUrl ? URL_TO_CATEGORY[urlCategory] : null;
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [activeGame, setActiveGame] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const { isGameFree } = useSubscription();
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("geo:progress:favorites")) || []; } catch { return []; }
  });

  const handleToggleFavorite = (e, gameId) => {
    e.stopPropagation();
    const updated = ProgressService.toggleFavorite(gameId);
    setFavorites([...updated]);
  };

  useEffect(() => {
    if (urlCategory && URL_TO_CATEGORY[urlCategory]) {
      setActiveCategory(URL_TO_CATEGORY[urlCategory]);
    } else if (!urlCategory) {
      setActiveCategory(null);
    }
  }, [urlCategory]);

  const handleSelectCategory = (id) => {
    if (id === "boardGames") {
      navigate("/play/board-games");
      return;
    }
    setActiveCategory(id);
    setActiveGame(null);
    setActiveQuiz(null);
    const slug = CATEGORY_TO_URL[id];
    if (slug) navigate(`/play/adult-games/${slug}`, { replace: true });
  };

  const handleSelectQuiz = (quizId) => {
    setActiveGame(null);
    setActiveQuiz(quizId);
  };

  const handleSelectGame = (gameId) => {
    setActiveQuiz(null);
    setActiveGame(gameId);
  };

  const GameComponent = activeGame ? GAME_COMPONENTS[activeGame] : null;
  const currentGameMeta = activeGame ? ALL_GAMES.find(g => g.id === activeGame) : null;
  const currentCat = activeCategory ? ADULT_GAME_CATEGORIES.find(c => c.id === activeCategory) : null;
  const currentQuizMeta = activeQuiz ? QUIZ_CATEGORIES.find(q => q.id === activeQuiz) : null;

  if (!activeCategory) {
    return (
      <div id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <SEO title={isEl ? "Παιχνίδια Ενηλίκων" : "Adult Games"} />
        <Navbar />
        <div className="pt-16" />
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-center mb-3">
            {isEl ? "Παιχνίδια Ενηλίκων" : "Adult Games"}
          </h1>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-10 text-sm md:text-base">
            {isEl ? "Επίλεξε κατηγορία για να ξεκινήσεις" : "Choose a category to get started"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CATEGORY_CARDS.map(card => (
              <button key={card.id} onClick={() => handleSelectCategory(card.id)}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-1 transition-all text-left overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-2xl text-white shadow-md shrink-0`}>
                    {card.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {card.title[isEl ? "el" : "en"]}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {card.desc[isEl ? "el" : "en"]}
                    </p>
                  </div>
                  <span className="text-slate-300 dark:text-slate-600 group-hover:text-purple-500 transition-colors text-xl mt-1">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <SEO title={isEl ? "Παιχνίδια Ενηλίκων" : "Adult Games"} />
      <Navbar />

      <div className="pt-16" />

      {/* Mobile category tabs */}
      <div className="lg:hidden px-3 pb-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 sticky top-16 z-40">
        <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
          {CATEGORY_CARDS.map(card => (
            <button
              key={card.id}
              onClick={() => handleSelectCategory(card.id)}
              className={[
                "flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0",
                activeCategory === card.id
                  ? `bg-gradient-to-r ${card.gradient} text-white shadow-md`
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              ].join(" ")}
            >
              <span>{card.icon}</span>
              {card.title[isEl ? "el" : "en"]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex">
        <Sidebar
          activeCategory={activeCategory}
          activeGame={activeGame}
          activeQuiz={activeQuiz}
          onSelectGame={handleSelectGame}
          onSelectQuiz={handleSelectQuiz}
          onBack={() => navigate("/play/adult-games")}
          lang={lang}
          favorites={favorites}
          onToggleFav={handleToggleFavorite}
        />

        <main className="flex-1 p-4 lg:p-6 min-h-[calc(100vh-4rem)]">
          {/* Playing a specific game */}
          {activeGame && GameComponent ? (
            <div>
              <Breadcrumb items={[
                { label: isEl ? "Παιχνίδια" : "Adult Games", icon: "🧠", onClick: () => navigate("/play/adult-games") },
                { label: currentCat?.title[isEl ? "el" : "en"], icon: currentCat?.icon, onClick: () => setActiveGame(null) },
                { label: currentGameMeta?.title[isEl ? "el" : "en"], icon: currentGameMeta?.icon },
              ]} />
              <button onClick={() => setActiveGame(null)}
                className="mb-4 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-lg transition-all min-h-[44px]">
                <span className="text-xl">←</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {isEl ? "Πίσω" : "Back"}
                </span>
              </button>
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    {currentGameMeta?.icon} {currentGameMeta?.title[isEl ? "el" : "en"]}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{currentGameMeta?.desc[isEl ? "el" : "en"]}</p>
                </div>
                <Suspense fallback={<GameSkeleton />}>
                  <div className="p-4">
                    <GameComponent lang={lang} />
                  </div>
                </Suspense>
              </div>
            </div>
          ) : activeQuiz ? (
            <div>
              <Breadcrumb items={[
                { label: isEl ? "Παιχνίδια" : "Adult Games", icon: "🧠", onClick: () => navigate("/play/adult-games") },
                { label: currentCat?.title[isEl ? "el" : "en"], icon: currentCat?.icon, onClick: () => setActiveQuiz(null) },
                { label: currentQuizMeta?.label[isEl ? "el" : "en"], icon: currentQuizMeta?.icon },
              ]} />
              <button onClick={() => setActiveQuiz(null)}
                className="mb-4 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-md hover:shadow-lg transition-all min-h-[44px]">
                <span className="text-xl">←</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {isEl ? "Πίσω" : "Back"}
                </span>
              </button>
              <div className="max-w-3xl">
                <CategoryQuiz category={activeQuiz} lang={lang} />
              </div>
            </div>
          ) : (
            /* Category overview - games + quiz cards */
            <div>
              <div className="mb-6">
                <Breadcrumb items={[
                  { label: isEl ? "Παιχνίδια" : "Adult Games", icon: "🧠", onClick: () => navigate("/play/adult-games") },
                  { label: currentCat?.title[isEl ? "el" : "en"], icon: currentCat?.icon },
                ]} />
                <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  {currentCat?.icon} {currentCat?.title[isEl ? "el" : "en"]}
                </h1>
                {currentCat?.desc && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {currentCat.desc[isEl ? "el" : "en"]}
                  </p>
                )}
              </div>

              {/* Quiz categories grid (only for brainTraining) */}
              {currentCat?.hasQuiz && (
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                    📝 Quiz {isEl ? "Γνώσεων" : "Categories"}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {QUIZ_CATEGORIES.map(q => {
                      const quizGameId = `quiz_${q.id}`;
                      return (
                        <button key={q.id} onClick={() => handleSelectQuiz(q.id)}
                          className="relative bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all text-left group overflow-hidden">
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => handleToggleFavorite(e, quizGameId)}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleToggleFavorite(e, quizGameId); } }}
                            className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white dark:bg-slate-700 shadow-md flex items-center justify-center hover:scale-110 transition-all cursor-pointer border border-slate-200 dark:border-slate-600"
                            title={isEl ? "Αγαπημένο" : "Favorite"}
                          >
                            <span className={`text-sm ${favorites.includes(quizGameId) ? "text-amber-400" : "text-slate-400 dark:text-slate-500"}`}>
                              {favorites.includes(quizGameId) ? "★" : "☆"}
                            </span>
                          </div>
                          <span className="text-2xl block mb-1.5">{q.icon}</span>
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {q.label[isEl ? "el" : "en"]}
                          </h3>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mini-games grid */}
              {currentCat?.games.length > 0 && (
                <div>
                  {currentCat?.hasQuiz && (
                    <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                      🎮 {isEl ? "Παιχνίδια" : "Games"}
                    </h2>
                  )}
                  {currentCat?.subgroups ? (
                    currentCat.subgroups.map(sg => {
                      const sgGames = sg.ids.map(id => currentCat.games.find(g => g.id === id)).filter(Boolean);
                      return (
                        <div key={sg.ids.join()} className="mb-6">
                          <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-2 pl-1">
                            {sg.label[isEl ? "el" : "en"]}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sgGames.map(game => {
                              const idx = currentCat.games.indexOf(game);
                              const locked = !isGameFree(idx);
                              return (
                                <button key={game.id} onClick={() => locked ? setShowPaywall(true) : handleSelectGame(game.id)}
                                  className="relative bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all text-left group overflow-hidden">
                                  {locked && <LockedGameOverlay lang={lang} onClick={() => setShowPaywall(true)} />}
                                  {!locked && (
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
                                  )}
                                  <div className="flex items-start justify-between mb-2">
                                    <span className="text-3xl">{game.icon}</span>
                                    {!locked && ProgressService.getDifficulty(game.id) > 1 && (
                                      <DifficultyBadge level={ProgressService.getDifficulty(game.id)} lang={lang} />
                                    )}
                                  </div>
                                  <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                    {game.title[isEl ? "el" : "en"]}
                                  </h3>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{game.desc[isEl ? "el" : "en"]}</p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentCat?.games.map((game, idx) => {
                        const locked = !isGameFree(idx);
                        return (
                          <button key={game.id} onClick={() => locked ? setShowPaywall(true) : handleSelectGame(game.id)}
                            className="relative bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all text-left group overflow-hidden">
                            {locked && <LockedGameOverlay lang={lang} onClick={() => setShowPaywall(true)} />}
                            {!locked && (
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
                            )}
                            <div className="flex items-start justify-between mb-2">
                              <span className="text-3xl">{game.icon}</span>
                              {!locked && ProgressService.getDifficulty(game.id) > 1 && (
                                <DifficultyBadge level={ProgressService.getDifficulty(game.id)} lang={lang} />
                              )}
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {game.title[isEl ? "el" : "en"]}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{game.desc[isEl ? "el" : "en"]}</p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {showPaywall && (
        <PaywallModal lang={lang} onClose={() => setShowPaywall(false)} />
      )}
    </div>
  );
}
