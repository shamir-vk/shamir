ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS tools TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.portfolio_projects ADD COLUMN IF NOT EXISTS media_gallery JSONB NOT NULL DEFAULT '[]'::JSONB CHECK (jsonb_typeof(media_gallery) = 'array');
ALTER TABLE public.portfolio_contact_settings ADD COLUMN IF NOT EXISTS social_links JSONB NOT NULL DEFAULT '{}'::JSONB CHECK (jsonb_typeof(social_links) = 'object');
ALTER TABLE public.portfolio_contact_submissions ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied'));

GRANT SELECT ON public.portfolio_projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.portfolio_projects TO authenticated;
GRANT ALL ON public.portfolio_projects TO service_role;
GRANT SELECT ON public.portfolio_contact_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.portfolio_contact_settings TO authenticated;
GRANT ALL ON public.portfolio_contact_settings TO service_role;
GRANT INSERT ON public.portfolio_contact_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.portfolio_contact_submissions TO authenticated;
GRANT ALL ON public.portfolio_contact_submissions TO service_role;

DROP POLICY IF EXISTS "Portfolio projects are publicly readable" ON public.portfolio_projects;
CREATE POLICY "Published portfolio projects are publicly readable" ON public.portfolio_projects FOR SELECT TO anon, authenticated USING (is_published = TRUE);
CREATE POLICY "Admins can read all portfolio projects" ON public.portfolio_projects FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS portfolio_projects_public_order_idx ON public.portfolio_projects (is_published, is_featured, sort_order);
CREATE INDEX IF NOT EXISTS portfolio_contact_submissions_status_created_idx ON public.portfolio_contact_submissions (status, created_at DESC);

DROP POLICY IF EXISTS "Visitors can sign published project media" ON storage.objects;
CREATE POLICY "Visitors can sign published project media" ON storage.objects FOR SELECT TO anon, authenticated USING (
  bucket_id = 'portfolio-work'
  AND EXISTS (
    SELECT 1 FROM public.portfolio_projects p
    WHERE p.is_published = TRUE
      AND (
        p.media_url = 'storage:' || storage.objects.name
        OR p.media_gallery @> jsonb_build_array(jsonb_build_object('path', 'storage:' || storage.objects.name))
      )
  )
);