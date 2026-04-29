import React, { useEffect, useState } from "react";
import { AdminService } from "../services/AdminService";

const TYPE_STYLES = {
  info:    { bg: "bg-blue-600",    icon: "ℹ️" },
  warning: { bg: "bg-amber-600",   icon: "⚠️" },
  success: { bg: "bg-emerald-600", icon: "✅" },
  promo:   { bg: "bg-pink-600",    icon: "🎉" },
};

const DISMISSED_KEY = "geo:dismissedAnnouncement";

export default function SystemAnnouncementBanner() {
  const [item, setItem] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ann = await AdminService.getActiveAnnouncement();
        if (cancelled || !ann) return;
        const dismissedId = localStorage.getItem(DISMISSED_KEY);
        if (dismissedId === ann.id) return;
        setItem(ann);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  const dismiss = () => {
    if (item?.id) {
      try { localStorage.setItem(DISMISSED_KEY, item.id); } catch {}
    }
    setItem(null);
  };

  if (!item) return null;
  const t = TYPE_STYLES[item.type] || TYPE_STYLES.info;

  return (
    <div role="status" className={`${t.bg} text-white px-4 py-2 flex items-start gap-3 shadow-md`}>
      <span aria-hidden className="text-xl shrink-0">{t.icon}</span>
      <div className="flex-1 min-w-0">
        {item.title && <p className="font-bold text-sm">{item.title}</p>}
        <p className="text-xs sm:text-sm opacity-95 whitespace-pre-line">{item.message}</p>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 px-2 py-0.5 rounded text-white/80 hover:text-white hover:bg-white/20 transition text-sm"
      >
        ✕
      </button>
    </div>
  );
}
