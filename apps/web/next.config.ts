import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@swiftship/core', '@swiftship/components', '@swiftship/codegen', '@swiftship/ai'],
  typedRoutes: true,
  // Required for Vercel monorepo deployments
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;
