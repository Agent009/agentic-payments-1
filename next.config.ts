import type { NextConfig } from "next";
import { constants } from "@lib/constants";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // experimental: {
  //   swcPlugins: [["next-superjson-plugin", {}]],
  // },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: constants.integrations.pinata.gateway },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
