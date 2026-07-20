import type { MetadataRoute } from "next";

/**
 * Dynamic robots.txt (replaces the former static public/robots.txt).
 *
 * Política: indexación ABIERTA para motores de búsqueda tradicionales y para
 * crawlers de IA generativa (ChatGPT, Claude, Perplexity, Gemini, etc.).
 *
 * A dynamic route (not a static file) is required so we can express per-path
 * rules for the future shop section under /tienda — cart/checkout/account and
 * the API proxy must never be indexed. Because each named crawler uses only its
 * own most-specific group, the shop Disallow list is applied to EVERY group,
 * not just `*`; otherwise Googlebot/GPTBot etc. would ignore it.
 */

// Traditional search engines + generative-AI crawlers we explicitly allow.
// Order preserved from the original static robots.txt.
const ALLOWED_AGENTS = [
  // Motores de búsqueda tradicionales
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "DuckDuckBot",
  "YandexBot",
  "Applebot",
  // AI crawlers — entrenamiento de modelos
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "FacebookBot",
  "Amazonbot",
  "DuckAssistBot",
  "CCBot",
  "Bytespider",
  "cohere-ai",
  "YouBot",
  "Diffbot",
];

// Future shop paths that must never be indexed (conversion/private + API).
// Both the root and locale-prefixed (/*/tienda/...) variants are covered.
const SHOP_DISALLOW = [
  "/tienda/cart",
  "/tienda/checkout",
  "/tienda/account",
  "/*/tienda/cart",
  "/*/tienda/checkout",
  "/*/tienda/account",
  "/api/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...ALLOWED_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: SHOP_DISALLOW,
      })),
      // Regla por defecto — permitir todo salvo las rutas de tienda/API.
      {
        userAgent: "*",
        allow: "/",
        disallow: SHOP_DISALLOW,
      },
    ],
    sitemap: "https://24clima.com/sitemap.xml",
  };
}
