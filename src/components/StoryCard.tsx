import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ConsensusBadge } from './ConsensusBadge';
import { SourceBadge } from './SourceBadge';
import type { Story } from '@/lib/types';

export function StoryCard({ story }: { story: Story }) {
  const sources = (story.articles ?? [])
    .map((a) => a.source)
    .filter((s): s is NonNullable<typeof s> => !!s)
    .filter((s, i, arr) => arr.findIndex((x) => x.id === s.id) === i);

  const timeAgo = story.updated_at
    ? formatDistanceToNow(new Date(story.updated_at), { addSuffix: true })
    : '';

  const imageUrl = story.representative_article?.image_url;

  return (
    <Link href={`/story/${story.id}`} className="block animate-fade-up" style={{ textDecoration: 'none' }}>
      <article className="story-card h-full">
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="bw-image"
            style={{ height: '10rem' }}
          />
        )}
        <div className="flex flex-col flex-1 p-4 gap-3">
          <h2
            className="font-headline"
            style={{
              fontSize: '0.95rem',
              fontWeight: 800,
              lineHeight: 1.3,
              color: 'var(--ink)',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {story.title}
          </h2>

          <div className="flex flex-col gap-2 mt-auto">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <ConsensusBadge sourceCount={story.source_count} />
              <span
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: '0.65rem',
                  color: 'var(--muted)',
                  letterSpacing: '0.02em',
                }}
              >
                {timeAgo}
              </span>
            </div>

            {sources.length > 0 && (
              <div
                className="flex flex-wrap gap-1.5 pt-2"
                style={{ borderTop: '1px solid var(--ink)' }}
              >
                {sources.slice(0, 4).map((source) => (
                  <SourceBadge key={source.id} source={source} />
                ))}
                {sources.length > 4 && (
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
                    +{sources.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
