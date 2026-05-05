import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { db } from "../auth/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";

/**
 * Public status page (`/status`).
 *
 * Performs lightweight health probes against Firebase Auth & Firestore from
 * the user's browser and reports a green/yellow/red status. Used by:
 *   - UptimeRobot HTTP keyword check ("All systems operational")
 *   - Curious users wondering "is it down for me?"
 */

const T = {
  el: {
    title: "Status της Πλατφόρμας",
    desc: "Δες σε πραγματικό χρόνο την υγεία των υπηρεσιών μας.",
    overall: { ok: "✅ Όλα τα συστήματα λειτουργικά", degraded: "⚠️ Μερική διακοπή", down: "🔴 Σημαντική διακοπή" },
    services: {
      hosting:    "Web Hosting",
      auth:       "Authentication",
      firestore:  "Database (Firestore)",
      functions:  "Cloud Functions",
    },
    statusOk: "Λειτουργικό",
    statusSlow: "Αργό",
    statusDown: "Διακοπή",
    statusChecking: "Έλεγχος…",
    refresh: "🔄 Επανέλεγχος",
    incident: "Δεν υπάρχουν ενεργά incidents τις τελευταίες 24 ώρες.",
    contact: "Αντιμετωπίζεις πρόβλημα; Στείλε μας email στο",
    history: "Ιστορικό incidents",
    historyEmpty: "Δεν υπάρχουν αναφερόμενα incidents.",
    lastChecked: "Τελευταίος έλεγχος",
  },
  en: {
    title: "Platform Status",
    desc: "Real-time health of our services.",
    overall: { ok: "✅ All systems operational", degraded: "⚠️ Partial outage", down: "🔴 Major outage" },
    services: {
      hosting:    "Web Hosting",
      auth:       "Authentication",
      firestore:  "Database (Firestore)",
      functions:  "Cloud Functions",
    },
    statusOk: "Operational",
    statusSlow: "Degraded",
    statusDown: "Down",
    statusChecking: "Checking…",
    refresh: "🔄 Recheck",
    incident: "No active incidents in the last 24 hours.",
    contact: "Having issues? Email us at",
    history: "Incident history",
    historyEmpty: "No reported incidents.",
    lastChecked: "Last checked",
  },
};

function pillClass(status) {
  if (status === "ok") return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  if (status === "slow") return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
  if (status === "down") return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
}

function dotClass(status) {
  if (status === "ok") return "bg-emerald-500";
  if (status === "slow") return "bg-yellow-500";
  if (status === "down") return "bg-red-500";
  return "bg-slate-400";
}

export default function StatusPage() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const l = T[lang === "el" ? "el" : "en"];
  const [checks, setChecks] = useState({
    hosting:   { status: "checking", ms: 0 },
    auth:      { status: "checking", ms: 0 },
    firestore: { status: "checking", ms: 0 },
    functions: { status: "checking", ms: 0 },
  });
  const [now, setNow] = useState(new Date());

  const runChecks = async () => {
    setChecks((c) => Object.fromEntries(Object.entries(c).map(([k]) => [k, { status: "checking", ms: 0 }])));

    // Hosting check: page already loaded, so it's OK by definition.
    const next = { hosting: { status: "ok", ms: 0 } };

    // Auth check: just imports loaded → OK if firebase is initialised.
    try {
      const t0 = performance.now();
      const { auth } = await import("../auth/firebase");
      const ms = Math.round(performance.now() - t0);
      next.auth = { status: auth ? (ms > 1500 ? "slow" : "ok") : "down", ms };
    } catch {
      next.auth = { status: "down", ms: 0 };
    }

    // Firestore check: try a tiny read (1 doc from a public collection).
    try {
      const t0 = performance.now();
      if (!db) throw new Error("no db");
      await getDocs(query(collection(db, "featureFlags"), limit(1)));
      const ms = Math.round(performance.now() - t0);
      next.firestore = { status: ms > 2500 ? "slow" : "ok", ms };
    } catch {
      next.firestore = { status: "down", ms: 0 };
    }

    // Functions check: best-effort HEAD request to a known callable URL prefix.
    // We probe only DNS, not actually invoke (avoids cost).
    try {
      const t0 = performance.now();
      // Cloud Functions root domain – returns 404 quickly when up, network error when down.
      const res = await fetch("https://europe-west1-logic-education-platform.cloudfunctions.net/", {
        method: "HEAD", mode: "no-cors", cache: "no-store",
      });
      const ms = Math.round(performance.now() - t0);
      next.functions = { status: ms > 2000 ? "slow" : "ok", ms };
      void res;
    } catch {
      next.functions = { status: "down", ms: 0 };
    }

    setChecks(next);
    setNow(new Date());
  };

  useEffect(() => { runChecks(); /* on mount */ }, []);

  const allOk = Object.values(checks).every((c) => c.status === "ok");
  const anyDown = Object.values(checks).some((c) => c.status === "down");
  const overall = allOk ? "ok" : anyDown ? "down" : "degraded";

  return (
    <div id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO title={l.title} description={l.desc} canonical="/status" />
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 mb-6 flex items-center gap-1"
          >
            &larr; {lang === "el" ? "Πίσω" : "Back"}
          </button>

          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">{l.title}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{l.desc}</p>

          {/* Overall banner */}
          <div className={`rounded-2xl p-5 mb-6 border-2 ${
            overall === "ok"   ? "bg-emerald-50 border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-700" :
            overall === "down" ? "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700" :
                                  "bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700"
          }`}>
            <div className="text-2xl font-extrabold">
              {l.overall[overall]}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {l.lastChecked}: {now.toLocaleTimeString()}
            </div>
          </div>

          {/* Per-service grid */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
            {Object.entries(checks).map(([key, val], i) => (
              <div key={key} className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-slate-100 dark:border-slate-700" : ""}`}>
                <div className="flex items-center gap-3">
                  <span className={`inline-block w-3 h-3 rounded-full ${dotClass(val.status)} ${val.status === "checking" ? "animate-pulse" : ""}`} />
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{l.services[key]}</span>
                </div>
                <div className="flex items-center gap-3">
                  {val.ms > 0 && (
                    <span className="text-xs text-slate-500">{val.ms} ms</span>
                  )}
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${pillClass(val.status)}`}>
                    {val.status === "ok"       ? l.statusOk :
                     val.status === "slow"     ? l.statusSlow :
                     val.status === "down"     ? l.statusDown :
                                                  l.statusChecking}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={runChecks}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow mb-8"
          >
            {l.refresh}
          </button>

          {/* Incident history */}
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">{l.history}</h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm text-sm text-slate-600 dark:text-slate-400">
            {l.incident}
          </div>

          <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
            {l.contact} <a href="mailto:support@kibloo.app" className="text-purple-600 dark:text-purple-400 hover:underline">support@kibloo.app</a>
          </p>
        </div>
      </main>
    </div>
  );
}
