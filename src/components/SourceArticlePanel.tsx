"use client";

import { formatDistanceToNow } from "date-fns";
import { SourceBadge } from "./SourceBadge";
import type { Article } from "@/lib/types";

export function SourceArticlePanel({ article }: { article: Article }) {
  const timeAgo = article.published_at
    ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true })
    : "";

  return (
    <article className="article-panel">
      {article.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.image_url} alt=""
          style={{ width: "100%", height: "8rem", objectFit: "cover", display: "block", borderBottom: "1px solid var(--border)" }}
        />
      )}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "1rem", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          {article.source && <SourceBadge source={article.source} />}
          <span className="font-mono" style={{ fontSize: "0.58rem", color: "var(--text-3)", flexShrink: 0 }}>{timeAgo}</span>
        </div>
        <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.9rem", fontWeight: 500, lineHeight: 1.4, color: "var(--text-1)" }}>
          {article.title}
        </h3>
        {article.content && (
          <p style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.78rem", lineHeight: 1.6, color: "var(--text-2)",
            display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {article.content}
          </p>
        )}
        <a href={article.url} target="_blank" rel="noopener noreferrer"
          className="read-btn" style={{ marginTop: "auto", alignSelf: "flex-start" }}
          onClick={e => e.stopPropagation()}
        >
          קרא כתבה
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>
    </article>
  );
}
