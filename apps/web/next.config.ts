import type { NextConfig } from 'next';
import { join } from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@swiftship/core', '@swiftship/components', '@swiftship/codegen', '@swiftship/ai'],
  typedRoutes: true,
  // Required for Vercel monorepo deployments
  outputFileTracingRoot: join(__dirname, '../../'),
};

export default nextConfig;
