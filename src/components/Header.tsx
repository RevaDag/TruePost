import Link from "next/link";

export function Header() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: "rgba(12,12,16,0.92)", borderBottom: "1px solid var(--border-2)", backdropFilter: "blur(12px)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between" style={{ height: 52 }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline", gap: 10 }}>
          <span className="font-serif" style={{ fontSize: "1.25rem", color: "var(--text-1)", letterSpacing: "-0.01em" }}>
            TruePost
          </span>
          <span className="font-mono hidden sm:inline" style={{ fontSize: "0.55rem", color: "var(--amber)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Middle East Intelligence
          </span>
        </Link>
        <nav style={{ display: "flex", gap: 24 }}>
          <Link href="/" style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-2)", textDecoration: "none" }}>Feed</Link>
          <Link href="/sources" style={{ fontFamily: "Outfit, sans-serif", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-2)", textDecoration: "none" }}>Sources</Link>
        </nav>
      </div>
    </header>
  );
}
