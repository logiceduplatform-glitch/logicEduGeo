import React, { useContext, useEffect, useState, useRef } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

const STATS = [
  { value: 100, suffix: "+", icon: "🎮", label: { el: "Παιχνίδια", en: "Games" } },
  { value: 500, suffix: "+", icon: "❓", label: { el: "Ερωτήσεις", en: "Questions" } },
  { value: 7, suffix: "", icon: "👥", label: { el: "Ηλικιακές Ομάδες", en: "Age Groups" } },
  { value: 12, suffix: "+", icon: "📂", label: { el: "Κατηγορίες", en: "Categories" } },
  { value: 0, suffix: "", icon: "🚫", label: { el: "Διαφημίσεις", en: "Ads" }, isZero: true },
];

function AnimatedCounter({ target, suffix, trigger }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let frame;
    const duration = 1500;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [trigger, target]);

  return (
    <span className="text-3xl sm:text-4xl font-extrabold">
      {count}{suffix}
    </span>
  );
}

export default function StatsBar() {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-10 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-900 dark:via-indigo-900 dark:to-blue-900 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-40 h-40 rounded-full bg-white -top-10 -left-10" />
        <div className="absolute w-60 h-60 rounded-full bg-white -bottom-20 -right-20" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center text-white">
          {STATS.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="text-2xl mb-1">{s.icon}</span>
              <AnimatedCounter
                target={s.value}
                suffix={s.suffix}
                trigger={visible}
              />
              <span className="text-sm font-medium text-white/80">
                {s.isZero
                  ? (isEl ? "Καμία Διαφήμιση" : "Zero Ads")
                  : s.label[isEl ? "el" : "en"]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
