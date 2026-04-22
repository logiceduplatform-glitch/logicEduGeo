import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { LanguageContext } from "../i18n/LanguageContext";

const AGE_ROUTES = {
  "Age 2-3": "/play/2-3-fun",
  "Age 4-5": "/play/4-5-fun",
  "Age 6": "/play/6-fun",
  "Age 7-8": "/play/7-8-fun",
  "Age 9-10": "/play/9-10-fun",
  "Age 11-12": "/play/11-12-fun",
  "Age 11–12": "/play/11-12-fun",
  "Adult": "/play/adult-games",
};

export default function TryFreeSection({ t }) {
  const navigate = useNavigate();
  const { user, guest, userProfile } = useContext(AuthContext);
  const { lang } = useContext(LanguageContext);
  const isLoggedIn = !!(user || guest);
  const isEl = lang === "el";

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-indigo-700 to-pink-700" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)",
        }}
      />

      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/20"
          style={{
            top: `${15 + i * 15}%`,
            left: `${5 + i * 18}%`,
            animation: `float ${3 + i * 0.4}s ease-in-out ${i * 0.5}s infinite alternate`,
          }}
        />
      ))}

      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          100% { transform: translateY(-12px); }
        }
      `}</style>

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <div className="text-5xl mb-6">🚀</div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          {isLoggedIn
            ? (isEl ? "Καλωσόρισες πίσω!" : "Welcome back!")
            : t("tryFree", "Try for free")}
        </h2>
        <p className="text-lg text-purple-200 mb-10 max-w-xl mx-auto leading-relaxed">
          {isLoggedIn
            ? (isEl ? "Συνέχισε από εκεί που σταμάτησες ή δες τα στατιστικά σου." : "Continue where you left off or check your stats.")
            : t("tryFreeSub", "Enter your email to join and keep progress across devices.")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => {
                  const age = userProfile?.age || guest?.age || "";
                  navigate(AGE_ROUTES[age] || "/play");
                }}
                className="px-8 py-4 rounded-2xl bg-white text-purple-700 font-bold text-lg hover:bg-purple-50 shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
              >
                {isEl ? "Συνέχισε να παίζεις →" : "Continue playing →"}
              </button>
              <button
                onClick={() => navigate("/stats")}
                className="px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 hover:border-white/60 transition-all duration-300"
              >
                {isEl ? "Τα στατιστικά μου" : "My stats"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/auth?mode=register")}
                className="px-8 py-4 rounded-2xl bg-white text-purple-700 font-bold text-lg hover:bg-purple-50 shadow-xl shadow-black/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
              >
                {t("register", "Sign Up")}
              </button>
              <button
                onClick={() => navigate("/guest-setup")}
                className="px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold hover:bg-white/10 hover:border-white/60 transition-all duration-300"
              >
                {t("tryAsGuest", "Try as guest")}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
