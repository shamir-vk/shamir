import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import p5 from "@/assets/project-5.jpg";
import p6 from "@/assets/project-6.jpg";

const projects = [
  { img: p1, title: "Lumière Identity", category: "Branding", desc: "A holographic identity for a boutique perfumery brand." },
  { img: p2, title: "Pulse Social Kit", category: "Social Media", desc: "90-day content system for a fintech launch." },
  { img: p3, title: "Onyx Packaging", category: "Packaging", desc: "Premium unboxing for a luxury skincare line." },
  { img: p4, title: "Aether Dashboard", category: "UI Design", desc: "Glassmorphism analytics dashboard for SaaS." },
  { img: p5, title: "Fold Magazine", category: "Print Design", desc: "Editorial system for a quarterly culture mag." },
  { img: p6, title: "Hex Mark", category: "Branding", desc: "Geometric monogram for a Web3 collective." },
];

export function Work() {
  return (
    <section id="work" className="relative py-28">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Featured Work"
          title={<>Recent <span className="text-gradient-neon">case studies.</span></>}
          description="A handpicked selection of recent collaborations across branding, packaging and digital."
        />
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-3xl glass p-3"
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={p.img}
                  alt={p.title}
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                  <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black">
                    View Case Study
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="absolute left-4 top-4 rounded-full glass-strong px-3 py-1 text-[10px] font-medium uppercase tracking-wider">
                  {p.category}
                </span>
              </div>
              <div className="px-3 pb-3 pt-4">
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
