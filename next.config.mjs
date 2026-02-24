// filepath: next.config.mjs
import { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
};

export default config;