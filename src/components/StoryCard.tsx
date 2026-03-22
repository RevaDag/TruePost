import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ConsensusBadge } from "./ConsensusBadge";
import { SourceBadge } from "./SourceBadge";
import { getConsensusLevel } from "@/lib/types";
import type { Story } from "@/lib/types";

export function StoryCard({ story }: { story: Story }) {
  const sources = (story.articles ?? [])
    .map(a => a.source)
    .filter((s): s is NonNullable<typeof s> => !!s)
    .filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i);

  const timeAgo = story.updated_at
    ? formatDistanceToNow(new Date(story.updated_at), { addSuffix: true })
    : "";

  const imageUrl = story.representative_article?.image_url;
  const level = getConsensusLevel(story.source_count);

  return (
    <Link href={`/story/${story.id}`} className="block animate-in" style={{ textDecoration: "none" }}>
      <article className={`story-card h-full c-${level}`}>
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt=""
            style={{ width: "100%", height: "9rem", objectFit: "cover", display: "block", borderBottom: "1px solid var(--border)" }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "1rem", gap: "0.75rem" }}>
          <h2 className="font-serif"
            style={{ fontSize: "1.05rem", fontWeight: 400, lineHeight: 1.3, color: "var(--text-1)",
              display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}
          >
            {story.title}
          </h2>
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
              <ConsensusBadge sourceCount={story.source_count} />
              <span className="font-mono" style={{ fontSize: "0.6rem", color: "var(--text-3)" }}>{timeAgo}</span>
            </div>
            {sources.length > 0 && (
              <div className="divide" style={{ paddingTop: "0.6rem", display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {sources.slice(0, 4).map(source => <SourceBadge key={source.id} source={source} />)}
                {sources.length > 4 && <span className="source-chip">+{sources.length - 4}</span>}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
