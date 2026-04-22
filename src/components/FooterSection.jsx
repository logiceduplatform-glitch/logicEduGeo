import React, { useContext } from "react";
import { LanguageContext } from "../i18n/LanguageContext";

export default function FooterSection({ t }) {
  const { lang } = useContext(LanguageContext);
  const isEl = lang === "el";

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🧠</span>
              <span className="text-xl font-bold text-white">GeoLo Platform</span>
            </div>
            <p className="text-xs font-semibold text-amber-400 tracking-wider uppercase mb-2">
              {isEl ? "Μάθε. Σκέψου. Λύσε." : "Learn. Think. Solve."}
            </p>
            <p className="text-sm leading-relaxed">
              {isEl
                ? "Γύμνασε το μυαλό σου με λογική! Εκπαιδευτική πλατφόρμα παιχνιδιών για παιδιά 2-12 ετών & ενήλικες."
                : "Train your brain with logic! Educational gaming platform for kids ages 2-12 & adults."}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              {isEl ? "Πλοήγηση" : "Navigate"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/#categories" className="hover:text-white transition-colors">{isEl ? "Κατηγορίες" : "Categories"}</a></li>
              <li><a href="/#features" className="hover:text-white transition-colors">{isEl ? "Χαρακτηριστικά" : "Features"}</a></li>
              <li><a href="/#games" className="hover:text-white transition-colors">{isEl ? "Παιχνίδια" : "Games"}</a></li>
              <li><a href="/#how-it-works" className="hover:text-white transition-colors">{isEl ? "Πώς λειτουργεί" : "How it works"}</a></li>
              <li><a href="/#pricing" className="hover:text-white transition-colors">{isEl ? "Τιμές" : "Pricing"}</a></li>
              <li><a href="/#faq" className="hover:text-white transition-colors">{isEl ? "Συχνές Ερωτήσεις" : "FAQ"}</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">{isEl ? "Επικοινωνία" : "Contact"}</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">{isEl ? "Σχετικά" : "About"}</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              {isEl ? "Επικοινωνία" : "Contact"}
            </h4>
            <a href="mailto:info@geoloplatform.com" className="text-sm hover:text-white transition-colors block mb-4">
              info@geoloplatform.com
            </a>
            <div className="flex items-center gap-3">
              <a href="https://www.facebook.com/geoloplatform" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-purple-600 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="https://www.instagram.com/geoloplatform" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-pink-600 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.youtube.com/@geoloplatform" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <span>&copy; {new Date().getFullYear()} GeoLo Platform</span>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-white transition-colors">
              {isEl ? "Απόρρητο" : "Privacy"}
            </a>
            <span className="text-slate-700">|</span>
            <a href="/terms" className="hover:text-white transition-colors">
              {isEl ? "Όροι χρήσης" : "Terms"}
            </a>
          </div>
          <span className="text-slate-500">
            {isEl ? "Κατασκευασμένο με ❤️ στην Ελλάδα" : "Made with ❤️ in Greece"}
          </span>
        </div>
      </div>
    </footer>
  );
}
