import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import BossTimerNotifier from "./components/BossTimerNotifier";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "사계 레기온 - AION2 지켈",
  description: "아이온2 지켈 서버 사계 레기온 관리 사이트",
  metadataBase: new URL('https://sagye.kr'),
  manifest: '/manifest.json',
  themeColor: '#f59e0b',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '사계 레기온',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: '사계 레기온',
    description: '아이온2 지켈 서버 사계 레기온',
    siteName: '사계 레기온',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '사계 레기온 - AION2 지켈',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '사계 레기온',
    description: '아이온2 지켈 서버 사계 레기온',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900 text-white`}
      >
        {children}
        <BossTimerNotifier />
        <Analytics />
      </body>
    </html>
  );
}
