import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";


export const metadata: Metadata = {
  title: "Annaya Boutique",
  description: "Exquisite ethnic & contemporary fashion — where tradition meets modern luxury.",
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png", shortcut: "/favicon-16x16.png" },
  manifest: "/site.webmanifest",
  appleWebApp: { title: "Annaya Boutique", statusBarStyle: "default", capable: true },
};

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
