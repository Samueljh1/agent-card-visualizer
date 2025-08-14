import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Agent Card Visualizer | Debug & Preview Agent Cards"
const description = "A tool for visualizing, debugging, and validating AI agent cards."

export const metadata: Metadata = {
  title,
  description,
  keywords: ["AI agent", "agent card", "visualization", "debugging", "validation", "AI tools", "agent configuration", "card preview", "ai", "a2a", "a2a protocol", "a2a visualizer", "a2a visualisation", "a2a validation", "a2a preview", "a2a configuration", "a2a agent card", "a2a agent card visualizer", "a2a agent card visualisation", "a2a agent card validation", "a2a agent card preview", "a2a agent card configuration"],
  authors: [{ name: "Agent Card Visualizer" }],
  creator: "Agent Card Visualizer",
  publisher: "Agent Card Visualizer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title,
    description,
    siteName: "Agent Card Visualizer",
    images: [
      // {
      //   url: "/og-image.png",
      //   width: 1200,
      //   height: 630,
      //   alt: "Agent Card Visualizer - Debug & Visualize AI Agent Cards",
      // },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      // "/twitter-image.png"
    ],
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
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": metadata.openGraph?.siteName,
              "description": metadata.description,
              "url": metadata.metadataBase?.toString(),
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": metadata.creator
              },
              "potentialAction": {
                "@type": "UseAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": metadata.metadataBase?.toString()
                }
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
