import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const DEFAULTS = {
  siteName: "Kibloo",
  description: "Kibloo is a playful learning world for kids 2–12 and curious adults. 350+ educational games. Where curiosity blooms.",
  url: "https://kibloo.app",
  image: "https://kibloo.app/og-image.png",
  imageWidth: "1200",
  imageHeight: "630",
};

export default function SEO({ title, description, image, path, article }) {
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
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
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
  }

  const ogType = article ? "article" : "website";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonicalUrl} />

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

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
