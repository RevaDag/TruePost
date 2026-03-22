-- ============================================================
-- TruePost Database Schema
-- Run this in the Supabase SQL editor
-- ============================================================

-- SOURCES: The news outlets we crawl
CREATE TABLE sources (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  url        TEXT NOT NULL,
  rss_url    TEXT,
  language   TEXT NOT NULL DEFAULT 'en',
  enabled    BOOLEAN NOT NULL DEFAULT true,
  logo_url   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ARTICLES: Individual articles crawled from sources
CREATE TABLE articles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id     UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  content       TEXT,
  url           TEXT NOT NULL UNIQUE,
  published_at  TIMESTAMPTZ,
  crawled_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  image_url     TEXT,
  title_tokens  TEXT[]
);

CREATE INDEX idx_articles_source_id    ON articles(source_id);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);

-- STORIES: Clusters of articles about the same event
CREATE TABLE stories (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                     TEXT NOT NULL,
  first_seen_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_count              INTEGER NOT NULL DEFAULT 1,
  representative_article_id UUID REFERENCES articles(id) ON DELETE SET NULL
);

CREATE INDEX idx_stories_source_count ON stories(source_count DESC);
CREATE INDEX idx_stories_updated_at   ON stories(updated_at DESC);

-- STORY_ARTICLES: Join table linking articles to stories
CREATE TABLE story_articles (
  story_id   UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  PRIMARY KEY (story_id, article_id)
);

CREATE INDEX idx_story_articles_story_id   ON story_articles(story_id);
CREATE INDEX idx_story_articles_article_id ON story_articles(article_id);

-- ============================================================
-- SEED DATA: Pre-configured news sources
-- ============================================================
INSERT INTO sources (name, url, rss_url, language, logo_url) VALUES
  ('Times of Israel',    'https://www.timesofisrael.com',              'https://www.timesofisrael.com/feed/',                              'en', '/logos/toi.svg'),
  ('Jerusalem Post',     'https://www.jpost.com',                      'https://www.jpost.com/rss/rssfeedsheadlines.aspx',                 'en', '/logos/jpost.svg'),
  ('Haaretz',            'https://www.haaretz.com',                    'https://www.haaretz.com/cmlink/1.628765',                          'en', '/logos/haaretz.svg'),
  ('Ynet News',          'https://www.ynetnews.com',                   'https://www.ynetnews.com/Integration/StoryRss2.xml',               'en', '/logos/ynet.svg'),
  ('i24 News',           'https://www.i24news.tv/en',                  'https://www.i24news.tv/en/rss',                                    'en', '/logos/i24.svg'),
  ('Arutz Sheva',        'https://www.israelnationalnews.com',         'https://www.israelnationalnews.com/rss.aspx',                      'en', '/logos/arutz.svg'),
  ('Al Jazeera',         'https://www.aljazeera.com',                  'https://www.aljazeera.com/xml/rss/all.xml',                        'en', '/logos/aljazeera.svg'),
  ('BBC Middle East',    'https://www.bbc.com/news/world/middle_east', 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml',          'en', '/logos/bbc.svg'),
  ('Reuters',            'https://www.reuters.com/world',              'https://feeds.reuters.com/reuters/worldNews',                      'en', '/logos/reuters.svg'),
  ('N12',                'https://www.mako.co.il',                     'https://www.mako.co.il/rss',                                       'he', '/logos/n12.svg'),
  ('13TV',               'https://13tv.co.il',                         NULL,                                                               'he', '/logos/13tv.svg'),
  ('C14',                'https://www.c14.co.il',                      NULL,                                                               'he', '/logos/c14.svg');

-- ============================================================
-- ROW LEVEL SECURITY (public read-only)
-- ============================================================
ALTER TABLE sources        ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read sources"        ON sources        FOR SELECT USING (true);
CREATE POLICY "Public read articles"       ON articles       FOR SELECT USING (true);
CREATE POLICY "Public read stories"        ON stories        FOR SELECT USING (true);
CREATE POLICY "Public read story_articles" ON story_articles FOR SELECT USING (true);
