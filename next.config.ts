import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure API URL is available at build time (NEXT_PUBLIC_* is inlined when `next build` runs).
  // Fallback so the app works even if the host doesn't set this during build (e.g. Cloud Run runtime-only env).
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "https://api.aoandco.tech",
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
