import { useSuspenseQuery } from '@tanstack/react-query';
import { portfolioQuery } from '@/lib/portfolio-query';
import { SectionHeading } from './SectionHeading';
import { ProjectGrid } from './ProjectGrid';
export function Work() {
  const { data } = useSuspenseQuery(portfolioQuery);
  const featured = data.projects.filter((project) => project.is_featured && project.slug);
  return <section id="work" className="relative py-28"><div className="container mx-auto max-w-7xl px-6"><SectionHeading eyebrow="Featured Work" title={<>Recent <span className="text-gradient-neon">case studies.</span></>} description="A handpicked selection of recent collaborations across branding, packaging and digital." /><div className="mt-14">{featured.length ? <ProjectGrid projects={featured} /> : <p className="py-10 text-center text-muted-foreground">New work is on the way.</p>}</div></div></section>;
}
