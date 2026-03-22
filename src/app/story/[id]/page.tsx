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
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to feed
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <ConsensusBadge sourceCount={story.source_count} />
          <span className="text-sm text-gray-500">{timeAgo}</span>
        </div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl leading-tight">
          {story.title}
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Reported by{' '}
          <span className="font-medium text-gray-200">{story.source_count}</span>{' '}
          independent {story.source_count === 1 ? 'source' : 'sources'}
        </p>
      </div>

      {articles.length === 0 ? (
        <p className="text-gray-500">No articles found for this story.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <SourceArticlePanel key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
