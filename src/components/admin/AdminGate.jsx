import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { LanguageContext } from "../../i18n/LanguageContext";
import { AdminService } from "../../services/AdminService";
import { ProfileService } from "../../services/ProfileService";

const T = {
  el: {
    title: "🔒 Πρόσβαση μόνο για διαχειριστές",
    subtitle: "Δεν έχεις δικαιώματα admin για αυτή τη σελίδα.",
    home: "← Επιστροφή στην αρχική",
    checking: "Έλεγχος δικαιωμάτων...",
    youAre: "Είσαι συνδεδεμένος ως",
    childMode: "👶 Ενεργοποιημένη λειτουργία παιδιού",
    childModeDesc: "Είσαι σε προφίλ παιδιού. Πρέπει πρώτα να επιστρέψεις στον λογαριασμό γονέα/εκπαιδευτικού (με PIN) για να μπεις στο Admin Dashboard.",
    switchToParent: "🔓 Επιστροφή σε λογαριασμό γονέα",
    guest: "👤 Λειτουργία επισκέπτη",
    guestDesc: "Πρέπει να συνδεθείς με λογαριασμό admin για να μπεις στο Admin Dashboard.",
    signIn: "→ Σύνδεση",
  },
  en: {
    title: "🔒 Admin access required",
    subtitle: "You do not have admin permissions for this page.",
    home: "← Back home",
    checking: "Checking permissions...",
    youAre: "You are signed in as",
    childMode: "👶 Child mode active",
    childModeDesc: "You're inside a child profile. Switch back to the parent/teacher account (with PIN) before opening the Admin Dashboard.",
    switchToParent: "🔓 Switch to parent account",
    guest: "👤 Guest mode",
    guestDesc: "You must sign in with an admin account to open the Admin Dashboard.",
    signIn: "→ Sign in",
  },
};

export default function AdminGate({ children }) {
  const { user, guest } = useContext(AuthContext) || {};
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  // States: checking | allowed | denied | childMode | guest
  const [state, setState] = useState("checking");

  // Re-evaluate when the active child profile changes (parent switches kids).
  // We listen on storage events + a manual flag we toggle below.
  const [childTick, setChildTick] = useState(0);

  useEffect(() => {
    const onStorage = (e) => {
      if (!e.key || e.key === "geo:activeProfileId") setChildTick((n) => n + 1);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Block #1: Guest sessions never get admin access.
      if (!user && guest) {
        setState("guest");
        return;
      }
      if (!user) {
        setState("denied");
        return;
      }
      // Block #2: If there's an active child profile, treat the session as
      // child mode and refuse — the parent must switch back via PIN first.
      const activeChild = ProfileService.getActive();
      if (activeChild) {
        setState("childMode");
        return;
      }
      // Block #3: Standard admin allow-list check.
      const ok = await AdminService.isAdmin(user);
      if (!cancelled) setState(ok ? "allowed" : "denied");
    })();
    return () => { cancelled = true; };
  }, [user, guest, childTick]);

  if (state === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-spin">⏳</div>
          <p className="text-slate-600 dark:text-slate-300 font-semibold">{l.checking}</p>
        </div>
      </div>
    );
  }

  if (state === "childMode") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-rose-50 dark:from-slate-900 dark:to-slate-800 px-4">
        <div className="max-w-md text-center bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-700">
          <div className="text-7xl mb-4">👶</div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{l.childMode}</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">{l.childModeDesc}</p>
          <div className="flex flex-col gap-2">
            <Link to="/profile" className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold shadow-md hover:shadow-lg">
              {l.switchToParent}
            </Link>
            <Link to="/" className="inline-block px-5 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700">
              {l.home}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (state === "guest") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 px-4">
        <div className="max-w-md text-center bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-700">
          <div className="text-7xl mb-4">👤</div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{l.guest}</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">{l.guestDesc}</p>
          <div className="flex flex-col gap-2">
            <Link to="/auth" className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-md hover:shadow-lg">
              {l.signIn}
            </Link>
            <Link to="/" className="inline-block px-5 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700">
              {l.home}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 px-4">
        <div className="max-w-md text-center bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-slate-700">
          <div className="text-7xl mb-4">🔒</div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{l.title}</h1>
          <p className="text-slate-600 dark:text-slate-300 mb-6">{l.subtitle}</p>
          {user?.email && (
            <p className="text-xs text-slate-500 mb-4">{l.youAre}: <span className="font-mono font-bold">{user.email}</span></p>
          )}
          <Link to="/" className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">{l.home}</Link>
        </div>
      </div>
    );
  }

  return children;
}
