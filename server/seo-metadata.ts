const BASE_URL = "https://treed.co";
const OG_IMAGE = `${BASE_URL}/social-share.png`;
const OG_IMAGE_ALT = "Tree\u2019d \u2013 AI-powered museum audio guide system";

function escAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  breadcrumbName?: string;
}

const PAGE_META: Record<string, PageMeta> = {
  "/": {
  title: "AI Audio Guide for Museums | Conversational | Tree’d",
  description: "AI museum audio guide that lets visitors explore freely, ask questions, and get answers in real time. Start with a 90-day pilot.",
    canonical: `${BASE_URL}/`,
    robots: "index,follow",
  },
  "/solution": {
    title: "How Tree’d Works | AI Audio Guide System for Museums",
    description: "Discover Tree\u2019d\u2019s AI audio guide ecosystem: conversational AI, multilingual tours, local networks, and a revenue model built for museums.",
    canonical: `${BASE_URL}/solution`,
    robots: "index,follow",
    breadcrumbName: "Solution",
  },
  "/handset": {
    title: "Museum Audio Guide Device | Conversational AI | Tree’d",
    description: "Meet the Tree\u2019d Handset: a screen-free, conversational AI audio guide designed for museums. Tap, listen, and ask questions in real time.",
    canonical: `${BASE_URL}/handset`,
    robots: "index,follow",
    breadcrumbName: "The Handset",
  },
  "/tree": {
    title: "On-Premise AI for Museum Audio Guides | The Tree | Tree’d",
    description: "The Tree is Tree\u2019d\u2019s on-premise AI backbone for museums. It charges, syncs, and distributes content locally, secure, fast, and fully autonomous.",
    canonical: `${BASE_URL}/tree`,
    robots: "index,follow",
    breadcrumbName: "The Tree",
  },
  "/dashboard": {
    title: "Museum Analytics Dashboard | Visitor Insights | Tree’d",
    description: "Monitor visitor engagement in real time with Tree\u2019d\u2019s museum dashboard: language mix, popular artifacts, and privacy-first insights designed for museums.",
    canonical: `${BASE_URL}/dashboard`,
    robots: "index,follow",
    breadcrumbName: "Dashboard",
  },
  "/visitor-experience": {
    title: "AI Museum Audio Guide System | Visitor Experience | Tree’d",
    description: "Tree\u2019d transforms the museum visitor experience with self-paced, conversational AI audio guides. Visitors explore freely, ask questions, and learn deeply.",
    canonical: `${BASE_URL}/visitor-experience`,
    robots: "index,follow",
    breadcrumbName: "Visitor Experience",
  },
  "/sustainability": {
    title: "Sustainable Museum Tech | On-Premise AI Guides | Tree’d",
    description: "Tree\u2019d designs sustainable museum technology with biodegradable materials, local processing, and circular hardware built to reduce waste and energy use.",
    canonical: `${BASE_URL}/sustainability`,
    robots: "index,follow",
    breadcrumbName: "Sustainability",
  },
  "/about": {
    title: "About Tree’d | AI Audio Guides for Museums",
    description: "Learn about Tree\u2019d, a CultureTech company reimagining museum experiences through conversational AI, screen-free hardware, and human-centered design.",
    canonical: `${BASE_URL}/about`,
    robots: "index,follow",
    breadcrumbName: "About",
  },
  "/contact": {
    title: "Contact Tree’d | Talk to Our Museum Technology Team",
    description: "Get in touch with Tree\u2019d to discuss museum audio guides, visitor experience, or technical questions. Our team is ready to help.",
    canonical: `${BASE_URL}/contact`,
    robots: "index,follow",
    breadcrumbName: "Contact",
  },
  "/revenue-sharing": {
    title: "Museum Revenue Share Model | Revenue Estimation | Tree’d",
    description: "Forecast new museum revenue with Tree\u2019d\u2019s revenue-sharing model. Dynamic museum share based on visitor volume, deployment scope, and adoption.",
    canonical: `${BASE_URL}/revenue-sharing`,
    robots: "index,follow",
    breadcrumbName: "Revenue Sharing",
  },
  "/booking": {
    title: "Book a Museum Audio Guide Demo | Start a Pilot with Tree’d",
    description: "Book a 30-minute demo to see Tree\u2019d\u2019s conversational, screen-free museum audio guides in action. In-person demos in NL, BE, PT, and EG, or online worldwide.",
    canonical: `${BASE_URL}/booking`,
    robots: "index,follow",
    breadcrumbName: "Book a Demo",
  },
  "/careers": {
    title: "Careers at Tree’d | Build AI Audio Guides for Museums",
    description: "Join Tree\u2019d to build conversational, screen-free museum audio guides. We\u2019re looking for craft-obsessed builders for a small, high-impact CultureTech team.",
    canonical: `${BASE_URL}/careers`,
    robots: "index,follow",
    breadcrumbName: "Careers",
  },
  "/faq": {
    title: "Museum Audio Guide FAQ | Pricing & Installation | Tree’d",
    description: "Answers to common questions about Tree\u2019d\u2019s ecosystem, deployment, privacy, and revenue-sharing model for museums.",
    canonical: `${BASE_URL}/faq`,
    robots: "index,follow",
    breadcrumbName: "FAQ",
  },
};

const DEFAULT_META: PageMeta = {
  title: "Tree\u2019d | AI-Powered Museum Audio Guides",
  description: "Tree\u2019d is an AI-powered museum audio guide system that delivers multilingual, screen-free, conversational experiences for museums.",
  canonical: BASE_URL + "/",
  robots: "noindex,follow",
};

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tree\u2019d",
  url: BASE_URL,
  logo: `${BASE_URL}/apple-touch-icon.png`,
  email: "info@treed.co",
  sameAs: [
    "https://www.instagram.com/treed.guide/",
    "https://www.linkedin.com/company/treedhistoryguide",
    "https://x.com/treedguide",
    "https://www.facebook.com/treedguide",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@treed.co",
    contactType: "customer service",
    availableLanguage: ["English", "Dutch", "French"],
  },
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Tree\u2019d",
  url: BASE_URL,
  inLanguage: ["en", "nl", "fr"],
};

const FAQ_ITEMS = [
  { q: "What is an AI museum audio guide?", a: "An AI museum audio guide is a conversational system that lets visitors explore exhibitions at their own pace, listen to curated stories, and ask follow-up questions in real time. Instead of playing fixed recordings, it responds dynamically based on visitor curiosity—making the experience more personal, interactive, and engaging." },
  { q: "How does Tree\u2019d work for visitors?", a: "Visitors simply pick up a Handset, select their language by tapping a panel, and start exploring. When they see an exhibit with a Tree\u2019d sensor, they tap it to hear the story. They can then ask the Handset any follow-up questions naturally." },
  { q: "Which languages are supported?", a: "Tree\u2019d currently supports 12+ major languages with native-level AI fluency, including English, Dutch, French, German, Spanish, Italian, and more. We are constantly adding new languages." },
  { q: "Do visitors need to download an app?", a: "No. Tree\u2019d is a physical, screen-free system. There are no apps to download, no accounts to create, and no personal devices required." },
  { q: "Is the system accessible for all ages?", a: "Yes. The interface is intentionally simple\u2014just tap and talk. It\u2019s intuitive for children, seniors, and everyone in between." },
  { q: "How long does a handset battery last?", a: "Up to 6 hours of active use, with fast-charging that brings the device back to 50% in about an hour, allowing a handset to comfortably cover a full museum day." },
  { q: "How many handsets can a single Tree support?", a: "This depends on your configuration. Trees are modular and sized to your required handset count." },
  { q: "Does Tree\u2019d require a special team to operate?", a: "No. Tree\u2019d was designed so museums can run the system without additional technical staff." },
  { q: "Can Tree\u2019d work in high-traffic museums?", a: "Yes. Charging capacity, syncing behavior, and local processing are engineered for continuous, large-volume use." },
  { q: "Does Tree\u2019d require a stable internet connection?", a: "Only for initial setup and periodic cloud updates. Day-to-day usage runs entirely on your local network, so outages don\u2019t affect visitor experience." },
  { q: "Where does the AI model run?", a: "Locally. The Tree hosts your museum\u2019s knowledge set, language models, and updates — nothing depends on external servers during use." },
  { q: "Can we control what the AI says?", a: "Yes. All AI knowledge is museum-approved and curated. The model stays within your defined content boundaries and NEVER looks up information from the internet or external sources." },
  { q: "Can Tree\u2019d answer questions specific to our collection?", a: "Yes. We build a custom knowledge base for each museum, covering your artworks, themes, and context." },
  { q: "How accurate are the AI answers?", a: "100% accurate. Answers follow museum-approved content, ensuring they stay factual, appropriate, and aligned with your curatorial standards. This leaves 0% chance of AI hallucinations." },
    { q: "What does installation look like?", a: "The Tree connects to power and your local network. Handsets are then paired to the network and require no further setup. Most museums are fully operational within hours." },
    { q: "Can the aesthetic of the Hub (The Tree) be customized for our building or exhibition?", a: "Yes. The Tree’s physical design, materials, and finish can be tailored to your museum or created in collaboration with a local artist." },
    { q: "Do you offer pilots?", a: "Yes. We offer pilot programs depending on the region and availability." },
    { q: "Do you offer revenue-sharing or subscription models?", a: "Yes. Tree\u2019d offers flexible commercial models, including revenue sharing and straightforward subscriptions." },
    { q: "Is Tree\u2019d compliant with privacy regulations?", a: "Yes. Privacy-by-design is at the heart of our architecture. We never collect personal data from visitors, don’t store voice recordings, and process all analytics anonymously on-site." },
  ];

function buildJsonLdScripts(urlPath: string, meta: PageMeta): string {
  const schemas: object[] = [];

  schemas.push(ORGANIZATION_SCHEMA);
  schemas.push(WEBSITE_SCHEMA);

  const webPageSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: meta.title,
    description: meta.description,
    url: meta.canonical,
    inLanguage: "en",
  };
  schemas.push(webPageSchema);

  if (urlPath !== "/" && meta.breadcrumbName) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL + "/" },
        { "@type": "ListItem", position: 2, name: meta.breadcrumbName, item: meta.canonical },
      ],
    });
  }

  if (urlPath === "/solution") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Tree\u2019d AI Museum Audio Guide System",
      description: meta.description,
      provider: { "@type": "Organization", name: "Tree\u2019d", url: BASE_URL },
      url: meta.canonical,
      serviceType: "Museum Audio Guide Technology",
      areaServed: "Worldwide",
    });
  }

  if (urlPath === "/revenue-sharing") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Tree\u2019d Museum Revenue Sharing Model",
      description: meta.description,
      provider: { "@type": "Organization", name: "Tree\u2019d", url: BASE_URL },
      url: meta.canonical,
      serviceType: "Museum Partnership & Revenue Sharing",
    });
  }

  if (urlPath === "/about") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: meta.title,
      description: meta.description,
      url: meta.canonical,
      about: { "@type": "Organization", name: "Tree\u2019d", url: BASE_URL },
    });
  }

  if (urlPath === "/contact") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: meta.title,
      description: meta.description,
      url: meta.canonical,
    });
  }

  if (urlPath === "/faq") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return schemas
    .map((s) => `  <script type="application/ld+json" data-seo="true">\n${JSON.stringify(s, null, 2)}\n  </script>`)
    .join("\n");
}

export function injectSEOMetadata(html: string, urlPath: string): string {
  const path = urlPath.split("?")[0].replace(/\/$/, "") || "/";
  const meta = PAGE_META[path] ?? DEFAULT_META;

  const title = escAttr(meta.title);
  const description = escAttr(meta.description);
  const canonical = escAttr(meta.canonical);
  
  html = html.replace(
    /<meta\s+name="twitter:site"\s+content="[^"]*"\s*\/>/i,
    `<meta name="twitter:site" content="@treedguide" />`,
  );
  
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);

  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/i,
    `<meta name="description" content="${description}" />`,
  );

  html = html.replace(
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/>/i,
    `<meta name="robots" content="${meta.robots}" />`,
  );

  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/i,
    `<meta property="og:title" content="${title}" />`,
  );

  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/i,
    `<meta property="og:description" content="${description}" />`,
  );

  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/i,
    `<meta property="og:url" content="${canonical}" />`,
  );

  html = html.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/i,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
  );

  html = html.replace(
    /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/>/i,
    `<meta property="og:image:alt" content="${escAttr(OG_IMAGE_ALT)}" />`,
  );

  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/i,
    `<meta name="twitter:title" content="${title}" />`,
  );

  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/i,
    `<meta name="twitter:description" content="${description}" />`,
  );

  html = html.replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/i,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
  );

  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/i,
    `<link rel="canonical" href="${canonical}" />`,
  );

  const jsonLd = buildJsonLdScripts(path, meta);
  html = html.replace("</head>", `${jsonLd}\n  </head>`);

  return html;
}
