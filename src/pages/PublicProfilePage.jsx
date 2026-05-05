import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { PublicProfileService } from "../services/PublicProfileService";
import { CountryService } from "../config/countries";

const T = {
  el: {
    title: "Δημόσιο Προφίλ",
    notFound: "Δεν βρέθηκε προφίλ.",
    publishYour: "Δημοσίευσε το προφίλ σου για να μπορεί ο κόσμος να το δει.",
    publishBtn: "Δημοσίευση Προφίλ",
    published: "✓ Δημοσιεύτηκε",
    edit: "✏️ Επεξεργασία",
    yourBio: "Bio (έως 160 χαρακτήρες)",
    bioPh: "Πες μας για σένα...",
    save: "Αποθήκευση",
    cancel: "Άκυρο",
    share: "📤 Κοινοποίηση",
    copied: "Αντιγράφηκε!",
    level: "Επίπεδο",
    xp: "XP",
    streak: "Σερί",
    coins: "Νομίσματα",
    games: "Παιχνίδια",
    accuracy: "Ακρίβεια",
    badges: "Badges",
    certs: "Πιστοποιητικά",
    backHome: "← Αρχική",
  },
  en: {
    title: "Public Profile",
    notFound: "Profile not found.",
    publishYour: "Publish your profile so others can see it.",
    publishBtn: "Publish Profile",
    published: "✓ Published",
    edit: "✏️ Edit",
    yourBio: "Bio (up to 160 chars)",
    bioPh: "Tell people about you...",
    save: "Save",
    cancel: "Cancel",
    share: "📤 Share",
    copied: "Copied!",
    level: "Level",
    xp: "XP",
    streak: "Streak",
    coins: "Coins",
    games: "Games",
    accuracy: "Accuracy",
    badges: "Badges",
    certs: "Certificates",
    backHome: "← Home",
  },
};

export default function PublicProfilePage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const { user } = useContext(AuthContext) || {};
  const l = T[lang] || T.en;
  const { uid } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const isMine = user?.uid && user.uid === uid;

  const load = async () => {
    setLoading(true);
    const p = await PublicProfileService.get(uid);
    setProfile(p);
    if (p) {
      setBio(p.bio || "");
      setDisplayName(p.displayName || "");
    } else {
      setBio("");
      setDisplayName(user?.displayName || "");
    }
    setLoading(false);
  };

  useEffect(() => { if (uid) load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [uid]);

  const handlePublish = async () => {
    if (!user?.uid) return;
    setBusy(true);
    try {
      await PublicProfileService.syncFromLocal(user.uid, {
        displayName: displayName || user.displayName || "User",
        bio: (bio || "").slice(0, 160),
        avatar: user.photoURL || "",
      });
      await load();
      setEditing(false);
    } catch (e) { alert(e.message || "Error"); }
    setBusy(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/u/${uid}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: profile?.displayName || "Profile", url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {}
  };

  const country = useMemo(() => (profile?.country ? CountryService.getInfo(profile.country) : null), [profile?.country]);

  const accuracy = useMemo(() => {
    if (!profile?.stats) return null;
    const a = profile.stats.totalAttempts || 0;
    const c = profile.stats.totalCorrect || 0;
    if (!a) return 0;
    return Math.round((c / a) * 100);
  }, [profile?.stats]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-pink-50 to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={profile?.displayName || l.title} />

      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-3xl space-y-5">
          <button onClick={() => navigate("/")} className="text-sm text-slate-500 hover:underline">{l.backHome}</button>

          {loading ? (
            <p className="text-center text-slate-500">…</p>
          ) : !profile ? (
            <div className="text-center bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700">
              <p className="text-2xl mb-2">😔</p>
              <p className="text-slate-500">{l.notFound}</p>
              {isMine && (
                <div className="mt-6 space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300">{l.publishYour}</p>
                  <button onClick={() => setEditing(true)} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-bold shadow">
                    {l.publishBtn}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Header card */}
              <div className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-700">
                <div className="absolute -top-12 -right-12 text-9xl opacity-10">{country?.flag || "🌍"}</div>
                <div className="flex items-center gap-4">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="" loading="lazy" decoding="async" className="w-20 h-20 rounded-full ring-4 ring-fuchsia-200 dark:ring-fuchsia-900" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-fuchsia-400 to-pink-500 flex items-center justify-center text-3xl font-extrabold text-white">
                      {(profile.displayName || "?")[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white truncate">
                      {profile.displayName} {country && <span className="text-2xl ml-1">{country.flag}</span>}
                    </h1>
                    <p className="text-xs text-slate-400 font-mono truncate">/u/{(profile.uid || "").slice(0, 12)}</p>
                  </div>
                </div>
                {profile.bio && <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 italic">"{profile.bio}"</p>}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={handleShare} className="px-3 py-1.5 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300 text-sm font-bold">
                    {copied ? l.copied : l.share}
                  </button>
                  {isMine && (
                    <button onClick={() => setEditing(true)} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold">
                      {l.edit}
                    </button>
                  )}
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Stat icon="🎯" label={l.level} value={profile.stats?.level || 1} color="from-violet-400 to-fuchsia-500" />
                <Stat icon="⭐" label={l.xp} value={(profile.stats?.xp || 0).toLocaleString()} color="from-amber-400 to-orange-500" />
                <Stat icon="🔥" label={l.streak} value={profile.stats?.streak || 0} color="from-rose-400 to-pink-500" />
                <Stat icon="🪙" label={l.coins} value={profile.stats?.coins || 0} color="from-yellow-400 to-amber-500" />
                <Stat icon="🎮" label={l.games} value={profile.stats?.totalGames || 0} color="from-emerald-400 to-teal-500" />
                <Stat icon="✓" label={l.accuracy} value={accuracy != null ? `${accuracy}%` : "—"} color="from-blue-400 to-indigo-500" />
                <Stat icon="🏅" label={l.badges} value={profile.badgeCount || 0} color="from-purple-400 to-violet-500" />
                <Stat icon="📜" label={l.certs} value={profile.certificateCount || 0} color="from-cyan-400 to-blue-500" />
              </div>
            </>
          )}

          {/* Edit modal */}
          {editing && (
            <div role="dialog" className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md space-y-4">
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">{l.edit}</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Display name</label>
                  <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">{l.yourBio}</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value.slice(0, 160))} rows={3} placeholder={l.bioPh} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white outline-none resize-none" />
                  <p className="text-[10px] text-slate-400 text-right mt-1">{bio.length}/160</p>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold">{l.cancel}</button>
                  <button onClick={handlePublish} disabled={busy} className="px-4 py-2 rounded-lg bg-fuchsia-500 text-white font-bold disabled:opacity-50">{l.save}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, color }) {
  return (
    <div className={`relative rounded-2xl p-3 bg-gradient-to-br ${color} text-white shadow overflow-hidden`}>
      <div className="absolute -top-2 -right-2 text-4xl opacity-30">{icon}</div>
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-90">{label}</p>
      <p className="text-xl font-extrabold mt-1">{value}</p>
    </div>
  );
}
