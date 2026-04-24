import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useSubscription } from "../contexts/SubscriptionContext";
import XPLevelBadge from "./XPLevelBadge";
import ProfileSwitcher from "./ProfileSwitcher";
import SearchOverlay from "./SearchOverlay";
import { ProfileService } from "../services/ProfileService";
import { CoinService } from "../services/CoinService";
import {
  ageToQuizRoute,
  adultObjectiveRoutes,
  age2_3ObjectiveRoutes,
  age4_5ObjectiveRoutes,
  age6ObjectiveRoutes,
  age7_8ObjectiveRoutes,
  age9_10ObjectiveRoutes,
  age11_12ObjectiveRoutes,
} from "../config/quizRoutes";

function getObjectiveRoutes(ageKey) {
  if (ageKey === "Adult") return adultObjectiveRoutes;
  if (ageKey === "Age 2-3") return age2_3ObjectiveRoutes;
  if (ageKey === "Age 4-5") return age4_5ObjectiveRoutes;
  if (ageKey === "Age 6") return age6ObjectiveRoutes;
  if (ageKey === "Age 7-8") return age7_8ObjectiveRoutes;
  if (ageKey === "Age 9-10") return age9_10ObjectiveRoutes;
  if (ageKey === "Age 11–12" || ageKey === "Age 11-12") return age11_12ObjectiveRoutes;
  return null;
}

const OBJECTIVE_LABELS = {
  school: { el: "Σχολείο", en: "School", icon: "🏫" },
  fun: { el: "Διασκέδαση", en: "Fun", icon: "🎉" },
  logic: { el: "Λογική", en: "Logic", icon: "🧩" },
  brain: { el: "Εξάσκηση", en: "Brain", icon: "🧠" },
  board: { el: "Επιτραπέζια", en: "Board Games", icon: "🎲" },
};

const AGE_ICONS = {
  "Age 2-3": "👶", "Age 4-5": "🧒", "Age 6": "🎒",
  "Age 7-8": "📖", "Age 9-10": "🔬", "Age 11–12": "🎓", "Age 11-12": "🎓", "Adult": "🧠",
};

export default function Navbar() {
  const navigate = useNavigate();
  const { lang, setLang } = useContext(LanguageContext);
  const { user, guest, userProfile, userRole, logout } = useContext(AuthContext);
  const { dark, toggle: toggleTheme } = useTheme();
  const { isPremium, tier } = useSubscription();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [ageCatOpen, setAgeCatOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinModalMode, setPinModalMode] = useState("verify"); // "verify" | "setup" | "confirm"
  const [pinInput, setPinInput] = useState("");
  const [pinSetupFirst, setPinSetupFirst] = useState("");
  const [pinError, setPinError] = useState(false);
  const profileRef = useRef(null);
  const ageCatRef = useRef(null);
  const isEl = lang === "el";

  const classroomHasNew = (() => {
    try {
      const saved = JSON.parse(localStorage.getItem("geo:myClassrooms") || "[]");
      if (!saved.length) return false;
      for (const cls of saved) {
        const lastSeen = localStorage.getItem(`geo:classroomLastSeen:${cls.code}`);
        if (!lastSeen) return true;
      }
      return false;
    } catch { return false; }
  })();

  async function hashPin(pin) {
    const encoded = new TextEncoder().encode(pin + "edu-salt-2026");
    const hash = await crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  const handleSwitchToParent = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    const storedPin = localStorage.getItem("geo:parentPin");
    setPinInput("");
    setPinSetupFirst("");
    setPinError(false);
    if (storedPin) {
      setPinModalMode("verify");
    } else {
      setPinModalMode("setup");
    }
    setPinModalOpen(true);
  };

  const handlePinSubmit = async () => {
    if (pinModalMode === "setup") {
      if (pinInput.length === 4) {
        setPinSetupFirst(pinInput);
        setPinInput("");
        setPinModalMode("confirm");
        setPinError(false);
      }
      return;
    }
    if (pinModalMode === "confirm") {
      if (pinInput === pinSetupFirst) {
        const hashed = await hashPin(pinInput);
        localStorage.setItem("geo:parentPin", hashed);
        setPinModalOpen(false);
        ProfileService.clearActive();
        window.location.href = "/";
      } else {
        setPinError(true);
        setPinInput("");
      }
      return;
    }
    // verify mode
    const storedPin = localStorage.getItem("geo:parentPin");
    const hashed = await hashPin(pinInput);
    if (hashed === storedPin) {
      setPinModalOpen(false);
      ProfileService.clearActive();
      window.location.href = "/";
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  // Ctrl+K / Cmd+K keyboard shortcut for search
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const activeChild = userRole === "teacher" ? null : ProfileService.getActive();

  const currentAge = activeChild?.age || guest?.age || userProfile?.age || null;
  const currentAgeIcon = currentAge ? AGE_ICONS[currentAge] : null;
  const currentAgeLabel = currentAge === "Adult" ? (isEl ? "Ενήλικας" : "Adult") : currentAge?.replace("Age ", "") || null;

  const isLoggedIn = !!(user || guest);
  const displayName = activeChild
    ? activeChild.name
    : userProfile?.name ||
      user?.displayName ||
      user?.email?.split("@")[0] ||
      (guest ? (isEl ? "Επισκέπτης" : "Guest") : "");
  const initials = displayName
    ? displayName.slice(0, 2).toUpperCase()
    : "?";
  const avatarUrl = activeChild ? null : (userProfile?.customPhoto || user?.photoURL || null);
  const userEmoji = activeChild ? null : (userProfile?.avatar || null);
  const activeChildAvatar = activeChild?.avatar || null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (ageCatRef.current && !ageCatRef.current.contains(e.target)) {
        setAgeCatOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setMobileOpen(false);
        setAgeCatOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const NAV_LINKS = [
    { label: isEl ? "Χαρακτ/κά" : "Features", fullLabel: isEl ? "Χαρακτηριστικά" : "Features", href: "#features" },
    { label: isEl ? "Βήματα" : "Steps", fullLabel: isEl ? "Πώς λειτουργεί" : "How it works", href: "#how-it-works" },
    { label: isEl ? "Κατηγορίες" : "Categories", fullLabel: isEl ? "Κατηγορίες" : "Categories", href: "#categories" },
    { label: isEl ? "Παιχνίδια" : "Games", fullLabel: isEl ? "Παιχνίδια" : "Games", href: "#games" },
    { label: isEl ? "Τιμές" : "Pricing", fullLabel: isEl ? "Πλάνα & Τιμές" : "Plans & Pricing", href: "#pricing" },
    { label: isEl ? "Ρεκόρ" : "Records", fullLabel: isEl ? "Τα Ρεκόρ μου" : "My Records", href: "/my-records", isRoute: true },
  ];

  const scrollTo = (href, isRoute) => {
    setMobileOpen(false);
    if (isRoute) {
      navigate(href);
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (href.startsWith("#")) {
      navigate("/");
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <nav
      aria-label="Main navigation"
      role="navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50"
          : "bg-transparent"
      }`}
    >
      <div className="w-full px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <button
          onClick={() => {
            if (activeChild?.age) {
              const routes = getObjectiveRoutes(activeChild.age);
              const obj = activeChild.objective || "fun";
              if (routes && routes[obj]) {
                navigate(routes[obj]);
              } else {
                navigate(ageToQuizRoute[activeChild.age] || "/play");
              }
            } else {
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center gap-2 group shrink-0"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">🧠</span>
          <span className="text-lg font-bold text-slate-800 dark:text-white">Educational</span>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Platform
          </span>
          <span className="hidden xl:inline-block text-[9px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-700 ml-1 tracking-wider uppercase">
            Learn. Think. Solve.
          </span>
        </button>

        {/* Desktop nav - left-aligned after logo */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href, link.isRoute)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                scrolled
                  ? "text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                  : "text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-400 hover:bg-white/50 dark:hover:bg-white/10"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Spacer to push right side */}
        <div className="hidden lg:block flex-1" />

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label={isEl ? "Αναζήτηση" : "Search"}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
              scrolled
                ? "border-slate-200 dark:border-slate-700 text-slate-400 hover:border-purple-300 hover:text-purple-500 dark:hover:border-purple-600 dark:hover:text-purple-400 bg-white/50 dark:bg-slate-800/50"
                : "border-slate-300/50 dark:border-slate-600/50 text-slate-500 dark:text-slate-400 hover:border-purple-300 hover:text-purple-500 bg-white/30 dark:bg-white/5"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden xl:inline">{isEl ? "Αναζήτηση" : "Search"}</span>
            <kbd className="hidden xl:inline-flex items-center px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 text-[10px] font-mono text-slate-400 ml-1">
              {/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘K" : "Ctrl+K"}
            </kbd>
          </button>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={dark ? (isEl ? "Φωτεινό θέμα" : "Light mode") : (isEl ? "Σκοτεινό θέμα" : "Dark mode")}
            title={dark ? (isEl ? "Φωτεινό θέμα" : "Light mode") : (isEl ? "Σκοτεινό θέμα" : "Dark mode")}
            className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all ${
              scrolled
                ? "text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                : "text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10"
            }`}
          >
            {dark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "el" ? "en" : "el")}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
              scrolled
                ? "text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400"
                : "text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10"
            }`}
            title={lang === "el" ? "Switch to English" : "Αλλαγή σε Ελληνικά"}
          >
            {lang === "el" ? "🇬🇧 English" : "🇬🇷 Ελληνικά"}
          </button>

          {/* Age group badge with category dropdown */}
          {isLoggedIn && currentAgeIcon && (
            <div className="relative" ref={ageCatRef}>
              <button
                onClick={() => {
                  const ageKey = activeChild?.age || currentAge;
                  const routes = ageKey ? getObjectiveRoutes(ageKey) : null;
                  if (routes) {
                    setAgeCatOpen((v) => !v);
                  } else {
                    navigate("/profile");
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold border-2 border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all"
              >
                <span>{currentAgeIcon}</span>
                <span>{currentAgeLabel}</span>
                {currentAge && (
                  <svg className={`w-3 h-3 transition-transform ${ageCatOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              {ageCatOpen && currentAge && (() => {
                const routes = getObjectiveRoutes(currentAge);
                if (!routes) return null;
                return (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                    <p className="px-4 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {isEl ? "Κατηγορία" : "Category"}
                    </p>
                    {Object.entries(routes).map(([key, route]) => {
                      const obj = OBJECTIVE_LABELS[key];
                      if (!obj) return null;
                      const isActiveRoute = window.location.pathname === route;
                      return (
                        <button
                          key={key}
                          onClick={() => { setAgeCatOpen(false); navigate(route); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2.5 transition-colors ${
                            isActiveRoute
                              ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                          }`}
                        >
                          <span className="text-lg">{obj.icon}</span>
                          {isEl ? obj.el : obj.en}
                          {isActiveRoute && <span className="ml-auto text-purple-500">●</span>}
                        </button>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Multi-child profile switcher (read-only for children, hidden for teachers) */}
          {isLoggedIn && user && userRole !== "teacher" && (
            <ProfileSwitcher lang={lang} onSwitch={() => window.location.reload()} readOnly={!!activeChild} />
          )}

          {isLoggedIn ? (
            /* Authenticated state */
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="User menu"
                aria-expanded={profileOpen}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all ${
                  scrolled
                    ? "hover:bg-purple-50 dark:hover:bg-purple-900/30"
                    : "hover:bg-white/50 dark:hover:bg-white/10"
                }`}
              >
                {activeChildAvatar ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-lg border-2 border-indigo-300">
                    {activeChildAvatar}
                  </div>
                ) : userEmoji ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-lg border-2 border-purple-300">
                    {userEmoji}
                  </div>
                ) : avatarUrl ? (
                  <img src={avatarUrl} alt={`${displayName} avatar`} loading="lazy" className="w-8 h-8 rounded-full border-2 border-purple-300 object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold border-2 border-purple-300">
                    {initials}
                  </div>
                )}
                {isLoggedIn && <XPLevelBadge lang={lang} size="sm" />}
                {isLoggedIn && (() => { const c = CoinService.getBalance(); return c.balance > 0 ? <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-0.5"><span className="text-sm">🪙</span>{c.balance}</span> : null; })()}
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                  {displayName}
                </span>
                {isPremium && (
                  <span className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold leading-none">
                    PRO
                  </span>
                )}
                <svg className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform ${profileOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{displayName}</p>
                    {user?.email && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                    )}
                    {guest && (
                      <p className="text-xs text-emerald-500 font-medium mt-0.5">
                        {isEl ? "Λειτουργία επισκέπτη" : "Guest mode"}
                      </p>
                    )}
                    {userProfile?.age && userRole !== "teacher" && (
                      <p className="text-xs text-slate-400 mt-0.5">{userProfile.age}</p>
                    )}
                    {userRole && userRole !== "student" && (
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        userRole === "parent"
                          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"
                      }`}>
                        {userRole === "parent" ? (isEl ? "Γονέας" : "Parent") : (isEl ? "Δάσκαλος" : "Teacher")}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <button
                    onClick={() => { setProfileOpen(false); navigate("/profile"); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400 transition-colors flex items-center gap-2"
                  >
                    <span>⚙️</span>
                    {isEl ? "Προφίλ & Ρυθμίσεις" : "Profile & Settings"}
                  </button>

                  <button
                    onClick={() => { setProfileOpen(false); navigate("/stats"); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400 transition-colors flex items-center gap-2"
                  >
                    <span>📊</span>
                    {isEl ? "Στατιστικά" : "Stats"}
                  </button>

                  <button
                    onClick={() => { setProfileOpen(false); navigate("/my-games"); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400 transition-colors flex items-center gap-2"
                  >
                    <span>⭐</span>
                    {isEl ? "Τα Παιχνίδια μου" : "My Games"}
                  </button>

                  <button
                    onClick={() => { setProfileOpen(false); navigate("/achievements"); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400 transition-colors flex items-center gap-2"
                  >
                    <span>🏆</span>
                    {isEl ? "Επιτεύγματα" : "Achievements"}
                  </button>

                  <button
                    onClick={() => { setProfileOpen(false); navigate("/shop"); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400 transition-colors flex items-center gap-2"
                  >
                    <span>🛍️</span>
                    {isEl ? "Κατάστημα" : "Shop"}
                  </button>

                  {userRole === "parent" && user && !activeChild && (
                    <>
                      <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                      <p className="px-4 pt-2 pb-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {isEl ? "Εργαλεία Γονέα" : "Parent Tools"}
                      </p>
                      <button
                        onClick={() => { setProfileOpen(false); navigate("/parent-dashboard"); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors flex items-center gap-2"
                      >
                        <span>📊</span>
                        {isEl ? "Γονικός Πίνακας Ελέγχου" : "Parent Dashboard"}
                      </button>
                      <button
                        onClick={() => { setProfileOpen(false); navigate("/weekly-report"); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors flex items-center gap-2"
                      >
                        <span>📋</span>
                        {isEl ? "Εβδομαδιαίες Αναφορές" : "Weekly Reports"}
                      </button>
                    </>
                  )}

                  {userRole !== "parent" && (
                    <button
                      onClick={() => { setProfileOpen(false); navigate("/weekly-report"); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400 transition-colors flex items-center gap-2"
                    >
                      <span>📋</span>
                      {isEl ? "Εβδομαδιαία Αναφορά" : "Weekly Report"}
                    </button>
                  )}

                  {userRole === "teacher" && (
                    <button
                      onClick={() => { setProfileOpen(false); navigate("/teacher-dashboard"); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors flex items-center gap-2"
                    >
                      <span>📚</span>
                      {isEl ? "Πίνακας Δασκάλου" : "Teacher Dashboard"}
                    </button>
                  )}

                  {userRole !== "teacher" && (
                    <button
                      onClick={() => { setProfileOpen(false); navigate("/my-classroom"); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-colors flex items-center gap-2 relative"
                    >
                      <span>🏫</span>
                      {isEl ? "Η Τάξη μου" : "My Classroom"}
                      {classroomHasNew && <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse ml-auto" />}
                    </button>
                  )}

                  <button
                    onClick={() => { setProfileOpen(false); navigate("/join"); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <span>🔑</span>
                    {isEl ? "Γρήγορος κωδικός quiz" : "Quick Quiz Code"}
                  </button>

                  <button
                    onClick={() => { setProfileOpen(false); navigate("/content-editor"); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400 transition-colors flex items-center gap-2"
                  >
                    <span>✏️</span>
                    {isEl ? "Δημιουργία Περιεχομένου" : "Content Editor"}
                  </button>

                  <button
                    onClick={() => { setProfileOpen(false); navigate("/ai-tutor"); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400 transition-colors flex items-center gap-2"
                    aria-label={isEl ? "Βοηθός Μελέτης" : "Study Assistant"}
                  >
                    <span>📚</span>
                    {isEl ? "Βοηθός Μελέτης" : "Study Assistant"}
                  </button>

                  <button
                    onClick={() => { setProfileOpen(false); navigate("/online-multiplayer"); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400 transition-colors flex items-center gap-2"
                  >
                    <span>🎮</span>
                    {isEl ? "Quiz Battle" : "Quiz Battle"}
                  </button>

                  {!isPremium && (
                    <button
                      onClick={() => { setProfileOpen(false); navigate("/subscription"); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors flex items-center gap-2"
                    >
                      <span>⭐</span>
                      {isEl ? "Αναβάθμιση σε Premium" : "Upgrade to Premium"}
                    </button>
                  )}

                  {activeChild && (
                    <>
                      <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                      <button
                        onClick={handleSwitchToParent}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors flex items-center gap-2"
                      >
                        <span>🔐</span>
                        {isEl ? "Περιοχή γονέα" : "Parent area"}
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2"
                  >
                    <span>🚪</span>
                    {isEl ? "Αποσύνδεση" : "Log out"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest/unauthenticated state */
            <>
              <button
                onClick={() => navigate("/auth")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  scrolled
                    ? "text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                    : "text-purple-700 dark:text-purple-400 hover:bg-white/50 dark:hover:bg-white/10"
                }`}
              >
                {isEl ? "Σύνδεση" : "Log in"}
              </button>

              <button
                onClick={() => navigate("/auth?mode=register")}
                className="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md shadow-purple-300/30 hover:shadow-lg transition-all"
              >
                {isEl ? "Εγγραφή" : "Sign Up"}
              </button>
            </>
          )}
        </div>

        {/* Mobile search + hamburger */}
        <div className="lg:hidden flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label={isEl ? "Αναζήτηση" : "Search"}
            className="p-2.5 min-w-[44px] min-h-[44px] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-slate-700 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? (isEl ? "Κλείσιμο μενού" : "Close menu") : (isEl ? "Άνοιγμα μενού" : "Open menu")}
          aria-expanded={mobileOpen}
          className="lg:hidden p-2.5 min-w-[44px] min-h-[44px] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
        >
          <svg className="w-6 h-6 text-slate-700 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        </div>
      </div>

      {/* Search overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-100 dark:border-slate-700 shadow-xl max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href, link.isRoute)}
                className="block w-full text-left px-4 py-3 rounded-xl text-slate-700 dark:text-slate-200 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
              >
                {link.fullLabel}
              </button>
            ))}

            <div className="border-t border-slate-100 dark:border-slate-700 pt-3 mt-3 space-y-2">
              <button
                onClick={() => setLang(lang === "el" ? "en" : "el")}
                className="block w-full text-left px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                {lang === "el" ? "🇬🇧 English" : "🇬🇷 Ελληνικά"}
              </button>
              <button
                onClick={toggleTheme}
                className="block w-full text-left px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                {dark ? "☀️" : "🌙"} {dark ? (isEl ? "Φωτεινό θέμα" : "Light mode") : (isEl ? "Σκοτεινό θέμα" : "Dark mode")}
              </button>

              {isLoggedIn ? (
                <>
                  {/* Mobile user info */}
                  <div className="px-4 py-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center gap-3">
                    {activeChildAvatar ? (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xl border-2 border-indigo-300">
                        {activeChildAvatar}
                      </div>
                    ) : userEmoji ? (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xl border-2 border-purple-300">
                        {userEmoji}
                      </div>
                    ) : avatarUrl ? (
                      <img src={avatarUrl} alt={`${displayName} avatar`} loading="lazy" className="w-10 h-10 rounded-full border-2 border-purple-300 object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold border-2 border-purple-300">
                        {initials}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{displayName}</p>
                        <XPLevelBadge lang={lang} size="sm" />
                      </div>
                      {user?.email && <p className="text-xs text-slate-400 truncate">{user.email}</p>}
                      {guest && <p className="text-xs text-emerald-500 font-medium">{isEl ? "Επισκέπτης" : "Guest"}</p>}
                    </div>
                  </div>

                  {/* Mobile age badge with category options */}
                  {currentAgeIcon && userRole !== "teacher" && (
                    <div>
                      <div className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
                        <span className="text-lg">{currentAgeIcon}</span>
                        <span className="text-sm">
                          {isEl ? "Ηλικία" : "Age"}: <strong>{currentAgeLabel}</strong>
                        </span>
                      </div>
                      {currentAge && (() => {
                        const routes = getObjectiveRoutes(currentAge);
                        if (!routes) return null;
                        return (
                          <div className="flex flex-wrap gap-2 mt-2 px-2">
                            {Object.entries(routes).map(([key, route]) => {
                              const obj = OBJECTIVE_LABELS[key];
                              if (!obj) return null;
                              const isActiveRoute = window.location.pathname === route;
                              return (
                                <button
                                  key={key}
                                  onClick={() => { setMobileOpen(false); navigate(route); }}
                                  className={`flex-1 min-w-0 px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                                    isActiveRoute
                                      ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-slate-200 dark:border-slate-700"
                                  }`}
                                >
                                  <span>{obj.icon}</span>
                                  {isEl ? obj.el : obj.en}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Mobile child profile switcher for parents */}
                  {userRole === "parent" && (
                    <div className="px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
                      <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-2">
                        {isEl ? "Παιδικά προφίλ" : "Child profiles"}
                      </p>
                      <ProfileSwitcher lang={lang} onSwitch={() => window.location.reload()} readOnly={!!activeChild} />
                    </div>
                  )}

                  <button
                    onClick={() => { setMobileOpen(false); navigate("/profile"); }}
                    className="block w-full text-left px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/30"
                  >
                    ⚙️ {isEl ? "Προφίλ & Ρυθμίσεις" : "Profile & Settings"}
                  </button>

                  <button
                    onClick={() => { setMobileOpen(false); navigate("/stats"); }}
                    className="block w-full text-left px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/30"
                  >
                    📊 {isEl ? "Στατιστικά" : "Stats"}
                  </button>

                  <button
                    onClick={() => { setMobileOpen(false); navigate("/my-games"); }}
                    className="block w-full text-left px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/30"
                  >
                    ⭐ {isEl ? "Τα Παιχνίδια μου" : "My Games"}
                  </button>

                  {userRole === "parent" && user && !activeChild && (
                    <>
                      <div className="pt-2 pb-1 px-4">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          {isEl ? "Εργαλεία Γονέα" : "Parent Tools"}
                        </p>
                      </div>
                      <button
                        onClick={() => { setMobileOpen(false); navigate("/parent-dashboard"); }}
                        className="block w-full text-left px-4 py-3 rounded-xl text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                      >
                        📊 {isEl ? "Γονικός Πίνακας Ελέγχου" : "Parent Dashboard"}
                      </button>
                      <button
                        onClick={() => { setMobileOpen(false); navigate("/weekly-report"); }}
                        className="block w-full text-left px-4 py-3 rounded-xl text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                      >
                        📋 {isEl ? "Εβδομαδιαίες Αναφορές" : "Weekly Reports"}
                      </button>
                    </>
                  )}

                  {userRole !== "parent" && (
                    <button
                      onClick={() => { setMobileOpen(false); navigate("/weekly-report"); }}
                      className="block w-full text-left px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/30"
                    >
                      📋 {isEl ? "Εβδομαδιαία Αναφορά" : "Weekly Report"}
                    </button>
                  )}

                  {userRole === "teacher" && (
                    <button
                      onClick={() => { setMobileOpen(false); navigate("/teacher-dashboard"); }}
                      className="block w-full text-left px-4 py-3 rounded-xl text-amber-600 dark:text-amber-400 font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/30"
                    >
                      📚 {isEl ? "Πίνακας Δασκάλου" : "Teacher Dashboard"}
                    </button>
                  )}

                  {userRole !== "teacher" && (
                    <button
                      onClick={() => { setMobileOpen(false); navigate("/my-classroom"); }}
                      className="block w-full text-left px-4 py-3 rounded-xl text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 relative"
                    >
                      🏫 {isEl ? "Η Τάξη μου" : "My Classroom"}
                      {classroomHasNew && <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse ml-2 align-middle" />}
                    </button>
                  )}

                  <button
                    onClick={() => { setMobileOpen(false); navigate("/join"); }}
                    className="block w-full text-left px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  >
                    🔑 {isEl ? "Γρήγορος κωδικός quiz" : "Quick Quiz Code"}
                  </button>

                  <button
                    onClick={() => { setMobileOpen(false); navigate("/content-editor"); }}
                    className="block w-full text-left px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/30"
                  >
                    ✏️ {isEl ? "Δημιουργία Περιεχομένου" : "Content Editor"}
                  </button>

                  <button
                    onClick={() => { setMobileOpen(false); navigate("/ai-tutor"); }}
                    className="block w-full text-left px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/30"
                  >
                    📚 {isEl ? "Βοηθός Μελέτης" : "Study Assistant"}
                  </button>

                  <button
                    onClick={() => { setMobileOpen(false); navigate("/online-multiplayer"); }}
                    className="block w-full text-left px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/30"
                  >
                    🎮 {isEl ? "Quiz Battle" : "Quiz Battle"}
                  </button>

                  {!isPremium && (
                    <button
                      onClick={() => { setMobileOpen(false); navigate("/subscription"); }}
                      className="block w-full text-left px-4 py-3 rounded-xl text-amber-600 dark:text-amber-400 font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/30"
                    >
                      ⭐ {isEl ? "Αναβάθμιση σε Premium" : "Upgrade to Premium"}
                    </button>
                  )}

                  {activeChild && (
                    <button
                      onClick={handleSwitchToParent}
                      className="block w-full text-left px-4 py-3 rounded-xl text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                    >
                      🔐 {isEl ? "Περιοχή γονέα" : "Parent area"}
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 rounded-xl text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    🚪 {isEl ? "Αποσύνδεση" : "Log out"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setMobileOpen(false); navigate("/auth"); }}
                    className="block w-full text-left px-4 py-3 rounded-xl text-purple-700 dark:text-purple-400 font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/30"
                  >
                    {isEl ? "Σύνδεση" : "Log in"}
                  </button>

                  <button
                    onClick={() => { setMobileOpen(false); navigate("/auth?mode=register"); }}
                    className="block w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold"
                  >
                    {isEl ? "Εγγραφή" : "Sign Up"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Parent PIN modal */}
      {pinModalOpen && (() => {
        const titles = {
          setup:   isEl ? "Ορισμός PIN Γονέα" : "Set Parent PIN",
          confirm: isEl ? "Επιβεβαίωση PIN" : "Confirm PIN",
          verify:  isEl ? "Περιοχή Γονέα" : "Parent Area",
        };
        const subtitles = {
          setup:   isEl ? "Ορίστε ένα 4ψήφιο PIN για να προστατέψετε τις ρυθμίσεις σας" : "Set a 4-digit PIN to protect your settings",
          confirm: isEl ? "Πληκτρολογήστε ξανά το PIN για επιβεβαίωση" : "Re-enter the PIN to confirm",
          verify:  isEl ? "Εισάγετε το PIN γονέα" : "Enter parent PIN",
        };
        const btnLabels = {
          setup:   isEl ? "Επόμενο" : "Next",
          confirm: isEl ? "Ορισμός & Είσοδος" : "Set & Enter",
          verify:  isEl ? "Είσοδος" : "Enter",
        };
        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={titles[pinModalMode]}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
              <div className="text-4xl mb-3" aria-hidden="true">{pinModalMode === "setup" ? "🔑" : pinModalMode === "confirm" ? "🔁" : "🔐"}</div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
                {titles[pinModalMode]}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                {subtitles[pinModalMode]}
              </p>
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => { setPinInput(e.target.value.replace(/\D/g, "")); setPinError(false); }}
                onKeyDown={(e) => e.key === "Enter" && pinInput.length === 4 && handlePinSubmit()}
                className={`w-32 mx-auto text-center text-2xl tracking-[0.5em] border-2 rounded-xl py-3 mb-3 outline-none block ${
                  pinError
                    ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                    : "border-slate-200 dark:border-slate-600 focus:border-purple-400"
                } dark:bg-slate-700 dark:text-white`}
                placeholder="····"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-red-500 mb-2">
                  {pinModalMode === "confirm"
                    ? (isEl ? "Τα PIN δεν ταιριάζουν" : "PINs don't match")
                    : (isEl ? "Λάθος PIN" : "Wrong PIN")}
                </p>
              )}
              <div className="flex gap-2 justify-center mt-3">
                <button
                  onClick={handlePinSubmit}
                  disabled={pinInput.length < 4}
                  className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-sm disabled:opacity-40 transition-all"
                >
                  {btnLabels[pinModalMode]}
                </button>
                <button
                  onClick={() => { setPinModalOpen(false); setPinInput(""); setPinSetupFirst(""); setPinError(false); }}
                  className="px-5 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-semibold text-sm"
                >
                  {isEl ? "Ακύρωση" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </nav>
  );
}
