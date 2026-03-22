import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getStoryById } from "@/lib/supabase";
import { ConsensusBadge } from "@/components/ConsensusBadge";
import { SourceArticlePanel } from "@/components/SourceArticlePanel";

export const revalidate = 60;

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = await getStoryById(id);
  if (!story) notFound();

  const timeAgo = story.updated_at
    ? formatDistanceToNow(new Date(story.updated_at), { addSuffix: true }) : "";
  const articles = story.articles ?? [];

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: "Outfit, sans-serif", fontSize: "0.65rem", fontWeight: 500,
        letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)",
        textDecoration: "none", marginBottom: "2rem" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Back
      </Link>

      <div className="animate-in" style={{ marginBottom: "2.5rem", paddingBottom: "2rem", borderBottom: "1px solid var(--border-2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem", flexWrap: "wrap" }}>
          <ConsensusBadge sourceCount={story.source_count} />
          <span className="font-mono" style={{ fontSize: "0.6rem", color: "var(--text-3)" }}>{timeAgo}</span>
        </div>
        <h1 className="font-serif"
          style={{ fontSize: "clamp(1.6rem,4vw,2.6rem)", fontWeight: 400, lineHeight: 1.15,
            color: "var(--text-1)", marginBottom: "0.75rem" }}>
          {story.title}
        </h1>
        <p style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.82rem", color: "var(--text-3)" }}>
          Independently reported by{" "}
          <strong style={{ color: "var(--text-2)" }}>{story.source_count}</strong>{" "}
          {story.source_count === 1 ? "source" : "sources"}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.25rem" }}>
        <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.65rem", fontWeight: 600,
          letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>
          Coverage
        </span>
        <span className="font-mono" style={{ fontSize: "0.6rem", color: "var(--text-3)" }}>
          {articles.length} {articles.length === 1 ? "article" : "articles"}
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>

      {articles.length === 0 ? (
        <p style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.85rem", color: "var(--text-3)" }}>
          No articles found for this story.
        </p>
      ) : (
        <div className="story-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {articles.map(article => <SourceArticlePanel key={article.id} article={article} />)}
        </div>
      )}
    </main>
  );
}
