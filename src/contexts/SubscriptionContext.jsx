import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { AuthContext } from "../auth/AuthContext";
import { db, auth } from "../auth/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { AnalyticsService } from "../services/AnalyticsService";

const SUB_KEY = "geo:subscription";
const FREE_GAMES_PER_CATEGORY = 5;

const STRIPE_API_URL = import.meta.env.VITE_STRIPE_API_URL || "";

const SubscriptionContext = createContext({
  tier: "free",
  isPremium: false,
  isGameFree: () => true,
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

  const isPremium = tier === "premium" || tier === "family";

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
    (index) => {
      if (isPremium) return true;
      if (typeof index !== "number") return true;
      return index < FREE_GAMES_PER_CATEGORY;
    },
    [isPremium]
  );

  const [checkoutError, setCheckoutError] = useState(null);

  const startCheckout = useCallback(
    async (plan = "premium", period = "monthly") => {
      setCheckoutError(null);
      if (!user || !auth?.currentUser) {
        setCheckoutError("not_logged_in");
        return;
      }
      if (!STRIPE_API_URL) {
        setCheckoutError("not_configured");
        return;
      }

      setLoading(true);
      try {
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
          AnalyticsService.subscribe(plan, period);
          window.location.href = data.url;
        } else {
          setCheckoutError("no_url");
        }
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
      if (!STRIPE_API_URL) {
        setCheckoutError("not_configured");
        return;
      }

      setLoading(true);
      try {
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
        } else {
          setCheckoutError("no_url");
        }
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

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        isPremium,
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
