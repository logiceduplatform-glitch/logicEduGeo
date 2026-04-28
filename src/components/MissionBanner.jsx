import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";

export default function MissionBanner() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const { user, guest } = useContext(AuthContext);
  const isEl = lang === "el";
  const isLoggedIn = !!(user || guest);

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 40%, rgba(139,92,246,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(236,72,153,0.2) 0%, transparent 50%)",
        }}
      />

      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-white/20"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
            animation: `pulse ${2 + i * 0.3}s ease-in-out ${i * 0.4}s infinite alternate`,
          }}
        />
      ))}

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-white/80 tracking-wide uppercase">
            {isEl ? "Η αποστολή μας" : "Our mission"}
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
          {isEl ? (
            <>Κάθε παιδί αξίζει να{" "}<span className="bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">αγαπήσει τη μάθηση</span></>
          ) : (
            <>Every child deserves to{" "}<span className="bg-gradient-to-r from-amber-300 to-pink-300 bg-clip-text text-transparent">love learning</span></>
          )}
        </h2>

        <p className="text-lg text-purple-200/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          {isEl
            ? "Δημιουργήσαμε μια ασφαλή, χωρίς διαφημίσεις πλατφόρμα όπου η μάθηση γίνεται παιχνίδι. Για μαθητές, δασκάλους και γονείς — δωρεάν."
            : "We built a safe, ad-free platform where learning becomes play. For students, teachers, and parents — free."}
        </p>

        {!isLoggedIn && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/auth?mode=register")}
              className="px-8 py-4 rounded-2xl bg-white text-purple-700 font-bold text-base hover:bg-purple-50 shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
            >
              {isEl ? "Ξεκίνα δωρεάν" : "Start for free"}
            </button>
            <button
              onClick={() => navigate("/guest-setup")}
              className="px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-semibold hover:bg-white/10 hover:border-white/40 transition-all duration-300"
            >
              {isEl ? "Δοκίμασε ως επισκέπτης" : "Try as guest"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
