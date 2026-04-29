import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { VoiceService } from "../services/VoiceService";

const T = {
  el: { read: "Διάβασε", stop: "Σταμάτα", notSupported: "Μη διαθέσιμο" },
  en: { read: "Read aloud", stop: "Stop", notSupported: "Not available" },
};

// Inline button that reads given text via the existing VoiceService.
// Toggles play/stop. Shows nothing if speechSynthesis is not supported.
export default function ReadAloudButton({ text, size = "sm", className = "" }) {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== "undefined" && !!window.speechSynthesis;

  useEffect(() => {
    if (!supported) return;
    const ss = window.speechSynthesis;
    const tick = () => setSpeaking(ss.speaking);
    const id = setInterval(tick, 300);
    return () => { clearInterval(id); };
  }, [supported]);

  useEffect(() => {
    return () => {
      if (supported) {
        try { window.speechSynthesis.cancel(); } catch {}
      }
    };
  }, [supported]);

  if (!supported) return null;
  if (!text || !text.trim()) return null;

  const handle = () => {
    if (speaking) {
      VoiceService.stop();
      setSpeaking(false);
    } else {
      VoiceService.speak(text, lang);
      setSpeaking(true);
    }
  };

  const sizeCls = size === "lg"
    ? "w-11 h-11 text-xl"
    : size === "md"
      ? "w-9 h-9 text-base"
      : "w-8 h-8 text-sm";

  return (
    <button
      type="button"
      onClick={handle}
      aria-pressed={speaking}
      aria-label={speaking ? l.stop : l.read}
      title={speaking ? l.stop : l.read}
      className={`${sizeCls} ${className} inline-flex items-center justify-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${speaking ? "bg-red-500 text-white animate-pulse" : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50"}`}
    >
      <span aria-hidden>{speaking ? "⏹️" : "🔊"}</span>
    </button>
  );
}
