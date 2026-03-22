import { getStories } from "@/lib/supabase";
import { StoryCard } from "@/components/StoryCard";
import { ConsensusBadge } from "@/components/ConsensusBadge";
import { SourceBadge } from "@/components/SourceBadge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import type { Story } from "@/lib/types";

export const revalidate = 60;

function FeaturedStory({ story }: { story: Story }) {
  const sources = (story.articles ?? [])
    .map(a => a.source)
    .filter((s): s is NonNullable<typeof s> => !!s)
    .filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i);
  const timeAgo = story.updated_at
    ? formatDistanceToNow(new Date(story.updated_at), { addSuffix: true }) : "";
  const imageUrl = story.representative_article?.image_url;

  return (
    <Link href={"story/" + story.id} className="block animate-in" style={{ textDecoration: "none" }}>
      <article className="featured-card">
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt=""
            style={{ width: "100%", height: "clamp(14rem,30vw,22rem)", objectFit: "cover", display: "block", borderBottom: "1px solid var(--border-2)" }}
          />
        )}
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <ConsensusBadge sourceCount={story.source_count} />
            <span style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.6rem", fontWeight: 600,
              letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)" }}>
              Top Story
            </span>
            <span className="font-mono" style={{ fontSize: "0.6rem", color: "var(--text-3)", marginLeft: "auto" }}>{timeAgo}</span>
          </div>
          <h2 className="font-serif"
            style={{ fontSize: "clamp(1.4rem,3.5vw,2rem)", fontWeight: 400, lineHeight: 1.2, color: "var(--text-1)" }}>
            {story.title}
          </h2>
          {sources.length > 0 && (
            <div className="divide-2" style={{ paddingTop: "1rem", display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {sources.slice(0, 6).map(s => <SourceBadge key={s.id} source={s} />)}
              {sources.length > 6 && <span className="source-chip">+{sources.length - 6}</span>}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export default async function HomePage() {
  let stories: Awaited<ReturnType<typeof getStories>> = [];
  try { stories = await getStories(50); } catch {}

  const featured = stories[0];
  const rest = stories.slice(1);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6" style={{ minHeight: "80vh" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between",
        paddingBottom: "1rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-2)" }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: "1.6rem", fontWeight: 400, color: "var(--text-1)", lineHeight: 1 }}>
            Latest Stories
          </h1>
          <p style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.72rem", color: "var(--text-3)", marginTop: 4 }}>
            Ranked by independent source count
          </p>
        </div>
        <span className="font-mono" style={{ fontSize: "0.65rem", color: "var(--text-3)" }}>
          {stories.length} {stories.length === 1 ? "story" : "stories"}
        </span>
      </div>

      {stories.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: "1rem", paddingTop: "6rem", textAlign: "center" }}>
          <h2 className="font-serif" style={{ fontSize: "1.5rem", color: "var(--text-2)" }}>No stories yet</h2>
          <p style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.85rem", color: "var(--text-3)", maxWidth: "28rem" }}>
            Trigger the first crawl to start collecting articles from all sources.
          </p>
          <a href="/api/cron/crawl" style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.7rem", fontWeight: 500,
            letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--amber)",
            border: "1px solid var(--amber)", borderRadius: 2, padding: "6px 16px", textDecoration: "none" }}>
            Run First Crawl
          </a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {featured && <FeaturedStory story={featured} />}
          {rest.length > 0 && (
            <div className="story-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "1rem" }}>
              {rest.map(story => <StoryCard key={story.id} story={story} />)}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
