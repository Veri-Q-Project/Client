import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { NextConfig } from 'next';

import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
  outputFileTracingRoot: dirname,
  reactStrictMode: true,
};

export default withVanillaExtract(nextConfig);
