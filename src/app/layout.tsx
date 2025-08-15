// ===== UI 改善（Tailwind）スターター一式（Google Fonts + Providers 対応） =====
// -------------------------------------------------

// ファイル: src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyApp",
  description: "Next.js + Auth + Todo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-background text-foreground antialiased`}>
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-8">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
