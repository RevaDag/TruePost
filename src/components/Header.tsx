import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: 'var(--parchment)', borderBottom: '3px solid var(--ink)' }}>
      {/* Top rule */}
      <div className="rule-thick" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Main masthead row */}
        <div className="flex items-center justify-between py-3 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-3 group" style={{ textDecoration: 'none' }}>
            <span
              className="font-display"
              style={{
                fontSize: 'clamp(1.4rem, 4vw, 2rem)',
                fontWeight: 800,
                letterSpacing: '-0.01em',
                color: 'var(--ink)',
                lineHeight: 1,
              }}
            >
              True<span className="highlight-peach">Post</span>
            </span>
            <span
              className="hidden sm:block font-display"
              style={{
                fontSize: '0.55rem',
                fontWeight: 600,
                letterSpacing: '0.16em',
                color: 'var(--muted)',
                borderLeft: '1px solid var(--muted-light)',
                paddingLeft: '0.75rem',
                lineHeight: 1.3,
              }}
            >
              Israeli &amp; Middle East<br />
              News Intelligence
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-5" aria-label="Main navigation">
            <Link href="/" className="nav-link">Feed</Link>
            <Link href="/sources" className="nav-link">Sources</Link>
          </nav>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="rule-thin" />
    </header>
  );
}
