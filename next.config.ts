import type { NextConfig } from "next";

const path = require("path");

const nextConfig: NextConfig = {
  experimental: {
    // authInterrupts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
      },
      {
        protocol: "https",
        hostname: "product-detail-www-opennext.snc-prod.aws.cinch.co.uk",
      },
    ],
  },
};

export default nextConfig;
