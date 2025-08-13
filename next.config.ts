import createMDX from "@next/mdx";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
