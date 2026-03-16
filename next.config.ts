import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "www.transparenttextures.com" },
    ],
  },
  // Allow large body sizes for image uploads
  api: {
    bodyParser: false,
  },
};

export default nextConfig;
