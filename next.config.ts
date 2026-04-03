import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: `https://${process.env.BLOB_READ_WRITE_TOKEN}.public.blob.vercel-storage.com/:path*`,
      },
    ];
  },
};

export default nextConfig;
