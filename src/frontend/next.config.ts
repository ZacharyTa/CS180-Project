import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["www.simplyrecipes.com", "img.spoonacular.com"],
  },
};

export default nextConfig;
