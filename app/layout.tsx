// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  // 배포 후 실제 도메인이 생기면 이 URL을 변경해 주세요
  metadataBase: new URL('https://ai-agent-photo-sky.vercel.app'),
  title: {
    default: 'Atmos | 사진작가를 위한 정밀 기상 및 채광 도구',
    template: '%s | Atmos',
  },
  description:
    '천체 정렬 계산기, 과초점 거리, 노을 버닝 지수, 동적 패킹 리스트 등 프로 사진작가를 위한 완벽한 출사 기상 분석 및 촬영 가이드를 제공합니다.',
  keywords: [
    '사진 날씨',
    'Atmos',
    '애트모스',
    '풍경 사진 날씨',
    '과초점 거리 계산기',
    '천체 정렬',
    '매직아워',
    '노을 예측',
    '은하수 날씨',
    '출사지 추천',
  ],
  authors: [{ name: 'PARK KYOUNGSEO', url: 'http://kkyungvelyy.com/' }],
  creator: 'PARK KYOUNGSEO',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://ai-agent-photo-sky.vercel.app/',
    title: 'Atmos | 사진작가를 위한 정밀 기상 및 채광 도구',
    description:
      '오늘의 빛과 대기는 어떤가요? 완벽한 셔터 찬스를 위한 실시간 기상 분석 및 촬영 설계 대시보드입니다.',
    siteName: 'Atmos',
    images: [
      {
        url: '/favicon.ico', // 추후 Atmos 로고 이미지로 교체하시면 더 좋습니다
        width: 1200,
        height: 630,
        alt: 'Atmos 로고',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atmos | 사진작가를 위한 정밀 기상 및 채광 도구',
    description: '프로 사진작가를 위한 정밀 기상 및 채광 정보 대시보드',
    images: ['/favicon.ico'],
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Atmos',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
