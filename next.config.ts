import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fkhpcokerbylyakxisru.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'api.biharithread.shop',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};


export default nextConfig;
