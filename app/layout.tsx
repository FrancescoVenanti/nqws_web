import type { Metadata, Viewport } from "next";
import React from "react";
import "./globals.css";
import { AppearanceProvider } from "@/components/AppearanceProvider";

export const metadata: Metadata = {
  title: "nQws",
  description: "Minimal news reader for the last 24 hours.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppearanceProvider>
          <main>{children}</main>
        </AppearanceProvider>
      </body>
    </html >
  );
}
