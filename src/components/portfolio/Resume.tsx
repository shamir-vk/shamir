import { motion } from "framer-motion";
import { Download, GraduationCap, Award, Briefcase, Trophy } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const items = [
  { icon: Briefcase, year: "2023 — Now", title: "Senior Brand Designer", place: "Independent · Kerala", color: "var(--neon-purple)" },
  { icon: Briefcase, year: "2021 — 2023", title: "Lead Designer", place: "Studio Northern, Berlin", color: "var(--neon-blue)" },
  { icon: GraduationCap, year: "2019 — 2021", title: "MA Visual Communication", place: "Royal College of Art", color: "var(--neon-cyan)" },
  { icon: Award, year: "2022", title: "Awwwards Site of the Day", place: "Pulse Brand Launch", color: "var(--neon-pink)" },
  { icon: Trophy, year: "2024", title: "Brand New — Notable", place: "Onyx Identity Refresh", color: "var(--neon-green)" },
];

export function Resume() {
  return (
    <section className="relative py-28">
      <div className="container mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow="Resume"
          title={<>A short <span className="text-gradient-neon">timeline.</span></>}
        />

        <div className="relative mt-16">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--neon-purple)] via-[var(--neon-cyan)] to-transparent md:left-1/2" />
          <ul className="space-y-10">
            {items.map((it, i) => (
              <motion.li
                key={it.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={`relative md:grid md:grid-cols-2 md:gap-12 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div className={`pl-14 md:pl-0 ${i % 2 ? "md:pl-12 md:text-left" : "md:pr-12 md:text-right"}`}>
                  <div className="glass rounded-2xl p-5">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{it.year}</span>
                    <h3 className="mt-2 font-display text-lg font-semibold">{it.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{it.place}</p>
                  </div>
                </div>
                <div className="absolute left-0 top-3 grid h-10 w-10 place-items-center rounded-full glass-strong md:left-1/2 md:-translate-x-1/2"
                     style={{ boxShadow: `0 0 20px ${it.color}` }}>
                  <it.icon className="h-4 w-4" style={{ color: it.color }} />
                </div>
                <div className="hidden md:block" />
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="mt-14 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-neon)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-glow-purple)] transition hover:scale-[1.03]"
          >
            <Download className="h-4 w-4" />
            Download Full CV
          </a>
        </div>
      </div>
    </section>
  );
}
