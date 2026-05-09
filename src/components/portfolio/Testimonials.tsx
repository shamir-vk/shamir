import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const items = [
  { name: "Mira Tanaka", role: "Founder, Lumière", quote: "Aria turned a vague idea into a brand that people actually obsess over. Pure magic.", rating: 5, color: "var(--neon-pink)" },
  { name: "Daniel Okafor", role: "CMO, Pulse", quote: "Our launch campaign hit 4× engagement. The visual system did most of the heavy lifting.", rating: 5, color: "var(--neon-cyan)" },
  { name: "Sofía Ramírez", role: "CEO, Onyx", quote: "Every detail is intentional. Packaging that customers literally photograph and post.", rating: 5, color: "var(--neon-purple)" },
];

export function Testimonials() {
  return (
    <section className="relative py-28">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Kind words"
          title={<>What <span className="text-gradient-neon">clients say.</span></>}
        />
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative rounded-3xl glass p-7"
            >
              <div className="absolute -top-6 left-7 grid h-12 w-12 place-items-center rounded-2xl glass-strong font-display text-xl text-gradient-neon">
                "
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-[var(--neon-cyan)] text-[var(--neon-cyan)]" style={{ filter: "drop-shadow(0 0 6px var(--neon-cyan))" }} />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div
                  className="grid h-11 w-11 place-items-center rounded-full font-display font-semibold text-white"
                  style={{ background: `linear-gradient(135deg, ${t.color}, var(--neon-blue))` }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-display text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
