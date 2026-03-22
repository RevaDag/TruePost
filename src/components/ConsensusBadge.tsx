import { getConsensusLevel } from '@/lib/types';

const levelMap = {
  established: { cls: 'lvl-established', dot: '#FFFFFF', label: 'Established' },
  confirmed:   { cls: 'lvl-confirmed',   dot: '#000000', label: 'Confirmed' },
  reported:    { cls: 'lvl-reported',    dot: '#000000', label: 'Reported' },
  unverified:  { cls: 'lvl-unverified',  dot: '#7A7570', label: 'Unverified' },
};

export function ConsensusBadge({ sourceCount }: { sourceCount: number }) {
  const level = getConsensusLevel(sourceCount);
  const { cls, dot, label } = levelMap[level];

  return (
    <span className={`consensus-badge ${cls}`}>
      <span
        style={{
          display: 'inline-block',
          width: 5,
          height: 5,
          borderRadius: '50%',
          backgroundColor: dot,
          flexShrink: 0,
        }}
      />
      {label}
      {sourceCount > 1 && (
        <span style={{ opacity: 0.7, fontWeight: 500 }}>· {sourceCount}</span>
      )}
    </span>
  );
}
