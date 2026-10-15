import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import a1 from "@/assets/congratulations_poster_malayalam.png.asset.json";
import a2 from "@/assets/adab_Logo_Design.png.asset.json";
import a3 from "@/assets/321ed6a328506436770c47bedf5f33cf_720w.mp4.asset.json";
import a4 from "@/assets/915ed8d36d3809d160b1bfef232bfd90_720w.mp4.asset.json";
import a5 from "@/assets/ChatGPT_Image_Oct_15_2026_10_47_04_AM.png.asset.json";
import a6 from "@/assets/poster_mockup_design.jpg.asset.json";

const projects: { img: string; video?: boolean; title: string; category: string; desc: string }[] = [
  { img: a1.url, title: "Poster design", category: "ADOBE PHOTOSHOP", desc: "Congratulations,programes,greeting soical media designs" },
  { img: a2.url, title: "Logo", category: "ADOBE ILLUSTRATOR", desc: "A minimalist geometric logo identity crafted with bold shapes, clean lines, and a modern visual language" },
  { img: a3.url, video: true, title: "Content Video", category: "CAPCUT", desc: "They use visuals, text, music, and editing to attract viewers on social media platforms." },
  { img: a4.url, video: true, title: "Animation video", category: "ADOBE AFTER EFFECT", desc: "Animation videos use moving images, characters, and visual effects to tell stories or explain ideas." },
  { img: a5.url, title: "Memento Design", category: "PRINT DESIGN", desc: "Memento design is a creative design made to preserve memories of special moments and events" },
  { img: a6.url, title: "Mockup Design", category: "CHAT GPT", desc: "Mockup design is a realistic presentation of a design on products like T-shirts, posters, packaging, or devices." },
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
                {p.video ? (
                  <video
                    src={p.img}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <img
                    src={p.img}
                    alt={p.title}
                    width={1024}
                    height={768}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
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
