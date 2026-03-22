import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.timesofisrael.com' },
      { protocol: 'https', hostname: '**.jpost.com' },
      { protocol: 'https', hostname: '**.haaretz.com' },
      { protocol: 'https', hostname: '**.ynetnews.com' },
      { protocol: 'https', hostname: '**.i24news.tv' },
      { protocol: 'https', hostname: '**.israelnationalnews.com' },
      { protocol: 'https', hostname: '**.aljazeera.com' },
      { protocol: 'https', hostname: '**.bbc.com' },
      { protocol: 'https', hostname: '**.bbci.co.uk' },
      { protocol: 'https', hostname: '**.reuters.com' },
      { protocol: 'https', hostname: '**.mako.co.il' },
      { protocol: 'https', hostname: '**.13tv.co.il' },
      { protocol: 'https', hostname: '**.c14.co.il' },
    ],
  },
};

export default nextConfig;
