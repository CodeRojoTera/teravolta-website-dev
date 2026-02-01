import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed "output: export" to allow dynamic admin routes
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;
