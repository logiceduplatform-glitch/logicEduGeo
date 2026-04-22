import React, { useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DefaultCategoryMenu from "../components/Sidebar/CategoryMenu";
import CategoryMenu_11_12 from "../components/Sidebar/CategoryMenu_11_12";
import CategoryQuiz from "../components/quiz/CategoryQuiz";
import RightPanel from "../components/quiz/RightPanel";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { useProgress } from "../contexts/ProgressContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import PaywallModal from "../components/PaywallModal";

function categoryEmojiIcon(emoji) {
  return function CategoryEmojiIcon({ className }) {
    return (
      <span
        className={["inline-flex items-center justify-center leading-none", className].filter(Boolean).join(" ")}
        role="img"
        aria-hidden
      >
        {emoji}
      </span>
    );
  };
}

const ALL_CATEGORY_ITEMS = [
  { id: "LogicMath",    icon: categoryEmojiIcon("🔢"), gradient: "from-cyan-500 to-blue-500",     label: { el: "Λογική",     en: "Logic" },     desc: { el: "Μαθηματικά & Λογική",      en: "Math & Logic" } },
  { id: "NaturalWorld", icon: categoryEmojiIcon("🌿"), gradient: "from-emerald-500 to-teal-500",  label: { el: "Φύση",       en: "Nature" },     desc: { el: "Φυσικός Κόσμος",           en: "Natural World" } },
  { id: "Adventures",   icon: categoryEmojiIcon("🧭"), gradient: "from-indigo-500 to-violet-500", label: { el: "Περιπέτεια", en: "Adventure" },  desc: { el: "Γεωγραφία & Ιστορία",      en: "Geography & History" } },
  { id: "BrainTeasers", icon: categoryEmojiIcon("🧠"), gradient: "from-rose-500 to-pink-500",     label: { el: "Γρίφοι",    en: "Puzzles" },    desc: { el: "Γρίφοι & Αινίγματα",       en: "Puzzles & Riddles" } },
  { id: "Edutainment",  icon: categoryEmojiIcon("🎮"), gradient: "from-amber-500 to-orange-500",  label: { el: "Ψυχαγωγία", en: "Fun" },        desc: { el: "Τεχνολογία & Πολιτισμός",  en: "Tech & Culture" } },
  { id: "History",      icon: categoryEmojiIcon("📖"), gradient: "from-stone-500 to-amber-600",   label: { el: "Ιστορία",   en: "History" },    desc: { el: "Ιστορία & Πολιτισμός",     en: "History & Civilization" } },
  { id: "Language",     icon: categoryEmojiIcon("💬"), gradient: "from-sky-500 to-blue-500",      label: { el: "Γλώσσα",    en: "Language" },   desc: { el: "Γλώσσα & Λογοτεχνία",     en: "Language & Literature" } },
  { id: "Space",        icon: categoryEmojiIcon("🚀"), gradient: "from-violet-500 to-purple-600", label: { el: "Διάστημα",  en: "Space" },      desc: { el: "Επιστήμη & Διάστημα",      en: "Science & Space" } },
  { id: "Politics",     icon: categoryEmojiIcon("🌍"), gradient: "from-blue-600 to-indigo-600",   label: { el: "Πολιτική",  en: "Politics" },   desc: { el: "Κόσμος & Πολιτική",        en: "World & Politics" } },
  { id: "Health",       icon: categoryEmojiIcon("❤️"), gradient: "from-red-500 to-rose-500",      label: { el: "Υγεία",     en: "Health" },     desc: { el: "Υγεία & Ευεξία",           en: "Health & Wellness" } },
  { id: "Art",          icon: categoryEmojiIcon("🎵"), gradient: "from-fuchsia-500 to-pink-500",  label: { el: "Τέχνη",     en: "Art" },        desc: { el: "Τέχνη & Μουσική",          en: "Art & Music" } },
];

const MODE_CATEGORY_IDS = {
  school: ["Language", "History", "NaturalWorld", "Space", "Health"],
  fun:    ["Adventures", "Edutainment", "Art", "Politics"],
  logic:  ["LogicMath", "BrainTeasers"],
};

const MODE_TITLES = {
  school: { el: "🏫 Ηλικία 11-12: Σχολείο", en: "🏫 Age 11-12: School" },
  fun:    { el: "🎮 Ηλικία 11-12: Διασκέδαση", en: "🎮 Age 11-12: Fun" },
  logic:  { el: "🧩 Ηλικία 11-12: Λογική Σκέψη", en: "🧩 Age 11-12: Logic" },
};

const MODE_SIDEBAR_TITLES = {
  school: { el: "🏫 Σχολείο", en: "🏫 School" },
  fun:    { el: "🎮 Διασκέδαση", en: "🎮 Fun" },
  logic:  { el: "🧩 Λογική", en: "🧩 Logic" },
};

export default function QuizPage({ menuVariant = "default", mode }) {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const navigate = useNavigate();
  const progress = useProgress();
  const { isGameFree } = useSubscription();
  const [showPaywall, setShowPaywall] = useState(false);

  const filteredCategories = useMemo(() => {
    if (mode && MODE_CATEGORY_IDS[mode]) {
      return ALL_CATEGORY_ITEMS.filter(c => MODE_CATEGORY_IDS[mode].includes(c.id));
    }
    return ALL_CATEGORY_ITEMS;
  }, [mode]);

  const [active, setActive] = useState(filteredCategories[0]?.id || "LogicMath");
  const [pendingCategory, setPendingCategory] = useState(null);

  const streak = progress.getStreak();
  const overall = progress.getOverallStats();

  const activeLabel = filteredCategories.find((c) => c.id === active)?.label[isEl ? "el" : "en"] || active;

  const is1112 = menuVariant === "11-12";
  const showBoardGames = menuVariant === "default" && !mode;

  const pageTitle = mode && MODE_TITLES[mode]
    ? MODE_TITLES[mode][isEl ? "el" : "en"]
    : `🧠 ${activeLabel}`;

  const handleCategoryChange = (id) => {
    if (id === active) return;
    const inProg = progress.getInProgressGame();
    if (inProg && inProg.categoryId === active && inProg.index > 0) {
      setPendingCategory(id);
    } else {
      setActive(id);
    }
  };

  const confirmSwitch = () => {
    setActive(pendingCategory);
    setPendingCategory(null);
  };

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <SEO title={pageTitle} />
      <Navbar />

      {/* Mobile category tabs */}
      <div className="lg:hidden pt-16 px-3 pb-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 sticky top-16 z-40">
        <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
          {filteredCategories.map(({ id, icon: Icon, gradient, label }, idx) => {
            const isActive = active === id;
            const locked = !isGameFree(idx);
            return (
              <button
                key={id}
                onClick={() => locked ? setShowPaywall(true) : handleCategoryChange(id)}
                className={[
                  "flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0",
                  locked
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
                    : isActive
                      ? `bg-gradient-to-r ${gradient} text-white shadow-md`
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                ].join(" ")}
              >
                {locked ? <span className="text-xs">🔒</span> : <Icon className="w-4 h-4 text-base" />}
                {label[isEl ? "el" : "en"]}
              </button>
            );
          })}
          {showBoardGames && (
            <>
              <button
                onClick={() => navigate("/play/board-games")}
                className="flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md"
              >
                <span>♟️</span>
                {isEl ? "Επιτραπέζια" : "Board Games"}
              </button>
              <button
                onClick={() => navigate("/play/adult-games")}
                className="flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
              >
                <span>🧠</span>
                {isEl ? "Παιχνίδια" : "Games"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="pt-16 hidden lg:block" />

      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_18rem]">
        {/* Sidebar -- desktop only */}
        {is1112 || mode ? (
          <CategoryMenu_11_12
            active={active}
            onSelect={handleCategoryChange}
            items={filteredCategories}
            sidebarTitle={mode ? MODE_SIDEBAR_TITLES[mode]?.[lang] || MODE_SIDEBAR_TITLES[mode]?.en : undefined}
            onLockedClick={() => setShowPaywall(true)}
          />
        ) : (
          <DefaultCategoryMenu active={active} onSelect={handleCategoryChange} onLockedClick={() => setShowPaywall(true)} />
        )}

        {/* Main content */}
        <main className="p-4 lg:p-6">
          <div className="mb-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-2xl p-4 shadow-lg">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {pageTitle}
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {overall.totalGamesPlayed} {isEl ? "quiz" : "quizzes"} • {overall.totalCorrect} {isEl ? "σωστά" : "correct"}
              </span>
              <span className="inline-flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
                🔥 {streak.current} {isEl ? "ημέρες" : "days"}
              </span>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <CategoryQuiz category={active} lang={lang} />
          </div>
        </main>

        <RightPanel onResume={(catId) => { if (catId) setActive(catId); }} />
      </div>

      {showPaywall && (
        <PaywallModal lang={lang} onClose={() => setShowPaywall(false)} />
      )}

      {/* Category switch confirmation modal */}
      {pendingCategory && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={isEl ? "Αλλαγή κατηγορίας" : "Switch category"}
          onKeyDown={(e) => { if (e.key === "Escape") setPendingCategory(null); }}
        >
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl text-center max-w-md animate-fadeIn">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
              {isEl ? "Αλλαγή κατηγορίας;" : "Switch category?"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              {isEl
                ? "Έχεις ένα quiz σε εξέλιξη. Αν αλλάξεις κατηγορία, η πρόοδός σου θα χαθεί."
                : "You have a quiz in progress. Switching will lose your current progress."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setPendingCategory(null)}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-lg font-semibold rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                {isEl ? "Μείνε" : "Stay"}
              </button>
              <button
                onClick={confirmSwitch}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold rounded-full hover:scale-105 transition-transform shadow-lg"
              >
                {isEl ? "Άλλαξε" : "Switch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
