import { getStories } from '@/lib/supabase';
import { StoryCard } from '@/components/StoryCard';

export const revalidate = 60;

export default async function HomePage() {
  let stories: Awaited<ReturnType<typeof getStories>> = [];

  try {
    stories = await getStories(50);
  } catch {
    // DB not configured yet — show empty state
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Latest Stories</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            Ranked by how many independent sources confirm the story
          </p>
        </div>
        <span className="text-sm text-gray-500">
          {stories.length} {stories.length === 1 ? 'story' : 'stories'}
        </span>
      </div>

      {stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">📰</div>
          <h2 className="text-lg font-semibold text-gray-300">No stories yet</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-sm">
            Trigger the first crawl to start collecting articles from all sources.
          </p>
          <a
            href="/api/cron/crawl"
            className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            Run first crawl
          </a>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </main>
  );
}
