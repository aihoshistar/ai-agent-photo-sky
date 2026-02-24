// filepath: app/layout.tsx
import { Children, ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/pwa/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <script src="/pwa/registerServiceWorker.ts" />
      </head>
      <body className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
        {children}
      </body>
    </html>
  );
}