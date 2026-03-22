import { getConsensusLevel } from "@/lib/types";

const cfg = {
  established: { cls: "cbadge-established", dot: "var(--c-established)", label: "מאושש" },
  confirmed:   { cls: "cbadge-confirmed",   dot: "var(--c-confirmed)",   label: "מאומת" },
  reported:    { cls: "cbadge-reported",     dot: "var(--c-reported)",    label: "דווח" },
  unverified:  { cls: "cbadge-unverified",   dot: "var(--text-3)",        label: "לא מאומת" },
};

export function ConsensusBadge({ sourceCount }: { sourceCount: number }) {
  const level = getConsensusLevel(sourceCount);
  const { cls, dot, label } = cfg[level];
  return (
    <span className={"cbadge " + cls}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: dot, flexShrink: 0, display: "inline-block" }} />
      {label}{sourceCount > 1 && <span style={{ opacity: 0.65 }}>· {sourceCount}</span>}
    </span>
  );
}
