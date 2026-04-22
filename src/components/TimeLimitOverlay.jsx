import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";
import { TimeLimitService } from "../services/TimeLimitService";
import { ProfileService } from "../services/ProfileService";

const TEXTS = {
  el: {
    title: "Ο χρόνος σου τελείωσε!",
    message: "Έπαιξες αρκετά για σήμερα. Συνέχισε αύριο!",
    parentUnlock: "Κωδικός γονέα",
    unlock: "Ξεκλείδωμα",
    wrongPin: "Λάθος PIN",
    addTime: "+15 λεπτά",
    remaining: "Υπολειπόμενα",
    minutes: "λεπτά",
    warning: "Απομένουν λίγα λεπτά!",
  },
  en: {
    title: "Time's up!",
    message: "You've played enough for today. Continue tomorrow!",
    parentUnlock: "Parent PIN",
    unlock: "Unlock",
    wrongPin: "Wrong PIN",
    addTime: "+15 min",
    remaining: "Remaining",
    minutes: "minutes",
    warning: "A few minutes left!",
  },
};

async function hashPin(pin) {
  const encoded = new TextEncoder().encode(pin + "edu-salt-2026");
  const hash = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function TimeLimitOverlay() {
  const { lang } = useContext(LanguageContext);
  const l = TEXTS[lang] || TEXTS.en;
  const [blocked, setBlocked] = useState(false);
  const [warning, setWarning] = useState(false);
  const [remaining, setRemaining] = useState(Infinity);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);

  useEffect(() => {
    TimeLimitService.startSession();

    const interval = setInterval(() => {
      TimeLimitService.tickSession();
      const childId = ProfileService.getActiveId();
      if (!childId) return;

      const limit = TimeLimitService.getChildLimit(childId);
      if (!limit.enabled) {
        setBlocked(false);
        setWarning(false);
        return;
      }

      const rem = TimeLimitService.getRemainingMinutes(childId);
      setRemaining(rem);

      if (rem <= 0) {
        setBlocked(true);
        setWarning(false);
      } else if (rem <= 5) {
        setWarning(true);
        setBlocked(false);
      } else {
        setWarning(false);
        setBlocked(false);
      }
    }, 30000);

    return () => {
      TimeLimitService.endSession();
      clearInterval(interval);
    };
  }, []);

  const handleUnlock = async () => {
    const storedPin = localStorage.getItem("geo:parentPin");
    if (!storedPin) {
      setBlocked(false);
      return;
    }
    const hashed = await hashPin(pin);
    if (hashed === storedPin) {
      setBlocked(false);
      setShowPinInput(false);
      setPin("");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleAddTime = async () => {
    const storedPin = localStorage.getItem("geo:parentPin");
    if (!storedPin) {
      doAddTime();
      return;
    }
    const hashed = await hashPin(pin);
    if (hashed === storedPin) {
      doAddTime();
      setShowPinInput(false);
      setPin("");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const doAddTime = () => {
    const childId = ProfileService.getActiveId();
    if (!childId) return;
    const limit = TimeLimitService.getChildLimit(childId);
    TimeLimitService.setLimit(childId, {
      ...limit,
      dailyMinutes: limit.dailyMinutes + 15,
    });
    setBlocked(false);
    setRemaining(15);
  };

  if (!blocked && !warning) return null;

  if (warning && !blocked) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999] animate-pulse">
        <div className="bg-amber-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold">
          <span>⏰</span>
          <span>{l.warning} ({remaining} {l.minutes})</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center space-y-5">
        <div className="text-7xl animate-bounce">⏰</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{l.title}</h2>
        <p className="text-slate-600 dark:text-slate-300">{l.message}</p>

        <div className="flex items-center justify-center gap-2 text-4xl font-bold text-purple-600 dark:text-purple-400">
          😴
        </div>

        {!showPinInput ? (
          <button
            onClick={() => setShowPinInput(true)}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 underline transition-colors"
          >
            🔐 {l.parentUnlock}
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setPinError(false); }}
              placeholder="PIN"
              className="w-32 mx-auto block px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 text-center text-lg tracking-widest font-mono bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:border-purple-400 outline-none"
              autoFocus
            />
            {pinError && <p className="text-red-500 text-sm font-medium">{l.wrongPin}</p>}
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleUnlock}
                disabled={pin.length < 4}
                className="px-5 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-40 transition-all text-sm active:scale-95"
              >
                {l.unlock}
              </button>
              <button
                onClick={handleAddTime}
                disabled={pin.length < 4}
                className="px-5 py-2 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 disabled:opacity-40 transition-all text-sm active:scale-95"
              >
                {l.addTime}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
