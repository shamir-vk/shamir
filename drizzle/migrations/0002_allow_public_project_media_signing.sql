CREATE POLICY "Visitors can sign published project media" ON storage.objects FOR SELECT TO anon, authenticated USING (
  bucket_id = 'portfolio-work'
  AND EXISTS (
    SELECT 1 FROM public.portfolio_projects p
    WHERE p.media_url = 'storage:' || storage.objects.name
  )
);