import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { ProfileService } from "../services/ProfileService";
import {
  ageToQuizRoute,
  adultObjectiveRoutes,
  age2_3ObjectiveRoutes,
  age4_5ObjectiveRoutes,
  age6ObjectiveRoutes,
  age7_8ObjectiveRoutes,
  age9_10ObjectiveRoutes,
  age11_12ObjectiveRoutes,
} from "../config/quizRoutes";

function getObjectiveRoutes(ageKey) {
  if (ageKey === "Adult") return adultObjectiveRoutes;
  if (ageKey === "Age 2-3") return age2_3ObjectiveRoutes;
  if (ageKey === "Age 4-5") return age4_5ObjectiveRoutes;
  if (ageKey === "Age 6") return age6ObjectiveRoutes;
  if (ageKey === "Age 7-8") return age7_8ObjectiveRoutes;
  if (ageKey === "Age 9-10") return age9_10ObjectiveRoutes;
  if (ageKey === "Age 11–12" || ageKey === "Age 11-12") return age11_12ObjectiveRoutes;
  return null;
}

const FLOATING_SHAPES = [
  { size: 80, color: "bg-purple-400/20", top: "10%", left: "5%", delay: 0 },
  { size: 60, color: "bg-pink-400/20", top: "60%", left: "12%", delay: 1.5 },
  { size: 100, color: "bg-indigo-400/15", top: "20%", right: "8%", delay: 0.8 },
  { size: 50, color: "bg-amber-400/20", top: "70%", right: "15%", delay: 2.2 },
  { size: 70, color: "bg-emerald-400/15", top: "40%", left: "45%", delay: 1 },
  { size: 40, color: "bg-cyan-400/20", top: "85%", left: "30%", delay: 3 },
];

function AnimatedCounter({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(id); }
      else setCount(start);
    }, 16);
    return () => clearInterval(id);
  }, [target, duration]);
  return <>{count}{suffix}</>;
}

const STATS = [
  { label: { el: "Παιχνίδια", en: "Games" }, value: 350, suffix: "+", gradient: "from-purple-500 to-pink-500", icon: "🎮" },
  { label: { el: "Κατηγορίες", en: "Categories" }, value: 15, suffix: "+", gradient: "from-amber-500 to-orange-500", icon: "📚" },
  { label: { el: "Ηλικίες", en: "Age Groups" }, value: 7, suffix: "", gradient: "from-emerald-500 to-teal-500", icon: "👶" },
];

export default function HeroSection({ t, loginWithGoogle, beginGuest, guest, user, userProfile }) {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";
  const isLoggedIn = !!(user || guest);

  return (
    <section className="relative isolate overflow-hidden min-h-[600px] flex items-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />
      <div
        className="absolute inset-0 -z-10 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120,80,200,0.3), transparent), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(236,72,153,0.2), transparent)",
        }}
      />

      {/* Floating shapes */}
      {FLOATING_SHAPES.map((s, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${s.color} blur-sm pointer-events-none`}
          style={{
            width: s.size, height: s.size,
            top: s.top, left: s.left, right: s.right,
            animation: `float ${4 + i * 0.5}s ease-in-out ${s.delay}s infinite alternate`,
          }}
        />
      ))}

      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(8deg); }
        }
      `}</style>

      <div className="mx-auto max-w-6xl w-full px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left - text */}
        <div className="flex flex-col justify-center gap-5">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-bold border border-amber-200 dark:border-amber-700 tracking-wide uppercase self-start">
            🧠 {t("tagline", "Train your brain with logic")}
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #db2777, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("heroTitle", "Where curiosity blooms.")}
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
            {t("heroSubtitle", "Welcome to Kibloo! 350+ playful educational games for kids 2–12 & curious adults.")}
          </p>

          {isLoggedIn ? (
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={() => {
                  const child = ProfileService.getActive();
                  const age = child?.age || userProfile?.age || guest?.age || "";
                  const objective = child?.objective || userProfile?.objective || guest?.objective || "fun";
                  const routes = getObjectiveRoutes(age);
                  if (routes && routes[objective]) {
                    navigate(routes[objective]);
                  } else {
                    navigate(ageToQuizRoute[age] || "/play");
                  }
                }}
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg hover:from-purple-700 hover:to-pink-700 shadow-xl shadow-purple-300/40 hover:shadow-2xl hover:shadow-purple-400/50 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
              >
                {isEl ? "Συνέχισε να παίζεις" : "Continue playing"}
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="px-8 py-4 rounded-2xl border-2 border-purple-200 dark:border-purple-600 text-purple-700 dark:text-purple-300 font-semibold hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300"
              >
                {isEl ? "Το προφίλ μου" : "My profile"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={() => navigate("/auth?mode=register")}
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg hover:from-purple-700 hover:to-pink-700 shadow-xl shadow-purple-300/40 hover:shadow-2xl hover:shadow-purple-400/50 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
              >
                {t("register", "Sign Up")}
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </button>

              <button
                onClick={() => navigate("/auth")}
                className="px-8 py-4 rounded-2xl border-2 border-purple-200 dark:border-purple-600 text-purple-700 dark:text-purple-300 font-semibold hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300"
              >
                {t("logIn", "Log in")}
              </button>

              <button
                onClick={() => navigate("/guest-setup")}
                className="px-8 py-4 rounded-2xl bg-white/70 dark:bg-emerald-900/30 backdrop-blur border-2 border-emerald-200 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/50 hover:border-emerald-400 transition-all duration-300"
              >
                {t("tryAsGuest", "Try as guest")}
              </button>
            </div>
          )}

          {guest && (
            <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg inline-flex items-center gap-2 self-start">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {t("guestActive", "Guest mode active")}
            </p>
          )}
        </div>

        {/* Right - stats cards */}
        <div className="flex flex-col items-center gap-5">
          <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
            {STATS.map((s, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/50 dark:border-slate-700 shadow-lg p-5 flex items-center gap-4 hover:scale-105 hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-2xl shadow-md shrink-0`}>
                  {s.icon}
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-slate-800 dark:text-white">
                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {s.label[isEl ? "el" : "en"] || s.label.en}
                  </div>
                </div>
                <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-gradient-to-br ${s.gradient} opacity-10`} />
              </div>
            ))}
          </div>

          {/* Trust badge */}
          <div className="flex items-center gap-4 px-5 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur rounded-xl border border-white/50 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg key={s} className={`w-5 h-5 ${s <= 4 ? "text-amber-400" : "text-amber-300"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-sm font-bold text-slate-800 dark:text-white">4.8</span>
            </div>
            <div className="h-5 w-px bg-slate-300 dark:bg-slate-600" />
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {isEl ? "Αγαπημένο από" : "Loved by"}{" "}
              <span className="font-semibold text-slate-800 dark:text-white">500+</span>{" "}
              {isEl ? "οικογένειες" : "families"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
