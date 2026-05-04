import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { AuthContext } from "../auth/AuthContext";
import { db, auth, app as firebaseApp } from "../auth/firebase";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { AnalyticsService } from "../services/AnalyticsService";

const SUB_KEY = "geo:subscription";
const TRIAL_KEY = "geo:trialStart";
const TRIAL_DURATION_DAYS = 14;

const STRIPE_API_URL = import.meta.env.VITE_STRIPE_API_URL || "";

const SubscriptionContext = createContext({
  tier: "free",
  isPremium: false,
  isTrialing: false,
  trialDaysLeft: 0,
  trialEnded: false,
  isGameFree: () => true,
  startTrial: () => {},
  startCheckout: () => {},
  startPortalSession: () => {},
  subscribe: () => {},
  unsubscribe: () => {},
  loading: false,
});

export function SubscriptionProvider({ children }) {
  const { user, guest } = useContext(AuthContext);

  const [tier, setTier] = useState(() => {
    try {
      const saved = localStorage.getItem(SUB_KEY);
      if (saved) return JSON.parse(saved).tier || "free";
    } catch { /* empty */ }
    return "free";
  });
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState(false);

  // Trial state — independent of paid tier so we can show "trial active" badge
  // and gracefully downgrade when the trial expires without losing the user's
  // historical state.
  const [trialStart, setTrialStart] = useState(() => {
    try {
      const v = localStorage.getItem(TRIAL_KEY);
      return v ? Number(v) : 0;
    } catch {
      return 0;
    }
  });

  const trial = useMemo(() => {
    if (!trialStart) return { active: false, daysLeft: 0, ended: false };
    const elapsedMs = Date.now() - trialStart;
    const totalMs = TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000;
    const daysLeft = Math.max(0, Math.ceil((totalMs - elapsedMs) / (24 * 60 * 60 * 1000)));
    const ended = elapsedMs >= totalMs;
    return { active: !ended, daysLeft, ended };
  }, [trialStart]);

  const isPremium = tier === "premium" || tier === "family" || trial.active;

  // Listen to Firestore for real-time subscription updates
  useEffect(() => {
    if (!user?.uid || !db) return;

    const subRef = doc(db, "users", user.uid, "data", "subscription");
    const unsub = onSnapshot(
      subRef,
      (snap) => {
        setSyncError(false);
        if (snap.exists()) {
          const data = snap.data();
          const cloudTier = data.tier || "free";
          const status = data.status || "active";

          if (status === "active" || status === "trialing") {
            setTier(cloudTier);
            try { localStorage.setItem(SUB_KEY, JSON.stringify({ tier: cloudTier })); } catch { /* */ }
          } else {
            setTier("free");
            try { localStorage.setItem(SUB_KEY, JSON.stringify({ tier: "free" })); } catch { /* */ }
          }
        }
      },
      (err) => {
        if (import.meta.env.DEV) console.warn("[Subscription] Firestore listener error:", err);
        setSyncError(true);
      }
    );

    return () => unsub();
  }, [user?.uid]);

  const isGameFree = useCallback(
    (_index) => {
      // The legacy "first N games per category are free" rule has been replaced by the
      // explicit per-item Premium Content management in the Admin Dashboard.
      // We therefore default to "free" here. Per-game premium gating is enforced by
      // <PremiumGate> + PremiumContentService.isPremiumOnly() at the route/component level.
      return true;
    },
    []
  );

  const [checkoutError, setCheckoutError] = useState(null);

  const startCheckout = useCallback(
    async (plan = "premium", period = "monthly") => {
      setCheckoutError(null);
      if (!user || !auth?.currentUser) {
        setCheckoutError("not_logged_in");
        return;
      }

      setLoading(true);
      try {
        AnalyticsService.subscribe(plan, period);

        // Preferred path: Firebase Cloud Function callable.
        // Falls back to legacy PHP endpoint if VITE_STRIPE_API_URL is set.
        if (firebaseApp) {
          try {
            const fns = getFunctions(firebaseApp, "europe-west1");
            const call = httpsCallable(fns, "createCheckoutSession");
            const result = await call({ plan, period });
            const url = result?.data?.url;
            if (url) {
              window.location.href = url;
              return;
            }
            setCheckoutError("no_url");
            return;
          } catch (e) {
            if (import.meta.env.DEV) console.warn("[Subscription] Functions checkout failed, trying fallback:", e);
            // fall through to legacy endpoint if configured
          }
        }

        if (STRIPE_API_URL) {
          const token = await auth.currentUser.getIdToken();
          const res = await fetch(`${STRIPE_API_URL}/stripe-checkout.php`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ plan, period }),
          });
          const data = await res.json();
          if (data.url) {
            window.location.href = data.url;
            return;
          }
          setCheckoutError("no_url");
          return;
        }

        setCheckoutError("not_configured");
      } catch (e) {
        if (import.meta.env.DEV) console.error("[Subscription] Checkout error:", e);
        setCheckoutError("network");
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const startPortalSession = useCallback(
    async () => {
      setCheckoutError(null);
      if (!user || !auth?.currentUser) {
        setCheckoutError("not_logged_in");
        return;
      }

      setLoading(true);
      try {
        if (firebaseApp) {
          try {
            const fns = getFunctions(firebaseApp, "europe-west1");
            const call = httpsCallable(fns, "createPortalSession");
            const result = await call({ returnUrl: window.location.href });
            const url = result?.data?.url;
            if (url) {
              window.location.href = url;
              return;
            }
            setCheckoutError("no_url");
            return;
          } catch (e) {
            if (import.meta.env.DEV) console.warn("[Subscription] Functions portal failed, trying fallback:", e);
          }
        }

        if (STRIPE_API_URL) {
          const token = await auth.currentUser.getIdToken();
          const res = await fetch(`${STRIPE_API_URL}/stripe-portal.php`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ returnUrl: window.location.href }),
          });
          const data = await res.json();
          if (data.url) {
            window.location.href = data.url;
            return;
          }
          setCheckoutError("no_url");
          return;
        }

        setCheckoutError("not_configured");
      } catch (e) {
        if (import.meta.env.DEV) console.error("[Subscription] Portal error:", e);
        setCheckoutError("network");
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const subscribe = useCallback(
    (plan = "premium") => {
      if (guest && !user) return;
      const data = { tier: plan, subscribedAt: new Date().toISOString() };
      try { localStorage.setItem(SUB_KEY, JSON.stringify(data)); } catch { /* */ }
      setTier(plan);
    },
    [user, guest]
  );

  const unsubscribe = useCallback(() => {
    try { localStorage.setItem(SUB_KEY, JSON.stringify({ tier: "free" })); } catch { /* */ }
    setTier("free");
  }, []);

  const startTrial = useCallback(async () => {
    if (trialStart) return false; // can only start once
    const now = Date.now();
    try { localStorage.setItem(TRIAL_KEY, String(now)); } catch { /* */ }
    setTrialStart(now);
    AnalyticsService.trialStarted?.();

    // Mirror to Firestore so it's enforced across devices.
    if (user?.uid && db) {
      try {
        await setDoc(
          doc(db, "users", user.uid, "data", "trial"),
          {
            startedAt: serverTimestamp(),
            durationDays: TRIAL_DURATION_DAYS,
            startedAtMs: now,
          },
          { merge: true },
        );
      } catch {
        /* Firestore unavailable — local trial still works */
      }
    }
    return true;
  }, [trialStart, user?.uid]);

  // On login, sync trial start from Firestore so the trial is device-portable.
  useEffect(() => {
    if (!user?.uid || !db) return;
    const trialRef = doc(db, "users", user.uid, "data", "trial");
    const unsub = onSnapshot(trialRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      if (data.startedAtMs && (!trialStart || data.startedAtMs < trialStart)) {
        try { localStorage.setItem(TRIAL_KEY, String(data.startedAtMs)); } catch { /* */ }
        setTrialStart(data.startedAtMs);
      }
    }, () => {});
    return () => unsub();
  }, [user?.uid, trialStart]);

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        isPremium,
        isTrialing: trial.active && !(tier === "premium" || tier === "family"),
        trialDaysLeft: trial.daysLeft,
        trialEnded: trial.ended,
        canStartTrial: !trialStart,
        startTrial,
        isGameFree,
        startCheckout,
        startPortalSession,
        subscribe,
        unsubscribe,
        loading,
        checkoutError,
        syncError,
      }}
    >
      {children}
      {syncError && (
        <div className="fixed bottom-20 left-4 z-50 max-w-xs px-4 py-3 rounded-xl bg-amber-100 dark:bg-amber-900/80 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 text-xs font-medium shadow-lg flex items-center gap-2">
          <span>⚠️</span>
          <span>Subscription sync error. Your access may be outdated.</span>
          <button onClick={() => setSyncError(false)} className="ml-auto shrink-0 text-amber-600 dark:text-amber-400 hover:text-amber-800" aria-label="Dismiss">✕</button>
        </div>
      )}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
