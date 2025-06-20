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
    domains: [
      'localhost',
      'vercel.app',
      'ipuraner.com',
      'img.collegepravesh.com',
      'collegepravesh.com',
      'bpitindia.com',
      'www.msit.ac.in',
      'bpitindia.ac.in',
      'msit.in',
      'www.msit.in',
      'images.unsplash.com',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'via.placeholder.com'
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
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
