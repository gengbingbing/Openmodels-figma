import { useEffect } from "react";

const SITE = "https://openmodels.market";
const DEFAULT_OG_IMAGE = `${SITE}/og-default.png`;

export interface SEOProps {
  title:       string;
  description: string;
  path?:       string;  /* e.g. "/models" */
  ogImage?:    string;
}

/** Drop-in SEO component — call once per page, returns null */
export function SEO({ title, description, path, ogImage }: SEOProps) {
  const canonical = path ? `${SITE}${path}` : SITE;
  const image     = ogImage ?? DEFAULT_OG_IMAGE;

  useEffect(() => {
    /* Title */
    document.title = title;

    /* Helper: create-or-update a <meta> element */
    const meta = (attr: string, key: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    /* Standard */
    meta("name",     "description",    description);

    /* Open Graph */
    meta("property", "og:title",       title);
    meta("property", "og:description", description);
    meta("property", "og:url",         canonical);
    meta("property", "og:image",       image);
    meta("property", "og:type",        "website");
    meta("property", "og:site_name",   "OpenModels");

    /* Twitter */
    meta("name", "twitter:card",        "summary_large_image");
    meta("name", "twitter:title",       title);
    meta("name", "twitter:description", description);
    meta("name", "twitter:image",       image);

    /* Canonical */
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
  }, [title, description, canonical, image]);

  return null;
}

/** Inject JSON-LD structured data, removes previous on unmount */
export function JsonLd({ id, data }: { id: string; data: object }) {
  useEffect(() => {
    const existing = document.getElementById(`ld-${id}`);
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id   = `ld-${id}`;
    script.text  = JSON.stringify(data);
    document.head.appendChild(script);
    return () => { document.getElementById(`ld-${id}`)?.remove(); };
  }, [id, data]);
  return null;
}

/* ── Common structured-data builders ──────────────────────── */

export const ORG_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name:  "OpenModels",
  url:   SITE,
  logo:  `${SITE}/logo.png`,
  sameAs: [],
  description: "OpenModels is the open marketplace for LLM tokens.",
};

export const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name:  "OpenModels",
  url:   SITE,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE}/models?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export const APP_LD = {
  "@context":    "https://schema.org",
  "@type":       "SoftwareApplication",
  name:          "OpenModels",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  url:  SITE,
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    price: "0",
    description: "Free to use with pay-per-token credits",
  },
};

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type":    "ListItem",
      position:   i + 1,
      name:       item.name,
      item:       item.url,
    })),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
