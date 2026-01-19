import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@swiftship/core', '@swiftship/components', '@swiftship/codegen'],
  typedRoutes: true,
};

export default nextConfig;
