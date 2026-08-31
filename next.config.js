/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Cover art and article thumbnails are our own trusted, bundled SVGs in
    // /public/covers. They load instantly (no external requests, no redirects)
    // which is what fixes the slow page loads. Allow next/image to serve them.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

module.exports = nextConfig
