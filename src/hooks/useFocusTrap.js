import { useEffect, useRef } from "react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(isOpen) {
  const ref = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    previousFocus.current = document.activeElement;

    const container = ref.current;
    if (!container) return;

    const focusables = () => [...container.querySelectorAll(FOCUSABLE)];

    const timer = requestAnimationFrame(() => {
      const els = focusables();
      if (els.length > 0) els[0].focus();
    });

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const els = focusables();
      if (els.length === 0) return;

      const first = els[0];
      const last = els[els.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(timer);
      container.removeEventListener("keydown", handleKeyDown);
      if (previousFocus.current && previousFocus.current.focus) {
        previousFocus.current.focus();
      }
    };
  }, [isOpen]);

  return ref;
}
