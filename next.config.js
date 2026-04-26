const isProduction = process.env.NODE_ENV === "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://partner.googleadservices.com https://www.youtube.com https://www.youtube-nocookie.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://image.tmdb.org https://i.ytimg.com https://www.themoviedb.org https://www.google-analytics.com https://pagead2.googlesyndication.com https://images.unsplash.com",
  "font-src 'self' data:",
  "connect-src 'self' https://api.themoviedb.org https://www.google-analytics.com https://region1.google-analytics.com https://pagead2.googlesyndication.com",
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://googleads.g.doubleclick.net",
  "media-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
  isProduction ? "upgrade-insecure-requests" : "",
]
  .filter(Boolean)
  .join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "www.themoviedb.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  async redirects() {
    return [
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms", destination: "/terms-and-conditions", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
      },
      {
        source: "/api/media/(.*)",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=1800, stale-while-revalidate=86400" }],
      },
      {
        source: "/api/trending",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=600, stale-while-revalidate=3600" }],
      },
      {
        source: "/api/search/autocomplete",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=900" }],
      },
      {
        source: "/blog/:slug*",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

module.exports = nextConfig;
