import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { SignLanguageService } from "../services/SignLanguageService";
import { AccessibilityService } from "../services/AccessibilityService";

const T = {
  el: { open: "Νοηματική", close: "Κλείσε", noVideo: "Δεν υπάρχει διαθέσιμο βίντεο", title: "Βίντεο Νοηματικής για:" },
  en: { open: "Sign", close: "Close", noVideo: "No video available", title: "Sign language video for:" },
};

/**
 * SignLanguageButton — small icon button next to text that opens a sign-language video popup.
 * Only renders if a11y.signLanguage is enabled.
 *
 * Props:
 *   - signKey: key to look up in SignLanguageService (e.g. "play", "next")
 *   - label: optional human-readable label for the popup header
 *   - className: extra classes
 *   - inline: if true, render compact icon
 */
export default function SignLanguageButton({ signKey, label, className = "", inline = false }) {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [open, setOpen] = useState(false);
  const [a11y, setA11y] = useState(() => AccessibilityService.getPrefs());

  useEffect(() => {
    return AccessibilityService.subscribe(setA11y);
  }, []);

  if (!a11y.signLanguage) return null;

  const video = SignLanguageService.get(signKey);

  return (
    <>
      <button
        data-sign-button="true"
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className={`inline-flex items-center gap-1 ${inline ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-sm"} rounded-md bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-200 dark:hover:bg-violet-900/50 transition ${className}`}
        title={l.open}
        aria-label={`${l.open}: ${label || signKey}`}
      >
        <span aria-hidden>🤟</span>
        {!inline && <span>{l.open}</span>}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1000] bg-black/70 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-slate-800 dark:text-white">
                <span className="mr-2">🤟</span>{l.title} <span className="text-violet-600">{label || signKey}</span>
              </h3>
              <button onClick={() => setOpen(false)} className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold">
                ✕
              </button>
            </div>
            {video ? (
              video.source === "youtube" ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={video.url}
                    title={`Sign language: ${signKey}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  />
                </div>
              ) : (
                <video src={video.url} controls className="w-full rounded-lg" />
              )
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">{l.noVideo}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
