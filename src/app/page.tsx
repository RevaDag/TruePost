import { getStories } from '@/lib/supabase';
import { StoryCard } from '@/components/StoryCard';
import { ConsensusBadge } from '@/components/ConsensusBadge';
import { SourceBadge } from '@/components/SourceBadge';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { Story } from '@/lib/types';

export const revalidate = 60;

function FeaturedStory({ story }: { story: Story }) {
  const sources = (story.articles ?? [])
    .map((a) => a.source)
    .filter((s): s is NonNullable<typeof s> => !!s)
    .filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);

  const timeAgo = story.updated_at
    ? formatDistanceToNow(new Date(story.updated_at), { addSuffix: true })
    : '';

  const imageUrl = story.representative_article?.image_url;

  return (
    <Link
      href={`/story/${story.id}`}
      className="block animate-fade-up"
      style={{ textDecoration: 'none' }}
    >
      <article className="featured-card">
        <div className="flex flex-col md:flex-row">
          {imageUrl && (
            <div style={{ flexShrink: 0, width: '100%', maxWidth: '20rem' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt=""
                className="bw-image"
                style={{ height: '100%', minHeight: '14rem', borderBottom: 'none', borderRight: '3px solid var(--ink)' }}
              />
            </div>
          )}
          <div className="flex flex-col flex-1 p-6 gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <ConsensusBadge sourceCount={story.source_count} />
              <span
                className="font-display"
                style={{
                  fontSize: '0.55rem',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  color: 'var(--muted)',
                }}
              >
                Top Story
              </span>
            </div>

            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '0.01em',
                color: 'var(--ink)',
              }}
            >
              {story.title}
            </h2>

            <div
              className="flex items-center gap-4 pt-3 flex-wrap"
              style={{ borderTop: '1px solid var(--ink)', marginTop: 'auto' }}
            >
              <div className="flex flex-wrap gap-1.5">
                {sources.slice(0, 5).map((source) => (
                  <SourceBadge key={source.id} source={source} />
                ))}
                {sources.length > 5 && (
                  <span
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: '0.5rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--muted)',
                      alignSelf: 'center',
                    }}
                  >
                    +{sources.length - 5}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: '0.65rem',
                  color: 'var(--muted)',
                  marginLeft: 'auto',
                }}
              >
                {timeAgo}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default async function HomePage() {
  let stories: Awaited<ReturnType<typeof getStories>> = [];

  try {
    stories = await getStories(50);
  } catch {
    // DB not configured yet — show empty state
  }

  const featured = stories[0];
  const rest = stories.slice(1);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8" style={{ minHeight: '80vh' }}>
      {/* Briefing header */}
      <div
        className="flex items-baseline justify-between pb-3 mb-6"
        style={{ borderBottom: '3px solid var(--ink)' }}
      >
        <h1
          className="font-display"
          style={{ fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', fontWeight: 700, letterSpacing: '0.16em' }}
        >
          Today&apos;s Briefing
        </h1>
        <span
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: '0.65rem',
            color: 'var(--muted)',
            letterSpacing: '0.04em',
          }}
        >
          {stories.length} {stories.length === 1 ? 'story' : 'stories'} · ranked by source consensus
        </span>
      </div>

      {stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center gap-6">
          <div
            className="font-display"
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--parchment-dark)',
            }}
          >
            No Stories Yet
          </div>
          <p
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: '0.85rem',
              color: 'var(--muted)',
              maxWidth: '28rem',
              lineHeight: 1.6,
            }}
          >
            Trigger the first crawl to start collecting articles from all sources.
          </p>
          <a href="/api/cron/crawl" className="brutalist-btn" style={{ fontSize: '0.65rem' }}>
            Run First Crawl
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Featured story */}
          {featured && <FeaturedStory story={featured} />}

          {/* Divider with label */}
          {rest.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="rule-thin flex-1" />
              <span
                className="font-display"
                style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--muted)', flexShrink: 0 }}
              >
                More Stories
              </span>
              <div className="rule-thin flex-1" />
            </div>
          )}

          {/* Story grid */}
          <div
            className="story-grid grid gap-6"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
          >
            {rest.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
