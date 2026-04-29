import React, { useContext, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { ProgressService } from "../services/ProgressService";
import { ProfileService } from "../services/ProfileService";
import { StorageService } from "../services/StorageService";
import StatCard from "../components/dashboard/StatCard";
import CategoryChart from "../components/dashboard/CategoryChart";
import ActivityCalendar from "../components/dashboard/ActivityCalendar";
import RecentGamesTable from "../components/dashboard/RecentGamesTable";
import BadgeCollection from "../components/rewards/BadgeCollection";
import Certificate from "../components/rewards/Certificate";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TimeLimitService } from "../services/TimeLimitService";
import WeeklyDigestPanel from "../components/parent/WeeklyDigestPanel";
import ParentTeacherMessages from "../components/parent/ParentTeacherMessages";
import MilestonesFeed from "../components/parent/MilestonesFeed";
import MultiChildCompare from "../components/parent/MultiChildCompare";
import HomeworkHelper from "../components/parent/HomeworkHelper";
import { Link } from "react-router-dom";

async function hashPin(pin) {
  const encoded = new TextEncoder().encode(pin + "edu-salt-2026");
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function readScopedData(profileId) {
  const savedScope = StorageService.getScope();
  StorageService.setScope(profileId || null);
  try {
    const overall = ProgressService.getOverallStats();
    const streak = ProgressService.getStreak();
    const dailyStats = ProgressService.getDailyStatsRange(30);
    const unlockedAchievements = ProgressService.getUnlockedAchievements();
    const allGameProgress = ProgressService.getAllGameProgress();
    const favorites = ProgressService.getFavorites();
    const recentGames = [];
    for (const [key, data] of Object.entries(allGameProgress)) {
      const gameId = key.replace("progress:game:", "");
      if (data?.history) {
        data.history.forEach((h) => {
          recentGames.push({ ...h, gameId, title: h.title || gameId });
        });
      }
    }
    recentGames.sort((a, b) => new Date(b.date) - new Date(a.date));
    return { overall, streak, dailyStats, unlockedAchievements, allGameProgress, recentGames, favorites };
  } finally {
    if (savedScope) {
      const id = savedScope.replace("profile:", "").replace(/:$/, "");
      StorageService.setScope(id);
    } else {
      StorageService.setScope(null);
    }
  }
}

export default function ParentDashboard() {
  const { lang } = useContext(LanguageContext);
  const { user, guest } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pinVerified, setPinVerified] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [view, setView] = useState("child"); // child | digest | messages | milestones | compare | homework | family
  const isEl = lang === "el";

  const storedPin = localStorage.getItem("geo:parentPin");
  const children = useMemo(() => ProfileService.getAll(), []);

  if (storedPin && !pinVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-slate-900 flex items-center justify-center">
        <SEO title={isEl ? "Πίνακας Γονέα" : "Parent Dashboard"} />
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            {isEl ? "Εισάγετε PIN Γονέα" : "Enter Parent PIN"}
          </h2>
          <input
            type="password"
            maxLength={4}
            value={pinInput}
            onChange={(e) => { setPinInput(e.target.value.replace(/\D/g, "")); setPinError(false); }}
            onKeyDown={(e) => e.key === "Enter" && pinInput.length === 4 && (async () => {
              const hashed = await hashPin(pinInput);
              if (hashed === storedPin) setPinVerified(true);
              else { setPinError(true); setPinInput(""); }
            })()}
            className={`w-32 text-center text-2xl tracking-[0.5em] border-2 rounded-xl py-3 mb-4 focus:outline-none ${
              pinError ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-slate-200 dark:border-slate-600 focus:border-purple-400"
            } dark:bg-slate-700 dark:text-white`}
            placeholder="····"
            autoFocus
          />
          {pinError && <p className="text-xs text-red-500 mb-2">{isEl ? "Λάθος PIN" : "Wrong PIN"}</p>}
          <div className="flex gap-3 justify-center">
            <button
              onClick={async () => {
                const hashed = await hashPin(pinInput);
                if (hashed === storedPin) setPinVerified(true);
                else { setPinError(true); setPinInput(""); }
              }}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold active:scale-95"
            >
              {isEl ? "Είσοδος" : "Enter"}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full font-semibold"
            >
              {isEl ? "Πίσω" : "Back"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <SEO title={isEl ? "Γονικός Πίνακας Ελέγχου" : "Parent Dashboard"} />
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              ← {isEl ? "Πίσω" : "Back"}
            </button>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              📊 {isEl ? "Γονικός Πίνακας Ελέγχου" : "Parent Dashboard"}
            </h1>
          </div>
          <button
            onClick={async () => {
              const { exportToPDF } = await import("../utils/pdfExport");
              await exportToPDF("parent-dashboard-content", `parent-dashboard-${new Date().toISOString().slice(0, 10)}.pdf`);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors print:hidden active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </button>
        </div>
      </header>

      <div id="parent-dashboard-content" className="max-w-6xl mx-auto px-4 py-6">
        {children.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">👶</span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              {isEl ? "Δεν υπάρχουν παιδικά προφίλ" : "No child profiles yet"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {isEl
                ? "Δημιούργησε ένα παιδικό προφίλ από τις ρυθμίσεις για να παρακολουθείς την πρόοδό του."
                : "Create a child profile from settings to track their progress."}
            </p>
            <button
              onClick={() => navigate("/profile")}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-all active:scale-95"
            >
              {isEl ? "Πήγαινε στις Ρυθμίσεις" : "Go to Settings"}
            </button>
          </div>
        ) : (
          <>
            {/* Top-level View Tabs */}
            <div className="mb-6 flex flex-wrap gap-2 overflow-x-auto">
              {[
                { id: "child",      icon: "👤", label: isEl ? "Παιδί"            : "Child" },
                { id: "compare",    icon: "📊", label: isEl ? "Σύγκριση"        : "Compare" },
                { id: "milestones", icon: "🏆", label: isEl ? "Ορόσημα"         : "Milestones" },
                { id: "homework",   icon: "📋", label: isEl ? "Εργασίες"        : "Homework" },
                { id: "messages",   icon: "💬", label: isEl ? "Μηνύματα"        : "Messages" },
                { id: "digest",     icon: "📧", label: isEl ? "Εβδ. Αναφορά"   : "Weekly" },
                { id: "family",     icon: "👨‍👩‍👧", label: isEl ? "Οικ. Πρόκληση" : "Family Quiz" },
              ].map(v => (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${view === v.id ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"}`}
                >
                  <span>{v.icon}</span> {v.label}
                </button>
              ))}
            </div>

            {/* Family-level views */}
            {view === "compare" && <MultiChildCompare />}
            {view === "milestones" && <MilestonesFeed />}
            {view === "homework" && <HomeworkHelper children={children} />}
            {view === "messages" && <ParentTeacherMessages children={children} />}
            {view === "digest" && <WeeklyDigestPanel />}
            {view === "family" && (
              <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-fuchsia-100 dark:from-pink-900/30 dark:via-purple-900/30 dark:to-fuchsia-900/30 rounded-2xl p-8 text-center border border-pink-200 dark:border-pink-800">
                <span className="text-5xl block mb-3">👨‍👩‍👧</span>
                <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">{isEl ? "Οικογενειακή Πρόκληση" : "Family Challenge"}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
                  {isEl ? "Παίξε ένα fun quiz μαζί με το παιδί σου - ποιος θα κερδίσει;" : "Play a fun quiz together with your child - who wins?"}
                </p>
                <Link
                  to="/family-challenge"
                  className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-fuchsia-500 text-white font-extrabold shadow-md hover:shadow-xl transition"
                >
                  🚀 {isEl ? "Ξεκίνα" : "Start"}
                </Link>
              </div>
            )}

            {view !== "child" ? null : (
            <>
            {/* Child Selector */}
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                {isEl ? "Επιλέξτε παιδί" : "Select child"}
              </p>
              <div className="flex flex-wrap gap-3">
                {children.map((child) => {
                  const isSelected = selectedChildId === child.id;
                  return (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChildId(child.id)}
                      className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? "border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/30 shadow-lg shadow-purple-200/40 dark:shadow-purple-900/30 scale-[1.02]"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md"
                      }`}
                    >
                      <span className="text-2xl">{child.avatar || "👤"}</span>
                      <div className="text-left">
                        <p className={`text-sm font-bold ${isSelected ? "text-purple-700 dark:text-purple-300" : "text-slate-700 dark:text-slate-200"}`}>
                          {child.name}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">
                          {child.age?.replace("Age ", "")} {child.objective ? `· ${child.objective}` : ""}
                        </p>
                      </div>
                      {isSelected && <span className="text-purple-500 dark:text-purple-400 ml-1">●</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedChildId ? (
              <ChildDashboardContent
                childId={selectedChildId}
                child={children.find((c) => c.id === selectedChildId)}
                lang={lang}
                isEl={isEl}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
                <span className="text-5xl block mb-3">👆</span>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  {isEl ? "Επιλέξτε ένα παιδί για να δείτε την πρόοδό του" : "Select a child to view their progress"}
                </p>
              </div>
            )}
            </>
            )}
          </>
        )}

        {/* Settings tab always available */}
        <div className="mt-8">
          <DashboardSettings lang={lang} isEl={isEl} />
        </div>
      </div>
    </div>
  );
}

function ChildDashboardContent({ childId, child, lang, isEl, activeTab, setActiveTab }) {
  const data = useMemo(() => readScopedData(childId), [childId]);

  const { overall, streak, dailyStats, unlockedAchievements, allGameProgress, recentGames } = data;

  const accuracy = overall.totalAttempts > 0
    ? Math.round((overall.totalCorrect / overall.totalAttempts) * 100)
    : 0;

  const totalMinutes = dailyStats.reduce((sum, d) => sum + (d.minutesPlayed || 0), 0);
  const last20Games = recentGames.slice(0, 20);

  const difficultyData = recentGames
    .slice()
    .reverse()
    .slice(-20)
    .map((g, i) => ({
      index: i + 1,
      difficulty: g.difficulty || 1,
      score: g.total > 0 ? Math.round((g.score / g.total) * 100) : 0,
    }));

  const chartData = dailyStats.slice(-7).map((d) => ({
    name: d.date.slice(5),
    correct: d.totalCorrect,
    games: d.gamesPlayed,
  }));

  const getRecommendation = useCallback(() => {
    if (overall.totalGamesPlayed === 0) {
      return isEl ? `${child?.name || "Το παιδί"} δεν έχει παίξει ακόμα!` : `${child?.name || "The child"} hasn't played yet!`;
    }
    if (accuracy >= 80) {
      return isEl ? "Εξαιρετική επίδοση! Δοκιμάστε πιο δύσκολα παιχνίδια." : "Excellent performance! Try harder games.";
    }
    if (streak.current >= 3) {
      return isEl ? "Υπέροχη συνέπεια! Συνεχίστε το σερί!" : "Great consistency! Keep the streak going!";
    }
    return isEl ? "Παίξτε τακτικά για καλύτερα αποτελέσματα!" : "Play regularly for better results!";
  }, [overall, accuracy, streak, child, isEl]);

  const tabs = [
    { id: "overview", label: isEl ? "Επισκόπηση" : "Overview", icon: "📊" },
    { id: "badges", label: isEl ? "Βραβεία" : "Badges", icon: "🏆" },
    { id: "games", label: isEl ? "Παιχνίδια" : "Games", icon: "🎮" },
    { id: "certificate", label: isEl ? "Πιστοποιητικό" : "Certificate", icon: "📜" },
  ];

  return (
    <div>
      {/* Child header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 rounded-2xl p-5 text-white mb-6 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/5 rounded-full" />
        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl border-2 border-white/30 shrink-0">
          {child?.avatar || "👤"}
        </div>
        <div>
          <h2 className="text-lg font-bold">{child?.name}</h2>
          <div className="flex items-center gap-2 text-sm text-purple-200">
            {child?.age && <span>{child.age.replace("Age ", "")}</span>}
            {child?.objective && <><span>·</span><span className="capitalize">{child.objective}</span></>}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3 text-right">
          <div>
            <p className="text-2xl font-bold">{overall.totalGamesPlayed}</p>
            <p className="text-[10px] text-purple-200 uppercase tracking-wider">{isEl ? "Παιχνίδια" : "Games"}</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{accuracy}%</p>
            <p className="text-[10px] text-purple-200 uppercase tracking-wider">{isEl ? "Ακρίβεια" : "Accuracy"}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm overflow-x-auto mb-6 border border-slate-100 dark:border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="🎮" label={isEl ? "Παιχνίδια" : "Games Played"} value={overall.totalGamesPlayed} gradient="from-purple-500 to-indigo-500" />
            <StatCard icon="⏱️" label={isEl ? "Χρόνος" : "Play Time"} value={`${totalMinutes}m`} gradient="from-blue-500 to-cyan-500" />
            <StatCard icon="🎯" label={isEl ? "Ακρίβεια" : "Accuracy"} value={`${accuracy}%`} gradient="from-emerald-500 to-teal-500" />
            <StatCard icon="🔥" label={isEl ? "Σερί" : "Streak"} value={`${streak.current} ${isEl ? "μέρες" : "days"}`} sublabel={`${isEl ? "Καλύτερο" : "Best"}: ${streak.best}`} gradient="from-orange-500 to-red-500" />
          </div>

          {/* Recommendation */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-5 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-1">{isEl ? "Σύσταση" : "Recommendation"}</h3>
                <p className="text-purple-700 dark:text-purple-400 text-sm">{getRecommendation()}</p>
              </div>
            </div>
          </div>

          {/* Weekly chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{isEl ? "Εβδομαδιαία Δραστηριότητα" : "Weekly Activity"}</h3>
            <CategoryChart data={chartData} lang={lang} />
          </div>

          {/* Activity Calendar */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{isEl ? "Ημερολόγιο (30 ημέρες)" : "Calendar (30 days)"}</h3>
            <ActivityCalendar dailyStats={dailyStats} lang={lang} />
          </div>

          {/* Difficulty progression */}
          {difficultyData.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{isEl ? "Εξέλιξη Δυσκολίας" : "Difficulty Progression"}</h3>
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={difficultyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="index" tick={{ fontSize: 12, fill: "#64748b" }} />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 12, fill: "#64748b" }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }} />
                    <Line type="monotone" dataKey="difficulty" name={isEl ? "Επίπεδο" : "Level"} stroke="#a855f7" strokeWidth={2} dot={{ fill: "#a855f7", r: 4 }} />
                    <Line type="monotone" dataKey="score" name={isEl ? "Σκορ %" : "Score %"} stroke="#ec4899" strokeWidth={2} dot={{ fill: "#ec4899", r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Quick list of recent games */}
          {last20Games.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{isEl ? "Τελευταία Παιχνίδια" : "Latest Games"}</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {last20Games.slice(0, 10).map((game, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{game.title || game.gameId}</p>
                      {game.date && <p className="text-[10px] text-slate-400 dark:text-slate-500">{new Date(game.date).toLocaleDateString(isEl ? "el-GR" : "en-US")}</p>}
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className={`text-sm font-bold ${game.score === game.total ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-300"}`}>
                        {game.score}/{game.total}
                      </span>
                      <p className="text-[10px] text-slate-400">{game.total > 0 ? Math.round((game.score / game.total) * 100) : 0}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Badges */}
      {activeTab === "badges" && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
            {isEl ? "Συλλογή Βραβείων" : "Badge Collection"} ({unlockedAchievements.length})
          </h3>
          <BadgeCollection unlockedIds={unlockedAchievements} lang={lang} />
        </div>
      )}

      {/* Games */}
      {activeTab === "games" && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{isEl ? "Πρόσφατα Παιχνίδια" : "Recent Games"}</h3>
          <RecentGamesTable games={last20Games} lang={lang} />
        </div>
      )}

      {/* Certificate */}
      {activeTab === "certificate" && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 text-center border border-slate-100 dark:border-slate-700">
          <div className="text-6xl mb-4">📜</div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{isEl ? "Πιστοποιητικό Επιτυχίας" : "Certificate of Achievement"}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            {isEl ? `Εκτυπώστε πιστοποιητικό για ${child?.name}` : `Print certificate for ${child?.name}`}
          </p>
          <Certificate childName={child?.name || ""} score={overall.totalCorrect} total={overall.totalAttempts} lang={lang} />
        </div>
      )}
    </div>
  );
}

function TimeLimitCard({ child, isEl }) {
  const [limit, setLimit] = useState(() => TimeLimitService.getChildLimit(child.id));
  const [saved, setSaved] = useState(false);
  const usage = TimeLimitService.getTodayUsage(child.id);
  const history = TimeLimitService.getUsageHistory(child.id, 7);

  const handleToggle = () => {
    const updated = { ...limit, enabled: !limit.enabled };
    setLimit(updated);
    TimeLimitService.setLimit(child.id, updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleMinutesChange = (val) => {
    const mins = Math.max(10, Math.min(180, val));
    const updated = { ...limit, dailyMinutes: mins };
    setLimit(updated);
    TimeLimitService.setLimit(child.id, updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const presets = [15, 30, 45, 60, 90, 120];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-5 border border-slate-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{child.avatar || "👦"}</span>
          <span className="font-semibold text-slate-800 dark:text-white text-sm">{child.name}</span>
        </div>
        <button
          onClick={handleToggle}
          className={`relative w-12 h-7 rounded-full transition-colors ${limit.enabled ? "bg-purple-500" : "bg-slate-300 dark:bg-slate-600"}`}
          aria-label={isEl ? "Χρονικό όριο" : "Time limit"}
        >
          <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${limit.enabled ? "translate-x-5" : ""}`} />
        </button>
      </div>

      {limit.enabled && (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              {isEl ? "Ημερήσιο όριο" : "Daily limit"}
            </p>
            <div className="flex flex-wrap gap-2">
              {presets.map(m => (
                <button
                  key={m}
                  onClick={() => handleMinutesChange(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    limit.dailyMinutes === m
                      ? "bg-purple-500 text-white shadow-md"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                  }`}
                >
                  {m} {isEl ? "λ." : "min"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">
              {isEl ? "Σήμερα:" : "Today:"} <span className="font-bold text-slate-700 dark:text-slate-200">{usage} {isEl ? "λ." : "min"}</span>
            </span>
            <span className={`font-bold ${usage >= limit.dailyMinutes ? "text-red-500" : "text-emerald-500"}`}>
              {Math.max(0, limit.dailyMinutes - usage)} {isEl ? "λ. απομένουν" : "min left"}
            </span>
          </div>

          {history.some(h => h.minutes > 0) && (
            <div className="h-24 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={history}>
                  <Bar dataKey="minutes" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={d => d.slice(5)} />
                  <Tooltip formatter={(v) => [`${v} ${isEl ? "λεπτά" : "min"}`, isEl ? "Χρόνος" : "Time"]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {saved && <p className="text-xs text-green-500 font-medium mt-2">{isEl ? "Αποθηκεύτηκε!" : "Saved!"}</p>}
    </div>
  );
}

function DashboardSettings({ lang, isEl }) {
  const [pin, setPin] = useState("");
  const [saved, setSaved] = useState(false);
  const currentPin = localStorage.getItem("geo:parentPin");
  const children = ProfileService.getAll();

  const handleSave = async () => {
    if (pin.length === 4) {
      const hashed = await hashPin(pin);
      localStorage.setItem("geo:parentPin", hashed);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleRemove = () => {
    localStorage.removeItem("geo:parentPin");
    setPin("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 max-w-md border border-slate-100 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <span>🔐</span>
          {isEl ? "PIN Προστασίας" : "Protection PIN"}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {isEl ? "PIN (4 ψηφία)" : "PIN (4 digits)"}
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder={currentPin ? "••••" : "1234"}
                className="w-32 text-center text-lg tracking-[0.3em] border-2 border-slate-200 dark:border-slate-600 rounded-xl py-2 focus:border-purple-400 focus:outline-none dark:bg-slate-700 dark:text-white"
              />
              <button onClick={handleSave} disabled={pin.length !== 4} className="px-4 py-2 bg-purple-500 text-white rounded-xl font-semibold disabled:opacity-50 active:scale-95">
                {isEl ? "Αποθήκευση" : "Save"}
              </button>
              {currentPin && (
                <button onClick={handleRemove} className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-semibold">
                  {isEl ? "Αφαίρεση" : "Remove"}
                </button>
              )}
            </div>
            {saved && <p className="text-sm text-green-600 dark:text-green-400 mt-1">{isEl ? "Αποθηκεύτηκε!" : "Saved!"}</p>}
          </div>
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {isEl ? "Όταν οριστεί PIN, θα ζητείται για πρόσβαση στον πίνακα γονέα." : "When a PIN is set, it will be required to access the parent dashboard."}
            </p>
          </div>
        </div>
      </div>

      {children.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span>⏰</span>
            {isEl ? "Χρονικά Όρια" : "Time Limits"}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            {isEl ? "Ορίστε ημερήσιο χρονικό όριο χρήσης ανά παιδί." : "Set daily screen time limits per child."}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {children.map(child => (
              <TimeLimitCard key={child.id} child={child} isEl={isEl} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
