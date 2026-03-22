import { getAllSources } from "@/lib/supabase";

export const revalidate = 3600;

export default async function SourcesPage() {
  let sources: Awaited<ReturnType<typeof getAllSources>> = [];
  try { sources = await getAllSources(); } catch {}

  const english = sources.filter(s => s.language === "en");
  const hebrew  = sources.filter(s => s.language === "he");

  function SourceRow({ name, url, rssUrl, logoUrl }: {
    name: string; url: string; rssUrl: string | null; logoUrl: string | null;
  }) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={name} width={18} height={18} style={{ objectFit: "contain", opacity: 0.85 }} />
          ) : (
            <div style={{ width: 18, height: 18, background: "var(--surface-3)",
              border: "1px solid var(--border-2)", borderRadius: 2,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Outfit, sans-serif", fontSize: "0.5rem", fontWeight: 600,
              color: "var(--text-3)", textTransform: "uppercase" }}>
              {name[0]}
            </div>
          )}
          <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.85rem", fontWeight: 500, color: "var(--text-1)" }}>
            {name}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.55rem", fontWeight: 600,
            letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 2,
            background: rssUrl ? "rgba(212,168,67,0.12)" : "var(--surface-3)",
            color: rssUrl ? "var(--amber)" : "var(--text-3)",
            border: rssUrl ? "1px solid rgba(212,168,67,0.3)" : "1px solid var(--border)" }}>
            {rssUrl ? "RSS" : "Scrape"}
          </span>
          <a href={url} target="_blank" rel="noopener noreferrer" className="read-btn">
            בקר באתר
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
      <div style={{ paddingBottom: "1.5rem", marginBottom: "2rem", borderBottom: "1px solid var(--border-2)" }}>
        <h1 className="font-serif animate-in" style={{ fontSize: "2rem", fontWeight: 400, color: "var(--text-1)", lineHeight: 1 }}>
          מקורות חדשות
        </h1>
        <p style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.78rem", color: "var(--text-3)", marginTop: 6 }}>
          {sources.length} מקורות במעקב — סריקה כל 30 דקות
        </p>
      </div>

      {sources.length === 0 && (
        <p style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.85rem", color: "var(--text-3)" }}>
          הגדר את משתני הסביבה של Supabase כדי לראות מקורות.
        </p>
      )}

      {english.length > 0 && (
        <section style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
            <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.6rem", fontWeight: 600,
              letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-3)" }}>
              מקורות באנגלית
            </span>
            <span className="font-mono" style={{ fontSize: "0.6rem", color: "var(--text-3)",
              padding: "1px 6px", border: "1px solid var(--border)", borderRadius: 2 }}>
              {english.length}
            </span>
          </div>
          <div style={{ border: "1px solid var(--border-2)", borderRadius: 2, overflow: "hidden", background: "var(--surface)" }}>
            {english.map(s => (
              <SourceRow key={s.id} name={s.name} url={s.url} rssUrl={s.rss_url} logoUrl={s.logo_url} />
            ))}
          </div>
        </section>
      )}

      {hebrew.length > 0 && (
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.75rem" }}>
            <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.6rem", fontWeight: 600,
              letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-3)" }}>
              מקורות בעברית
            </span>
            <span className="font-mono" style={{ fontSize: "0.6rem", color: "var(--text-3)",
              padding: "1px 6px", border: "1px solid var(--border)", borderRadius: 2 }}>
              {hebrew.length}
            </span>
          </div>
          <div style={{ border: "1px solid var(--border-2)", borderRadius: 2, overflow: "hidden", background: "var(--surface)" }}>
            {hebrew.map(s => (
              <SourceRow key={s.id} name={s.name} url={s.url} rssUrl={s.rss_url} logoUrl={s.logo_url} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
