ALTER TABLE public.portfolio_projects ADD COLUMN slug TEXT;
CREATE UNIQUE INDEX portfolio_projects_slug_unique_idx ON public.portfolio_projects (slug) WHERE slug IS NOT NULL;

CREATE TABLE public.portfolio_contact_settings (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_contact_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.portfolio_contact_settings TO authenticated;
GRANT ALL ON public.portfolio_contact_settings TO service_role;
ALTER TABLE public.portfolio_contact_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Portfolio contact details are publicly readable" ON public.portfolio_contact_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can create portfolio contact details" ON public.portfolio_contact_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can edit portfolio contact details" ON public.portfolio_contact_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.portfolio_contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 100),
  email TEXT NOT NULL CHECK (char_length(email) <= 255),
  subject TEXT NOT NULL CHECK (char_length(btrim(subject)) BETWEEN 1 AND 160),
  message TEXT NOT NULL CHECK (char_length(btrim(message)) BETWEEN 1 AND 4000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.portfolio_contact_submissions TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.portfolio_contact_submissions TO authenticated;
GRANT ALL ON public.portfolio_contact_submissions TO service_role;
ALTER TABLE public.portfolio_contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can send valid contact messages" ON public.portfolio_contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (
  char_length(btrim(name)) BETWEEN 1 AND 100
  AND email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  AND char_length(email) <= 255
  AND char_length(btrim(subject)) BETWEEN 1 AND 160
  AND char_length(btrim(message)) BETWEEN 1 AND 4000
);
CREATE POLICY "Admins can read contact messages" ON public.portfolio_contact_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact messages" ON public.portfolio_contact_submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete contact messages" ON public.portfolio_contact_submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX portfolio_contact_submissions_created_at_idx ON public.portfolio_contact_submissions (created_at DESC);

DROP POLICY "Portfolio media can be viewed publicly" ON storage.objects;
CREATE POLICY "Portfolio admins can read media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'portfolio-work' AND public.has_role(auth.uid(), 'admin'));