const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  // Vercel: use next/image optimization (do not set unoptimized: true)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  async headers() {
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
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://mc.yandex.ru",
              "img-src 'self' data: https: blob:",
              "style-src 'self' 'unsafe-inline'",
              "frame-src 'self'",
              "connect-src 'self' https://www.google-analytics.com https://*.supabase.co https://translation.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
