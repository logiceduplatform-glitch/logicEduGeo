// Print-on-Demand Service: handles ordering of physical products (stickers, certificates, posters).
// Orders are stored in localStorage (& in Firestore if user is logged in) for the parent/admin to fulfill.
//
// IMPORTANT: This is a stub for the order pipeline. To enable real fulfillment integrate with a service
// like Printful, Printify, Gelato or a local print shop API.

import { db, auth } from "../auth/firebase";
import {
  collection, addDoc, getDocs, query, where, orderBy, serverTimestamp,
} from "firebase/firestore";

const KEY_LOCAL = "geo:pod:orders";
const KEY_CART = "geo:pod:cart";

// Catalog of available products
export const POD_PRODUCTS = [
  // Stickers
  { id: "stickers_pack_small", type: "stickers", title: { el: "Πακέτο Αυτοκόλλητων (10 τμχ)", en: "Sticker Pack (10pcs)" },
    desc: { el: "10 αυτοκόλλητα από τα κατορθώματά σου", en: "10 stickers featuring your achievements" },
    price: 7.99, currency: "EUR", icon: "🌟", color: "from-amber-400 to-orange-500",
    sizes: ["5×5cm"], premium: false },
  { id: "stickers_pack_large", type: "stickers", title: { el: "Mega Πακέτο Αυτοκόλλητων (25 τμχ)", en: "Mega Sticker Pack (25pcs)" },
    desc: { el: "25 αυτοκόλλητα — όλα τα badges & επιτεύγματα!", en: "25 stickers — all your badges & achievements!" },
    price: 14.99, currency: "EUR", icon: "💎", color: "from-violet-500 to-fuchsia-500",
    sizes: ["5×5cm", "7×7cm"], premium: true },

  // Certificates
  { id: "cert_a4", type: "certificate", title: { el: "Πιστοποιητικό A4 (Premium)", en: "A4 Certificate (Premium)" },
    desc: { el: "Επαγγελματικό πιστοποιητικό σε χαρτί 250gsm με χρυσή σφραγίδα", en: "Professional certificate on 250gsm paper with gold seal" },
    price: 9.99, currency: "EUR", icon: "🏆", color: "from-yellow-500 to-amber-600",
    sizes: ["A4"], premium: false },
  { id: "cert_framed", type: "certificate", title: { el: "Πιστοποιητικό σε Κορνίζα", en: "Framed Certificate" },
    desc: { el: "Πιστοποιητικό A4 σε ξύλινη κορνίζα — έτοιμο για δώρο/τοίχο", en: "A4 certificate in wooden frame — ready to hang or gift" },
    price: 24.99, currency: "EUR", icon: "🖼️", color: "from-amber-700 to-yellow-800",
    sizes: ["A4 framed"], premium: true },

  // Posters
  { id: "poster_milestones", type: "poster", title: { el: "Αφίσα Επιτευγμάτων A3", en: "Achievements Poster A3" },
    desc: { el: "Όλα σου τα επιτεύγματα σε μια αφίσα A3", en: "All your achievements in one A3 poster" },
    price: 12.99, currency: "EUR", icon: "📜", color: "from-emerald-500 to-teal-600",
    sizes: ["A3"], premium: false },

  // Bundle
  { id: "bundle_starter", type: "bundle", title: { el: "Starter Bundle", en: "Starter Bundle" },
    desc: { el: "10 αυτοκόλλητα + 1 πιστοποιητικό A4 + 1 αφίσα A3", en: "10 stickers + 1 A4 certificate + 1 A3 poster" },
    price: 24.99, currency: "EUR", icon: "🎁", color: "from-rose-500 to-pink-600",
    sizes: ["Bundle"], premium: false, savings: 5.98 },

  // Notebooks / school supplies
  { id: "notebook_a5", type: "notebook", title: { el: "Σημειωματάριο A5 (custom cover)", en: "A5 Notebook (custom cover)" },
    desc: { el: "Σημειωματάριο με τον αγαπημένο σου χαρακτήρα από την πλατφόρμα", en: "Notebook with your favorite platform character" },
    price: 11.99, currency: "EUR", icon: "📓", color: "from-blue-500 to-cyan-600",
    sizes: ["A5"], premium: false },

  // T-shirts (premium tier)
  { id: "tshirt_kid", type: "apparel", title: { el: "Παιδικό T-shirt με Avatar", en: "Kid T-Shirt with Avatar" },
    desc: { el: "100% βαμβάκι. Το avatar του παιδιού τυπωμένο μπροστά", en: "100% cotton. Child's avatar printed on the front" },
    price: 19.99, currency: "EUR", icon: "👕", color: "from-fuchsia-500 to-purple-600",
    sizes: ["4-5y", "6-7y", "8-9y", "10-11y"], premium: true },
];

const KEY_DEMO = "geo:pod:demo-mode";

export const PrintOnDemandService = {
  PRODUCTS: POD_PRODUCTS,

  /** Whether to simulate orders locally (true if no backend payment integration). */
  isDemoMode() {
    try { return localStorage.getItem(KEY_DEMO) !== "false"; }
    catch { return true; }
  },
  setDemoMode(b) {
    try { localStorage.setItem(KEY_DEMO, b ? "true" : "false"); } catch {}
  },

  // Cart
  getCart() {
    try { return JSON.parse(localStorage.getItem(KEY_CART) || "[]"); } catch { return []; }
  },
  saveCart(items) {
    try { localStorage.setItem(KEY_CART, JSON.stringify(items)); } catch {}
  },
  addToCart(productId, qty = 1, options = {}) {
    const cart = this.getCart();
    const existing = cart.find((c) => c.productId === productId && JSON.stringify(c.options) === JSON.stringify(options));
    if (existing) { existing.qty += qty; }
    else { cart.push({ productId, qty, options, addedAt: Date.now() }); }
    this.saveCart(cart);
    return cart;
  },
  removeFromCart(idx) {
    const cart = this.getCart();
    cart.splice(idx, 1);
    this.saveCart(cart);
    return cart;
  },
  updateQty(idx, qty) {
    const cart = this.getCart();
    if (cart[idx]) cart[idx].qty = Math.max(1, qty);
    this.saveCart(cart);
    return cart;
  },
  clearCart() {
    this.saveCart([]);
  },

  cartTotal(cart) {
    return cart.reduce((sum, item) => {
      const p = POD_PRODUCTS.find((x) => x.id === item.productId);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  },

  // Orders
  getLocalOrders() {
    try { return JSON.parse(localStorage.getItem(KEY_LOCAL) || "[]"); } catch { return []; }
  },

  async submitOrder({ items, shippingAddress, contact, total, currency = "EUR" }) {
    const order = {
      items, shippingAddress, contact, total, currency,
      status: this.isDemoMode() ? "demo_submitted" : "pending",
      createdAt: Date.now(),
      uid: auth?.currentUser?.uid || null,
      orderRef: "GEO-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    };

    // Save locally
    const orders = this.getLocalOrders();
    orders.unshift(order);
    try { localStorage.setItem(KEY_LOCAL, JSON.stringify(orders)); } catch {}

    // Try to save to Firestore (best-effort)
    if (auth?.currentUser?.uid) {
      try {
        await addDoc(collection(db, "podOrders"), {
          ...order,
          createdAt: serverTimestamp(),
        });
      } catch (e) {
        console.warn("PoD: failed to save to Firestore", e);
      }
    }

    this.clearCart();
    return order;
  },

  async getMyOrders() {
    if (!auth?.currentUser?.uid) return this.getLocalOrders();
    try {
      const q = query(
        collection(db, "podOrders"),
        where("uid", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn(e);
      return this.getLocalOrders();
    }
  },
};
