// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // app 폴더 내의 모든 컴포넌트 검사
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar'), // 스크롤바 플러그인 활성화
  ],
};

export default config;
