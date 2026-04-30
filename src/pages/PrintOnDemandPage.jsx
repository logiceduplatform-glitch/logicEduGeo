import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import { LanguageContext } from "../i18n/LanguageContext";
import { AuthContext } from "../auth/AuthContext";
import { PrintOnDemandService, POD_PRODUCTS } from "../services/PrintOnDemandService";
import { CertificateService } from "../services/CertificateService";

const T = {
  el: {
    title: "🖨️ Print Shop",
    subtitle: "Παράγγειλε τα κατορθώματά σου σε φυσική μορφή — αυτοκόλλητα, πιστοποιητικά, αφίσες, t-shirts.",
    tabs: { shop: "🛒 Κατάστημα", cart: "🧺 Καλάθι", orders: "📦 Παραγγελίες" },
    add: "Προσθήκη",
    remove: "Αφαίρεση",
    addedTo: "Προστέθηκε στο καλάθι!",
    qty: "Ποσότητα",
    size: "Μέγεθος",
    total: "Σύνολο",
    subtotal: "Υποσύνολο",
    shipping: "Μεταφορικά",
    grandTotal: "Τελικό Σύνολο",
    free: "Δωρεάν >40€",
    empty: "Το καλάθι είναι άδειο",
    browse: "Πήγαινε στο κατάστημα",
    checkout: "💳 Ολοκλήρωση παραγγελίας",
    address: "Διεύθυνση αποστολής",
    name: "Ονοματεπώνυμο",
    addressLine: "Διεύθυνση",
    city: "Πόλη",
    postal: "Τ.Κ.",
    country: "Χώρα",
    phone: "Τηλέφωνο",
    email: "Email",
    submit: "Ολοκλήρωση",
    demoMode: "🧪 DEMO Mode — Δεν θα γίνει πραγματική χρέωση. Η ομάδα μας θα επικοινωνήσει για επιβεβαίωση.",
    successTitle: "✅ Η παραγγελία καταχωρήθηκε!",
    successDesc: "Θα λάβεις email με τα στοιχεία της παραγγελίας. Ο κωδικός σου είναι:",
    contactSoon: "Θα σε καλέσουμε σύντομα για επιβεβαίωση.",
    backToShop: "← Πίσω στο κατάστημα",
    noOrders: "Δεν έχεις παραγγελίες ακόμη",
    orderNum: "Παραγγελία",
    items: "Αντικείμενα",
    placedAt: "Ημ/νία",
    status: "Κατάσταση",
    statuses: {
      demo_submitted: "🧪 Demo",
      pending: "⏳ Σε αναμονή",
      processing: "🔧 Επεξεργασία",
      shipped: "🚚 Εστάλη",
      delivered: "✅ Παραδόθηκε",
    },
    premium: "✨ Premium",
    achievementsBadge: "Από τα κατορθώματά σου:",
    nothingEarned: "Παίξε λίγο πιο πολύ για να ξεκλειδώσεις πιστοποιητικά!",
    back: "← Πίσω",
    bundleSave: "Εξοικονόμηση",
  },
  en: {
    title: "🖨️ Print Shop",
    subtitle: "Order your achievements as physical products — stickers, certificates, posters, t-shirts.",
    tabs: { shop: "🛒 Shop", cart: "🧺 Cart", orders: "📦 Orders" },
    add: "Add to cart",
    remove: "Remove",
    addedTo: "Added to cart!",
    qty: "Quantity",
    size: "Size",
    total: "Total",
    subtotal: "Subtotal",
    shipping: "Shipping",
    grandTotal: "Grand Total",
    free: "Free >€40",
    empty: "Your cart is empty",
    browse: "Browse the shop",
    checkout: "💳 Checkout",
    address: "Shipping address",
    name: "Full name",
    addressLine: "Address",
    city: "City",
    postal: "Postal code",
    country: "Country",
    phone: "Phone",
    email: "Email",
    submit: "Place Order",
    demoMode: "🧪 DEMO Mode — No real charge. Our team will contact you for confirmation.",
    successTitle: "✅ Order submitted!",
    successDesc: "You'll receive an email with order details. Your reference is:",
    contactSoon: "We'll reach out shortly for confirmation.",
    backToShop: "← Back to shop",
    noOrders: "No orders yet",
    orderNum: "Order",
    items: "Items",
    placedAt: "Placed at",
    status: "Status",
    statuses: {
      demo_submitted: "🧪 Demo",
      pending: "⏳ Pending",
      processing: "🔧 Processing",
      shipped: "🚚 Shipped",
      delivered: "✅ Delivered",
    },
    premium: "✨ Premium",
    achievementsBadge: "From your achievements:",
    nothingEarned: "Play a bit more to unlock certificates!",
    back: "← Back",
    bundleSave: "Save",
  },
};

const SHIPPING_FREE_OVER = 40;
const SHIPPING_COST = 4.99;

export default function PrintOnDemandPage() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};

  const [tab, setTab] = useState("shop");
  const [cart, setCart] = useState(() => PrintOnDemandService.getCart());
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState("");
  const [orderConfirm, setOrderConfirm] = useState(null);

  // Load orders when switching to orders tab
  useEffect(() => {
    if (tab === "orders") {
      PrintOnDemandService.getMyOrders().then(setOrders);
    }
  }, [tab]);

  // Earned certificates (for the highlight banner)
  const earnedCerts = useMemo(() => CertificateService.getEarnedCertificates() || [], []);

  const addToCart = (productId, options = {}) => {
    const next = PrintOnDemandService.addToCart(productId, 1, options);
    setCart(next);
    setToast(l.addedTo);
    setTimeout(() => setToast(""), 2000);
  };
  const removeFromCart = (idx) => setCart(PrintOnDemandService.removeFromCart(idx));
  const updateQty = (idx, q) => setCart(PrintOnDemandService.updateQty(idx, q));

  const subtotal = PrintOnDemandService.cartTotal(cart);
  const shipping = subtotal === 0 ? 0 : subtotal >= SHIPPING_FREE_OVER ? 0 : SHIPPING_COST;
  const grand = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Navbar />
      <SEO title={l.title} />
      <div className="pt-20 pb-12 px-4">
        <div className="mx-auto max-w-5xl space-y-5">
          <button onClick={() => navigate(-1)} className="text-sm text-slate-500 hover:underline">{l.back}</button>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">{l.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto">{l.subtitle}</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-white dark:bg-slate-800 rounded-2xl p-1.5 shadow-sm">
            {Object.entries(l.tabs).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition ${
                  tab === k ? "bg-orange-500 text-white shadow" : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {v}{k === "cart" && cart.length > 0 && ` (${cart.length})`}
              </button>
            ))}
          </div>

          {/* Earned certificates banner */}
          {tab === "shop" && earnedCerts.length > 0 && (
            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
              <p className="font-bold text-amber-800 dark:text-amber-200 text-sm">{l.achievementsBadge}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {earnedCerts.slice(0, 8).map((c) => (
                  <span key={c.id} className="bg-white dark:bg-slate-800 rounded-lg px-3 py-1.5 text-sm shadow-sm">
                    {c.icon} {c.title?.[lang] || c.title?.en || c.id}
                  </span>
                ))}
                {earnedCerts.length > 8 && <span className="text-xs text-amber-700">+{earnedCerts.length - 8} more</span>}
              </div>
            </div>
          )}

          {tab === "shop" && <ShopTab products={POD_PRODUCTS} l={l} lang={lang} addToCart={addToCart} />}

          {tab === "cart" && (
            <CartTab
              cart={cart} l={l} lang={lang}
              removeFromCart={removeFromCart}
              updateQty={updateQty}
              subtotal={subtotal}
              shipping={shipping}
              grand={grand}
              onCheckout={(data) => {
                const order = PrintOnDemandService.submitOrder({
                  items: cart, shippingAddress: data.address, contact: data.contact,
                  total: grand, currency: "EUR",
                });
                Promise.resolve(order).then((o) => {
                  setOrderConfirm(o);
                  setCart([]);
                });
              }}
              prefillEmail={user?.email}
            />
          )}

          {tab === "orders" && <OrdersTab orders={orders} l={l} lang={lang} />}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white font-bold px-6 py-3 rounded-full shadow-2xl animate-bounce">
          {toast}
        </div>
      )}

      {orderConfirm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md text-center shadow-2xl">
            <div className="text-6xl mb-3">🎉</div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">{l.successTitle}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">{l.successDesc}</p>
            <p className="text-2xl font-mono font-extrabold text-orange-600 mt-2">{orderConfirm.orderRef}</p>
            <p className="text-xs text-slate-400 mt-2">{l.contactSoon}</p>
            <button
              onClick={() => { setOrderConfirm(null); setTab("orders"); }}
              className="mt-6 w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ShopTab({ products, l, lang, addToCart }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((p) => (
        <div key={p.id} className={`bg-gradient-to-br ${p.color} rounded-2xl p-5 text-white shadow-xl flex flex-col`}>
          <div className="flex items-start justify-between">
            <div className="text-5xl">{p.icon}</div>
            {p.premium && <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{l.premium}</span>}
          </div>
          <h3 className="mt-3 font-extrabold text-lg leading-tight">{p.title[lang] || p.title.en}</h3>
          <p className="text-xs opacity-90 mt-1 flex-1">{p.desc[lang] || p.desc.en}</p>
          {p.savings && <p className="text-xs font-bold bg-amber-400/20 inline-block px-2 py-0.5 rounded mt-2 self-start">💰 {l.bundleSave} €{p.savings.toFixed(2)}</p>}

          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-extrabold">€{p.price.toFixed(2)}</span>
            <button
              onClick={() => addToCart(p.id)}
              className="px-4 py-2 bg-white/90 hover:bg-white text-slate-800 font-bold rounded-xl text-sm"
            >
              {l.add}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function CartTab({ cart, l, lang, removeFromCart, updateQty, subtotal, shipping, grand, onCheckout, prefillEmail }) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState(lang === "el" ? "Ελλάδα" : "Greece");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(prefillEmail || "");

  if (cart.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 text-center">
        <div className="text-6xl mb-3">🛒</div>
        <p className="text-slate-500 dark:text-slate-400 font-bold">{l.empty}</p>
      </div>
    );
  }

  if (showCheckout) {
    const handleSubmit = (e) => {
      e.preventDefault();
      onCheckout({
        address: { name, address, city, postal, country },
        contact: { phone, email },
      });
    };
    return (
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="font-extrabold text-slate-800 dark:text-white text-xl">{l.address}</h3>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm rounded-xl p-3">
          {l.demoMode}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label={l.name} value={name} onChange={setName} required />
          <Field label={l.addressLine} value={address} onChange={setAddress} required />
          <Field label={l.city} value={city} onChange={setCity} required />
          <Field label={l.postal} value={postal} onChange={setPostal} required />
          <Field label={l.country} value={country} onChange={setCountry} required />
          <Field label={l.phone} value={phone} onChange={setPhone} type="tel" />
          <Field label={l.email} value={email} onChange={setEmail} type="email" required />
        </div>
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-between text-sm"><span>{l.subtotal}</span><span>€{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span>{l.shipping}</span><span>{shipping === 0 ? l.free : `€${shipping.toFixed(2)}`}</span></div>
          <div className="flex justify-between text-xl font-extrabold mt-1"><span>{l.grandTotal}</span><span>€{grand.toFixed(2)}</span></div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setShowCheckout(false)} className="flex-1 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold">
            ← Cart
          </button>
          <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-extrabold">
            {l.submit}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 space-y-3">
      {cart.map((item, idx) => {
        const product = POD_PRODUCTS.find((p) => p.id === item.productId);
        if (!product) return null;
        return (
          <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <div className="text-3xl">{product.icon}</div>
            <div className="flex-1">
              <p className="font-bold text-slate-800 dark:text-white text-sm">{product.title[lang] || product.title.en}</p>
              <p className="text-xs text-slate-500">€{product.price.toFixed(2)} × {item.qty}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => updateQty(idx, item.qty - 1)} className="w-7 h-7 rounded bg-slate-200 dark:bg-slate-600 font-bold">−</button>
              <span className="w-8 text-center font-bold text-slate-800 dark:text-white">{item.qty}</span>
              <button onClick={() => updateQty(idx, item.qty + 1)} className="w-7 h-7 rounded bg-slate-200 dark:bg-slate-600 font-bold">+</button>
            </div>
            <button onClick={() => removeFromCart(idx)} className="text-rose-500 text-sm font-bold ml-2">✕</button>
          </div>
        );
      })}

      <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-1 text-sm">
        <div className="flex justify-between"><span>{l.subtotal}</span><span>€{subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>{l.shipping}</span><span>{shipping === 0 ? l.free : `€${shipping.toFixed(2)}`}</span></div>
        <div className="flex justify-between text-lg font-extrabold pt-1"><span>{l.grandTotal}</span><span>€{grand.toFixed(2)}</span></div>
      </div>

      <button
        onClick={() => setShowCheckout(true)}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-extrabold text-lg shadow-lg"
      >
        {l.checkout}
      </button>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-slate-500">{label}{required && " *"}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
      />
    </label>
  );
}

function OrdersTab({ orders, l, lang }) {
  if (!orders.length) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 text-center">
        <div className="text-6xl mb-3">📦</div>
        <p className="text-slate-500 dark:text-slate-400 font-bold">{l.noOrders}</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {orders.map((o, i) => {
        const ts = o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000) : new Date(o.createdAt || Date.now());
        return (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-extrabold text-slate-800 dark:text-white">{l.orderNum} <span className="text-orange-600 font-mono">{o.orderRef}</span></p>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                {l.statuses[o.status] || o.status}
              </span>
            </div>
            <p className="text-xs text-slate-500">{l.placedAt}: {ts.toLocaleString()}</p>
            <div className="mt-2 space-y-1 text-sm">
              {o.items?.map((item, idx) => {
                const p = POD_PRODUCTS.find((x) => x.id === item.productId);
                return p ? (
                  <div key={idx} className="flex justify-between">
                    <span>{p.icon} {p.title[lang] || p.title.en} × {item.qty}</span>
                    <span className="font-bold">€{(p.price * item.qty).toFixed(2)}</span>
                  </div>
                ) : null;
              })}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-right font-extrabold text-slate-800 dark:text-white">
              {l.total}: €{(o.total || 0).toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
