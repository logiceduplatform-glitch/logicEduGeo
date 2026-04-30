// Manage equipped cosmetic items (frame, badge, currently active music track).
// Stored in localStorage. Defaults provided.

import { SHOP_ITEMS } from "../config/shopItems";

const KEY = "geo:equipped";

const DEFAULTS = {
  frame: "frame_simple",
  badge: null,
  music: "music_focus",
};

export const CosmeticsService = {
  getEquipped() {
    try {
      const e = JSON.parse(localStorage.getItem(KEY) || "{}");
      return { ...DEFAULTS, ...e };
    } catch { return { ...DEFAULTS }; }
  },

  equip(slot, itemId) {
    const e = this.getEquipped();
    e[slot] = itemId;
    try { localStorage.setItem(KEY, JSON.stringify(e)); } catch {}
    try { window.dispatchEvent(new CustomEvent("geo:cosmetics-changed", { detail: e })); } catch {}
    return e;
  },

  getFrame(id) {
    return (SHOP_ITEMS.frames || []).find((f) => f.id === id) || (SHOP_ITEMS.frames || [])[0];
  },

  getBadge(id) {
    return (SHOP_ITEMS.badges || []).find((b) => b.id === id);
  },

  getMusic(id) {
    return (SHOP_ITEMS.music || []).find((m) => m.id === id) || (SHOP_ITEMS.music || [])[0];
  },
};
