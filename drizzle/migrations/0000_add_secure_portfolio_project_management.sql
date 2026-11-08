CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;

CREATE TABLE public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.portfolio_projects TO authenticated;
GRANT ALL ON public.portfolio_projects TO service_role;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Portfolio projects are publicly readable" ON public.portfolio_projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can add portfolio projects" ON public.portfolio_projects FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can edit portfolio projects" ON public.portfolio_projects FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete portfolio projects" ON public.portfolio_projects FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX portfolio_projects_sort_order_idx ON public.portfolio_projects (sort_order, created_at, id);

CREATE OR REPLACE FUNCTION public.create_profile_for_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'display_name', ''), split_part(COALESCE(NEW.email, ''), '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.create_profile_for_auth_user() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER on_auth_user_created_create_profile
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.create_profile_for_auth_user();

CREATE OR REPLACE FUNCTION public.sync_verified_portfolio_owner_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL AND lower(COALESCE(NEW.email, '')) = 'shamirkarulai177@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    DELETE FROM public.user_roles
    WHERE user_id = NEW.id AND role = 'admin';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.sync_verified_portfolio_owner_role() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER on_auth_user_verified_email_sync_portfolio_owner_role
AFTER INSERT OR UPDATE OF email, email_confirmed_at ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.sync_verified_portfolio_owner_role();

CREATE OR REPLACE FUNCTION public.reorder_portfolio_projects(_ids UUID[])
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requested_count INTEGER;
  actual_count INTEGER;
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  requested_count := COALESCE(array_length(_ids, 1), 0);
  SELECT count(*) INTO actual_count FROM public.portfolio_projects;
  IF requested_count <> actual_count
     OR (SELECT count(DISTINCT item_id) FROM unnest(_ids) AS item_id) <> requested_count
     OR EXISTS (SELECT 1 FROM public.portfolio_projects p WHERE NOT (p.id = ANY(_ids)))
     OR EXISTS (SELECT 1 FROM unnest(_ids) AS item_id WHERE NOT EXISTS (SELECT 1 FROM public.portfolio_projects p WHERE p.id = item_id)) THEN
    RAISE EXCEPTION 'Project order must include every current project exactly once';
  END IF;
  UPDATE public.portfolio_projects AS p
  SET sort_order = ordered.position - 1, updated_at = now()
  FROM unnest(_ids) WITH ORDINALITY AS ordered(project_id, position)
  WHERE p.id = ordered.project_id;
END;
$$;
REVOKE ALL ON FUNCTION public.reorder_portfolio_projects(UUID[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reorder_portfolio_projects(UUID[]) TO authenticated, service_role;

CREATE POLICY "Portfolio media can be viewed publicly" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'portfolio-work');
CREATE POLICY "Portfolio admins can upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-work' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Portfolio admins can update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-work' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'portfolio-work' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Portfolio admins can delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-work' AND public.has_role(auth.uid(), 'admin'));
