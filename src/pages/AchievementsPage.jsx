import React, { Suspense, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { useProgress } from "../contexts/ProgressContext";
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES } from "../config/achievements";
import { ProgressService } from "../services/ProgressService";
import { CertificateService } from "../services/CertificateService";
import ShareButton from "../components/ShareButton";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const MilestoneCertificate = React.lazy(() => import("../components/rewards/MilestoneCertificate"));

const T = {
  el: {
    title: "Τα Επιτεύγματά μου",
    subtitle: "Συλλογή βραβείων & πρόοδος",
    unlocked: "Ξεκλειδωμένα",
    locked: "Κλειδωμένα",
    progress: "Πρόοδος",
    earned: "Κερδήθηκε",
    back: "Πίσω",
    noAchievements: "Παίξε παιχνίδια για να ξεκλειδώσεις βραβεία!",
    shareText: "Κέρδισα το βραβείο στο Kibloo!",
    certificates: "Πιστοποιητικά",
    certSub: "Πιστοποιητικά προόδου",
    certView: "Δες",
  },
  en: {
    title: "My Achievements",
    subtitle: "Badge collection & progress",
    unlocked: "Unlocked",
    locked: "Locked",
    progress: "Progress",
    earned: "Earned",
    back: "Back",
    noAchievements: "Play games to unlock achievements!",
    shareText: "I earned a badge on Kibloo!",
    certificates: "Certificates",
    certSub: "Milestone progress certificates",
    certView: "View",
  },
};

export default function AchievementsPage() {
  const { lang } = useContext(LanguageContext);
  const progress = useProgress();
  const navigate = useNavigate();
  const l = T[lang] || T.en;

  const unlockedIds = useMemo(() => progress.getUnlockedAchievements(), [progress]);
  const timestamps = useMemo(() => ProgressService.getAchievementTimestamps(), []);

  const grouped = useMemo(() => {
    const groups = {};
    for (const a of ACHIEVEMENTS) {
      const cat = a.category || "beginner";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(a);
    }
    return groups;
  }, []);

  const total = ACHIEVEMENTS.length;
  const earned = unlockedIds.length;
  const pct = total > 0 ? Math.round((earned / total) * 100) : 0;

  const overallStats = useMemo(() => ProgressService.getOverallStats(), []);
  const xpData = useMemo(() => ProgressService.getXP(), []);
  const streakData = useMemo(() => ProgressService.getStreak(), []);

  const certProgress = useMemo(() => CertificateService.getProgress({
    gamesPlayed: overallStats.totalGamesPlayed,
    level: xpData.level,
    streak: streakData.current,
    correct: overallStats.totalCorrect,
  }), [overallStats, xpData, streakData]);

  const [viewCert, setViewCert] = useState(null);
  const { user, guest } = useContext(AuthContext);
  const userName = user?.displayName || guest?.name || "";

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(lang === "el" ? "el-GR" : "en-US", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO title={l.title} />
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <span>←</span> {l.back}
          </button>

          <div className="text-center mb-10">
            <span className="text-5xl mb-3 block" aria-hidden="true">🏆</span>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
          </div>

          {/* Progress bar */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{l.progress}</span>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{earned} / {total} ({pct}%)</span>
            </div>
            <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Certificates section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl" aria-hidden="true">📜</span>
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">{l.certificates}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{l.certSub}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {certProgress.map((m) => (
                <button
                  key={m.id}
                  onClick={() => m.earned && setViewCert(m)}
                  disabled={!m.earned}
                  className={`rounded-xl p-3 text-center transition-all duration-200 ${
                    m.earned
                      ? "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-200 dark:border-purple-700 hover:scale-105 hover:shadow-md cursor-pointer"
                      : "bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 opacity-60 cursor-default"
                  }`}
                >
                  <div className="text-2xl mb-1">{m.earned ? m.icon : "🔒"}</div>
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">
                    {m.title[lang]}
                  </p>
                  <div className="mt-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                      style={{ width: `${Math.round(m.progress * 100)}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-1">
                    {m.current}/{m.target}
                  </p>
                  {m.earned && (
                    <span className="text-[9px] text-purple-600 dark:text-purple-400 font-semibold">{l.certView}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {viewCert && (
            <Suspense fallback={null}>
              <MilestoneCertificate
                cert={viewCert}
                userName={userName}
                lang={lang}
                onClose={() => setViewCert(null)}
              />
            </Suspense>
          )}

          {/* Category groups */}
          {Object.entries(grouped).map(([catKey, achievements]) => {
            const catInfo = ACHIEVEMENT_CATEGORIES[catKey] || { el: catKey, en: catKey, icon: "🎖️" };
            const catEarned = achievements.filter((a) => unlockedIds.includes(a.id)).length;

            return (
              <div key={catKey} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl" aria-hidden="true">{catInfo.icon}</span>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                    {lang === "el" ? catInfo.el : catInfo.en}
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                    {catEarned}/{achievements.length}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {achievements.map((a) => {
                    const isUnlocked = unlockedIds.includes(a.id);
                    const ts = timestamps[a.id];

                    return (
                      <div
                        key={a.id}
                        className={`relative rounded-2xl p-4 text-center transition-all duration-300 ${
                          isUnlocked
                            ? "bg-white dark:bg-slate-800 shadow-lg border-2 border-purple-200 dark:border-purple-700 hover:shadow-xl hover:scale-105"
                            : "bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 opacity-60"
                        }`}
                      >
                        <div className={`text-4xl mb-2 ${isUnlocked ? "" : "opacity-30 grayscale"}`}>
                          {isUnlocked ? a.icon : "🔒"}
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-0.5">
                          {a.title[lang]}
                        </h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                          {a.description[lang]}
                        </p>
                        {isUnlocked && ts && (
                          <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                            {l.earned}: {formatDate(ts)}
                          </p>
                        )}
                        {isUnlocked && (
                          <>
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                            <div className="mt-1">
                              <ShareButton
                                title={a.title[lang]}
                                text={`${l.shareText} ${a.title[lang]} ${a.icon}`}
                                className="text-[10px] px-2 py-1"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {earned === 0 && (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500">
              <span className="text-5xl block mb-4" aria-hidden="true">🎮</span>
              <p className="text-lg">{l.noAchievements}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
