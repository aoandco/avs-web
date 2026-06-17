import type { NextConfig } from "next";

const defaultApiUrl = "https://api.aoandco.tech";

const publicApiUrl = (
  process.env.NEXT_PUBLIC_API_URL || defaultApiUrl
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Ensure API URL is available at build time (NEXT_PUBLIC_* is inlined when `next build` runs).
  // Fallback so the app works even if the host doesn't set this during build (e.g. Cloud Run runtime-only env).
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || defaultApiUrl,
  },
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${publicApiUrl}/:path*`,
      },
    ];
  },
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
