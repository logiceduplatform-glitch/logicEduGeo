import React, { useState, useEffect, useContext, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { ChallengeService } from "../services/ChallengeService";

const T = {
  el: {
    title: "Προκλήσεις φίλων",
    subtitle: "Παίξε τα ίδια ερωτήματα με έναν φίλο και δες ποιος έκανε καλύτερα!",
    findCode: "Έχεις κωδικό πρόκλησης;",
    enterCode: "ABC123",
    open: "Άνοιξε",
    notFound: "Δεν βρέθηκε πρόκληση με αυτόν τον κωδικό.",
    create: "Δημιουργία πρόκλησης",
    createDesc: "Παίξε ένα παιχνίδι, μοιράσου τον κωδικό με φίλο, και ζήτα του να σπάσει το σκορ σου.",
    quickStart: "Γρήγορη εκκίνηση: παίξε ένα quiz",
    play: "Παίξε quiz",
    myChallenges: "Οι προκλήσεις μου",
    none: "Δεν έχεις προκλήσεις ακόμη.",
    won: "Νίκησες!",
    lost: "Έχασες",
    tied: "Ισοπαλία",
    pending: "Σε αναμονή",
    score: "σκορ",
    share: "Μοιράσου",
    shareUrl: "URL αντιγράφηκε!",
    needLogin: "Συνδέσου για να δημιουργείς προκλήσεις.",
    you: "Εσύ",
    opponent: "Αντίπαλος",
  },
  en: {
    title: "Friend challenges",
    subtitle: "Play the same questions as a friend and see who scores higher!",
    findCode: "Got a challenge code?",
    enterCode: "ABC123",
    open: "Open",
    notFound: "No challenge found for that code.",
    create: "Create a challenge",
    createDesc: "Play a game, share the code with a friend, and dare them to beat your score.",
    quickStart: "Quick start: play a quiz",
    play: "Play quiz",
    myChallenges: "My challenges",
    none: "No challenges yet.",
    won: "You won!",
    lost: "You lost",
    tied: "Tied",
    pending: "Pending",
    score: "score",
    share: "Share",
    shareUrl: "URL copied!",
    needLogin: "Sign in to create challenges.",
    you: "You",
    opponent: "Opponent",
  },
};

function outcome(c, uid, l) {
  if (c.status !== "completed") return { label: l.pending, cls: "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200" };
  const youAreFrom = c.fromUid === uid;
  const yourScore = youAreFrom ? c.fromScore : c.toScore;
  const theirScore = youAreFrom ? c.toScore : c.fromScore;
  if (yourScore > theirScore) return { label: `🏆 ${l.won}`, cls: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200" };
  if (yourScore < theirScore) return { label: `😢 ${l.lost}`, cls: "bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200" };
  return { label: `🤝 ${l.tied}`, cls: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" };
}

export default function FriendChallengesPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext) || {};
  const l = T[lang] || T.en;
  const [params] = useSearchParams();
  const initialCode = params.get("code") || "";
  const [code, setCode] = useState(initialCode);
  const [challenge, setChallenge] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [list, setList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [shareFlash, setShareFlash] = useState("");

  const lookup = useCallback(async (c) => {
    if (!c) return;
    setLoadError("");
    const found = await ChallengeService.getByCode(c);
    if (!found) {
      setLoadError(l.notFound);
      setChallenge(null);
    } else {
      setChallenge(found);
    }
  }, [l.notFound]);

  useEffect(() => {
    if (initialCode) lookup(initialCode);
  }, [initialCode, lookup]);

  useEffect(() => {
    let cancelled = false;
    if (!user) { setLoadingList(false); return; }
    (async () => {
      const items = await ChallengeService.listForCurrentUser(20);
      if (!cancelled) {
        setList(items);
        setLoadingList(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const handleShare = (c) => {
    const url = ChallengeService.buildShareUrl(c.code || c.id);
    if (navigator.share) {
      navigator.share({ title: "Kibloo Challenge", text: `Πρόκληση! Σκορ μου: ${c.fromScore}`, url }).catch(() => {});
      return;
    }
    navigator.clipboard?.writeText(url);
    setShareFlash(c.id);
    setTimeout(() => setShareFlash(""), 2000);
  };

  return (
    <>
      <Navbar />
      <SEO title={l.title} description={l.subtitle} canonical="/challenges" />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">⚔️</div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{l.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{l.subtitle}</p>
          </div>

          {/* Enter code */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5 mb-5">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{l.findCode}</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder={l.enterCode}
                maxLength={6}
                className="flex-1 px-3 py-2 font-mono text-lg tracking-widest text-center border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={() => lookup(code)}
                disabled={code.length < 4}
                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-lg disabled:opacity-50 hover:from-orange-600 hover:to-pink-600"
              >
                {l.open}
              </button>
            </div>
            {loadError && <div className="text-sm text-rose-600 mt-2">{loadError}</div>}

            {challenge && (
              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg">
                <div className="text-xs text-slate-500 dark:text-slate-400">Topic: {challenge.topic}</div>
                <div className="font-bold mt-1 text-slate-800 dark:text-slate-100">
                  {challenge.fromName} • {challenge.fromScore} {l.score}
                </div>
                {challenge.status === "completed" ? (
                  <div className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    {challenge.toName}: {challenge.toScore} {l.score}
                  </div>
                ) : (
                  <Link
                    to="/play"
                    className="inline-block mt-2 text-sm font-bold text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    {l.play} →
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Create */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5 mb-5">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-1">{l.create}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{l.createDesc}</p>
            {!user && <div className="text-sm text-amber-600 dark:text-amber-400 mb-2">{l.needLogin}</div>}
            <Link
              to="/play"
              className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700"
            >
              {l.quickStart} →
            </Link>
          </div>

          {/* My challenges */}
          {user && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5">
              <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-3">{l.myChallenges}</h2>
              {loadingList ? (
                <div className="text-center py-4 text-slate-500">…</div>
              ) : list.length === 0 ? (
                <div className="text-center py-4 text-slate-500">{l.none}</div>
              ) : (
                <ul className="space-y-2">
                  {list.map((c) => {
                    const o = outcome(c, user.uid, l);
                    return (
                      <li key={c.id} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-mono text-sm font-bold text-slate-800 dark:text-slate-100">{c.code || c.id}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {c.fromName} ({c.fromScore}) vs {c.toName || "—"} ({c.toScore ?? "?"})
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${o.cls}`}>{o.label}</span>
                          <button
                            type="button"
                            onClick={() => handleShare(c)}
                            className="text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                          >
                            {shareFlash === c.id ? l.shareUrl : l.share}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
