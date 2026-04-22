import React, { useState } from "react";
import { VoiceService } from "../../services/VoiceService";
import { GAME_INSTRUCTIONS } from "../../config/gameInstructions";

export default function VoiceButton({ gameId, lang = "el" }) {
  const [speaking, setSpeaking] = useState(false);

  const handleClick = () => {
    if (speaking) {
      VoiceService.stop();
      setSpeaking(false);
      return;
    }

    const instruction = GAME_INSTRUCTIONS[gameId];
    if (!instruction) return;

    setSpeaking(true);
    VoiceService.speak(instruction[lang] || instruction.el, lang);

    const checkDone = setInterval(() => {
      if (!window.speechSynthesis?.speaking) {
        setSpeaking(false);
        clearInterval(checkDone);
      }
    }, 300);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
        speaking
          ? "bg-purple-100 text-purple-700 shadow-md scale-105"
          : "bg-white text-slate-600 hover:bg-purple-50 hover:text-purple-600 shadow-sm border border-slate-200"
      }`}
      title={lang === "el" ? "Άκουσε τις οδηγίες" : "Listen to instructions"}
    >
      <span className={`text-lg ${speaking ? "animate-pulse" : ""}`}>
        {speaking ? "🔊" : "🔈"}
      </span>
      <span className="hidden sm:inline">
        {speaking
          ? lang === "el" ? "Σταμάτα" : "Stop"
          : lang === "el" ? "Οδηγίες" : "Instructions"}
      </span>
    </button>
  );
}
