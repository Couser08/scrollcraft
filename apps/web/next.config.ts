import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@scrollcraft/core', '@scrollcraft/react'],
  reactStrictMode: true,
};

export default nextConfig;
