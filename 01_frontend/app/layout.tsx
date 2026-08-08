import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sanjeevani",
  description:
    "AI-powered Blood & Plasma Supply Coordination Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}