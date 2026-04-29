import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { ACHIEVEMENTS } from "../config/achievements";
import { ProgressService } from "../services/ProgressService";
import { CertificateService } from "../services/CertificateService";
import { CountryService } from "../config/countries";
import { CARDS } from "../config/cardsConfig";

const T = {
  el: {
    title: "🏆 Trophy Room",
    subtitle: "Όλα τα επιτεύγματά σου σε ένα μέρος",
    back: "Πίσω",
    badges: "Ταυτότητες",
    certificates: "Πιστοποιητικά",
    cards: "Κάρτες",
    streaks: "Σερί",
    stats: "Στατιστικά",
    unlocked: "Ξεκλείδωτα",
    locked: "Κλειδωμένα",
    earned: "Κερδισμένα",
    completion: "Ολοκλήρωση",
    share: "Μοιράσου το trophy room",
    copied: "Αντιγράφηκε!",
    visitor: "Επισκέπτης",
    none: "Κανένα ακόμα",
    play: "Παίξε για να ξεκλειδώσεις!",
    download: "Κατέβασμα",
    rarityCommon: "Κοινή",
    rarityUncommon: "Σπάνια",
    rarityRare: "Πολύ Σπάνια",
    rarityLegendary: "Θρυλική",
    level: "Επίπεδο",
    xp: "XP",
    gamesPlayed: "Παιχνίδια",
    perfectScores: "Τέλεια Σκορ",
    bestStreak: "Καλύτερο Σερί",
  },
  en: {
    title: "🏆 Trophy Room",
    subtitle: "All your achievements in one place",
    back: "Back",
    badges: "Badges",
    certificates: "Certificates",
    cards: "Cards",
    streaks: "Streaks",
    stats: "Stats",
    unlocked: "Unlocked",
    locked: "Locked",
    earned: "Earned",
    completion: "Completion",
    share: "Share my trophy room",
    copied: "Copied!",
    visitor: "Visitor",
    none: "None yet",
    play: "Play to unlock!",
    download: "Download",
    rarityCommon: "Common",
    rarityUncommon: "Uncommon",
    rarityRare: "Rare",
    rarityLegendary: "Legendary",
    level: "Level",
    xp: "XP",
    gamesPlayed: "Games",
    perfectScores: "Perfect Scores",
    bestStreak: "Best Streak",
  },
};

const RARITY_STYLES = {
  common:    { bg: "from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600",  text: "text-slate-700 dark:text-slate-200", ring: "ring-slate-300" },
  uncommon:  { bg: "from-emerald-200 to-emerald-300 dark:from-emerald-900/40 dark:to-emerald-800/40", text: "text-emerald-800 dark:text-emerald-200", ring: "ring-emerald-400" },
  rare:      { bg: "from-blue-200 to-purple-200 dark:from-blue-900/40 dark:to-purple-900/40", text: "text-blue-800 dark:text-blue-200", ring: "ring-blue-400" },
  legendary: { bg: "from-amber-200 via-orange-300 to-pink-300 dark:from-amber-900/50 dark:via-orange-800/50 dark:to-pink-900/50", text: "text-orange-800 dark:text-orange-200", ring: "ring-amber-400" },
};

export default function TrophyRoomPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const l = T[lang] || T.en;

  const [tab, setTab] = useState("badges");
  const [shareState, setShareState] = useState("idle");

  const unlocked = useMemo(() => ProgressService.getUnlockedAchievements(), []);
  const certificates = useMemo(() => {
    try { return CertificateService.getEarnedCertificates() || []; } catch { return []; }
  }, []);

  const cardCollection = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("geo:cardCollection") || "{}"); } catch { return {}; }
  }, []);

  const stats = useMemo(() => {
    try {
      const xp = JSON.parse(localStorage.getItem("geo:xp") || "{}");
      const totalGames = parseInt(localStorage.getItem("geo:totalGames") || "0", 10);
      const perfectGames = parseInt(localStorage.getItem("geo:perfectGames") || "0", 10);
      const bestStreak = parseInt(localStorage.getItem("geo:bestStreak") || localStorage.getItem("geo:dailyChallengeStreak") || "0", 10);
      return {
        level: xp.level || 1,
        totalXP: xp.totalXP || 0,
        totalGames,
        perfectGames,
        bestStreak,
      };
    } catch {
      return { level: 1, totalXP: 0, totalGames: 0, perfectGames: 0, bestStreak: 0 };
    }
  }, []);

  const country = CountryService.getInfo(CountryService.get());
  const playerName = user?.displayName || user?.email?.split("@")[0] || l.visitor;

  const completionPct = Math.round((unlocked.length / Math.max(1, ACHIEVEMENTS.length)) * 100);
  const cardCount = Object.keys(cardCollection).length;
  const cardTotal = (CARDS || []).length || 55;
  const cardPct = Math.round((cardCount / Math.max(1, cardTotal)) * 100);

  const handleShare = async () => {
    const summary = `🏆 ${l.title} — ${playerName}\n` +
      `${country.flag} ${l[`level`]}: ${stats.level} • ${stats.totalXP} XP\n` +
      `🎖️ ${l.badges}: ${unlocked.length}/${ACHIEVEMENTS.length} (${completionPct}%)\n` +
      `🃏 ${l.cards}: ${cardCount}/${cardTotal}\n` +
      `📜 ${l.certificates}: ${certificates.length}\n` +
      `${typeof window !== "undefined" ? window.location.href : ""}`;
    if (navigator.share) {
      try { await navigator.share({ title: l.title, text: summary }); return; } catch {}
    }
    try {
      await navigator.clipboard.writeText(summary);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2000);
    } catch {}
  };

  const TABS = [
    { id: "badges", icon: "🎖️", label: l.badges, count: unlocked.length },
    { id: "certificates", icon: "📜", label: l.certificates, count: certificates.length },
    { id: "cards", icon: "🃏", label: l.cards, count: cardCount },
    { id: "stats", icon: "📊", label: l.stats, count: null },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <SEO title={l.title} description={l.subtitle} canonical="/trophy-room" />
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-purple-600 mb-4">← {l.back}</button>

        {/* Hero */}
        <header className="relative overflow-hidden bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 rounded-3xl p-6 sm:p-8 text-white shadow-2xl mb-8">
          <div aria-hidden className="absolute -top-10 -right-10 text-[200px] opacity-10 leading-none pointer-events-none select-none">🏆</div>
          <div className="relative flex flex-wrap items-start gap-4 justify-between">
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl font-extrabold flex items-center gap-2 flex-wrap">
                <span aria-hidden>🏆</span> {l.title}
              </h1>
              <p className="text-white/90 mt-1 flex items-center gap-2 text-sm sm:text-base">
                <span>{country.flag}</span> {playerName}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge label={`Lv ${stats.level}`} />
                <Badge label={`${stats.totalXP} XP`} />
                <Badge label={`🎖️ ${unlocked.length}`} />
                <Badge label={`🃏 ${cardCount}`} />
                <Badge label={`📜 ${certificates.length}`} />
              </div>
            </div>
            <button
              onClick={handleShare}
              className="shrink-0 px-4 py-2 rounded-xl bg-white/20 backdrop-blur hover:bg-white/30 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-white"
            >
              {shareState === "copied" ? `✅ ${l.copied}` : `🔗 ${l.share}`}
            </button>
          </div>

          {/* Completion bar */}
          <div className="relative mt-5 bg-white/15 backdrop-blur rounded-2xl p-3">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>{l.completion}</span>
              <span>{completionPct}%</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all" style={{ width: `${completionPct}%` }} />
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div role="tablist" aria-label={l.title} className="flex gap-2 mb-6 overflow-x-auto -mx-2 px-2 pb-1 scrollbar-thin">
          {TABS.map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${tab === t.id ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-900/20"}`}
            >
              <span aria-hidden>{t.icon}</span> {t.label} {t.count !== null && <span className="text-xs opacity-80">({t.count})</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          {tab === "badges" && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {ACHIEVEMENTS.map(a => {
                const isUnlocked = unlocked.includes(a.id);
                return (
                  <div
                    key={a.id}
                    title={a.description?.[lang] || a.description?.en}
                    className={`aspect-square flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition ${isUnlocked ? "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border-amber-300 dark:border-amber-700" : "bg-slate-100 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 opacity-50 grayscale"}`}
                  >
                    <span className="text-3xl sm:text-4xl mb-1">{a.icon}</span>
                    <span className={`text-[10px] sm:text-xs font-bold text-center line-clamp-2 ${isUnlocked ? "text-slate-700 dark:text-slate-200" : "text-slate-500"}`}>
                      {a.title?.[lang] || a.title?.en}
                    </span>
                    {!isUnlocked && <span className="text-[9px] mt-0.5 text-slate-400">🔒</span>}
                  </div>
                );
              })}
            </div>
          )}

          {tab === "certificates" && (
            <>
              {certificates.length === 0 ? (
                <EmptyState icon="📜" text={l.none} cta={l.play} />
              ) : (
                <ul className="space-y-3">
                  {certificates.map((c, i) => (
                    <li key={c.id || i} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800">
                      <span className="text-4xl">📜</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{c.title || c.name || "Certificate"}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{c.earnedAt ? new Date(c.earnedAt).toLocaleDateString() : ""}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {tab === "cards" && (
            <>
              <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm text-slate-600 dark:text-slate-300"><strong>{cardCount}</strong> / {cardTotal} ({cardPct}%)</p>
                <button onClick={() => navigate("/cards")} className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">→ {lang === "el" ? "Άνοιξε νέες κάρτες" : "Open new cards"}</button>
              </div>
              {cardCount === 0 ? (
                <EmptyState icon="🃏" text={l.none} cta={l.play} />
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
                  {(CARDS || []).map(card => {
                    const owned = cardCollection[card.id];
                    const r = RARITY_STYLES[card.rarity] || RARITY_STYLES.common;
                    return (
                      <div
                        key={card.id}
                        title={`${card.name?.[lang] || card.name?.en || card.id}${owned ? ` ×${owned.count || 1}` : ""}`}
                        className={`aspect-[3/4] rounded-xl flex flex-col items-center justify-center p-2 border-2 ${owned ? `bg-gradient-to-br ${r.bg} border-transparent` : "bg-slate-100 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700 opacity-40 grayscale"}`}
                      >
                        <span className="text-2xl sm:text-3xl">{card.icon || card.emoji || "🃏"}</span>
                        <span className={`text-[9px] sm:text-[10px] font-bold text-center mt-1 line-clamp-2 ${owned ? r.text : "text-slate-500"}`}>
                          {card.name?.[lang] || card.name?.en || card.id}
                        </span>
                        {owned?.count > 1 && <span className="text-[9px] font-bold text-amber-600">×{owned.count}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {tab === "stats" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatCard icon="⭐" label={l.level} value={stats.level} color="from-purple-500 to-pink-500" />
              <StatCard icon="⚡" label={l.xp} value={stats.totalXP} color="from-blue-500 to-cyan-500" />
              <StatCard icon="🎮" label={l.gamesPlayed} value={stats.totalGames} color="from-emerald-500 to-teal-500" />
              <StatCard icon="🏆" label={l.perfectScores} value={stats.perfectGames} color="from-amber-500 to-yellow-500" />
              <StatCard icon="🔥" label={l.bestStreak} value={stats.bestStreak} color="from-orange-500 to-red-500" />
              <StatCard icon="🎖️" label={l.badges} value={`${unlocked.length}/${ACHIEVEMENTS.length}`} color="from-violet-500 to-purple-500" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Badge({ label }) {
  return <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/25 backdrop-blur text-xs font-bold">{label}</span>;
}

function EmptyState({ icon, text, cta }) {
  return (
    <div className="text-center py-12">
      <div aria-hidden className="text-6xl mb-3">{icon}</div>
      <p className="text-slate-500 dark:text-slate-400 font-semibold">{text}</p>
      <p className="text-xs text-slate-400 mt-1">{cta}</p>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`rounded-2xl p-4 bg-gradient-to-br ${color} text-white shadow-md`}>
      <div className="text-3xl mb-1">{icon}</div>
      <div className="text-xs font-bold uppercase opacity-90 tracking-wider">{label}</div>
      <div className="text-2xl font-extrabold mt-1">{value}</div>
    </div>
  );
}
