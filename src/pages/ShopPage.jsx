import React, { useContext, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../i18n/LanguageContext";
import { CoinService } from "../services/CoinService";
import { SHOP_ITEMS, SHOP_TABS } from "../config/shopItems";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";

const T = {
  el: {
    title: "Κατάστημα",
    subtitle: "Ξόδεψε τα νομίσματά σου!",
    coins: "Νομίσματα",
    buy: "Αγορά",
    owned: "Ιδιοκτησία",
    notEnough: "Δεν αρκούν",
    back: "Πίσω",
    earnMore: "Παίξε παιχνίδια για να κερδίσεις νομίσματα!",
    purchased: "Αγοράστηκε!",
  },
  en: {
    title: "Shop",
    subtitle: "Spend your coins!",
    coins: "Coins",
    buy: "Buy",
    owned: "Owned",
    notEnough: "Not enough",
    back: "Back",
    earnMore: "Play games to earn coins!",
    purchased: "Purchased!",
  },
};

export default function ShopPage() {
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();
  const l = T[lang] || T.en;
  const [activeTab, setActiveTab] = useState("avatars");
  const [coinData, setCoinData] = useState(() => CoinService.getBalance());
  const [ownedItems, setOwnedItems] = useState(() => CoinService.getOwned());
  const [justBought, setJustBought] = useState(null);

  const items = useMemo(() => SHOP_ITEMS[activeTab] || [], [activeTab]);

  const handleBuy = useCallback((item) => {
    if (CoinService.isOwned(item.id)) return;
    if (!CoinService.spend(item.price)) return;

    const typeMap = { avatars: "avatar", pets: "pet", themes: "theme", avatarParts: "avatarPart", frames: "frame", badges: "badge", music: "music" };
    CoinService.addOwned({ id: item.id, type: typeMap[activeTab] || activeTab, emoji: item.emoji, name: item.name });
    setCoinData(CoinService.getBalance());
    setOwnedItems(CoinService.getOwned());
    setJustBought(item.id);
    setTimeout(() => setJustBought(null), 2000);
  }, [activeTab]);

  return (
    <div id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SEO title={l.title} />
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <span>←</span> {l.back}
          </button>

          <div className="text-center mb-8">
            <span className="text-5xl mb-3 block" aria-hidden="true">🛍️</span>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{l.subtitle}</p>
          </div>

          {/* Coin balance header */}
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-5 mb-8 text-center shadow-lg">
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl" aria-hidden="true">🪙</span>
              <div>
                <p className="text-white/80 text-sm font-medium">{l.coins}</p>
                <p className="text-white text-3xl font-extrabold">{coinData.balance}</p>
              </div>
            </div>
            {coinData.balance === 0 && (
              <p className="text-white/70 text-xs mt-2">{l.earnMore}</p>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 justify-center">
            {SHOP_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-purple-300"
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label[lang] || tab.label.en}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item) => {
              const isOwned = ownedItems.some((o) => o.id === item.id);
              const canAfford = coinData.balance >= item.price;
              const wasBought = justBought === item.id;

              return (
                <div
                  key={item.id}
                  className={`relative rounded-2xl p-5 text-center transition-all duration-300 ${
                    isOwned
                      ? "bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-700"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:scale-105"
                  }`}
                >
                  {item.colors && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.colors} opacity-10 rounded-2xl`} />
                  )}

                  <div className="relative">
                    <span className="text-5xl block mb-3">{item.emoji}</span>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                      {item.name[lang] || item.name.en}
                    </h3>

                    {isOwned ? (
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                        {wasBought ? l.purchased : l.owned}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={!canAfford}
                        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                          canAfford
                            ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:scale-105 shadow-md"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        <span>🪙</span>
                        {canAfford ? `${item.price} ${l.buy}` : l.notEnough}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
