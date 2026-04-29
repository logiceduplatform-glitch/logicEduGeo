import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { collection, query, where, orderBy, limit, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../auth/firebase";
import { CountryService } from "../config/countries";

const T = {
  el: {
    title: "Παγκόσμιος Πίνακας Κατάταξης",
    subtitle: "Δες πού βρίσκεσαι ανάμεσα στους κορυφαίους!",
    back: "Πίσω",
    today: "Σήμερα",
    week: "Εβδομάδα",
    allTime: "Όλη ώρα",
    xp: "XP",
    daily: "Daily Challenge",
    battle: "Battle Royale",
    cards: "Card Collection",
    rank: "#",
    player: "Παίκτης",
    score: "Σκορ",
    you: "Εσύ",
    noData: "Δεν υπάρχουν δεδομένα ακόμα. Παίξε για να εμφανιστείς!",
    loading: "Φόρτωση...",
    submitMine: "Υποβολή του ρεκόρ μου",
    submitted: "Υποβλήθηκε!",
    global: "🌍 Παγκόσμια",
    myCountry: "🏠 Χώρα μου",
  },
  en: {
    title: "Global Leaderboard",
    subtitle: "See where you rank among the top players!",
    back: "Back",
    today: "Today",
    week: "Week",
    allTime: "All Time",
    xp: "XP",
    daily: "Daily Challenge",
    battle: "Battle Royale",
    cards: "Card Collection",
    rank: "#",
    player: "Player",
    score: "Score",
    you: "You",
    noData: "No data yet. Play to appear here!",
    loading: "Loading...",
    submitMine: "Submit my record",
    submitted: "Submitted!",
    global: "🌍 Global",
    myCountry: "🏠 My Country",
  },
};

const CATEGORIES = [
  { id: "xp",    label: { el: "XP", en: "XP" }, icon: "⭐", color: "from-purple-500 to-pink-500" },
  { id: "daily", label: { el: "Daily", en: "Daily" }, icon: "🎯", color: "from-orange-500 to-red-500" },
  { id: "battle", label: { el: "Battle", en: "Battle" }, icon: "⚔️", color: "from-rose-500 to-purple-500" },
  { id: "cards", label: { el: "Κάρτες", en: "Cards" }, icon: "🃏", color: "from-cyan-500 to-blue-500" },
];

const PERIODS = [
  { id: "all", label: { el: "Όλη ώρα", en: "All Time" } },
  { id: "week", label: { el: "Εβδομάδα", en: "Week" } },
  { id: "today", label: { el: "Σήμερα", en: "Today" } },
];

function periodCutoff(period) {
  const now = Date.now();
  if (period === "today") return now - 24 * 60 * 60 * 1000;
  if (period === "week") return now - 7 * 24 * 60 * 60 * 1000;
  return 0;
}

function getMyData(category) {
  try {
    if (category === "xp") {
      const xp = JSON.parse(localStorage.getItem("geo:xp") || "{}");
      return xp.totalXP || 0;
    }
    if (category === "daily") {
      const streak = parseInt(localStorage.getItem("geo:dailyChallengeStreak") || "0", 10);
      return streak;
    }
    if (category === "cards") {
      const col = JSON.parse(localStorage.getItem("geo:cardCollection") || "{}");
      return Object.keys(col).length;
    }
    if (category === "battle") {
      const wins = parseInt(localStorage.getItem("geo:battleWins") || "0", 10);
      return wins;
    }
  } catch {}
  return 0;
}

export default function GlobalLeaderboardPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const l = T[lang] || T.en;

  const [category, setCategory] = useState("xp");
  const [period, setPeriod] = useState("all");
  const [scope, setScope] = useState("global"); // "global" | "country"
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitState, setSubmitState] = useState("idle");
  const myCountry = CountryService.get();

  const myValue = useMemo(() => getMyData(category), [category]);

  const loadBoard = async () => {
    setLoading(true);
    setRows([]);
    try {
      const ref = collection(db, "globalLeaderboard");
      const cutoff = periodCutoff(period);
      let q;
      if (cutoff > 0) {
        q = query(ref,
          where("category", "==", category),
          where("createdAt", ">=", new Date(cutoff)),
          orderBy("createdAt", "desc"),
          orderBy("score", "desc"),
          limit(100));
      } else {
        q = query(ref, where("category", "==", category), orderBy("score", "desc"), limit(50));
      }
      const snap = await getDocs(q);
      let list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      if (scope === "country") {
        list = list.filter(r => r.country === myCountry);
      }
      list.sort((a, b) => (b.score || 0) - (a.score || 0));
      setRows(list.slice(0, 50));
    } catch (e) {
      console.error("loadBoard", e);
    }
    setLoading(false);
  };

  useEffect(() => { loadBoard(); /* eslint-disable-next-line */ }, [category, period, scope]);

  const submitScore = async () => {
    if (!user || myValue <= 0) return;
    setSubmitState("submitting");
    try {
      await addDoc(collection(db, "globalLeaderboard"), {
        uid: user.uid,
        name: user.displayName || (user.email || "").split("@")[0] || "Player",
        avatar: user.photoURL || null,
        country: CountryService.get(),
        category,
        score: myValue,
        createdAt: serverTimestamp(),
      });
      setSubmitState("submitted");
      setTimeout(() => setSubmitState("idle"), 2500);
      loadBoard();
    } catch (e) {
      console.error("submitScore", e);
      setSubmitState("idle");
    }
  };

  const myRank = useMemo(() => {
    if (!user) return null;
    const i = rows.findIndex(r => r.uid === user.uid);
    return i >= 0 ? i + 1 : null;
  }, [rows, user]);

  const cat = CATEGORIES.find(c => c.id === category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <SEO title={l.title} description={l.subtitle} canonical="/leaderboard" />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:text-purple-600 mb-4">← {l.back}</button>

        <header className="text-center mb-8">
          <div className="text-6xl mb-3">🏆</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">{l.title}</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">{l.subtitle}</p>
        </header>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-100 dark:border-slate-700">
          <div role="tablist" aria-label={l.title} className="flex gap-2 mb-4 overflow-x-auto -mx-2 px-2 pb-1 sm:flex-wrap sm:overflow-visible scrollbar-thin">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                role="tab"
                aria-selected={category === c.id}
                onClick={() => setCategory(c.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold text-sm transition focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${category === c.id ? `bg-gradient-to-r ${c.color} text-white shadow-md` : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"}`}
              >
                <span aria-hidden>{c.icon}</span> {c.label[lang] || c.label.en}
              </button>
            ))}
          </div>

          <div role="tablist" className="flex flex-wrap gap-2 mb-3">
            {PERIODS.map(p => (
              <button
                key={p.id}
                role="tab"
                aria-selected={period === p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${period === p.id ? "bg-purple-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}
              >
                {p.label[lang] || p.label.en}
              </button>
            ))}
          </div>

          <div role="tablist" className="flex gap-2 mb-6">
            <button
              role="tab"
              aria-selected={scope === "global"}
              onClick={() => setScope("global")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 ${scope === "global" ? "bg-emerald-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}
            >{l.global}</button>
            <button
              role="tab"
              aria-selected={scope === "country"}
              onClick={() => setScope("country")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 ${scope === "country" ? "bg-emerald-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}`}
            >{CountryService.getInfo(myCountry).flag} {l.myCountry}</button>
          </div>

          {/* Submit my score */}
          {user && myValue > 0 && (
            <div className="mb-5 flex items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-800">
              <div className="text-sm">
                <span className="font-bold text-slate-700 dark:text-slate-200">{cat?.icon} {l.score}: {myValue}</span>
                {myRank && <span className="ml-2 text-purple-600 dark:text-purple-300 font-semibold">#{myRank}</span>}
              </div>
              <button
                disabled={submitState === "submitting"}
                onClick={submitScore}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${submitState === "submitted" ? "bg-emerald-500 text-white" : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"}`}
              >
                {submitState === "submitted" ? `✅ ${l.submitted}` : `🚀 ${l.submitMine}`}
              </button>
            </div>
          )}

          {loading ? (
            <div className="space-y-2 py-2" aria-live="polite" aria-busy="true">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-700/40 animate-pulse">
                  <div className="w-12 h-6 bg-slate-200 dark:bg-slate-600 rounded" />
                  <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-600" />
                  <div className="flex-1 h-4 bg-slate-200 dark:bg-slate-600 rounded" />
                  <div className="w-12 h-5 bg-slate-200 dark:bg-slate-600 rounded" />
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-12">
              <div aria-hidden className="text-6xl mb-3">🏁</div>
              <p className="text-slate-500 dark:text-slate-400">{l.noData}</p>
              {user && myValue > 0 && (
                <button onClick={submitScore} className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold shadow-md">
                  🚀 {l.submitMine}
                </button>
              )}
            </div>
          ) : (
            <ol className="space-y-2">
              {rows.map((r, i) => {
                const rankIcon = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
                const isMe = user && r.uid === user.uid;
                const countryInfo = r.country ? CountryService.getInfo(r.country) : null;
                return (
                  <li key={r.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 ${isMe ? "bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700" : "bg-slate-50 dark:bg-slate-700/40 border-transparent"}`}>
                    <div className="text-2xl w-12 text-center" aria-label={`Rank ${i + 1}`}>{rankIcon}</div>
                    {r.avatar ? (
                      <img src={r.avatar} alt="" loading="lazy" className="w-9 h-9 rounded-full" />
                    ) : (
                      <div aria-hidden className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">{(r.name || "?")[0]?.toUpperCase()}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm truncate ${isMe ? "text-purple-700 dark:text-purple-300" : "text-slate-700 dark:text-slate-200"}`}>
                        {countryInfo && <span className="mr-1" title={countryInfo.name[lang] || countryInfo.name.en}>{countryInfo.flag}</span>}
                        {r.name || "Player"} {isMe && <span className="ml-1 text-xs">({l.you})</span>}
                      </p>
                    </div>
                    <div className="font-extrabold text-lg text-slate-700 dark:text-slate-100">{r.score}</div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </main>
    </div>
  );
}
