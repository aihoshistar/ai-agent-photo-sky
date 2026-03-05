import { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
// import './globals.css'; (글로벌 CSS 임포트 확인 필요)

// 1. Metadata API 사용
export const metadata: Metadata = {
  title: 'PhotoSky',
  description: "Photographer's weather service",
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      {/* flex 및 정렬 클래스 제거 */}
      <body className="bg-gray-900 text-white antialiased">
        {children}
      </body>
    </html>
  );
}