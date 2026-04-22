import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

const STORAGE_KEY = "geo:pwa-dismissed";
const DISMISS_DAYS = 7;

function isDismissed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const { until } = JSON.parse(raw);
    return until && Date.now() < until;
  } catch {
    return false;
  }
}

function setDismissed() {
  const until = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ until }));
}

export default function InstallPrompt() {
  const { lang } = useContext(LanguageContext);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  const installLabel = lang === "el" ? "Εγκατάσταση εφαρμογής" : "Install app";
  const dismissLabel = lang === "el" ? "Άκυρο" : "Dismiss";
  const message =
    lang === "el"
      ? "Εγκαταστήστε την εφαρμογή για γρήγορη πρόσβαση!"
      : "Install the app for quick access!";

  useEffect(() => {
    if (isDismissed()) return;

    function handleBeforeInstall(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setDismissed();
    setVisible(false);
    setDeferredPrompt(null);
  };

  if (!visible) return null;

  return (
    <div
      role="banner"
      aria-label={installLabel}
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 bg-slate-800 text-white px-4 py-3 shadow-lg border-t border-slate-700"
    >
      <p className="text-sm flex-1">{message}</p>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleInstall}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg font-medium transition-colors active:scale-95"
        >
          {installLabel}
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="px-3 py-2 text-slate-300 hover:text-white transition-colors"
        >
          {dismissLabel}
        </button>
      </div>
    </div>
  );
}
