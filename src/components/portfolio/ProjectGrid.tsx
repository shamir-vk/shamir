import { Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import type { PortfolioProject } from '@/lib/portfolio-query';
export function ProjectGrid({ projects }: { projects: PortfolioProject[] }) {
  return <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{projects.filter(p => p.slug).map(p => <Link key={p.id} to="/work/$slug" params={{ slug: p.slug }} className="group overflow-hidden rounded-lg glass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
    <div className="relative aspect-[4/3] overflow-hidden bg-surface">{p.media_type === 'video' ? <video src={p.display_url} muted loop autoPlay playsInline className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <img src={p.display_url} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}<span className="absolute left-4 top-4 rounded-full glass-strong px-3 py-1 text-xs">{p.category}</span></div>
    <div className="p-5"><div className="flex items-center justify-between gap-3"><h3 className="text-lg font-semibold">{p.title}</h3><ArrowUpRight className="size-5 text-neon-cyan" /></div><p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p></div>
  </Link>)}</div>;
}
