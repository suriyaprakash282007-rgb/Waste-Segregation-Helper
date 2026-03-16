/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['s3.amazonaws.com'],
  },
  experimental: {
    // Required for MUI + Next.js App Router
    optimizePackageImports: ['@mui/icons-material', '@mui/material'],
  },
};

module.exports = nextConfig;
