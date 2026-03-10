import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import BossTimerNotifier from "./components/BossTimerNotifier";
import PasswordGate from "./components/PasswordGate";
import "./globals.css";

const GA_ID = 'G-34ZGYN24W0';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "접속중 레기온 - AION2 지켈",
  description: "아이온2 지켈 서버 접속중 레기온 사이트",
  metadataBase: new URL('https://sagye.kr'),
  robots: { index: false, follow: false },
  verification: { google: 'f1IDkVOWfUFBJiPqmCNoVgQlERqbf3iOMbAa6hn8LUk' },
  manifest: '/manifest.json',
  themeColor: '#f59e0b',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '접속중 레기온',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: '접속중 레기온',
    description: '아이온2 지켈 서버 접속중 레기온',
    siteName: '접속중 레기온',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/og-image.png?v=2',
        width: 1200,
        height: 630,
        alt: '접속중 레기온 - AION2 지켈',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '접속중 레기온',
    description: '아이온2 지켈 서버 접속중 레기온',
    images: ['/og-image.png?v=2'],
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
      <head>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900 text-white`}
      >
        <PasswordGate>
          {children}
          <BossTimerNotifier />
        </PasswordGate>
        <Analytics />
      </body>
    </html>
  );
}
