import { getAllSources } from '@/lib/supabase';
import { SourceBadge } from '@/components/SourceBadge';

export const revalidate = 3600;

export default async function SourcesPage() {
  let sources: Awaited<ReturnType<typeof getAllSources>> = [];

  try {
    sources = await getAllSources();
  } catch {
    // DB not configured yet
  }

  const english = sources.filter((s) => s.language === 'en');
  const hebrew  = sources.filter((s) => s.language === 'he');

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">News Sources</h1>
      <p className="text-sm text-gray-400 mb-8">
        {sources.length} sources tracked — articles are crawled every 30 minutes
      </p>

      {english.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
            English Sources
          </h2>
          <div className="grid gap-3">
            {english.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-4"
              >
                <SourceBadge source={source} />
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="rounded bg-gray-800 px-2 py-0.5">
                    {source.rss_url ? 'RSS' : 'Scrape'}
                  </span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Visit →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {hebrew.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
            Hebrew Sources
          </h2>
          <div className="grid gap-3">
            {hebrew.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 p-4"
              >
                <SourceBadge source={source} />
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="rounded bg-gray-800 px-2 py-0.5">
                    {source.rss_url ? 'RSS' : 'Scrape'}
                  </span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Visit →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {sources.length === 0 && (
        <p className="text-gray-500">
          Configure your Supabase environment variables to see sources.
        </p>
      )}
    </main>
  );
}
