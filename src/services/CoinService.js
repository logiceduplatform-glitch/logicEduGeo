import { StorageService } from "./StorageService";

export const CoinService = {
  getBalance() {
    const data = StorageService.get("stats:coins") || { balance: 0, totalEarned: 0 };
    return data;
  },

  earn(amount) {
    if (amount <= 0) return this.getBalance();
    const data = this.getBalance();
    data.balance += amount;
    data.totalEarned += amount;
    StorageService.set("stats:coins", data);
    return data;
  },

  spend(amount) {
    const data = this.getBalance();
    if (data.balance < amount) return false;
    data.balance -= amount;
    StorageService.set("stats:coins", data);
    return true;
  },

  getOwned() {
    try { return JSON.parse(localStorage.getItem("geo:shop:owned")) || []; }
    catch { return []; }
  },

  addOwned(item) {
    const owned = this.getOwned();
    if (owned.some((o) => o.id === item.id)) return owned;
    owned.push({ ...item, purchasedAt: new Date().toISOString() });
    try { localStorage.setItem("geo:shop:owned", JSON.stringify(owned)); } catch { /* restricted */ }
    return owned;
  },

  isOwned(itemId) {
    return this.getOwned().some((o) => o.id === itemId);
  },

  getLastXPMilestone() {
    return StorageService.get("stats:coinMilestone") || 0;
  },

  setLastXPMilestone(xp) {
    StorageService.set("stats:coinMilestone", xp);
  },
};
