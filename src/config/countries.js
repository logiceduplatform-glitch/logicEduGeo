// Country list with flag emoji. Used for leaderboard nationality display.

export const COUNTRIES = [
  { code: "GR", flag: "🇬🇷", name: { el: "Ελλάδα", en: "Greece" } },
  { code: "CY", flag: "🇨🇾", name: { el: "Κύπρος", en: "Cyprus" } },
  { code: "US", flag: "🇺🇸", name: { el: "Η.Π.Α.", en: "USA" } },
  { code: "GB", flag: "🇬🇧", name: { el: "Ηνωμένο Βασίλειο", en: "United Kingdom" } },
  { code: "DE", flag: "🇩🇪", name: { el: "Γερμανία", en: "Germany" } },
  { code: "FR", flag: "🇫🇷", name: { el: "Γαλλία", en: "France" } },
  { code: "IT", flag: "🇮🇹", name: { el: "Ιταλία", en: "Italy" } },
  { code: "ES", flag: "🇪🇸", name: { el: "Ισπανία", en: "Spain" } },
  { code: "PT", flag: "🇵🇹", name: { el: "Πορτογαλία", en: "Portugal" } },
  { code: "NL", flag: "🇳🇱", name: { el: "Ολλανδία", en: "Netherlands" } },
  { code: "BE", flag: "🇧🇪", name: { el: "Βέλγιο", en: "Belgium" } },
  { code: "AT", flag: "🇦🇹", name: { el: "Αυστρία", en: "Austria" } },
  { code: "CH", flag: "🇨🇭", name: { el: "Ελβετία", en: "Switzerland" } },
  { code: "SE", flag: "🇸🇪", name: { el: "Σουηδία", en: "Sweden" } },
  { code: "NO", flag: "🇳🇴", name: { el: "Νορβηγία", en: "Norway" } },
  { code: "DK", flag: "🇩🇰", name: { el: "Δανία", en: "Denmark" } },
  { code: "FI", flag: "🇫🇮", name: { el: "Φινλανδία", en: "Finland" } },
  { code: "PL", flag: "🇵🇱", name: { el: "Πολωνία", en: "Poland" } },
  { code: "RO", flag: "🇷🇴", name: { el: "Ρουμανία", en: "Romania" } },
  { code: "BG", flag: "🇧🇬", name: { el: "Βουλγαρία", en: "Bulgaria" } },
  { code: "TR", flag: "🇹🇷", name: { el: "Τουρκία", en: "Turkey" } },
  { code: "RU", flag: "🇷🇺", name: { el: "Ρωσία", en: "Russia" } },
  { code: "UA", flag: "🇺🇦", name: { el: "Ουκρανία", en: "Ukraine" } },
  { code: "CA", flag: "🇨🇦", name: { el: "Καναδάς", en: "Canada" } },
  { code: "AU", flag: "🇦🇺", name: { el: "Αυστραλία", en: "Australia" } },
  { code: "BR", flag: "🇧🇷", name: { el: "Βραζιλία", en: "Brazil" } },
  { code: "MX", flag: "🇲🇽", name: { el: "Μεξικό", en: "Mexico" } },
  { code: "AR", flag: "🇦🇷", name: { el: "Αργεντινή", en: "Argentina" } },
  { code: "IN", flag: "🇮🇳", name: { el: "Ινδία", en: "India" } },
  { code: "JP", flag: "🇯🇵", name: { el: "Ιαπωνία", en: "Japan" } },
  { code: "KR", flag: "🇰🇷", name: { el: "Νότια Κορέα", en: "South Korea" } },
  { code: "CN", flag: "🇨🇳", name: { el: "Κίνα", en: "China" } },
  { code: "AE", flag: "🇦🇪", name: { el: "ΗΑΕ", en: "UAE" } },
  { code: "EG", flag: "🇪🇬", name: { el: "Αίγυπτος", en: "Egypt" } },
  { code: "ZA", flag: "🇿🇦", name: { el: "Νότια Αφρική", en: "South Africa" } },
  { code: "OTHER", flag: "🌍", name: { el: "Άλλο", en: "Other" } },
];

const KEY = "geo:country";

export const CountryService = {
  get() { try { return localStorage.getItem(KEY) || "GR"; } catch { return "GR"; } },
  set(code) { try { localStorage.setItem(KEY, code); } catch {} },
  getInfo(code) {
    return COUNTRIES.find(c => c.code === code) || COUNTRIES.find(c => c.code === "OTHER");
  },
};
