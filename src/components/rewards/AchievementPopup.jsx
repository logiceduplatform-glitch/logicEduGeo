import React, { useEffect, useState } from "react";
import { getAchievementById } from "../../services/RewardsService";

export default function AchievementPopup({ achievementId, lang = "el", onClose }) {
  const [visible, setVisible] = useState(false);
  const achievement = getAchievementById(achievementId);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!achievement) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      {/* Confetti background */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              fontSize: `${12 + Math.random() * 20}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          >
            {["🎉", "✨", "🌟", "🎊", "💫"][i % 5]}
          </div>
        ))}
      </div>

      <div
        className={`relative pointer-events-auto bg-white rounded-3xl shadow-2xl p-8 max-w-sm mx-4 text-center transition-all duration-500 ${
          visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <div className="text-7xl mb-3 animate-bounce">{achievement.icon}</div>
        <div className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-1">
          {lang === "el" ? "Νέο Βραβείο!" : "New Badge!"}
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {achievement.title[lang]}
        </h2>
        <p className="text-slate-500 text-sm mb-4">
          {achievement.description[lang]}
        </p>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg"
        >
          {lang === "el" ? "Τέλεια!" : "Awesome!"}
        </button>
      </div>
    </div>
  );
}
