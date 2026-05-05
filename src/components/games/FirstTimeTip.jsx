import React, { useEffect, useState } from "react";

/**
 * Shows a one-shot tip popup the first time a user visits a complex game.
 * Persists "seen" state in localStorage by `id`.
 */
export default function FirstTimeTip({ id, title, body }) {
  const key = `tip:seen:${id}`;
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(key)) setOpen(true);
    } catch { /* */ }
  }, [key]);

  const close = () => {
    try { localStorage.setItem(key, "1"); } catch { /* */ }
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center p-4 bg-black/40" onClick={close}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl border-2 border-purple-300 dark:border-purple-700" onClick={(e) => e.stopPropagation()}>
        <div className="text-3xl mb-2">💡</div>
        <h3 className="text-lg font-extrabold mb-1">{title}</h3>
        <div className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line mb-4">{body}</div>
        <button onClick={close} className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg">
          OK
        </button>
      </div>
    </div>
  );
}
