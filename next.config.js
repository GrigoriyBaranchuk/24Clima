const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
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
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
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
