import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  assetPrefix: process.env.NODE_ENV === 'production' ? './' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
