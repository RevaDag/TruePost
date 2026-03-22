import { getConsensusLevel, getConsensusLabel } from '@/lib/types';

const styles: Record<string, string> = {
  unverified:  'bg-gray-800 text-gray-400 border border-gray-700',
  reported:    'bg-yellow-950 text-yellow-400 border border-yellow-800',
  confirmed:   'bg-green-950 text-green-400 border border-green-800',
  established: 'bg-blue-950 text-blue-400 border border-blue-800',
};

export function ConsensusBadge({ sourceCount }: { sourceCount: number }) {
  const level = getConsensusLevel(sourceCount);
  const label = getConsensusLabel(sourceCount);

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[level]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
