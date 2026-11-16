import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { portfolioQuery } from '@/lib/portfolio-query';
import { ProjectGrid } from '@/components/portfolio/ProjectGrid';
import { Button } from '@/components/ui/button';
export const Route = createFileRoute('/work/$slug')({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(portfolioQuery);
    const project = data.projects.find(p => p.slug === params.slug);
    if (!project) throw notFound();
    return project;
  },
  head: ({ loaderData: p }) => ({ meta: [
    { title: p ? `${p.title} — Shamir VK` : 'Project unavailable — Shamir VK' },
    { name: 'description', content: p?.description ?? 'Explore the design portfolio of Shamir VK.' },
    { property: 'og:title', content: p ? `${p.title} — Shamir VK` : 'Project unavailable — Shamir VK' },
    { property: 'og:description', content: p?.description ?? 'Explore the design portfolio of Shamir VK.' },
    { property: 'og:type', content: 'article' }, { name: 'twitter:card', content: 'summary_large_image' },
    ...(p?.media_type === 'image' && p.display_url.startsWith('https://') ? [{ property: 'og:image', content: p.display_url }, { name: 'twitter:image', content: p.display_url }] : []),
  ] }),
  component: ProjectPage,
});
function ProjectPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(portfolioQuery);
  const p = data.projects.find(project => project.slug === slug);
  if (!p) return null;
  const related = data.projects.filter(item => item.id !== p.id).sort((a, b) => Number(b.category === p.category) - Number(a.category === p.category)).slice(0, 3);
  return <main className="mx-auto max-w-7xl px-6 py-8"><header className="flex items-center justify-between border-b border-border pb-6"><Link to="/" className="font-display text-lg font-semibold">Shamir<span className="text-neon-cyan">.vk</span></Link><Button asChild variant="ghost"><Link to="/" hash="work"><ArrowLeft />All work</Link></Button></header><div className="py-12"><p className="text-sm text-neon-cyan">{p.category}</p><h1 className="mt-3 break-words text-4xl font-semibold sm:text-5xl">{p.title}</h1><p className="mt-5 max-w-3xl whitespace-pre-wrap break-words text-muted-foreground">{p.description}</p></div><div className="flex min-h-64 justify-center bg-surface">{p.media_type === 'video' ? <video src={p.display_url} controls playsInline className="max-h-[80vh] w-full object-contain" /> : <img src={p.display_url} alt={p.title} className="max-h-[100vh] w-full object-contain" />}</div><section className="py-16"><h2 className="mb-8 text-2xl font-semibold">Related work</h2><ProjectGrid projects={related} /></section></main>;
}
