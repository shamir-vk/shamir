import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
export const Route = createFileRoute('/auth')({ head: () => ({ meta: [{ title: 'Owner sign-in — Shamir VK' }, { name: 'description', content: 'Secure portfolio owner sign-in.' }, { property: 'og:title', content: 'Owner sign-in — Shamir VK' }, { property: 'og:description', content: 'Secure portfolio owner sign-in.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }, { name: 'robots', content: 'noindex' }] }), component: Auth });
function Auth() {
  const navigate = useNavigate();
  const [signup, setSignup] = useState(false); const [busy, setBusy] = useState(false); const [status, setStatus] = useState('');
  return <main className="flex min-h-screen items-center justify-center px-6"><div className="w-full max-w-md"><Button asChild variant="ghost" className="mb-10"><Link to="/"><ArrowLeft />Portfolio</Link></Button><ShieldCheck className="mb-5 size-10 text-neon-cyan" /><h1 className="text-3xl font-semibold">{signup ? 'Create owner account' : 'Welcome back, Shamir'}</h1><p className="mt-3 text-sm text-muted-foreground">Portfolio administration</p><form className="mt-8 space-y-5" onSubmit={async e => {
    e.preventDefault(); setBusy(true); setStatus(''); const values = new FormData(e.currentTarget); const email = String(values.get('email')); const password = String(values.get('password'));
    try { if (signup) { const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth` } }); if (error) throw error; setStatus('Check your email and confirm your account before signing in.'); } else { const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error; await navigate({ to: '/admin' }); } } catch (error) { setStatus(error instanceof Error ? error.message : 'Sign-in failed'); } finally { setBusy(false); }
  }}><label className="block space-y-2 text-sm">Email<Input type="email" name="email" required autoComplete="email" /></label><label className="block space-y-2 text-sm">Password<Input type="password" name="password" required minLength={8} autoComplete={signup ? 'new-password' : 'current-password'} /></label><Button type="submit" disabled={busy} className="w-full">{busy ? 'Please wait…' : signup ? 'Create account' : 'Sign in'}</Button></form><Button variant="link" className="mt-4 px-0" onClick={() => { setSignup(!signup); setStatus(''); }}>{signup ? 'Already have an account? Sign in' : 'Create owner account'}</Button>{status && <p role="status" className="mt-4 text-sm text-neon-cyan">{status}</p>}</div></main>;
}
