import { createServerFn, createServerOnlyFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Database } from '@/integrations/supabase/types';
import { isVerifiedOwner } from './portfolio-rules';

const publicClient = createServerOnlyFn(() => {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error('Portfolio is temporarily unavailable');
  return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => {
    const headers = new Headers(init?.headers);
    if (key.startsWith('sb_') && headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
    headers.set('apikey', key);
    return fetch(input, { ...init, headers });
  } } });
});
const authorize = createServerOnlyFn(async (client: ReturnType<typeof publicClient>, userId: string) => {
  const { data: { user }, error } = await client.auth.getUser();
  const { data: admin, error: roleError } = await client.rpc('has_role', { _user_id: userId, _role: 'admin' });
  if (error || roleError || !isVerifiedOwner(user, admin === true)) throw new Error('Only the verified portfolio owner can access this area.');
});
const signedProjects = createServerOnlyFn(async (client: ReturnType<typeof publicClient>) => {
  const { data, error } = await client.from('portfolio_projects').select('*').order('sort_order').order('created_at');
  if (error) throw new Error('Could not load projects');
  return Promise.all((data ?? []).map(async p => {
    let display_url = p.media_url;
    if (p.media_url.startsWith('storage:')) {
      const result = await client.storage.from('portfolio-work').createSignedUrl(p.media_url.slice(8), 3600);
      if (result.error) throw new Error('Could not load project media');
      display_url = result.data.signedUrl;
    }
    return { ...p, display_url };
  }));
});
export const getPortfolio = createServerFn({ method: 'GET' }).handler(async () => {
  const client = publicClient();
  const [projects, contact] = await Promise.all([signedProjects(client), client.from('portfolio_contact_settings').select('email,phone,location').eq('id', 1).single()]);
  if (contact.error) throw new Error('Could not load contact details');
  return { projects, contact: contact.data };
});
export const getAdminData = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  await authorize(context.supabase, context.userId);
  const [projects, contact, messages] = await Promise.all([signedProjects(context.supabase), context.supabase.from('portfolio_contact_settings').select('*').eq('id', 1).single(), context.supabase.from('portfolio_contact_submissions').select('*').order('created_at', { ascending: false })]);
  if (contact.error || messages.error) throw new Error('Could not load admin data');
  return { projects, contact: contact.data, messages: messages.data };
});
const projectSchema = z.object({ id: z.string().uuid().optional(), title: z.string().trim().min(1).max(150), category: z.string().trim().min(1).max(100), description: z.string().max(20000), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160), media_url: z.string().refine(v => /^storage:[a-zA-Z0-9/_.-]+$/.test(v) || v.startsWith('https://')), media_type: z.enum(['image', 'video']) });
export const saveProject = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((input: z.input<typeof projectSchema>) => projectSchema.parse(input)).handler(async ({ data, context }) => {
  await authorize(context.supabase, context.userId);
  const { id, ...values } = data;
  if (id) {
    const result = await context.supabase.from('portfolio_projects').update({ ...values, updated_at: new Date().toISOString() }).eq('id', id).select('id').single();
    if (result.error) throw new Error('Could not save project. Its page address must be unique.');
  } else {
    const { data: last } = await context.supabase.from('portfolio_projects').select('sort_order').order('sort_order', { ascending: false }).limit(1);
    const result = await context.supabase.from('portfolio_projects').insert({ ...values, sort_order: (last?.[0]?.sort_order ?? -1) + 1 });
    if (result.error) throw new Error('Could not create project. Its page address must be unique.');
  }
  return { ok: true };
});
export const deleteProject = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input)).handler(async ({ data, context }) => {
  await authorize(context.supabase, context.userId);
  const { error } = await context.supabase.from('portfolio_projects').delete().eq('id', data.id);
  if (error) throw new Error('Could not delete project');
  return { ok: true };
});
export const reorderProjects = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((input: { ids: string[] }) => z.object({ ids: z.array(z.string().uuid()) }).parse(input)).handler(async ({ data, context }) => {
  await authorize(context.supabase, context.userId);
  const { error } = await context.supabase.rpc('reorder_portfolio_projects', { _ids: data.ids });
  if (error) throw new Error('Project order changed. Refresh and try again.');
  return { ok: true };
});
export const saveContact = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((input: { email: string; phone: string; location: string }) => z.object({ email: z.string().email().max(255), phone: z.string().trim().min(1).max(50), location: z.string().trim().min(1).max(255) }).parse(input)).handler(async ({ data, context }) => {
  await authorize(context.supabase, context.userId);
  const { error } = await context.supabase.from('portfolio_contact_settings').upsert({ ...data, id: 1, updated_at: new Date().toISOString() });
  if (error) throw new Error('Could not save contact details');
  return { ok: true };
});
export const sendContact = createServerFn({ method: 'POST' }).inputValidator((input: { name: string; email: string; subject: string; message: string; website: string }) => z.object({ name: z.string().trim().min(1).max(100), email: z.string().email().max(255), subject: z.string().trim().min(1).max(160), message: z.string().trim().min(1).max(4000), website: z.string().max(0) }).parse(input)).handler(async ({ data }) => {
  const { website: _website, ...message } = data;
  const { error } = await publicClient().from('portfolio_contact_submissions').insert(message);
  if (error) throw new Error('Your message could not be sent. Please try again.');
  return { ok: true };
});
export const deleteMessage = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input)).handler(async ({ data, context }) => {
  await authorize(context.supabase, context.userId);
  const { error } = await context.supabase.from('portfolio_contact_submissions').delete().eq('id', data.id);
  if (error) throw new Error('Could not delete message');
  return { ok: true };
});
