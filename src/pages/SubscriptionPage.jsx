import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import { AnalyticsService } from "../services/AnalyticsService";
import { FeatureFlagService } from "../services/FeatureFlagService";

const T = {
  el: {
    title: "Συνδρομές",
    subtitle: "Επίλεξε το πλάνο που σου ταιριάζει",
    back: "Πίσω",
    current: "Τρέχον πλάνο",
    choosePlan: "Επιλογή",
    activePlan: "Ενεργό",
    cancel: "Ακύρωση συνδρομής",
    loginFirst: "Πρέπει να συνδεθείς για να εγγραφείς",
    loginBtn: "Σύνδεση",
    free: "Δωρεάν",
    premium: "Premium",
    family: "Οικογενειακό",
    mo: "/μήνα",
    yr: "/χρόνο",
    monthly: "Μηνιαία",
    yearly: "Ετήσια",
    save: "Εξοικονόμηση",
    features: "Χαρακτηριστικά",
    freeFeatures: [
      "5 παιχνίδια ανά κατηγορία",
      "Βασικά στατιστικά",
      "Λειτουργία επισκέπτη",
      "Πρόκληση ημέρας",
    ],
    premiumFeatures: [
      "Όλα τα παιχνίδια ξεκλειδωμένα",
      "Λεπτομερή στατιστικά",
      "Πιστοποιητικά επιτυχίας",
      "Όλες οι ηλικιακές ομάδες",
      "Χωρίς διαφημίσεις",
      "Νέα παιχνίδια κάθε μήνα",
    ],
    familyFeatures: [
      "Ό,τι έχει το Premium",
      "Έως 3 προφίλ παιδιών",
      "Γονικός πίνακας ελέγχου",
      "Αναφορές προόδου",
      "Προτεραιότητα υποστήριξης",
    ],
    popular: "Δημοφιλές",
    guarantee: "7 ημέρες δωρεάν δοκιμή. Ακύρωσε οποτεδήποτε.",
    successTitle: "Η πληρωμή ολοκληρώθηκε!",
    successMsg: "Η συνδρομή σου ενεργοποιήθηκε. Απόλαυσε πλήρη πρόσβαση!",
    cancelledTitle: "Η πληρωμή ακυρώθηκε",
    cancelledMsg: "Δεν χρεώθηκες. Μπορείς να δοκιμάσεις ξανά οποτεδήποτε.",
    processing: "Μετάβαση στο Stripe...",
    backHome: "Πίσω στην αρχική",
    continueBrowsing: "Συνέχεια περιήγησης",
  },
  en: {
    title: "Subscriptions",
    subtitle: "Choose the plan that fits you",
    back: "Back",
    current: "Current plan",
    choosePlan: "Choose",
    activePlan: "Active",
    cancel: "Cancel subscription",
    loginFirst: "You need to log in to subscribe",
    loginBtn: "Log in",
    free: "Free",
    premium: "Premium",
    family: "Family",
    mo: "/mo",
    yr: "/yr",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "Save",
    features: "Features",
    freeFeatures: [
      "5 games per category",
      "Basic statistics",
      "Guest mode",
      "Daily challenge",
    ],
    premiumFeatures: [
      "All games unlocked",
      "Detailed statistics",
      "Achievement certificates",
      "All age groups",
      "No ads",
      "New games every month",
    ],
    familyFeatures: [
      "Everything in Premium",
      "Up to 3 child profiles",
      "Parent dashboard",
      "Progress reports",
      "Priority support",
    ],
    popular: "Popular",
    guarantee: "7-day free trial. Cancel anytime.",
    successTitle: "Payment successful!",
    successMsg: "Your subscription is now active. Enjoy full access!",
    cancelledTitle: "Payment cancelled",
    cancelledMsg: "You haven't been charged. Feel free to try again anytime.",
    processing: "Redirecting to Stripe...",
    backHome: "Back to home",
    continueBrowsing: "Continue browsing",
  },
};

const PRICES = {
  premium: { monthly: 2.99, yearly: 29.99 },
  family: { monthly: 4.99, yearly: 49.99 },
};

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { lang } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const { tier, isPremium, startCheckout, startPortalSession, unsubscribe, loading, checkoutError } = useSubscription();
  const isEl = lang === "el";
  const l = T[lang] || T.en;

  const [period, setPeriod] = useState("monthly");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelled, setShowCancelled] = useState(false);

  useEffect(() => {
    AnalyticsService.subscriptionView(tier);
  }, [tier]);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
      setSearchParams({}, { replace: true });
    } else if (searchParams.get("cancelled") === "true") {
      setShowCancelled(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const yearlySavePremium = Math.round((1 - PRICES.premium.yearly / (PRICES.premium.monthly * 12)) * 100);
  const yearlySaveFamily = Math.round((1 - PRICES.family.yearly / (PRICES.family.monthly * 12)) * 100);

  const plans = [
    {
      id: "free",
      name: l.free,
      priceMonthly: 0,
      priceYearly: 0,
      icon: "🎮",
      gradient: "from-slate-500 to-slate-600",
      features: l.freeFeatures,
    },
    {
      id: "premium",
      name: l.premium,
      priceMonthly: PRICES.premium.monthly,
      priceYearly: PRICES.premium.yearly,
      yearlySave: yearlySavePremium,
      icon: "⭐",
      gradient: "from-amber-500 to-orange-500",
      popular: true,
      features: l.premiumFeatures,
    },
    {
      id: "family",
      name: l.family,
      priceMonthly: PRICES.family.monthly,
      priceYearly: PRICES.family.yearly,
      yearlySave: yearlySaveFamily,
      icon: "👨‍👩‍👧‍👦",
      gradient: "from-purple-500 to-pink-500",
      features: l.familyFeatures,
    },
  ].filter((plan) => {
    if (plan.id === "free")    return FeatureFlagService.isEnabled("subs_free");
    if (plan.id === "premium") return FeatureFlagService.isEnabled("subs_premium");
    if (plan.id === "family")  return FeatureFlagService.isEnabled("subs_family");
    return true;
  });

  const paymentEnabled = FeatureFlagService.isEnabled("subs_payment");

  const handleChoose = (planId) => {
    if (!user) return;
    if (planId === "free") {
      unsubscribe();
    } else {
      if (!paymentEnabled) {
        alert(lang === "el"
          ? "🚧 Οι πληρωμές είναι προσωρινά απενεργοποιημένες. Δοκίμασε ξανά αργότερα."
          : "🚧 Payments are temporarily disabled. Please try again later.");
        return;
      }
      startCheckout(planId, period);
    }
  };

  const errorMessages = {
    not_logged_in: isEl ? "Πρέπει να συνδεθείς πρώτα" : "You need to log in first",
    not_configured: isEl ? "Η πληρωμή δεν είναι διαθέσιμη αυτή τη στιγμή" : "Payments are not available at this time",
    no_url: isEl ? "Αποτυχία σύνδεσης με πληρωμή. Δοκιμάστε ξανά." : "Failed to connect to payment. Please try again.",
    network: isEl ? "Σφάλμα δικτύου. Ελέγξτε τη σύνδεσή σας." : "Network error. Check your connection.",
  };

  // Success banner
  if (showSuccess) {
    return (
      <div id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="pt-32 pb-16 px-4 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-3">{l.successTitle}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{l.successMsg}</p>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-800 mb-8 text-left">
            <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-3">
              {isEl ? "🎉 Τι ξεκλείδωσες:" : "🎉 What you unlocked:"}
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {[
                isEl ? "✓ 350+ παιχνίδια χωρίς περιορισμούς" : "✓ 350+ games without limits",
                isEl ? "✓ Χωρίς χρονικό όριο" : "✓ No time limits",
                isEl ? "✓ Αναλυτικά στατιστικά" : "✓ Detailed statistics",
                isEl ? "✓ Εβδομαδιαίες αναφορές" : "✓ Weekly reports",
                isEl ? "✓ Προτεραιότητα υποστήριξης" : "✓ Priority support",
              ].map((f, i) => <li key={i} className="font-medium">{f}</li>)}
            </ul>
          </div>

          <button
            onClick={() => { setShowSuccess(false); navigate("/"); }}
            className="px-8 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            {l.backHome}
          </button>
        </div>
      </div>
    );
  }

  // Cancelled banner
  if (showCancelled) {
    return (
      <div id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="pt-32 pb-16 px-4 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-4xl">
            ↩
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-3">{l.cancelledTitle}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">{l.cancelledMsg}</p>
          <button
            onClick={() => setShowCancelled(false)}
            className="px-8 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            {l.continueBrowsing}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO title={l.title} description={l.subtitle} />
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 mb-6 flex items-center gap-1 font-medium transition-colors"
          >
            &larr; {l.back}
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-sm font-semibold mb-4">
              {l.title}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-3">
              {l.subtitle}
            </h1>
            {isPremium && (
              <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {l.current}: {tier === "family" ? l.family : l.premium}
              </p>
            )}
          </div>

          {/* Monthly / Yearly toggle */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-700/70 backdrop-blur">
              <button
                onClick={() => setPeriod("monthly")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  period === "monthly"
                    ? "bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-md"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {l.monthly}
              </button>
              <button
                onClick={() => setPeriod("yearly")}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  period === "yearly"
                    ? "bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-md"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {l.yearly}
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  -{yearlySavePremium}%
                </span>
              </button>
            </div>
          </div>

          {/* Login prompt for guests */}
          {!user && (
            <div className="mb-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-center">
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">{l.loginFirst}</p>
              <button
                onClick={() => navigate("/auth")}
                className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all active:scale-95"
              >
                {l.loginBtn}
              </button>
            </div>
          )}

          {checkoutError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <span>{errorMessages[checkoutError] || (isEl ? "Κάτι πήγε στραβά" : "Something went wrong")}</span>
            </div>
          )}

          {/* Plans grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {plans.map((plan) => {
              const isActive = tier === plan.id;
              const price = plan.id === "free" ? 0 : period === "yearly" ? plan.priceYearly : plan.priceMonthly;
              const periodLabel = plan.id === "free" ? "" : period === "yearly" ? l.yr : l.mo;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl border-2 transition-all duration-300 ${
                    plan.popular
                      ? "border-amber-400 dark:border-amber-500 shadow-xl shadow-amber-200/30 dark:shadow-amber-900/30 scale-[1.02]"
                      : isActive
                        ? "border-emerald-400 dark:border-emerald-500 shadow-lg"
                        : "border-slate-200 dark:border-slate-700 shadow-md"
                  } bg-white dark:bg-slate-800 overflow-hidden`}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold">
                      {l.popular}
                    </div>
                  )}

                  <div className="p-6 sm:p-8">
                    {/* Icon + name */}
                    <div className="text-center mb-6">
                      <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center text-2xl mb-3 shadow-lg`}>
                        {plan.icon}
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">{plan.name}</h3>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-2">
                      <span className="text-4xl font-extrabold text-slate-800 dark:text-white">
                        {price === 0 ? (lang === "el" ? "Δωρεάν" : "Free") : `€${price}`}
                      </span>
                      {price > 0 && (
                        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{periodLabel}</span>
                      )}
                    </div>

                    {/* Yearly savings badge */}
                    {plan.yearlySave && period === "yearly" && (
                      <div className="text-center mb-4">
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                          {l.save} {plan.yearlySave}%
                        </span>
                      </div>
                    )}
                    {(!plan.yearlySave || period !== "yearly") && <div className="mb-4" />}

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    {isActive ? (
                      <div className="w-full py-3 rounded-2xl text-center font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50">
                        {l.activePlan}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleChoose(plan.id)}
                        disabled={!user || loading}
                        className={`w-full py-3 rounded-2xl font-bold text-white transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg ${
                          plan.popular
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-300/30 dark:shadow-amber-900/30"
                            : `bg-gradient-to-r ${plan.gradient} shadow-slate-300/30 dark:shadow-slate-900/30`
                        }`}
                      >
                        {loading ? l.processing : l.choosePlan}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Manage / Cancel subscription */}
          {isPremium && (
            <div className="text-center mb-8">
              <button
                onClick={startPortalSession}
                disabled={loading}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 underline underline-offset-2 transition-colors disabled:opacity-50"
              >
                {isEl ? "Διαχείριση συνδρομής" : "Manage subscription"}
              </button>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                {isEl ? "Αλλαγή πλάνου, ακύρωση ή ενημέρωση πληρωμής" : "Change plan, cancel, or update payment method"}
              </p>
            </div>
          )}

          {/* Guarantee */}
          <p className="text-center text-sm text-slate-400 dark:text-slate-500">
            {l.guarantee}
          </p>
        </div>
      </div>
    </div>
  );
}
