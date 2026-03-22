import { formatDistanceToNow } from 'date-fns';
import { SourceBadge } from './SourceBadge';
import type { Article } from '@/lib/types';

export function SourceArticlePanel({ article }: { article: Article }) {
  const timeAgo = article.published_at
    ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true })
    : '';

  return (
    <article className="flex flex-col rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
      {article.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.image_url}
          alt=""
          className="h-36 w-full object-cover"
        />
      )}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-center justify-between gap-2">
          {article.source && <SourceBadge source={article.source} />}
          <span className="text-xs text-gray-500 shrink-0">{timeAgo}</span>
        </div>

        <h3 className="text-sm font-semibold leading-snug text-gray-100">
          {article.title}
        </h3>

        {article.content && (
          <p className="text-xs text-gray-400 line-clamp-5">
            {article.content}
          </p>
        )}

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 hover:underline"
        >
          Read full article
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </article>
  );
}
