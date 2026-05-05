import React, { useEffect, useState } from "react";

/**
 * Listens for `kibloo:reward` events fired by `useGameRewards.award()`.
 * Renders a small floating toast with the awarded coins.
 */
export default function RewardToast() {
  const [toast, setToast] = useState(null);
  useEffect(() => {
    const handler = (e) => {
      if (!e.detail) return;
      setToast(e.detail);
      const t = setTimeout(() => setToast(null), 2200);
      return () => clearTimeout(t);
    };
    window.addEventListener("kibloo:reward", handler);
    return () => window.removeEventListener("kibloo:reward", handler);
  }, []);
  if (!toast) return null;
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
      <div className="bg-amber-500 text-white font-extrabold rounded-full px-5 py-2 shadow-2xl animate-bounce border-2 border-yellow-300">
        +{toast.amount} 🪙{toast.label ? ` · ${toast.label}` : ""}
      </div>
    </div>
  );
}
