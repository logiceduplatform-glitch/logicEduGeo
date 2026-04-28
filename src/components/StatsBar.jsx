import React, { useContext, useEffect, useState, useRef } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

const STATS = [
  {
    value: 350, suffix: "+", icon: "🎮",
    gradient: "from-purple-500 to-pink-500",
    label: { el: "Εκπαιδευτικά Παιχνίδια", en: "Educational Games" },
    desc: { el: "Για κάθε ηλικία και επίπεδο", en: "For every age and level" },
  },
  {
    value: 7, suffix: "", icon: "👥",
    gradient: "from-blue-500 to-cyan-500",
    label: { el: "Ηλικιακές Ομάδες", en: "Age Groups" },
    desc: { el: "Από 2 ετών έως ενήλικες", en: "From age 2 to adults" },
  },
  {
    value: 0, suffix: "", icon: "🛡️", isZero: true,
    gradient: "from-emerald-500 to-teal-500",
    label: { el: "Διαφημίσεις", en: "Ads" },
    desc: { el: "100% ασφαλές περιβάλλον", en: "100% safe environment" },
  },
  {
    value: 100, suffix: "%", icon: "🎓",
    gradient: "from-amber-500 to-orange-500",
    label: { el: "Δωρεάν για Δασκάλους", en: "Free for Teachers" },
    desc: { el: "Πλήρη εργαλεία τάξης", en: "Full classroom tools" },
  },
];

function AnimatedCounter({ target, suffix, trigger }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let frame;
    const duration = 1800;
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
    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
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
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-14 sm:py-20 bg-slate-50 dark:bg-slate-900">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold mb-4">
            {isEl ? "Γιατί εμάς" : "Why us"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
            {isEl ? "Αριθμοί που μιλάνε" : "Numbers that speak"}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="relative group bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.gradient}`} />

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-xl shadow-md mb-4 group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>

              <div className="text-slate-800 dark:text-white mb-1">
                {s.isZero ? (
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                    {visible ? "0" : "—"}
                  </span>
                ) : (
                  <AnimatedCounter target={s.value} suffix={s.suffix} trigger={visible} />
                )}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200 mb-1">
                {s.isZero
                  ? (isEl ? "Καμία Διαφήμιση" : "Zero Ads")
                  : s.label[isEl ? "el" : "en"]}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">
                {s.desc[isEl ? "el" : "en"]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
