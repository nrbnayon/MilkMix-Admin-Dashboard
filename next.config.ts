// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["recharts"],
  images: {
    unoptimized: true,
    domains: ["cdn.lordicon.com"],
  },
  experimental: {
    
    optimizePackageImports: ["lordicon"],
  },

  // ✅ Pass env vars to Edge Middleware
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_ASSETS_BASE_URL: process.env.NEXT_PUBLIC_ASSETS_BASE_URL,
  },
};

export default nextConfig;
