import type { NextConfig } from 'next';
import { join } from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@swiftship/core', '@swiftship/components', '@swiftship/codegen', '@swiftship/ai'],
  typedRoutes: true,
  // Required for Vercel monorepo deployments - use process.cwd() to get actual runtime path
  outputFileTracingRoot: process.env.VERCEL ? '/vercel/path0' : join(__dirname, '../../'),
  // Ensure experimental features are properly set
  experimental: {
    outputFileTracingIncludes: {
      '/*': ['./node_modules/**/*'],
    },
  },
};

export default nextConfig;
