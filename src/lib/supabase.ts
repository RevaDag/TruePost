import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Source, Article, Story } from './types';

let instance: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!instance) {
    instance = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
    );
  }
  return instance;
}

// ── Sources ──────────────────────────────────────────────────────────────────

export async function getEnabledSources(): Promise<Source[]> {
  const { data, error } = await getSupabase()
    .from('sources')
    .select('*')
    .eq('enabled', true);
  if (error) throw error;
  return data ?? [];
}

export async function getAllSources(): Promise<Source[]> {
  const { data, error } = await getSupabase()
    .from('sources')
    .select('*')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

// ── Articles ─────────────────────────────────────────────────────────────────

export async function articleExistsByUrl(url: string): Promise<boolean> {
  const { count } = await getSupabase()
    .from('articles')
    .select('id', { count: 'exact', head: true })
    .eq('url', url);
  return (count ?? 0) > 0;
}

export async function insertArticle(
  article: Omit<Article, 'id' | 'crawled_at'>,
): Promise<Article> {
  const { data, error } = await getSupabase()
    .from('articles')
    .insert(article)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getRecentArticles(withinHours = 48): Promise<Article[]> {
  const since = new Date(Date.now() - withinHours * 60 * 60 * 1000).toISOString();
  const { data, error } = await getSupabase()
    .from('articles')
    .select('*, source:sources(*)')
    .gte('published_at', since)
    .order('published_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ── Stories ──────────────────────────────────────────────────────────────────

export async function getStories(limit = 50): Promise<Story[]> {
  const { data, error } = await getSupabase()
    .from('stories')
    .select(`
      *,
      representative_article:articles(
        *,
        source:sources(*)
      )
    `)
    .order('source_count', { ascending: false })
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getStoryById(id: string): Promise<Story | null> {
  const { data, error } = await getSupabase()
    .from('stories')
    .select(`
      *,
      representative_article:articles(*),
      story_articles(
        article:articles(
          *,
          source:sources(*)
        )
      )
    `)
    .eq('id', id)
    .single();
  if (error) return null;
  // Flatten the nested join
  data.articles = (data.story_articles ?? []).map((sa: { article: Article }) => sa.article);
  delete data.story_articles;
  return data;
}

export async function upsertStory(story: Partial<Story>): Promise<Story> {
  const { data, error } = await getSupabase()
    .from('stories')
    .insert(story)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function linkArticleToStory(
  storyId: string,
  articleId: string,
): Promise<void> {
  await getSupabase()
    .from('story_articles')
    .upsert({ story_id: storyId, article_id: articleId });
}

export async function updateStorySourceCount(storyId: string): Promise<void> {
  const { data } = await getSupabase()
    .from('story_articles')
    .select('articles(source_id)')
    .eq('story_id', storyId);

  const sourceIds = new Set(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data ?? []).map((sa: any) => sa.articles?.source_id).filter(Boolean),
  );

  await getSupabase()
    .from('stories')
    .update({ source_count: sourceIds.size, updated_at: new Date().toISOString() })
    .eq('id', storyId);
}

export async function getStoryArticleLink(
  articleId: string,
): Promise<{ story_id: string } | null> {
  const { data } = await getSupabase()
    .from('story_articles')
    .select('story_id')
    .eq('article_id', articleId)
    .maybeSingle();
  return data;
}

export { getSupabase };
