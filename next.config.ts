import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "www.transparenttextures.com" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    return [
      {
        source: "/product/:slug",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" }],
      },
      {
        source: "/category/:category",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=3600, stale-while-revalidate=86400" }],
      },
      {
        source: "/",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=1800, stale-while-revalidate=7200" }],
      },
      {
        source: "/products",
        headers: [{ key: "Cache-Control", value: "public, s-maxage=1800, stale-while-revalidate=7200" }],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/wp-admin/:path*", destination: "/404", permanent: false },
      { source: "/wordpress/:path*", destination: "/404", permanent: false },
      { source: "/wp-login.php", destination: "/404", permanent: false },
    ];
  },
};

export default nextConfig;
