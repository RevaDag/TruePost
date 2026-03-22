"use client";

import type { Source } from "@/lib/types";

export function SourceBadge({ source }: { source: Source }) {
  return (
    <div className="source-chip">
      {source.logo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={source.logo_url}
          alt={source.name}
          width={11}
          height={11}
          style={{ objectFit: "contain", opacity: 0.8 }}
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}
      {source.name}
    </div>
  );
}
