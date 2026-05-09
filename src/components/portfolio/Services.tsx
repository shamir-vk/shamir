import { motion } from "framer-motion";
import { Palette, Sparkles, Share2, Package, Layout, Newspaper } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const services = [
  { icon: Palette, title: "Logo Design", desc: "Distinctive marks engineered for longevity, scale and meaning.", grad: "var(--gradient-neon)" },
  { icon: Sparkles, title: "Brand Identity", desc: "Full visual systems: typography, color, voice, guidelines.", grad: "var(--gradient-pink)" },
  { icon: Share2, title: "Social Media Design", desc: "Scroll-stopping content systems built for consistency.", grad: "var(--gradient-cyan)" },
  { icon: Package, title: "Packaging Design", desc: "Tactile, premium packaging that earns shelf space.", grad: "var(--gradient-green)" },
  { icon: Layout, title: "UI/UX Design", desc: "Interfaces that feel inevitable — clean, fast, delightful.", grad: "var(--gradient-neon)" },
  { icon: Newspaper, title: "Print Design", desc: "Editorial, brochures, posters with museum-grade craft.", grad: "var(--gradient-pink)" },
];

export function Services() {
  return (
    <section id="services" className="relative py-28">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="What I do"
          title={<>Premium services, <span className="text-gradient-neon">crafted end-to-end.</span></>}
          description="A focused suite of design services for brands that refuse to look like everyone else."
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl glass p-7 transition"
            >
              <div
                className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-30 blur-3xl transition group-hover:opacity-60"
                style={{ background: s.grad }}
              />
              <div
                className="grid h-14 w-14 place-items-center rounded-2xl text-white shadow-lg"
                style={{ backgroundImage: s.grad }}
              >
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground transition group-hover:text-foreground">
                Learn more
                <span className="transition group-hover:translate-x-1">→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
