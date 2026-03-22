import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "TruePost — Verified Middle East News",
  description: "Cross-source news aggregator for Israeli and Middle East stories.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text-1)" }}>
        <Header />
        {children}
      </body>
    </html>
  );
}
