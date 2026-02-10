import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  themeColor: "#e9a1b1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: "Daily Beauty Clothes",
  description: "Quản lý tủ đồ & gợi ý phối đồ bằng AI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "StyleMate",
  },
};

import { PwaInit } from "@/components/pwa-init";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${jakarta.variable} ${inter.variable} font-sans antialiased`}
      >
        <PwaInit />
        {children}
      </body>
    </html>
  );
}
