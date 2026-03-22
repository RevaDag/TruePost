export interface Source {
  id: string;
  name: string;
  url: string;
  rss_url: string | null;
  language: string;
  enabled: boolean;
  logo_url: string | null;
  created_at: string;
}

export interface Article {
  id: string;
  source_id: string;
  title: string;
  content: string | null;
  url: string;
  published_at: string | null;
  crawled_at: string;
  image_url: string | null;
  title_tokens: string[] | null;
  source?: Source;
}

export interface Story {
  id: string;
  title: string;
  first_seen_at: string;
  updated_at: string;
  source_count: number;
  representative_article_id: string | null;
  representative_article?: Article;
  articles?: Article[];
}

export type ConsensusLevel = 'unverified' | 'reported' | 'confirmed' | 'established';

export function getConsensusLevel(sourceCount: number): ConsensusLevel {
  if (sourceCount >= 5) return 'established';
  if (sourceCount >= 3) return 'confirmed';
  if (sourceCount >= 2) return 'reported';
  return 'unverified';
}

export function getConsensusLabel(sourceCount: number): string {
  const level = getConsensusLevel(sourceCount);
  const labels: Record<ConsensusLevel, string> = {
    unverified:  'Unverified',
    reported:    `Reported by ${sourceCount} sources`,
    confirmed:   `Confirmed by ${sourceCount} sources`,
    established: `Well-established (${sourceCount}+ sources)`,
  };
  return labels[level];
}
