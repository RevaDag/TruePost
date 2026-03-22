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
    <Link href={`/story/${story.id}`} className="block group">
      <article className="flex flex-col rounded-xl border border-gray-800 bg-gray-900 overflow-hidden transition hover:border-blue-700 hover:bg-gray-800/80 h-full">
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="h-44 w-full object-cover"
          />
        )}
        <div className="flex flex-col flex-1 p-4 gap-3">
          <h2 className="text-sm font-semibold leading-snug text-gray-100 group-hover:text-blue-400 line-clamp-3">
            {story.title}
          </h2>

          <div className="flex items-center justify-between gap-2 flex-wrap mt-auto">
            <ConsensusBadge sourceCount={story.source_count} />
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>

          {sources.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-800">
              {sources.slice(0, 5).map((source) => (
                <SourceBadge key={source.id} source={source} />
              ))}
              {sources.length > 5 && (
                <span className="text-xs text-gray-500">+{sources.length - 5} more</span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
