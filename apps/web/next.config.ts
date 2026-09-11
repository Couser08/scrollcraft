import type { NextConfig } from 'next';

// Fix Windows drive-letter casing discrepancy (c:\ vs C:\) which breaks Webpack module graphs
if (process.platform === 'win32') {
  const cwd = process.cwd();
  if (cwd.charAt(1) === ':') {
    const uppercaseCwd = cwd.charAt(0).toUpperCase() + cwd.slice(1);
    if (cwd !== uppercaseCwd) {
      try {
        process.chdir(uppercaseCwd);
      } catch {
        // fallback
      }
    }
  }
}

const nextConfig: NextConfig = {
  transpilePackages: ['@scrollcraft/core', '@scrollcraft/react'],
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/design-system',
        destination: '/docs',
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    if (process.platform === 'win32' && config.context && config.context.charAt(1) === ':') {
      config.context = config.context.charAt(0).toUpperCase() + config.context.slice(1);
    }
    return config;
  },
};

export default nextConfig;
