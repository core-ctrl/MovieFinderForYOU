<<<<<<< HEAD
/** next.config.js */
module.exports = {
  output: "standalone",   // Required for Docker
=======


/** next.config.js */
module.exports = {
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
  reactStrictMode: true,
  turbopack: {},
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "i.ytimg.com" },
<<<<<<< HEAD
      { protocol: "https", hostname: "www.themoviedb.org" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",        value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection",        value: "1; mode=block" },
        ],
      },
    ];
  },
=======
    ],
  },
>>>>>>> 3b3f76b6b2f75cfb78a3ee46561373052120bd14
};
