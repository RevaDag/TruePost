import type { Source } from '@/lib/types';

export function SourceBadge({ source }: { source: Source }) {
  return (
    <div className="flex items-center gap-1.5">
      {source.logo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={source.logo_url}
          alt={source.name}
          width={16}
          height={16}
          className="rounded-sm object-contain"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      )}
      <span className="text-xs text-gray-400">{source.name}</span>
    </div>
  );
}
