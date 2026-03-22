import { NextResponse } from 'next/server';
import { crawlAllSources } from '@/lib/crawler';
import { matchAndClusterArticles } from '@/lib/matcher';

export async function GET() {
  console.log('[cron/crawl] Starting at', new Date().toISOString());

  try {
    const crawlResult = await crawlAllSources();
    console.log('[cron/crawl] Crawl done:', crawlResult);

    const matchResult = await matchAndClusterArticles();
    console.log('[cron/crawl] Match done:', matchResult);

    return NextResponse.json({
      success:   true,
      crawl:     crawlResult,
      match:     matchResult,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[cron/crawl] Fatal:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
