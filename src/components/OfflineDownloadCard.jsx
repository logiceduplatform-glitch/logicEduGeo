import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

const T = {
  el: {
    title: "📡 Offline Παιχνίδι",
    desc: "Κατέβασε τα δημοφιλή παιχνίδια ώστε να μπορείς να παίζεις χωρίς internet!",
    download: "Κατέβασε για offline",
    downloading: "Λήψη...",
    downloaded: "Έτοιμο! ✅",
    failed: "Απέτυχε. Δοκίμασε ξανά.",
    online: "✅ Είσαι online",
    offline: "❌ Είσαι offline",
    swUnavailable: "Το offline mode δεν είναι διαθέσιμο σε αυτή τη συσκευή.",
    benefits: "✓ Παίξε χωρίς internet  ✓ Πιο γρήγορη φόρτωση  ✓ Σώζεις δεδομένα κινητού",
  },
  en: {
    title: "📡 Offline Play",
    desc: "Download popular games so you can play without internet!",
    download: "Download for offline",
    downloading: "Downloading...",
    downloaded: "Ready! ✅",
    failed: "Failed. Try again.",
    online: "✅ You're online",
    offline: "❌ You're offline",
    swUnavailable: "Offline mode is not available on this device.",
    benefits: "✓ Play without internet  ✓ Faster loading  ✓ Save mobile data",
  },
};

const STATE_KEY = "geo:offlineDownloaded";

export default function OfflineDownloadCard() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;

  const [online, setOnline] = useState(navigator.onLine);
  const [state, setState] = useState(() => {
    try { return localStorage.getItem(STATE_KEY) || "idle"; } catch { return "idle"; }
  });
  const swSupported = typeof navigator !== "undefined" && "serviceWorker" in navigator;

  useEffect(() => {
    const onOn = () => setOnline(true);
    const onOff = () => setOnline(false);
    window.addEventListener("online", onOn);
    window.addEventListener("offline", onOff);
    return () => { window.removeEventListener("online", onOn); window.removeEventListener("offline", onOff); };
  }, []);

  const handleDownload = async () => {
    if (!swSupported) return;
    setState("downloading");
    try {
      const reg = await navigator.serviceWorker.ready;
      reg.active?.postMessage("PRECACHE_GAMES");
      // Optimistic - SW caches in background. Mark ready after 4s.
      setTimeout(() => {
        setState("done");
        try { localStorage.setItem(STATE_KEY, "done"); } catch {}
      }, 4000);
    } catch (e) {
      setState("error");
    }
  };

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="text-4xl">📡</div>
        <div className="flex-1">
          <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-1">{l.title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{l.desc}</p>
          <p className="text-[11px] text-slate-400 mt-1">{l.benefits}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${online ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
              {online ? l.online : l.offline}
            </span>

            {swSupported ? (
              <button
                onClick={handleDownload}
                disabled={state === "downloading" || !online}
                className={`px-4 py-2 rounded-xl text-sm font-bold text-white transition ${
                  state === "done" ? "bg-emerald-500" :
                  state === "downloading" ? "bg-slate-400" :
                  "bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg"
                }`}
              >
                {state === "downloading" ? `⏳ ${l.downloading}` :
                 state === "done" ? l.downloaded :
                 state === "error" ? `❌ ${l.failed}` :
                 `⬇️ ${l.download}`}
              </button>
            ) : (
              <span className="text-xs text-amber-600 dark:text-amber-400">{l.swUnavailable}</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
