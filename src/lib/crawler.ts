import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import {
  getEnabledSources,
  articleExistsByUrl,
  insertArticle,
} from './supabase';
import { tokenizeTitle } from './matcher';
import type { Source, Article } from './types';

const rssParser = new Parser({
  timeout: 10_000,
  headers: { 'User-Agent': 'TruePost/1.0 (news aggregator)' },
});

export interface CrawlResult {
  crawled: number;
  inserted: number;
  errors: string[];
}

export async function crawlAllSources(): Promise<CrawlResult> {
  const sources = await getEnabledSources();
  let crawled = 0;
  let inserted = 0;
  const errors: string[] = [];

  await Promise.allSettled(
    sources.map(async (source) => {
      try {
        const articles = source.rss_url
          ? await crawlRssFeed(source)
          : await scrapeHtmlFallback(source);

        crawled += articles.length;

        for (const article of articles) {
          try {
            const exists = await articleExistsByUrl(article.url);
            if (!exists) {
              await insertArticle(article);
              inserted++;
            }
          } catch (err) {
            const msg = err instanceof Error
              ? err.message
              : JSON.stringify(err);
            errors.push(`Insert failed for ${article.url}: ${msg}`);
          }
        }
      } catch (err) {
        errors.push(`Source "${source.name}" failed: ${String(err)}`);
      }
    }),
  );

  return { crawled, inserted, errors };
}

async function crawlRssFeed(
  source: Source,
): Promise<Omit<Article, 'id' | 'crawled_at'>[]> {
  const feed = await rssParser.parseURL(source.rss_url!);

  return (feed.items ?? [])
    .filter((item) => item.link && item.title)
    .map((item) => ({
      source_id:    source.id,
      title:        item.title!.trim(),
      content:      item.contentSnippet ?? item.content ?? null,
      url:          normalizeUrl(item.link!),
      published_at: item.pubDate
        ? new Date(item.pubDate).toISOString()
        : new Date().toISOString(),
      image_url:    extractImageFromItem(item),
      title_tokens: tokenizeTitle(item.title!),
    }));
}

async function scrapeHtmlFallback(
  source: Source,
): Promise<Omit<Article, 'id' | 'crawled_at'>[]> {
  const response = await fetch(source.url, {
    headers: { 'User-Agent': 'TruePost/1.0' },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${source.url}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const articles: Omit<Article, 'id' | 'crawled_at'>[] = [];
  const seen = new Set<string>();

  $('article a, h2 a, h3 a, .headline a, [class*="title"] a').each((_, el) => {
    const $el = $(el);
    const title = $el.text().trim();
    const href = $el.attr('href');

    if (!title || title.length < 20 || !href) return;

    let url: string;
    try {
      url = href.startsWith('http') ? href : new URL(href, source.url).href;
      url = normalizeUrl(url);
    } catch {
      return;
    }

    if (seen.has(url)) return;
    seen.add(url);

    articles.push({
      source_id:    source.id,
      title,
      content:      null,
      url,
      published_at: new Date().toISOString(),
      image_url:    null,
      title_tokens: tokenizeTitle(title),
    });
  });

  return articles.slice(0, 30);
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    utmParams.forEach((p) => u.searchParams.delete(p));
    return u.toString();
  } catch {
    return url;
  }
}

function extractImageFromItem(item: Parser.Item): string | null {
  if (item.enclosure?.url) return item.enclosure.url;
  if (item.content) {
    const match = item.content.match(/src="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i);
    if (match) return match[1];
  }
  return null;
}
