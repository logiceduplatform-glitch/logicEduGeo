import React from "react";
import { dict } from "./dict";

let DEFAULT_LANG = "el";
try { DEFAULT_LANG = localStorage.getItem("geo:lang") || "el"; } catch { /* restricted env */ }

export const LanguageContext = React.createContext({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (key, fallback) => fallback ?? key
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = React.useState(DEFAULT_LANG);

  const setLang = React.useCallback((next) => {
    setLangState(next);
    try { localStorage.setItem("geo:lang", next); } catch { /* quota/private */ }
    document.documentElement.lang = next;
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = React.useCallback(
    (key, fallback) => dict?.[lang]?.[key] ?? dict?.en?.[key] ?? fallback ?? key,
    [lang]
  );

  const value = React.useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
