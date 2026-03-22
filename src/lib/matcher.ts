import {
  getRecentArticles,
  upsertStory,
  linkArticleToStory,
  updateStorySourceCount,
  getStoryArticleLink,
} from './supabase';
import type { Article } from './types';

const SIMILARITY_THRESHOLD = 0.25;
const TIME_WINDOW_HOURS = 48;

// Hebrew and English stopwords
const STOPWORDS = new Set([
  // English
  'the', 'and', 'for', 'that', 'with', 'has', 'was', 'are', 'from',
  'have', 'had', 'not', 'but', 'they', 'been', 'will', 'its', 'said',
  'this', 'his', 'her', 'their', 'over', 'after', 'more', 'into',
  'about', 'also', 'when', 'who', 'two', 'can', 'new', 'than',
  // Common news words that don't help differentiate
  'israel', 'israeli', 'gaza', 'report', 'news', 'says', 'amid',
]);

export function tokenizeTitle(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u0590-\u05FF]/g, ' ') // keep Hebrew chars
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

export function jaccardSimilarity(tokensA: string[], tokensB: string[]): number {
  if (!tokensA.length || !tokensB.length) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  let intersection = 0;
  for (const t of setA) {
    if (setB.has(t)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return intersection / union;
}

export interface MatchResult {
  storiesCreated: number;
  articlesMatched: number;
}

export async function matchAndClusterArticles(): Promise<MatchResult> {
  const articles = await getRecentArticles(TIME_WINDOW_HOURS);

  if (!articles.length) return { storiesCreated: 0, articlesMatched: 0 };

  const clusters = buildClusters(articles);

  let storiesCreated = 0;
  let articlesMatched = 0;

  for (const cluster of clusters) {
    if (!cluster.length) continue;

    // Pick the article with the most tokens as representative
    const representative = cluster.reduce((best, a) =>
      (a.title_tokens?.length ?? 0) > (best.title_tokens?.length ?? 0) ? a : best,
    );

    // Check if a story already exists for this representative article
    const existingLink = await getStoryArticleLink(representative.id);

    let storyId: string;

    if (existingLink) {
      storyId = existingLink.story_id;
    } else {
      const story = await upsertStory({
        title:                     representative.title,
        first_seen_at:             representative.published_at ?? new Date().toISOString(),
        updated_at:                new Date().toISOString(),
        source_count:              1,
        representative_article_id: representative.id,
      });
      storyId = story.id;
      storiesCreated++;
    }

    for (const article of cluster) {
      await linkArticleToStory(storyId, article.id);
      articlesMatched++;
    }

    await updateStorySourceCount(storyId);
  }

  return { storiesCreated, articlesMatched };
}

function buildClusters(articles: Article[]): Article[][] {
  const visited = new Set<string>();
  const clusters: Article[][] = [];

  for (let i = 0; i < articles.length; i++) {
    const a = articles[i];
    if (visited.has(a.id)) continue;

    const cluster: Article[] = [a];
    visited.add(a.id);

    for (let j = i + 1; j < articles.length; j++) {
      const b = articles[j];
      if (visited.has(b.id)) continue;
      if (a.source_id === b.source_id) continue;
      if (!withinTimeWindow(a, b)) continue;

      const tokensA = a.title_tokens ?? tokenizeTitle(a.title);
      const tokensB = b.title_tokens ?? tokenizeTitle(b.title);
      const sim = jaccardSimilarity(tokensA, tokensB);

      if (sim >= SIMILARITY_THRESHOLD) {
        cluster.push(b);
        visited.add(b.id);
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}

function withinTimeWindow(a: Article, b: Article): boolean {
  const tA = a.published_at ? new Date(a.published_at).getTime() : 0;
  const tB = b.published_at ? new Date(b.published_at).getTime() : 0;
  return Math.abs(tA - tB) <= TIME_WINDOW_HOURS * 60 * 60 * 1000;
}
