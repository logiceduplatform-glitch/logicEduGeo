import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

export default function SWUpdateBanner() {
  const { lang } = useContext(LanguageContext);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(true);
    window.addEventListener("sw-update-available", handler);
    return () => window.removeEventListener("sw-update-available", handler);
  }, []);

  if (!show) return null;

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[110] max-w-sm w-full px-4">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-3 text-white">
        <span className="text-xl shrink-0">🔄</span>
        <p className="text-sm font-medium flex-1">
          {lang === "el"
            ? "Νέα έκδοση διαθέσιμη!"
            : "New version available!"}
        </p>
        <button
          onClick={handleReload}
          className="shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold bg-white text-purple-700 hover:bg-purple-50 transition-colors"
        >
          {lang === "el" ? "Ανανέωση" : "Reload"}
        </button>
        <button
          onClick={() => setShow(false)}
          className="shrink-0 text-white/70 hover:text-white text-sm"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
