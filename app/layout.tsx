import type { Metadata } from "next";
import { Anton, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "ClipGanji — Short-Form Video Advertising Network | Kenya",
  description: "Reach 50,000–1,000,000+ verified Kenyan viewers through TikTok, Instagram Reels, and YouTube Shorts. Campaigns live in 72 hours. UTM-tracked. No ad blockers.",
  keywords: "Kenya advertising, TikTok ads Kenya, short form video advertising Nairobi, brand awareness Kenya, betting advertising Kenya",
  openGraph: {
    title: "ClipGanji — Your Brand Inside Every Clip",
    description: "Kenya's first short-form video ad network. 10+ creators. Verified views. 72-hour launch.",
    url: "https://www.clipganji.com",
    siteName: "ClipGanji",
    locale: "en_KE",
    type: "website",
  },
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ClipGanji",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

import { Providers } from "@/app/components/auth/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${dmSans.variable} ${anton.variable} ${jetbrainsMono.variable} font-sans antialiased text-white bg-black`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
