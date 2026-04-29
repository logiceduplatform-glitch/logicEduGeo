import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { VoiceCommandService } from "../services/VoiceCommandService";
import { useTheme } from "../contexts/ThemeContext";

const T = {
  el: {
    listen: "Φωνητική εντολή",
    listening: "Ακούω...",
    notSupported: "Μη υποστηριζόμενο από browser",
    sayHelp: "Π.χ. «αρχική», «κατοικίδιο», «δάσκαλος», «πίσω»",
    heard: "Άκουσα:",
    notFound: "Δεν βρέθηκε αντίστοιχη εντολή",
    tryAgain: "Δοκίμασε ξανά",
    close: "Κλείσιμο",
  },
  en: {
    listen: "Voice command",
    listening: "Listening...",
    notSupported: "Not supported by browser",
    sayHelp: "E.g. 'home', 'pet', 'teacher', 'back'",
    heard: "I heard:",
    notFound: "No matching command",
    tryAgain: "Try again",
    close: "Close",
  },
};

export default function VoiceCommandButton() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const themeCtx = useTheme() || {};
  const navigate = useNavigate();
  const l = T[lang] || T.en;

  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const supported = VoiceCommandService.isSupported();

  useEffect(() => {
    return VoiceCommandService.onListeningChange(setListening);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        VoiceCommandService.stop();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const startListening = () => {
    setOpen(true);
    setFeedback(null);
    VoiceCommandService.start({
      lang,
      onResult: ({ transcript, command }) => {
        setFeedback({ transcript, command });
        if (command) {
          setTimeout(() => executeCommand(command), 600);
        }
      },
      onError: (err) => {
        setFeedback({ error: err });
      },
    });
  };

  const executeCommand = (cmd) => {
    if (cmd.path) {
      navigate(cmd.path);
      setOpen(false);
    } else if (cmd.action === "back") {
      navigate(-1);
      setOpen(false);
    } else if ((cmd.action === "dark" || cmd.action === "light") && themeCtx.toggle) {
      const wantDark = cmd.action === "dark";
      if (themeCtx.dark !== wantDark) themeCtx.toggle();
      setOpen(false);
    } else if (cmd.action === "search") {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
      setOpen(false);
    } else if (cmd.action === "help") {
      navigate("/faq");
      setOpen(false);
    }
  };

  if (!supported) return null;

  return (
    <>
      <button
        onClick={startListening}
        title={l.listen}
        aria-label={l.listen}
        aria-pressed={listening}
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${listening ? "bg-red-500 text-white animate-pulse" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"}`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 0 1-14 0M12 19v3m-4 0h8M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => { VoiceCommandService.stop(); setOpen(false); }}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={l.listen}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${listening ? "bg-gradient-to-br from-red-500 to-pink-600 animate-pulse" : "bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600"}`}>
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 0 1-14 0M12 19v3m-4 0h8M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">
              {listening ? l.listening : l.listen}
            </h3>
            {!feedback && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">{l.sayHelp}</p>
            )}

            {feedback && (
              <div className="mt-4 space-y-2">
                {feedback.transcript && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm">
                    <span className="text-slate-400 text-xs">{l.heard}</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">"{feedback.transcript}"</p>
                  </div>
                )}
                {feedback.command ? (
                  <p className="text-emerald-500 font-bold">✅ {feedback.command.path || feedback.command.action}</p>
                ) : feedback.error ? (
                  <p className="text-amber-500 text-sm">⚠️ {feedback.error}</p>
                ) : (
                  <p className="text-amber-500 text-sm">{l.notFound}</p>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-5">
              {!listening && (
                <button onClick={startListening} className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                  🎤 {l.tryAgain}
                </button>
              )}
              <button onClick={() => { VoiceCommandService.stop(); setOpen(false); }} className="flex-1 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold">
                {l.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
