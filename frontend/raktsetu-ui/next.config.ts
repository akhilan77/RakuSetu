import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Next.js from bundling build-time internals (e.g. @vercel/nft)
  // into the server bundle at runtime.
  serverExternalPackages: ["@vercel/nft"],

  // Declare turbopack config to silence the "webpack config without turbopack
  // config" error — Next.js 16 uses Turbopack by default.
  turbopack: {},
};

export default nextConfig;
