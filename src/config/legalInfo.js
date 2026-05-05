/**
 * Centralised company / legal info used across legal pages, footer, contact.
 *
 * IMPORTANT — placeholders below must be filled in before going live:
 *   - VAT number (ΑΦΜ)
 *   - GEMI registration number (Γ.Ε.ΜΗ.)
 *   - Registered address
 *   - Phone number (optional but builds trust)
 *
 * Search-replace all "TBD" entries when the legal entity is finalised.
 */
export const LEGAL_INFO = {
  // Brand
  brand:           "Kibloo",
  productName:     "Kibloo · Educational Games Platform",

  // Legal entity (placeholders – fill before go-live)
  legalName:       "TBD — Νομική Οντότητα", // e.g. "Kibloo IKE"
  vatNumber:       "TBD — ΑΦΜ",
  gemiNumber:      "TBD — Γ.Ε.ΜΗ.",
  taxOffice:       "TBD — Δ.Ο.Υ.",

  // Registered address (Greek)
  address:         "TBD — Οδός, Αριθμός, Τ.Κ., Πόλη, Ελλάδα",
  country:         "Ελλάδα / Greece",

  // Contact
  emailGeneral:    "hello@kibloo.app",
  emailSupport:    "support@kibloo.app",
  emailLegal:      "legal@kibloo.app",
  emailPrivacy:    "privacy@kibloo.app",
  emailDpo:        "dpo@kibloo.app",
  phone:           "TBD — +30 210 0000000",

  // Web
  websiteUrl:      "https://kibloo.app",
  // Update if you change hosting domain.

  // Governing law / dispute resolution
  governingLaw:    "Ελληνικό Δίκαιο / Greek law",
  jurisdiction:    "Δικαστήρια Αθηνών / Courts of Athens, Greece",
  euOdrUrl:        "https://ec.europa.eu/consumers/odr",

  // GDPR Authority (Greek DPA)
  dpa: {
    name:    "Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (ΑΠΔΠΧ)",
    nameEn:  "Hellenic Data Protection Authority (HDPA)",
    address: "Λεωφ. Κηφισίας 1-3, 115 23 Αθήνα",
    web:     "www.dpa.gr",
  },

  // Subscription pricing (used in legal copy)
  pricing: {
    free:         "€0/μήνα",
    premium:      "€9.99/μήνα",
    family:       "€14.99/μήνα",
    trialDays:    7,
    refundDays:   14, // EU consumer right of withdrawal
  },

  // Last updated date for policies — bump when text changes.
  policyUpdated: "Μάιος 2026 / May 2026",
};

export default LEGAL_INFO;
