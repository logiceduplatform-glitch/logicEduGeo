import React, { useEffect, useState, useMemo } from "react";
import { SeasonalThemeService } from "../services/SeasonalThemeService";

// Floating decorations across the screen for the active seasonal theme.
export default function SeasonalDecorations() {
  const [theme, setTheme] = useState(() => SeasonalThemeService.getActive());

  useEffect(() => {
    const handler = () => setTheme(SeasonalThemeService.getActive());
    window.addEventListener("geo:seasonalThemeChange", handler);
    return () => window.removeEventListener("geo:seasonalThemeChange", handler);
  }, []);

  // Reduce motion preference
  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const decorations = useMemo(() => {
    if (!theme || theme.id === "auto" || !theme.decorations || theme.decorations.length === 0) return [];
    if (reduceMotion) return [];
    const count = 12;
    const items = [];
    for (let i = 0; i < count; i++) {
      const d = theme.decorations[i % theme.decorations.length];
      items.push({
        id: `${theme.id}_${i}`,
        emoji: d,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 10,
        size: 18 + Math.random() * 22,
      });
    }
    return items;
  }, [theme, reduceMotion]);

  if (decorations.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes floatdown {
          0%   { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.8; }
          50%  { transform: translateY(50vh) translateX(20px) rotate(180deg); }
          90%  { opacity: 0.8; }
          100% { transform: translateY(110vh) translateX(-15px) rotate(360deg); opacity: 0; }
        }
      `}</style>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        {decorations.map(d => (
          <span
            key={d.id}
            className="absolute select-none"
            style={{
              left: `${d.left}%`,
              top: 0,
              fontSize: `${d.size}px`,
              animation: `floatdown ${d.duration}s linear ${d.delay}s infinite`,
              willChange: "transform, opacity",
            }}
          >
            {d.emoji}
          </span>
        ))}
      </div>
    </>
  );
}
