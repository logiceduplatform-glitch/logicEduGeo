import React, { useState, useEffect, useCallback, createContext, useContext } from "react";

const ToastContext = createContext({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const ICONS = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
  xp: "⚡",
  achievement: "🏆",
  streak: "🔥",
  levelup: "🎉",
};

const BG = {
  success: "from-emerald-500 to-teal-500",
  error: "from-red-500 to-rose-500",
  warning: "from-amber-500 to-orange-500",
  info: "from-blue-500 to-indigo-500",
  xp: "from-purple-500 to-pink-500",
  achievement: "from-amber-500 to-yellow-500",
  streak: "from-orange-500 to-red-500",
  levelup: "from-indigo-500 to-purple-600",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-20 right-4 z-[100] space-y-2 pointer-events-none max-w-[22rem]">
        {toasts.map(t => (
          <Toast key={t.id} {...t} onDone={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ message, type, duration, onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDone]);

  return (
    <div className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl text-white text-sm font-medium bg-gradient-to-r ${BG[type] || BG.info} transition-all duration-300 ${visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}>
      <span className="text-lg shrink-0">{ICONS[type] || ICONS.info}</span>
      <span className="flex-1">{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(onDone, 300); }} aria-label="Dismiss notification" className="shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs hover:bg-white/30">✕</button>
    </div>
  );
}
