import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { db } from "../auth/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

const NOTIF_KEY = "geo:notifications";
const NOTIF_SEEN_KEY = "geo:notifLastSeen";

function getLocalNotifs() {
  try { return JSON.parse(localStorage.getItem(NOTIF_KEY)) || []; } catch { return []; }
}
function saveLocalNotifs(n) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(n.slice(0, 30)));
}
function getLastSeen() {
  return localStorage.getItem(NOTIF_SEEN_KEY) || "";
}
function setLastSeen() {
  localStorage.setItem(NOTIF_SEEN_KEY, new Date().toISOString());
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const isEl = lang === "el";
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => getLocalNotifs());
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const lastSeen = getLastSeen();
    setUnreadCount(notifications.filter(n => !lastSeen || n.createdAt > lastSeen).length);
  }, [notifications]);

  useEffect(() => {
    generateNotifications();
    const interval = setInterval(generateNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function generateNotifications() {
    const notifs = [];
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    const dailyResult = (() => {
      try { return JSON.parse(localStorage.getItem(`geo:dailyChallenge:${todayStr}`)); } catch { return null; }
    })();
    if (!dailyResult) {
      notifs.push({
        id: `daily-${todayStr}`,
        type: "daily",
        icon: "🎯",
        title: isEl ? "Ημερήσια Πρόκληση" : "Daily Challenge",
        body: isEl ? "Η σημερινή πρόκληση σε περιμένει!" : "Today's challenge awaits!",
        route: "/daily",
        createdAt: `${todayStr}T08:00:00.000Z`,
      });
    }

    const streak = (() => {
      try { return JSON.parse(localStorage.getItem("geo:dailyChallengeStreak")) || {}; } catch { return {}; }
    })();
    if (streak.current >= 3) {
      notifs.push({
        id: `streak-${streak.current}`,
        type: "streak",
        icon: "🔥",
        title: isEl ? `Σερί ${streak.current} ημερών!` : `${streak.current}-day streak!`,
        body: isEl ? "Συνέχισε έτσι!" : "Keep it going!",
        route: "/daily",
        createdAt: `${todayStr}T09:00:00.000Z`,
      });
    }

    const adventureProgress = (() => {
      try { return JSON.parse(localStorage.getItem("geo:adventureMap")) || {}; } catch { return {}; }
    })();
    const completedStations = Object.keys(adventureProgress.completed || {}).length;
    if (completedStations > 0 && completedStations % 5 === 0) {
      notifs.push({
        id: `adventure-${completedStations}`,
        type: "adventure",
        icon: "🗺️",
        title: isEl ? `${completedStations} σταθμοί!` : `${completedStations} stations!`,
        body: isEl ? "Ο χάρτης σε περιμένει!" : "The map awaits!",
        route: "/adventure",
        createdAt: `${todayStr}T10:00:00.000Z`,
      });
    }

    if (user) {
      try {
        const myClassrooms = JSON.parse(localStorage.getItem("geo:myClassrooms") || "[]");
        for (const cls of myClassrooms.slice(0, 3)) {
          const hwQ = query(collection(db, "classroomHomework"), where("classroomCode", "==", cls.code));
          const hwSnap = await getDocs(hwQ);
          hwSnap.docs.forEach(d => {
            const hw = d.data();
            if (hw.deadline && new Date(hw.deadline) > now) {
              notifs.push({
                id: `hw-${hw.code}`,
                type: "homework",
                icon: "📋",
                title: hw.title,
                body: `${isEl ? "Προθεσμία" : "Due"}: ${new Date(hw.deadline).toLocaleDateString(isEl ? "el-GR" : "en-US", { day: "numeric", month: "short" })}`,
                route: `/my-classroom/${cls.code}`,
                createdAt: hw.createdAt || now.toISOString(),
              });
            }
          });
        }
      } catch {}
    }

    const existing = getLocalNotifs();
    const existingIds = new Set(existing.map(n => n.id));
    const merged = [...existing];
    for (const n of notifs) {
      if (!existingIds.has(n.id)) merged.push(n);
    }
    merged.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const trimmed = merged.slice(0, 30);
    setNotifications(trimmed);
    saveLocalNotifs(trimmed);
  }

  const handleOpen = () => {
    setOpen(!open);
    if (!open) {
      setLastSeen();
      setUnreadCount(0);
    }
  };

  const typeColors = {
    daily: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    streak: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
    homework: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    adventure: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={handleOpen} className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Notifications">
        <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center min-w-[18px] px-0.5">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">
              🔔 {isEl ? "Ειδοποιήσεις" : "Notifications"}
            </h3>
            {notifications.length > 0 && (
              <button onClick={() => { saveLocalNotifs([]); setNotifications([]); }} className="text-[10px] text-slate-400 hover:text-red-500">
                {isEl ? "Καθαρισμός" : "Clear all"}
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">{isEl ? "Κανένα μήνυμα" : "No notifications"}</div>
            ) : (
              notifications.slice(0, 15).map(n => (
                <button
                  key={n.id}
                  onClick={() => { if (n.route) navigate(n.route); setOpen(false); }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-50 dark:border-slate-700/50 flex items-start gap-3"
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${typeColors[n.type] || "bg-slate-100 dark:bg-slate-700"}`}>{n.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{n.title}</p>
                    <p className="text-xs text-slate-400 truncate">{n.body}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
