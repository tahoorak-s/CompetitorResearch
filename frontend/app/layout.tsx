import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Market Quest",
  description: "AI-powered competitor intelligence as a retro strategy game dashboard"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}

