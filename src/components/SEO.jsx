import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const DEFAULTS = {
  siteName: "GeoLo Platform",
  description: "Train your brain with logic! 350+ educational games for kids 2-12 & adults. Learn. Think. Solve.",
  url: "https://geoloplatform.com",
  image: "https://geoloplatform.com/og-image.png",
  imageWidth: "1200",
  imageHeight: "630",
};

export default function SEO({ title, description, image, path }) {
  const location = useLocation();
  const fullTitle = title ? `${title} | ${DEFAULTS.siteName}` : DEFAULTS.siteName;
  const desc = description || DEFAULTS.description;
  const ogImage = image || DEFAULTS.image;
  const derivedPath = path || location.pathname;
  const canonicalUrl = `${DEFAULTS.url}${derivedPath === "/" ? "" : derivedPath}`;

  const isHome = derivedPath === "/" || derivedPath === "";
  const jsonLd = isHome ? {
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
  } : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
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
