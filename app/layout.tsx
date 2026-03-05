// app/layout.tsx
import { ReactNode } from 'react';
import './globals.css'; // ✨ 이 줄을 반드시 추가해 주세요!

export const metadata = {
  title: 'PhotoSky',
  description: "Photographer's weather service",
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#0f172a',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-[#0f172a] text-slate-200 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
