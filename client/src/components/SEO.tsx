import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";

interface SEOProps {
  page: string;
}

const BASE_URL = "https://treed.co";

const PAGE_TO_PATH: Record<string, string> = {
  home: "/",
  solution: "/solution",
  handset: "/handset",
  tree: "/tree",
  dashboard: "/dashboard",
  visitorExperience: "/visitor-experience",
  sustainability: "/sustainability",
  about: "/about",
  contact: "/contact",
  revenueSharing: "/revenue-sharing",
  requestPricing: "/request-pricing",
  booking: "/booking",
  careers: "/careers",
  faq: "/faq",
  blog: "/blog",
  useCases: "/use-cases",
  privacyPolicy: "/privacy-policy",
  cookiePolicy: "/cookie-policy",
  termsOfUse: "/terms-of-use",
  notFound: "",
};

const PAGE_BREADCRUMB_NAME: Record<string, string> = {
  solution: "Solution",
  handset: "The Handset",
  tree: "The Tree",
  dashboard: "Dashboard",
  visitorExperience: "Visitor Experience",
  sustainability: "Sustainability",
  about: "About",
  contact: "Contact",
  revenueSharing: "Revenue Sharing",
  requestPricing: "Request Pricing",
  booking: "Book a Demo",
  careers: "Careers",
  faq: "FAQ",
  blog: "Blog",
  useCases: "Use Cases",
  privacyPolicy: "Privacy Policy",
  cookiePolicy: "Cookie Policy",
  termsOfUse: "Terms of Use",
};

const LANG_TO_OG_LOCALE: Record<string, string> = {
  en: "en_US",
  nl: "nl_NL",
  fr: "fr_FR",
};

export function SEO({ page }: SEOProps) {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();
  const currentLang = i18n.language;

  useEffect(() => {
    const title = t(`seo.${page}.title`);
    const description = t(`seo.${page}.description`) || t("seo.default.description", "Tree'd is an AI-powered museum audio guide system.");
    const pathWithoutQuery = location.split("?")[0];
    const normalizedPath = pathWithoutQuery === "/" ? "" : pathWithoutQuery.replace(/\/$/, "");
    const canonicalUrl = `${BASE_URL}${normalizedPath === "" ? "/" : normalizedPath}`;
    const ogLocale = LANG_TO_OG_LOCALE[currentLang] ?? "en_US";
    const ogLocaleAlternates = Object.entries(LANG_TO_OG_LOCALE)
      .filter(([lang]) => lang !== currentLang)
      .map(([, locale]) => locale);

    document.title = title;
    document.documentElement.lang = currentLang;

    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      const elements = document.querySelectorAll(`meta[${attribute}="${name}"]`);
      if (elements.length > 1) {
        elements.forEach((el, i) => i > 0 && el.remove());
      }
      let element = elements[0];
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const removeMetaTags = (name: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      document.querySelectorAll(`meta[${attribute}="${name}"]`).forEach(el => el.remove());
    };

    const updateLinkTag = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]:not([hreflang])`;
      const elements = document.querySelectorAll(selector);
      if (elements.length > 1) {
        elements.forEach((el, i) => i > 0 && el.remove());
      }
      let element = elements[0];
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        if (hreflang) element.setAttribute("hreflang", hreflang);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    updateMetaTag("description", description);

    if (page === "notFound") {
      updateMetaTag("robots", "noindex,follow");
    } else {
      updateMetaTag("robots", "index,follow");
    }

    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:url", canonicalUrl, true);
    updateMetaTag("og:type", "website", true);
    updateMetaTag("og:image", `${BASE_URL}/social-share.png`, true);
    updateMetaTag("og:image:alt", "Tree'd – AI-powered museum audio guide system", true);
    updateMetaTag("og:locale", ogLocale, true);

    removeMetaTags("og:locale:alternate", true);
    ogLocaleAlternates.forEach(altLocale => {
      const el = document.createElement("meta");
      el.setAttribute("property", "og:locale:alternate");
      el.setAttribute("content", altLocale);
      document.head.appendChild(el);
    });

    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", `${BASE_URL}/social-share.png`);
    updateMetaTag("twitter:site", "@treedguide");

    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.setAttribute("href", canonicalUrl);
    } else {
      updateLinkTag("canonical", canonicalUrl);
    }

    const path = pathWithoutQuery === "/" ? "" : pathWithoutQuery;
    updateLinkTag("alternate", `${BASE_URL}${path}?lng=en`, "en");
    updateLinkTag("alternate", `${BASE_URL}${path}?lng=nl`, "nl");
    updateLinkTag("alternate", `${BASE_URL}${path}?lng=fr`, "fr");
    updateLinkTag("alternate", `${BASE_URL}${path}`, "x-default");

    return () => {};
  }, [page, t, currentLang, location]);

  return null;
}

export function StructuredData({ page }: SEOProps) {
  const { t, i18n } = useTranslation();
  const [location] = useLocation();
  const currentLang = i18n.language;

  useEffect(() => {
    const existingScripts = document.querySelectorAll('script[data-seo="true"]');
    existingScripts.forEach(s => s.remove());

    const pathWithoutQuery = location.split("?")[0];
    const canonicalPath = PAGE_TO_PATH[page] ?? pathWithoutQuery;
    const canonicalUrl = `${BASE_URL}${canonicalPath === "/" ? "/" : canonicalPath}`;

    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Tree'd",
      "url": BASE_URL,
      "logo": `${BASE_URL}/apple-touch-icon.png`,
      "email": "info@treed.co",
      "sameAs": [
        "https://www.instagram.com/treed.guide/",
        "https://www.linkedin.com/company/treedhistoryguide",
        "https://x.com/treedNL"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "info@treed.co",
        "contactType": "customer service",
        "availableLanguage": ["English", "Dutch", "French"]
      }
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Tree'd",
      "url": BASE_URL,
      "inLanguage": ["en", "nl", "fr"]
    };

    const webPageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": t(`seo.${page}.title`),
      "description": t(`seo.${page}.description`),
      "url": canonicalUrl,
      "inLanguage": currentLang
    };

    const addScript = (data: object) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "true");
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    };

    addScript(organizationSchema);
    addScript(websiteSchema);
    addScript(webPageSchema);

    if (page !== "home" && page !== "notFound" && PAGE_BREADCRUMB_NAME[page]) {
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": BASE_URL + "/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": PAGE_BREADCRUMB_NAME[page],
            "item": canonicalUrl
          }
        ]
      };
      addScript(breadcrumbSchema);
    }

    if (page === "solution") {
      const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Tree'd AI Museum Audio Guide System",
        "description": t("seo.solution.description"),
        "provider": {
          "@type": "Organization",
          "name": "Tree'd",
          "url": BASE_URL
        },
        "url": `${BASE_URL}/solution`,
        "serviceType": "Museum Audio Guide Technology",
        "areaServed": "Worldwide"
      };
      addScript(serviceSchema);
    }

    if (page === "revenueSharing") {
      const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Tree'd Museum Revenue Sharing Model",
        "description": t("seo.revenueSharing.description"),
        "provider": {
          "@type": "Organization",
          "name": "Tree'd",
          "url": BASE_URL
        },
        "url": `${BASE_URL}/revenue-sharing`,
        "serviceType": "Museum Partnership & Revenue Sharing"
      };
      addScript(serviceSchema);
    }

    if (page === "about") {
      const aboutPageSchema = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": t("seo.about.title"),
        "description": t("seo.about.description"),
        "url": `${BASE_URL}/about`,
        "about": {
          "@type": "Organization",
          "name": "Tree'd",
          "url": BASE_URL
        }
      };
      addScript(aboutPageSchema);
    }

    if (page === "contact") {
      const contactPageSchema = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": t("seo.contact.title"),
        "description": t("seo.contact.description"),
        "url": `${BASE_URL}/contact`
      };
      addScript(contactPageSchema);
    }

    if (page === "requestPricing") {
      const requestPricingSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Tree'd Museum Audio Guide — Pricing Request",
        "description": t("seo.requestPricing.description"),
        "provider": {
          "@type": "Organization",
          "name": "Tree'd",
          "url": BASE_URL
        },
        "url": `${BASE_URL}/request-pricing`,
        "serviceType": "AI Museum Audio Guide System",
        "areaServed": "Worldwide"
      };
      addScript(requestPricingSchema);
    }

    if (page === "faq") {
      const faqCategories = t("faq.categories", { returnObjects: true }) as { category: string; items: { q: string; a: string }[] }[];
      const faqItems: { "@type": string; name: string; acceptedAnswer: { "@type": string; text: string } }[] = [];

      faqCategories.forEach(category => {
        category.items.forEach(item => {
          faqItems.push({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.a
            }
          });
        });
      });

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems
      };
      addScript(faqSchema);
    }

    return () => {
      const scripts = document.querySelectorAll('script[data-seo="true"]');
      scripts.forEach(s => s.remove());
    };
  }, [page, t, currentLang, location]);

  return null;
}
