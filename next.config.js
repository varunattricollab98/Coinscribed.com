/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Cover art for the sample/fallback articles are our own trusted, bundled
    // SVGs in /public/covers (loaded locally, instantly). When real content is
    // published in Sanity, featured images and author avatars are served from
    // Sanity's image CDN, so allow that host too.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
      {
        // Editorial photography for the sample/fallback articles.
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        // Coin logos shown in the live market hero cards.
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
