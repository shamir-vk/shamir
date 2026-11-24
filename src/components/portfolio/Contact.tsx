import { Mail, Phone, MapPin, Send, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { portfolioQuery } from '@/lib/portfolio-query';
import { sendContact } from '@/lib/portfolio.functions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SectionHeading } from './SectionHeading';

export function Contact() {
  const { data } = useSuspenseQuery(portfolioQuery);
  const send = useServerFn(sendContact);
  const [status, setStatus] = useState('');
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const info = [{ icon: Mail, label: 'Email', value: data.contact.email, href: `mailto:${data.contact.email}` }, { icon: Phone, label: 'Phone', value: data.contact.phone, href: `tel:${data.contact.phone}` }, { icon: MapPin, label: 'Location', value: data.contact.location }];
  const socials = Object.entries(data.contact.social_links).filter(([, url]) => Boolean(url));
  return <section id="contact" className="relative py-28"><div className="container mx-auto max-w-7xl px-6"><SectionHeading eyebrow="Contact" title={<>Let's build something <span className="text-gradient-neon">unforgettable.</span></>} description="Tell me about your project." /><div className="mt-16 grid gap-10 lg:grid-cols-2"><div className="space-y-6">{info.map(c => <div key={c.label} className="flex items-start gap-4 border-b border-border py-5"><c.icon className="size-6 shrink-0 text-neon-cyan" /><div className="min-w-0"><p className="text-xs uppercase text-muted-foreground">{c.label}</p>{c.href ? <a href={c.href} className="mt-2 block break-words font-semibold">{c.value}</a> : <p className="mt-2 break-words font-semibold">{c.value}</p>}</div></div>)}{socials.length > 0 && <nav aria-label="Social links" className="flex flex-wrap gap-x-5 gap-y-3 pt-2">{socials.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm capitalize text-muted-foreground transition hover:text-foreground">{name}<ArrowUpRight className="size-3" /></a>)}</nav>}</div><form onSubmit={async e => {
    e.preventDefault(); const form = e.currentTarget; const values = new FormData(form); setBusy(true); setStatus(''); setFailed(false);
    try { await send({ data: { name: String(values.get('name')), email: String(values.get('email')), subject: String(values.get('subject')), message: String(values.get('message')), website: String(values.get('website') ?? '') } }); setStatus('Thanks — your message has been sent successfully.'); form.reset(); } catch (error) { setFailed(true); setStatus(error instanceof Error ? error.message : 'Could not send your message. Please try again.'); } finally { setBusy(false); }
  }} className="space-y-5"><div className="grid gap-5 sm:grid-cols-2"><label className="space-y-2 text-sm">Your name<Input name="name" autoComplete="name" required maxLength={100} /></label><label className="space-y-2 text-sm">Email<Input name="email" type="email" autoComplete="email" required maxLength={255} /></label></div><label className="block space-y-2 text-sm">Subject<Input name="subject" required maxLength={160} /></label><label className="block space-y-2 text-sm">Message<Textarea name="message" required rows={6} maxLength={4000} /></label><input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" /><Button type="submit" disabled={busy} size="lg"><Send />{busy ? 'Sending…' : 'Send message'}</Button>{status && <p role={failed ? 'alert' : 'status'} className={failed ? 'text-sm text-destructive' : 'text-sm text-neon-cyan'}>{status}</p>}</form></div></div></section>;
}
