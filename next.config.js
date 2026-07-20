// Node 25+ ships a stubbed `globalThis.localStorage = {}` without a usable
// `getItem`/`setItem`. Libraries that probe `typeof globalThis.localStorage`
// then crash in SSR (Supabase auth-js, Next dev overlay, etc.). Strip it here
// — next.config.js loads before any server module.
if (typeof globalThis !== "undefined") {
  const ls = globalThis.localStorage;
  if (ls && typeof ls === "object" && typeof ls.getItem !== "function") {
    delete globalThis.localStorage;
  }
}

const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Shop API proxy target. Mirrors apps/shop-web/next.config.js so that
// /api/v1/* requests forwarded from the site reach the same backend.
const apiProxyTarget = process.env.API_PROXY_TARGET || "http://localhost:8000";
if (process.env.VERCEL && !process.env.API_PROXY_TARGET) {
  console.warn(
    "[next.config] API_PROXY_TARGET is not set — /api/v1 proxy will fall back to http://localhost:8000 and shop requests will 404 in production."
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  // Disable Next's automatic 308 trailing-slash redirects. We keep
  // trailingSlash:true for link generation, but canonical slash enforcement
  // is done in middleware (page paths only) so /api/v1 POSTs are never
  // redirect-mangled. See middleware.ts.
  skipTrailingSlashRedirect: true,
  // Transpile the shared design package (ships raw TSX/ESM components).
  transpilePackages: ["@24clima/design"],
  // Enable gzip/brotli compression on HTML, JS, CSS, fonts.
  // Vercel does this at the edge already, but explicit is safer if
  // self-hosting or running behind a different proxy.
  compress: true,
  // Drop "X-Powered-By: Next.js" — saves a few bytes per response and
  // reduces fingerprint surface for automated scanners.
  poweredByHeader: false,
  // Don't generate source maps for production browser bundles —
  // they leak source code and roughly double JS payload.
  productionBrowserSourceMaps: false,
  // Hard-fail on type errors during build (catches regressions early).
  typescript: { ignoreBuildErrors: false },
  // Vercel: use next/image optimization (do not set unoptimized: true)
  images: {
    // Try AVIF first (~30-50% smaller than WebP), fallback to WebP if browser
    // doesn't support AVIF. next/image handles content-negotiation automatically
    // based on the Accept header sent by the client.
    formats: ["image/avif", "image/webp"],
    // Cache optimized images on the CDN for 60 days (was default 60s).
    // Source images rarely change; cache miss = re-encode on Vercel which is slow.
    minimumCacheTTL: 60 * 60 * 24 * 60,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      // Broadened from /storage/v1/object/public/** to /storage/** so shop
      // product images (which live under /storage/) resolve. Union with shop.
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/**" },
      // Shop product images hosted on S3.
      { protocol: "https", hostname: "**.amazonaws.com", pathname: "/**" },
    ],
  },
  // Proxy shop API requests to the FastAPI backend. Mirrors apps/shop-web.
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${apiProxyTarget}/v1/:path*` },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    const scriptSrc = isDev
      ? "'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://mc.yandex.ru https://ymdwvb5k3r.ru https://ym7agrabf4.ru"
      : "'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://mc.yandex.ru https://ymdwvb5k3r.ru https://ym7agrabf4.ru";

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              `script-src ${scriptSrc}`,
              "img-src 'self' data: https: blob:",
              "style-src 'self' 'unsafe-inline'",
              "frame-src 'self'",
              "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://analytics.google.com https://stats.g.doubleclick.net https://*.supabase.co https://translation.googleapis.com https://mc.yandex.ru wss://mc.yandex.ru https://ymdwvb5k3r.ru https://ym7agrabf4.ru https://www.facebook.com https://connect.facebook.net",
              "font-src 'self' data: https://fonts.gstatic.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
