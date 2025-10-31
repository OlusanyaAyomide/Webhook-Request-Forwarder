import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import ClientProvider from "@/components/protected/ClientProvider";
import { NavigationEvents } from "@/components/protected/NavigationEvents";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Echo - Webhook Testing & Monitoring Platform",
    template: "%s | Echo"
  },
  description: "Forward, log, and analyze webhook requests with complete visibility. Test webhooks seamlessly between development and production environments.",
  keywords: ["webhook", "webhook testing", "webhook monitoring", "API testing", "webhook forwarding", "development tools", "webhook logs"],
  authors: [{ name: "Echo" }],
  creator: "Echo",
  publisher: "Echo",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Echo - Webhook Testing & Monitoring Platform",
    description: "Forward, log, and analyze webhook requests with complete visibility. Test webhooks seamlessly between development and production environments.",
    siteName: "Echo",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Echo - Webhook Testing Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Echo - Webhook Testing & Monitoring Platform",
    description: "Forward, log, and analyze webhook requests with complete visibility.",
    images: ["/logo.svg"],
    creator: "@echo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/logo.svg" },
      { url: "/logo.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/logo.svg", sizes: "32x32", type: "image/svg+xml" },
    ],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <Suspense fallback={<span>An Error occured</span>}>
            <ClientProvider>
              {children}
            </ClientProvider>
            <Toaster />
            <NavigationEvents />
          </Suspense>
        </ClerkProvider>
      </body>
    </html>
  );
}