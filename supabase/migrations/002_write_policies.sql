-- ============================================================
-- Write policies for server-side crawler (service role)
-- Run this in the Supabase SQL editor
-- ============================================================

CREATE POLICY "Allow insert articles"       ON articles       FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert stories"        ON stories        FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert story_articles" ON story_articles FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update articles"       ON articles       FOR UPDATE USING (true);
CREATE POLICY "Allow update stories"        ON stories        FOR UPDATE USING (true);
CREATE POLICY "Allow update story_articles" ON story_articles FOR UPDATE USING (true);
