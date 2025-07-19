/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['ui-avatars.com', 'images.unsplash.com'],
  },
};

module.exports = nextConfig;
