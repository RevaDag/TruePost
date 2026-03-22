import { formatDistanceToNow } from 'date-fns';
import { SourceBadge } from './SourceBadge';
import type { Article } from '@/lib/types';

export function SourceArticlePanel({ article }: { article: Article }) {
  const timeAgo = article.published_at
    ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true })
    : '';

  return (
    <article className="article-panel">
      {article.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.image_url}
          alt=""
          className="bw-image"
          style={{ height: '8.5rem' }}
        />
      )}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-center justify-between gap-2">
          {article.source && <SourceBadge source={article.source} />}
          <span
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: '0.6rem',
              color: 'var(--muted)',
              flexShrink: 0,
            }}
          >
            {timeAgo}
          </span>
        </div>

        <h3
          className="font-headline"
          style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            lineHeight: 1.35,
            color: 'var(--ink)',
          }}
        >
          {article.title}
        </h3>

        {article.content && (
          <p
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: '0.75rem',
              lineHeight: 1.55,
              color: 'var(--muted)',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {article.content}
          </p>
        )}

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="brutalist-btn mt-auto"
          style={{ alignSelf: 'flex-start' }}
        >
          Read article
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </article>
  );
}
