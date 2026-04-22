import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { useSubscription } from "../contexts/SubscriptionContext";

const PLANS = [
  {
    id: "free",
    icon: "🎮",
    gradient: "from-slate-500 to-slate-600",
    price: "0",
    features: {
      el: ["5 παιχνίδια ανά κατηγορία", "Βασικά στατιστικά", "Λειτουργία επισκέπτη"],
      en: ["5 games per category", "Basic statistics", "Guest mode"],
    },
  },
  {
    id: "premium",
    icon: "⭐",
    gradient: "from-amber-500 to-orange-500",
    price: "2.99",
    popular: true,
    features: {
      el: ["Όλα τα παιχνίδια ξεκλειδωμένα", "Λεπτομερή στατιστικά", "Πιστοποιητικά επιτυχίας", "Χωρίς διαφημίσεις"],
      en: ["All games unlocked", "Detailed statistics", "Achievement certificates", "No ads"],
    },
  },
  {
    id: "family",
    icon: "👨‍👩‍👧‍👦",
    gradient: "from-purple-500 to-pink-500",
    price: "4.99",
    features: {
      el: ["Ό,τι έχει το Premium", "Έως 3 προφίλ παιδιών", "Γονικός πίνακας ελέγχου", "Αναφορές προόδου"],
      en: ["Everything in Premium", "Up to 3 child profiles", "Parent dashboard", "Progress reports"],
    },
  },
];

const LABELS = {
  el: { free: "Δωρεάν", premium: "Premium", family: "Οικογενειακό", mo: "/μήνα", popular: "Δημοφιλές", startFree: "Ξεκίνα δωρεάν", upgrade: "Αναβάθμιση", choose: "Επιλογή", active: "Ενεργό ✓", trial: "7 ημέρες δωρεάν δοκιμή. Ακύρωσε οποτεδήποτε.", title: "Πλάνα", heading: "Ξεκίνα δωρεάν, αναβαθμίσου όταν θες", subtitle: "5 παιχνίδια ανά κατηγορία δωρεάν. Αναβάθμισε σε Premium για πλήρη πρόσβαση." },
  en: { free: "Free", premium: "Premium", family: "Family", mo: "/mo", popular: "Popular", startFree: "Start free", upgrade: "Upgrade", choose: "Choose", active: "Active ✓", trial: "7-day free trial. Cancel anytime.", title: "Pricing", heading: "Start free, upgrade when you want", subtitle: "5 games per category for free. Upgrade to Premium for full access." },
};

export default function PricingSection() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const { user, guest } = useContext(AuthContext);
  const { isPremium, tier } = useSubscription();
  const isEl = lang === "el";
  const l = LABELS[isEl ? "el" : "en"];

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-sm font-semibold mb-4">
            {l.title}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-3">
            {l.heading}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            {l.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const isActive = tier === plan.id;
            const name = l[plan.id];
            const features = plan.features[isEl ? "el" : "en"];

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl border-2 bg-white dark:bg-slate-800 p-8 transition-all duration-300 ${
                  plan.popular
                    ? "border-amber-400 dark:border-amber-500 shadow-xl shadow-amber-200/30 dark:shadow-amber-900/30 scale-[1.02]"
                    : isActive
                      ? "border-emerald-400 dark:border-emerald-500 shadow-lg"
                      : "border-slate-200 dark:border-slate-700 shadow-md"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold">
                    {l.popular}
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center text-xl mb-3 shadow-lg`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">{name}</h3>
                  <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2">
                    {plan.price === "0" ? l.free : `€${plan.price}`}
                    {plan.price !== "0" && (
                      <span className="text-base font-medium text-slate-500 dark:text-slate-400">{l.mo}</span>
                    )}
                  </p>
                </div>

                <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400 mb-6">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {isActive ? (
                  <div className="w-full py-3 rounded-2xl text-center font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50">
                    {l.active}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (plan.id === "free") navigate(user || guest ? "/play" : "/guest-setup");
                      else navigate("/subscription");
                    }}
                    className={`w-full py-3 rounded-2xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] ${
                      plan.popular
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-300/30 dark:shadow-amber-900/30"
                        : `bg-gradient-to-r ${plan.gradient}`
                    }`}
                  >
                    {plan.id === "free" ? l.startFree : plan.id === "premium" ? (isPremium ? l.active : l.upgrade) : l.choose}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-8">{l.trial}</p>
      </div>
    </section>
  );
}
