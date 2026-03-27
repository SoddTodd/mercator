import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverBodySizeLimitBytes: 54525952, // 52 MB (coverage for 50 MB file + form overhead)
  },
};

export default nextConfig;
