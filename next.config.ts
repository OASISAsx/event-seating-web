import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: process.env.NODE_ENV === "development",
    domains: ["img.daisyui.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1", // บางครั้ง Next.js แปลง localhost เป็น IP นี้
        port: "8080",
        pathname: "/uploads/**",
      },
      // สำหรับ Production ของคุณ
      {
        protocol: "https",
        hostname: "api.event-seat.elitefund.fun",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
