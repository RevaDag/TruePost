"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CrawlButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function run() {
    setLoading(true);
    try {
      await fetch("/api/cron/crawl");
    } finally {
      router.refresh();
      setLoading(false);
    }
  }

  return (
    <button
      onClick={run}
      disabled={loading}
      style={{
        fontFamily: "Outfit, sans-serif", fontSize: "0.7rem", fontWeight: 500,
        letterSpacing: "0.08em", textTransform: "uppercase",
        color: loading ? "var(--text-3)" : "var(--amber)",
        border: "1px solid", borderColor: loading ? "var(--border-2)" : "var(--amber)",
        borderRadius: 2, padding: "6px 16px", background: "transparent",
        cursor: loading ? "not-allowed" : "pointer", transition: "all 0.15s",
      }}
    >
      {loading ? "Crawling…" : "Run First Crawl"}
    </button>
  );
}
