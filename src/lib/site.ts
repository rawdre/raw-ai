// Single source for the public address and business facts used by search engines
// (canonical links, sitemap, robots, structured data). Change SITE_URL when a custom domain arrives.
export const SITE_URL = "https://raw-ai.vercel.app";

export const BUSINESS = {
  name: "Raw AI Business Solution",
  shortName: "Raw AI",
  founder: "André Raw",
  phone: "+55 61 99822-9223",
  city: "Brasília",
  region: "DF",
  country: "BR",
  instagram: "https://www.instagram.com/rawaibrz/",
} as const;

/** Routes that are private or internal and must stay out of search results. */
export const PRIVATE_PATHS = ["/personal", "/acesso", "/api/", "/painel", "/seja-arena"] as const;
