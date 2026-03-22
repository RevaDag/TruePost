import { NextRequest, NextResponse } from 'next/server';
import { getStories } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const limit = Math.min(
    parseInt(request.nextUrl.searchParams.get('limit') ?? '50', 10),
    100,
  );

  try {
    const stories = await getStories(limit);
    return NextResponse.json(stories, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : JSON.stringify(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
