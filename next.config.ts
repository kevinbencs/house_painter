import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: `https://BLOB_ID.public.blob.vercel-storage.com/:path*`,
      },
    ];
  },
   experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
  cacheComponents: true,
   images: {
    remotePatterns: [new URL('https://lh3.googleusercontent.com/**')],
  },
};

export default nextConfig;
