import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white tracking-tight">TruePost</span>
          <span className="hidden sm:inline text-xs text-gray-500 font-normal">
            Israeli & Middle East news
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Feed</Link>
          <Link href="/sources" className="hover:text-white transition-colors">Sources</Link>
        </nav>
      </div>
    </header>
  );
}
