// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ai-agent-photo-sky.vercel.app'),
  title: {
    default: 'PhotoSky - 사진작가를 위한 정밀 기상 및 채광 정보',
    template: '%s | PhotoSky',
  },
  description:
    'Nikon Zf 사용자와 사진작가를 위한 실시간 날씨 및 채광 가이드. 빛의 5가지 방향, 측광 모드, 렌즈 최적화 세팅 정보를 제공합니다.',
  keywords: [
    '사진 날씨',
    'Nikon Zf',
    '24-70mm f/4 S',
    '매직아워',
    '골든아워',
    '빛의 방향',
    '스팟 측광',
    '안개 지수',
    '사진 출사 날씨',
    '출사 가이드',
  ],
  authors: [{ name: 'aihoshistar' }],
  creator: 'PhotoSky Team',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://ai-agent-photo-sky.vercel.app/',
    title: 'PhotoSky - 사진작가를 위한 정밀 기상 및 채광 정보',
    description:
      '오늘의 빛은 어떤가요? Nikon Zf와 함께하는 최고의 출사를 위한 실시간 기상 분석 도구입니다.',
    siteName: 'PhotoSky',
    images: [
      {
        url: '/favicon.ico', // 생성한 로고 경로
        width: 1200,
        height: 630,
        alt: 'PhotoSky 로고',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PhotoSky - 사진작가를 위한 정밀 기상 및 채광 정보',
    description: '사진작가를 위한 정밀 기상 및 채광 정보 대시보드',
    images: ['/favicon.ico'],
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PhotoSky',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png', // iOS용 로고 지정
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
