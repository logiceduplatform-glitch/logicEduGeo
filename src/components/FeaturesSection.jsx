import React, { useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

const FEATURES = [
  {
    emoji: "🎮",
    titleKey: "gameBased",
    subKey: "gameBasedSub",
    gradient: "from-purple-500 to-indigo-600",
    bg: "bg-purple-50",
    shadow: "shadow-purple-200/50",
  },
  {
    emoji: "🃏",
    titleKey: "heroCards",
    subKey: "heroCardsSub",
    gradient: "from-pink-500 to-rose-600",
    bg: "bg-pink-50",
    shadow: "shadow-pink-200/50",
  },
  {
    emoji: "🏆",
    titleKey: "worldRank",
    subKey: "worldRankSub",
    gradient: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    shadow: "shadow-amber-200/50",
  },
  {
    emoji: "📊",
    titleKey: "progress",
    subKey: "progressSub",
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    shadow: "shadow-emerald-200/50",
  },
];

const PARENT_FEATURES = [
  {
    emoji: "👨‍👩‍👧‍👦",
    titleKey: "parentDashboard",
    subKey: "parentDashboardSub",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    emoji: "📊",
    titleKey: "weeklyReports",
    subKey: "weeklyReportsSub",
    gradient: "from-teal-500 to-emerald-600",
  },
];

export default function FeaturesSection({ t }) {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/50 to-transparent dark:via-purple-900/10 pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-4">
            {isEl ? "Χαρακτηριστικά" : "Features"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">
            {t("platformTitle", "Edutainment Platform")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => {
            return (
              <div
                key={i}
                className={`group relative rounded-3xl ${f.bg} dark:bg-slate-800/80 border border-white/80 dark:border-slate-700 p-6 hover:-translate-y-2 hover:shadow-2xl ${f.shadow} transition-all duration-300 cursor-default overflow-hidden`}
              >
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${f.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />

                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg mb-5`}>
                  <span className="text-2xl leading-none" role="img" aria-hidden>
                    {f.emoji}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-2">{t(f.titleKey)}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t(f.subKey)}</p>
              </div>
            );
          })}
        </div>

        {/* XP & Level Up highlight */}
        <div className="mt-10 mb-10">
          <div className="relative rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 border border-amber-200/60 dark:border-amber-700/40 p-8 overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-10" />
            <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 opacity-10" />
            <div className="relative flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg">
                  ⚡
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {["from-slate-400 to-slate-500", "from-emerald-400 to-teal-500", "from-blue-400 to-indigo-500", "from-purple-400 to-violet-500", "from-amber-400 to-orange-500"].map((g, i) => (
                      <div key={i} className={`w-8 h-8 rounded-lg bg-gradient-to-br ${g} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-3/5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">{t("xpLevelUp", "Earn XP & Level Up")}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t("xpLevelUpSub", "Every game earns XP points. Collect enough to level up and unlock new titles!")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Parent-focused features */}
        <div className="mt-10">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold">
              <span>👨‍👩‍👧</span>
              {isEl ? "Ειδικά για γονείς" : "Made for parents"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {PARENT_FEATURES.map((pf, i) => (
              <div
                key={i}
                className="group relative rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-default overflow-hidden"
              >
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${pf.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />

                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pf.gradient} flex items-center justify-center shadow-lg mb-5`}>
                  <span className="text-2xl">{pf.emoji}</span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-2">{t(pf.titleKey)}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t(pf.subKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
