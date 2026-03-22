import { getAllSources } from '@/lib/supabase';

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

  const SourceRow = ({ name, url, rssUrl, logoUrl }: {
    name: string;
    url: string;
    rssUrl: string | null;
    logoUrl: string | null;
  }) => (
    <div
      className="flex items-center justify-between p-4 animate-fade-up"
      style={{ borderBottom: '1px solid var(--ink)' }}
    >
      <div className="flex items-center gap-3">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={name}
            width={20}
            height={20}
            style={{
              objectFit: 'contain',
              filter: 'grayscale(100%)',
              border: '1px solid var(--ink)',
              padding: '2px',
              backgroundColor: 'var(--parchment-alt)',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div
            style={{
              width: 20,
              height: 20,
              border: '1px solid var(--ink)',
              backgroundColor: 'var(--parchment-dark)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Syne, sans-serif',
              fontSize: '0.45rem',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            {name[0]}
          </div>
        )}
        <span
          className="font-display"
          style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em' }}
        >
          {name}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="font-display"
          style={{
            fontSize: '0.5rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            padding: '0.15rem 0.4rem',
            border: '1px solid var(--ink)',
            backgroundColor: rssUrl ? 'var(--yellow)' : 'var(--parchment-alt)',
          }}
        >
          {rssUrl ? 'RSS' : 'Scrape'}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="brutalist-btn"
          style={{ padding: '0.3rem 0.75rem', fontSize: '0.55rem' }}
        >
          Visit →
        </a>
      </div>
    </div>
  );

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      {/* Page header */}
      <div
        className="pb-4 mb-8"
        style={{ borderBottom: '3px solid var(--ink)' }}
      >
        <h1
          className="font-display animate-fade-up"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            fontWeight: 800,
            letterSpacing: '0.01em',
            lineHeight: 1,
            marginBottom: '0.5rem',
          }}
        >
          News Sources
        </h1>
        <p
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: '0.8rem',
            color: 'var(--muted)',
          }}
        >
          {sources.length} sources tracked — crawled every 30 minutes
        </p>
      </div>

      {sources.length === 0 && (
        <p
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: '0.85rem',
            color: 'var(--muted)',
          }}
        >
          Configure your Supabase environment variables to see sources.
        </p>
      )}

      {english.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-4 mb-1">
            <h2
              className="font-display"
              style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: 'var(--muted)',
              }}
            >
              English Sources
            </h2>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.5rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '0.1rem 0.4rem',
                border: '1px solid var(--muted-light)',
                color: 'var(--muted)',
              }}
            >
              {english.length}
            </div>
          </div>
          <div style={{ border: '2px solid var(--ink)', boxShadow: '4px 4px 0px var(--ink)' }}>
            {english.map((source) => (
              <SourceRow
                key={source.id}
                name={source.name}
                url={source.url}
                rssUrl={source.rss_url}
                logoUrl={source.logo_url}
              />
            ))}
          </div>
        </section>
      )}

      {hebrew.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-1">
            <h2
              className="font-display"
              style={{
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: 'var(--muted)',
              }}
            >
              Hebrew Sources
            </h2>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '0.5rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '0.1rem 0.4rem',
                border: '1px solid var(--muted-light)',
                color: 'var(--muted)',
              }}
            >
              {hebrew.length}
            </div>
          </div>
          <div style={{ border: '2px solid var(--ink)', boxShadow: '4px 4px 0px var(--ink)' }}>
            {hebrew.map((source) => (
              <SourceRow
                key={source.id}
                name={source.name}
                url={source.url}
                rssUrl={source.rss_url}
                logoUrl={source.logo_url}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
