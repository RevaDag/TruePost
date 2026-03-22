import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'TruePost — Verified Middle East News',
  description:
    'Cross-source news aggregator for Israeli and Middle East stories. The more sources report it, the more verified it is.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ backgroundColor: 'var(--parchment)', color: 'var(--ink)' }}>
        <Header />
        {children}
      </body>
    </html>
  );
}
