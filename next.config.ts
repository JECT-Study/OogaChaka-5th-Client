import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) config.resolve.alias['msw/browser'] = false;
    return config;
  },
  output: 'export',
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  assetPrefix: process.env.NODE_ENV === 'production' && !process.env.VERCEL ? './' : undefined,
  trailingSlash: true,
  devIndicators: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
