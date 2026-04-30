import React, { useState, useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

export default function ShareButton({ title, text, url, className = "" }) {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleShare = async () => {
    setFailed(false);
    const shareData = {
      title: title || "Kibloo",
      text: text || (isEl ? "Δες τα επιτεύγματά μου!" : "Check out my achievements!"),
      url: url || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        if (e.name !== "AbortError") {
          setFailed(true);
          setTimeout(() => setFailed(false), 3000);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        setFailed(true);
        setTimeout(() => setFailed(false), 3000);
      }
    }
  };

  const btnClass = failed
    ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
    : copied
      ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700";

  return (
    <button onClick={handleShare} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${btnClass} ${className}`}>
      {failed ? (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          {isEl ? "Αντιγράψτε χειροκίνητα" : "Copy link manually"}
        </>
      ) : copied ? (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          {isEl ? "Αντιγράφηκε!" : "Copied!"}
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          {isEl ? "Κοινοποίηση" : "Share"}
        </>
      )}
    </button>
  );
}
