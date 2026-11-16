import { useSuspenseQuery } from '@tanstack/react-query';
import { portfolioQuery } from '@/lib/portfolio-query';
import { SectionHeading } from './SectionHeading';
import { ProjectGrid } from './ProjectGrid';
export function Work() {
  const { data } = useSuspenseQuery(portfolioQuery);
  return <section id="work" className="relative py-28"><div className="container mx-auto max-w-7xl px-6"><SectionHeading eyebrow="Featured Work" title={<>Recent <span className="text-gradient-neon">case studies.</span></>} description="A handpicked selection of recent collaborations across branding, packaging and digital." /><div className="mt-14"><ProjectGrid projects={data.projects} /></div></div></section>;
}
