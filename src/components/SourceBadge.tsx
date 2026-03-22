import type { Source } from '@/lib/types';

export function SourceBadge({ source }: { source: Source }) {
  return (
    <div className="source-badge">
      {source.logo_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={source.logo_url}
          alt={source.name}
          width={12}
          height={12}
          style={{ objectFit: 'contain', filter: 'grayscale(100%)' }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      {source.name}
    </div>
  );
}
