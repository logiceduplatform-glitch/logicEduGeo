import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SITE_URL, SITE_NAME, alternateUrls } from "../config/site";

const DEFAULTS = {
  siteName: SITE_NAME,
  description: "Kibloo is a playful learning world for kids 2–12 and curious adults. 350+ educational games. Where curiosity blooms.",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.png`,
  imageWidth: "1200",
  imageHeight: "630",
};

// Organization schema is shipped on every page so search engines can
// associate the brand identity (name, logo, social profiles) site-wide.
const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: DEFAULTS.siteName,
  url: DEFAULTS.url,
  logo: `${DEFAULTS.url}/icon-512.png`,
  sameAs: [
    "https://twitter.com/kibloo",
    "https://www.facebook.com/kibloo",
    "https://www.instagram.com/kibloo",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@kibloo.app",
    contactType: "customer support",
    availableLanguage: ["English", "Greek"],
  },
};

export default function SEO({
  title,
  description,
  image,
  path,
  article,
  course,
  game,
  faq,           // [{ q, a }] for FAQPage schema
  breadcrumbs,   // [{ name, url }]
  noindex,
}) {
  const location = useLocation();
  const fullTitle = title ? `${title} | ${DEFAULTS.siteName}` : DEFAULTS.siteName;
  const desc = description || DEFAULTS.description;
  const ogImage = image || DEFAULTS.image;
  const derivedPath = path || location.pathname;
  const canonicalUrl = `${DEFAULTS.url}${derivedPath === "/" ? "" : derivedPath}`;

  const isHome = derivedPath === "/" || derivedPath === "";

  let jsonLd = null;
  if (isHome) {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: DEFAULTS.siteName,
      url: DEFAULTS.url,
      description: DEFAULTS.description,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      audience: {
        "@type": "EducationalAudience",
        educationalRole: "student",
        audienceType: "Children ages 2–12, adults",
      },
      offers: [
        {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          name: "Free",
        },
        {
          "@type": "Offer",
          price: "4.99",
          priceCurrency: "EUR",
          name: "Premium (monthly)",
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "120",
      },
    };
  } else if (article) {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title || DEFAULTS.siteName,
      description: desc,
      url: canonicalUrl,
      image: ogImage,
      author: {
        "@type": "Organization",
        name: DEFAULTS.siteName,
        url: DEFAULTS.url,
      },
      publisher: {
        "@type": "Organization",
        name: DEFAULTS.siteName,
        logo: {
          "@type": "ImageObject",
          url: `${DEFAULTS.url}/icons/icon-192.png`,
        },
      },
      ...(article.datePublished && { datePublished: article.datePublished }),
      ...(article.dateModified && { dateModified: article.dateModified }),
      ...(article.readTime && { timeRequired: article.readTime }),
    };
  } else if (course) {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Course",
      name: title || DEFAULTS.siteName,
      description: desc,
      url: canonicalUrl,
      provider: {
        "@type": "Organization",
        name: DEFAULTS.siteName,
        sameAs: DEFAULTS.url,
      },
      ...(course.educationalLevel && { educationalLevel: course.educationalLevel }),
      ...(course.audience && {
        audience: {
          "@type": "EducationalAudience",
          educationalRole: "student",
          audienceType: course.audience,
        },
      }),
    };
  } else if (game) {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Game",
      name: title || DEFAULTS.siteName,
      description: desc,
      url: canonicalUrl,
      image: ogImage,
      genre: game.genre || "Educational",
      ...(game.audience && {
        audience: {
          "@type": "PeopleAudience",
          suggestedMinAge: game.minAge,
          suggestedMaxAge: game.maxAge,
        },
      }),
      publisher: {
        "@type": "Organization",
        name: DEFAULTS.siteName,
      },
    };
  }

  const ogType = article ? "article" : "website";

  // FAQPage schema — boosts Google "People also ask" rich results.
  const faqSchema = (faq && faq.length > 0) ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  } : null;

  // BreadcrumbList schema — shows trail in Google results.
  const breadcrumbSchema = (breadcrumbs && breadcrumbs.length > 0) ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: b.url.startsWith("http") ? b.url : `${DEFAULTS.url}${b.url}`,
    })),
  } : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* hreflang alternates for bilingual EL/EN site */}
      {alternateUrls(derivedPath).map((alt) => (
        <link key={alt.lang} rel="alternate" hrefLang={alt.lang} href={alt.url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content={DEFAULTS.imageWidth} />
      <meta property="og:image:height" content={DEFAULTS.imageHeight} />
      <meta property="og:site_name" content={DEFAULTS.siteName} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      <script type="application/ld+json">{JSON.stringify(ORG_SCHEMA)}</script>
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      {breadcrumbSchema && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}
    </Helmet>
  );
}
