import { useRef, useCallback, useEffect } from "react";

/**
 * Returns a `safeTimeout(fn, ms)` that auto-clears on unmount.
 * Drop-in replacement for `setTimeout` inside React components.
 */
export default function useSafeTimeout() {
  const timers = useRef(new Set());

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current.clear();
    };
  }, []);

  const safeTimeout = useCallback((fn, ms) => {
    const id = setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
    return id;
  }, []);

  const clearSafeTimeout = useCallback((id) => {
    clearTimeout(id);
    timers.current.delete(id);
  }, []);

  return { safeTimeout, clearSafeTimeout };
}
