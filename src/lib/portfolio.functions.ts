import { createServerFn, createServerOnlyFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Database } from '@/integrations/supabase/types';
import { isVerifiedOwner, MESSAGE_STATUSES } from './portfolio-rules';

const publicClient = createServerOnlyFn(() => {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error('Portfolio is temporarily unavailable');
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
        headers.set('apikey', key);
        return fetch(input, { ...init, headers });
      },
    },
  });
});

const authorize = createServerOnlyFn(async (client: ReturnType<typeof publicClient>, userId: string) => {
  const [{ data: { user }, error }, { data: admin, error: roleError }] = await Promise.all([
    client.auth.getUser(),
    client.rpc('has_role', { _user_id: userId, _role: 'admin' }),
  ]);
  if (error || roleError || !isVerifiedOwner(user, admin === true)) {
    throw new Error('Only the verified portfolio owner can access this area.');
  }
});

const mediaItemSchema = z.object({ path: z.string().trim().min(1).max(2048), type: z.enum(['image', 'video']) });
const gallerySchema = z.array(mediaItemSchema);
const mediaUrlSchema = z.string().trim().min(1).max(2048).refine((value) => {
  if (/^storage:[a-zA-Z0-9/_.-]+$/.test(value) && !value.includes('..')) return true;
  if (value.startsWith('/__l5e/assets-v1/')) return true;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}, 'Choose a secure media address.');
const socialLinksSchema = z.object({
  instagram: z.string().trim().max(500).default(''),
  linkedin: z.string().trim().max(500).default(''),
  behance: z.string().trim().max(500).default(''),
  dribbble: z.string().trim().max(500).default(''),
  website: z.string().trim().max(500).default(''),
}).superRefine((links, ctx) => {
  for (const [key, value] of Object.entries(links)) {
    if (!value) continue;
    try {
      if (new URL(value).protocol !== 'https:') throw new Error('invalid');
    } catch {
      ctx.addIssue({ code: 'custom', path: [key], message: 'Social links must use secure https:// addresses.' });
    }
  }
});
const messageStatusSchema = z.enum(MESSAGE_STATUSES);

const resolveMediaUrl = createServerOnlyFn(async (client: ReturnType<typeof publicClient>, path: string) => {
  if (!path.startsWith('storage:')) return path;
  const result = await client.storage.from('portfolio-work').createSignedUrl(path.slice(8), 3600);
  if (result.error) throw new Error('Could not load project media');
  return result.data.signedUrl;
});

const signedProjects = createServerOnlyFn(async (client: ReturnType<typeof publicClient>, publishedOnly = false) => {
  let query = client.from('portfolio_projects').select('*').order('sort_order').order('created_at');
  if (publishedOnly) query = query.eq('is_published', true);
  const { data, error } = await query;
  if (error) throw new Error('Could not load projects');
  return Promise.all((data ?? []).map(async (project) => {
    const parsedGallery = gallerySchema.safeParse(project.media_gallery);
    const gallery = parsedGallery.success ? parsedGallery.data : [];
    const [display_url, media_gallery] = await Promise.all([
      resolveMediaUrl(client, project.media_url),
      Promise.all(gallery.map(async (item) => ({ ...item, display_url: await resolveMediaUrl(client, item.path) }))),
    ]);
    return { ...project, media_gallery, display_url };
  }));
});

export const getPortfolio = createServerFn({ method: 'GET' }).handler(async () => {
  const client = publicClient();
  const [projects, contact] = await Promise.all([
    signedProjects(client, true),
    client.from('portfolio_contact_settings').select('email,phone,location,social_links').eq('id', 1).single(),
  ]);
  if (contact.error) throw new Error('Could not load contact details');
  return { projects, contact: { ...contact.data, social_links: socialLinksSchema.parse(contact.data.social_links) } };
});

export const getAdminData = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  await authorize(context.supabase, context.userId);
  const [projects, contact, messages] = await Promise.all([
    signedProjects(context.supabase),
    context.supabase.from('portfolio_contact_settings').select('*').eq('id', 1).single(),
    context.supabase.from('portfolio_contact_submissions').select('*').order('created_at', { ascending: false }),
  ]);
  if (contact.error || messages.error) throw new Error('Could not load admin data');
  return {
    projects,
    contact: { ...contact.data, social_links: socialLinksSchema.parse(contact.data.social_links) },
    messages: messages.data,
  };
});

const projectSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(150),
  category: z.string().trim().min(1).max(100),
  description: z.string().max(20000),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160),
  media_url: mediaUrlSchema,
  media_type: z.enum(['image', 'video']),
  media_gallery: gallerySchema.max(20),
  tools: z.array(z.string().trim().min(1).max(80)).max(20),
  is_featured: z.boolean(),
  is_published: z.boolean(),
});

function storedPaths(mediaUrl: string, galleryValue: unknown) {
  const gallery = gallerySchema.safeParse(galleryValue);
  return [mediaUrl, ...(gallery.success ? gallery.data.map((item) => item.path) : [])]
    .filter((value) => value.startsWith('storage:'));
}

const removeUnusedMedia = createServerOnlyFn(async (client: ReturnType<typeof publicClient>, candidates: string[]) => {
  const paths = [...new Set(candidates)].map((value) => value.slice(8));
  if (paths.length === 0) return;
  const { data, error } = await client.from('portfolio_projects').select('media_url,media_gallery');
  if (error) {
    console.error('Could not check for unreferenced portfolio media.');
    return;
  }
  const active = new Set(data.flatMap((project) => storedPaths(project.media_url, project.media_gallery)));
  const unused = paths.filter((path) => !active.has(`storage:${path}`));
  if (unused.length === 0) return;
  const { error: storageError } = await client.storage.from('portfolio-work').remove(unused);
  if (storageError) console.error('Could not remove unreferenced portfolio media.');
});

export const saveProject = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: z.input<typeof projectSchema>) => projectSchema.parse(input))
  .handler(async ({ data, context }) => {
    await authorize(context.supabase, context.userId);
    const { id, ...values } = data;
    if (id) {
      const { data: previous, error: previousError } = await context.supabase.from('portfolio_projects')
        .select('media_url,media_gallery').eq('id', id).single();
      if (previousError) throw new Error('Could not find the project to update.');
      const { error } = await context.supabase.from('portfolio_projects')
        .update({ ...values, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw new Error('Could not save project. Its page address must be unique.');
      const nextPaths = new Set(storedPaths(values.media_url, values.media_gallery));
      await removeUnusedMedia(context.supabase, storedPaths(previous.media_url, previous.media_gallery).filter((path) => !nextPaths.has(path)));
    } else {
      const { data: last } = await context.supabase.from('portfolio_projects').select('sort_order').order('sort_order', { ascending: false }).limit(1);
      const { error } = await context.supabase.from('portfolio_projects').insert({ ...values, sort_order: (last?.[0]?.sort_order ?? -1) + 1 });
      if (error) throw new Error('Could not create project. Its page address must be unique.');
    }
    return { ok: true };
  });

export const deleteProject = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await authorize(context.supabase, context.userId);
    const { data: project, error: readError } = await context.supabase.from('portfolio_projects')
      .select('media_url,media_gallery').eq('id', data.id).single();
    if (readError) throw new Error('Could not find the project to delete.');
    const { error } = await context.supabase.from('portfolio_projects').delete().eq('id', data.id);
    if (error) throw new Error('Could not delete project');
    await removeUnusedMedia(context.supabase, storedPaths(project.media_url, project.media_gallery));
    return { ok: true };
  });

export const reorderProjects = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator((input: { ids: string[] }) => z.object({ ids: z.array(z.string().uuid()).max(500) }).parse(input))
  .handler(async ({ data, context }) => {
    await authorize(context.supabase, context.userId);
    const { error } = await context.supabase.rpc('reorder_portfolio_projects', { _ids: data.ids });
    if (error) throw new Error('Project order changed. Refresh and try again.');
    return { ok: true };
  });

export const saveContact = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator((input: { email: string; phone: string; location: string; social_links: z.input<typeof socialLinksSchema> }) => z.object({
    email: z.string().email().max(255),
    phone: z.string().trim().min(1).max(50),
    location: z.string().trim().min(1).max(255),
    social_links: socialLinksSchema,
  }).parse(input))
  .handler(async ({ data, context }) => {
    await authorize(context.supabase, context.userId);
    const { error } = await context.supabase.from('portfolio_contact_settings').upsert({ ...data, id: 1, updated_at: new Date().toISOString() });
    if (error) throw new Error('Could not save contact details');
    return { ok: true };
  });

export const sendContact = createServerFn({ method: 'POST' })
  .inputValidator((input: { name: string; email: string; subject: string; message: string; website: string }) => z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().email().max(255),
    subject: z.string().trim().min(1).max(160),
    message: z.string().trim().min(1).max(4000),
    website: z.string().max(0),
  }).parse(input))
  .handler(async ({ data }) => {
    const { website: _website, ...message } = data;
    const { error } = await publicClient().from('portfolio_contact_submissions').insert(message);
    if (error) throw new Error('Your message could not be sent. Please try again.');
    return { ok: true };
  });

export const updateMessageStatus = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: string }) => z.object({ id: z.string().uuid(), status: messageStatusSchema }).parse(input))
  .handler(async ({ data, context }) => {
    await authorize(context.supabase, context.userId);
    const { error } = await context.supabase.from('portfolio_contact_submissions').update({ status: data.status }).eq('id', data.id);
    if (error) throw new Error('Could not update message status');
    return { ok: true };
  });

export const deleteMessage = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await authorize(context.supabase, context.userId);
    const { error } = await context.supabase.from('portfolio_contact_submissions').delete().eq('id', data.id);
    if (error) throw new Error('Could not delete message');
    return { ok: true };
  });
