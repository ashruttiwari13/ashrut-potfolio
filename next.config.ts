import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '192.168.29.97:3000',
    '*.lhr.life',
    '*.loca.lt',
    '*.trycloudflare.com',
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
