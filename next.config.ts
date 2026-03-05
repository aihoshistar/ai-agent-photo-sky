import type { NextConfig } from 'next';
import withPWA from '@ducanh2912/next-pwa';

const withPWAInit = withPWA({
  dest: 'public',
  // 개발 환경에서는 PWA 동작을 비활성화하여 캐싱 문제를 방지
  disable: process.env.NODE_ENV === 'development', 
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next.js 16부터는 experimental 바깥(최상단)에 turbopack 설정을 명시하여
  // Webpack 플러그인과 혼용될 때 발생하는 에러를 무시하도록 처리합니다.
  turbopack: {},
};

export default withPWAInit(nextConfig);  