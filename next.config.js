/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable server-side rendering and API routes in development
  experimental: {
    serverActions: true,
  },
  // Environment variables configuration
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    // Add other environment variables here
  },
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
