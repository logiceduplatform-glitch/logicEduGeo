import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../../i18n/LanguageContext";
import { db } from "../../auth/firebase";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

/**
 * Admin UI for B2B / school invoicing.
 *
 * Lists past invoices from `schoolInvoices` and lets the admin create new ones
 * via the `createSchoolInvoice` callable function.
 */

const T = {
  el: {
    title: "💼 Τιμολόγηση Σχολείων / B2B",
    sub: "Δημιούργησε & διαχειρίσου τιμολόγια Stripe για σχολεία και εταιρικούς πελάτες.",
    newInvoice: "+ Νέο Τιμολόγιο",
    school: "Όνομα Σχολείου / Πελάτη",
    email: "Email Επικοινωνίας",
    vat: "ΑΦΜ / VAT",
    addressLine: "Διεύθυνση",
    postalCode: "Τ.Κ.",
    city: "Πόλη",
    country: "Χώρα",
    items: "Γραμμές χρέωσης",
    description: "Περιγραφή",
    qty: "Ποσότητα",
    unitAmount: "Τιμή μονάδας (€)",
    addLine: "+ Γραμμή",
    notes: "Σημειώσεις (εμφανίζεται στο footer)",
    saveDraft: "Αποθήκευση ως draft",
    sendInvoice: "Δημιούργησε & Στείλε",
    cancel: "Ακύρωση",
    pastInvoices: "Πρόσφατα Τιμολόγια",
    none: "Δεν υπάρχουν τιμολόγια ακόμη.",
    status: "Status",
    total: "Σύνολο",
    actions: "Ενέργειες",
    view: "Δες",
    pdf: "PDF",
    void: "Άκυρο",
    success: "✅ Τιμολόγιο δημιουργήθηκε & εστάλη.",
    error: "❌ Σφάλμα: ",
    creating: "Δημιουργία…",
  },
  en: {
    title: "💼 School / B2B Invoicing",
    sub: "Create & manage Stripe invoices for schools and enterprise customers.",
    newInvoice: "+ New Invoice",
    school: "School / Customer Name",
    email: "Contact Email",
    vat: "VAT Number",
    addressLine: "Address",
    postalCode: "Postal Code",
    city: "City",
    country: "Country",
    items: "Line Items",
    description: "Description",
    qty: "Quantity",
    unitAmount: "Unit Price (€)",
    addLine: "+ Line",
    notes: "Notes (shown on invoice footer)",
    saveDraft: "Save as draft",
    sendInvoice: "Create & Send",
    cancel: "Cancel",
    pastInvoices: "Recent Invoices",
    none: "No invoices yet.",
    status: "Status",
    total: "Total",
    actions: "Actions",
    view: "View",
    pdf: "PDF",
    void: "Void",
    success: "✅ Invoice created & sent.",
    error: "❌ Error: ",
    creating: "Creating…",
  },
};

const STATUS_COLORS = {
  paid:    "bg-emerald-100 text-emerald-700",
  open:    "bg-amber-100  text-amber-700",
  draft:   "bg-slate-100  text-slate-600",
  void:    "bg-rose-100   text-rose-600",
  uncollectible: "bg-rose-100 text-rose-600",
};

function statusPill(status) {
  return `inline-block px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[status] || "bg-slate-200 text-slate-700"}`;
}

const EMPTY_LINE = { description: "", quantity: 1, unitAmount: 0 };

export default function AdminInvoicing() {
  const { lang } = useContext(LanguageContext) || { lang: "el" };
  const l = T[lang] || T.en;

  const [invoices, setInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null); // { kind: "ok"|"err", text }

  // Form state
  const [schoolName, setSchoolName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("GR");
  const [lineItems, setLineItems] = useState([{ ...EMPTY_LINE }]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!db) return undefined;
    const q = query(collection(db, "schoolInvoices"), orderBy("createdAt", "desc"), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      setInvoices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const reset = () => {
    setSchoolName(""); setContactEmail(""); setVatNumber("");
    setAddressLine(""); setPostalCode(""); setCity(""); setCountry("GR");
    setLineItems([{ ...EMPTY_LINE }]); setNotes("");
  };

  const submit = async (asDraft) => {
    setMsg(null);
    if (!schoolName || !contactEmail || lineItems.length === 0) {
      setMsg({ kind: "err", text: l.error + "missing required fields" });
      return;
    }
    setBusy(true);
    try {
      const fn = httpsCallable(getFunctions(undefined, "europe-west1"), "createSchoolInvoice");
      const res = await fn({
        schoolName,
        contactEmail,
        vatNumber: vatNumber || undefined,
        address: addressLine ? {
          line1: addressLine,
          postal_code: postalCode || undefined,
          city: city || undefined,
          country: country || "GR",
        } : null,
        lineItems: lineItems.map((li) => ({
          description: li.description,
          quantity:    Number(li.quantity) || 1,
          unitAmount:  Math.round((Number(li.unitAmount) || 0) * 100), // €→cents
        })),
        notes,
        draft: !!asDraft,
      });
      if (res.data?.ok) {
        setMsg({ kind: "ok", text: l.success });
        setShowForm(false);
        reset();
      } else {
        setMsg({ kind: "err", text: l.error + (res.data?.error || "unknown") });
      }
    } catch (e) {
      setMsg({ kind: "err", text: l.error + (e?.message || String(e)) });
    } finally {
      setBusy(false);
    }
  };

  const voidInvoice = async (invoiceId) => {
    if (!window.confirm(`Void invoice ${invoiceId}?`)) return;
    try {
      const fn = httpsCallable(getFunctions(undefined, "europe-west1"), "voidSchoolInvoice");
      await fn({ invoiceId });
    } catch (e) {
      setMsg({ kind: "err", text: l.error + e?.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">{l.title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{l.sub}</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold shadow whitespace-nowrap"
        >
          {showForm ? l.cancel : l.newInvoice}
        </button>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-lg text-sm font-semibold ${
          msg.kind === "ok" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                              "bg-rose-50    text-rose-700    border border-rose-200"
        }`}>{msg.text}</div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label={l.school}  value={schoolName}   onChange={setSchoolName}   required />
            <Input label={l.email}   value={contactEmail} onChange={setContactEmail} required type="email" />
            <Input label={l.vat}     value={vatNumber}    onChange={setVatNumber}    placeholder="EL999999999" />
            <Input label={l.addressLine} value={addressLine} onChange={setAddressLine} />
            <Input label={l.postalCode}  value={postalCode}  onChange={setPostalCode} />
            <Input label={l.city}        value={city}        onChange={setCity} />
            <Input label={l.country}     value={country}     onChange={setCountry} placeholder="GR" />
          </div>

          <div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">{l.items}</div>
            {lineItems.map((li, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 mb-2">
                <input className="col-span-7 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900" placeholder={l.description} value={li.description} onChange={(e) => {
                  const next = [...lineItems]; next[i].description = e.target.value; setLineItems(next);
                }} />
                <input className="col-span-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900" type="number" min="1" placeholder={l.qty} value={li.quantity} onChange={(e) => {
                  const next = [...lineItems]; next[i].quantity = e.target.value; setLineItems(next);
                }} />
                <input className="col-span-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900" type="number" min="0" step="0.01" placeholder={l.unitAmount} value={li.unitAmount} onChange={(e) => {
                  const next = [...lineItems]; next[i].unitAmount = e.target.value; setLineItems(next);
                }} />
                <button onClick={() => setLineItems(lineItems.filter((_, j) => j !== i))} className="col-span-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg" title="Remove">✕</button>
              </div>
            ))}
            <button onClick={() => setLineItems([...lineItems, { ...EMPTY_LINE }])} className="text-sm text-purple-600 hover:underline">{l.addLine}</button>
          </div>

          <textarea className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900" rows="3" placeholder={l.notes} value={notes} onChange={(e) => setNotes(e.target.value)} />

          <div className="flex gap-2">
            <button onClick={() => submit(true)}  disabled={busy} className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold disabled:opacity-50">{l.saveDraft}</button>
            <button onClick={() => submit(false)} disabled={busy} className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold disabled:opacity-50">{busy ? l.creating : l.sendInvoice}</button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200">{l.pastInvoices}</div>
        {invoices.length === 0 ? (
          <div className="px-5 py-8 text-center text-slate-500">{l.none}</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="text-left px-4 py-2">{l.school}</th>
                <th className="text-left px-4 py-2">{l.email}</th>
                <th className="text-right px-4 py-2">{l.total}</th>
                <th className="text-center px-4 py-2">{l.status}</th>
                <th className="text-center px-4 py-2">{l.actions}</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-t border-slate-100 dark:border-slate-700">
                  <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">{inv.schoolName}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{inv.contactEmail}</td>
                  <td className="px-4 py-3 text-right font-mono">{((inv.total || 0) / 100).toFixed(2)} {(inv.currency || "eur").toUpperCase()}</td>
                  <td className="px-4 py-3 text-center"><span className={statusPill(inv.status)}>{inv.status}</span></td>
                  <td className="px-4 py-3 text-center space-x-2 whitespace-nowrap">
                    {inv.hostedInvoiceUrl && <a href={inv.hostedInvoiceUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">{l.view}</a>}
                    {inv.invoicePdf      && <a href={inv.invoicePdf}       target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">{l.pdf}</a>}
                    {inv.status === "open" && <button onClick={() => voidInvoice(inv.id)} className="text-rose-600 hover:underline">{l.void}</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder = "", required = false }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{label}{required && " *"}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900"
      />
    </label>
  );
}
