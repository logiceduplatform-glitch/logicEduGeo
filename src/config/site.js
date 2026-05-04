/**
 * Single source of truth for site URLs and brand metadata. Read from env
 * vars when available so we can swap domains (e.g. kibloo.app vs the
 * Firebase preview URL) without touching code.
 */
export const SITE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) ||
  "https://kibloo.app";

export const SITE_NAME = "Kibloo";

export const SITE_TAGLINE = {
  el: "Όπου η περιέργεια ανθίζει",
  en: "Where curiosity blooms",
};

export const CONTACT_EMAIL = "hello@kibloo.app";

export const SOCIAL = {
  twitter: "https://twitter.com/kibloo",
  facebook: "https://www.facebook.com/kibloo",
  instagram: "https://www.instagram.com/kibloo",
  youtube: "https://www.youtube.com/@kibloo",
};

export const SUPPORTED_LANGS = ["en", "el"];
export const DEFAULT_LANG = "el";

/**
 * Build a fully qualified URL from a path. Handles trailing slashes and
 * absolute URLs gracefully.
 */
export function siteUrl(path = "/") {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  if (path === "/") return SITE_URL;
  if (path.startsWith("/")) return SITE_URL + path;
  return `${SITE_URL}/${path}`;
}

/**
 * Build alternate-language URLs for hreflang tags. Prepends ?lang=en/el to
 * the canonical so Google can index both translations of the same page.
 */
export function alternateUrls(path) {
  const base = siteUrl(path);
  const sep = base.includes("?") ? "&" : "?";
  return SUPPORTED_LANGS.map((lang) => ({
    lang,
    url: `${base}${sep}lang=${lang}`,
  }));
}
