import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { getStoryById } from '@/lib/supabase';
import { ConsensusBadge } from '@/components/ConsensusBadge';
import { SourceArticlePanel } from '@/components/SourceArticlePanel';

export const revalidate = 60;

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await getStoryById(id);

  if (!story) notFound();

  const timeAgo = story.updated_at
    ? formatDistanceToNow(new Date(story.updated_at), { addSuffix: true })
    : '';

  const articles = story.articles ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="font-display inline-flex items-center gap-2 mb-8"
        style={{
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: 'var(--muted)',
          textDecoration: 'none',
          borderBottom: '1px solid transparent',
          transition: 'color 0.15s, border-color 0.15s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink)';
          (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'var(--peach)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.color = 'var(--muted)';
          (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = 'transparent';
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Feed
      </Link>

      {/* Story header */}
      <div
        className="animate-fade-up mb-8 pb-6"
        style={{ borderBottom: '3px solid var(--ink)' }}
      >
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <ConsensusBadge sourceCount={story.source_count} />
          <span
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: '0.7rem',
              color: 'var(--muted)',
            }}
          >
            {timeAgo}
          </span>
        </div>

        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(1.3rem, 4vw, 2.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '0.01em',
            color: 'var(--ink)',
            marginBottom: '1rem',
          }}
        >
          {story.title}
        </h1>

        <p
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: '0.8rem',
            color: 'var(--muted)',
            lineHeight: 1.5,
          }}
        >
          Independently reported by{' '}
          <strong style={{ color: 'var(--ink)' }}>{story.source_count}</strong>{' '}
          {story.source_count === 1 ? 'source' : 'sources'}
        </p>
      </div>

      {/* Section label */}
      <div className="flex items-center gap-4 mb-6">
        <span
          className="font-display"
          style={{
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '0.16em',
            color: 'var(--muted)',
          }}
        >
          Coverage — {articles.length} {articles.length === 1 ? 'article' : 'articles'}
        </span>
        <div className="rule-thin flex-1" />
      </div>

      {articles.length === 0 ? (
        <p
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: '0.85rem',
            color: 'var(--muted)',
          }}
        >
          No articles found for this story.
        </p>
      ) : (
        <div
          className="story-grid grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
        >
          {articles.map((article) => (
            <SourceArticlePanel key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
