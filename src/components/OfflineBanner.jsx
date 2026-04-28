import React, { useState, useEffect } from "react";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => { setOffline(false); setDismissed(false); };
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[95%] max-w-md animate-[slideUp_0.3s_ease-out]">
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 dark:bg-slate-700 text-white shadow-2xl border border-slate-700 dark:border-slate-500">
        <span className="text-xl shrink-0">📡</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold">Εκτός σύνδεσης / Offline</p>
          <p className="text-xs text-slate-300 mt-0.5">Μπορείτε να συνεχίσετε να παίζετε. Η πρόοδος θα συγχρονιστεί αυτόματα.</p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
