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
    if (process.platform === 'win32') {
      const normalizeDrive = (str: string): string => {
        if (typeof str === 'string' && str.length >= 2 && str.charAt(1) === ':') {
          return str.charAt(0).toUpperCase() + str.slice(1);
        }
        return str;
      };

      if (config.context) {
        config.context = normalizeDrive(config.context);
      }

      if (config.resolve?.alias) {
        if (typeof config.resolve.alias === 'object' && !Array.isArray(config.resolve.alias)) {
          for (const key of Object.keys(config.resolve.alias)) {
            const val = config.resolve.alias[key];
            if (typeof val === 'string') {
              config.resolve.alias[key] = normalizeDrive(val);
            }
          }
        }
      }

      if (Array.isArray(config.resolve?.modules)) {
        config.resolve.modules = config.resolve.modules.map((m: any) =>
          typeof m === 'string' ? normalizeDrive(m) : m
        );
      }
    }
    return config;
  },
};

export default nextConfig;
