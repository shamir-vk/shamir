import { motion } from "framer-motion";
import { ArrowDown, Download, Sparkles } from "lucide-react";
import { Linkedin, Instagram, Dribbble, Figma } from "./icons";
import profile from "@/assets/profile.jpg";

const skills = ["Branding", "Social Media Design", "Logo Design", "UI Design", "Print Design"];

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center pt-32 pb-20">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 lg:grid-cols-[1.15fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--neon-green)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--neon-green)]" />
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[var(--neon-cyan)]" />
            Available for Freelance Work
          </div>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Hi, I'm <span className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl bg-stone-300/0">Shamir VK</span>
            <br />
            <span className="text-muted-foreground">Crafting brands that</span>
            <br />
            <span className="text-gradient-neon">glow in the dark.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Graphic Designer & Visual Creator with 5+ years turning ambitious ideas into
            unforgettable visual identities — from luxury packaging to scroll-stopping social.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s}
                className="glass rounded-full px-3.5 py-1.5 text-xs font-medium text-foreground/80"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-neon)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-glow-purple)] transition hover:scale-[1.03]"
            >
              View My Work
              <ArrowDown className="h-4 w-4 transition group-hover:translate-y-0.5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full glass-strong px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Follow</span>
            <div className="h-px w-10 bg-border" />
            {[
              { Icon: Linkedin, href: "#" },
              { Icon: Dribbble, href: "#" },
              { Icon: Figma, href: "#" },
              { Icon: Instagram, href: "#" },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="grid h-10 w-10 place-items-center rounded-full glass transition hover:scale-110 hover:text-[var(--neon-cyan)]"
                aria-label="social"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="absolute -inset-6 rounded-[2.5rem] bg-[image:var(--gradient-neon)] opacity-30 blur-3xl" />
          <div className="relative glass-strong rounded-[2rem] p-3 neon-border">
            <div className="overflow-hidden rounded-[1.5rem]">
              <img
                src={profile}
                alt="Shamir VK, graphic designer"
                width={896}
                height={1152}
                className="h-auto w-full transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="absolute -top-3 -left-3 h-12 w-12 rounded-tl-2xl border-t-2 border-l-2 border-[var(--neon-pink)] glow-purple" />
            <div className="absolute -top-3 -right-3 h-12 w-12 rounded-tr-2xl border-t-2 border-r-2 border-[var(--neon-cyan)] glow-cyan" />
            <div className="absolute -bottom-3 -left-3 h-12 w-12 rounded-bl-2xl border-b-2 border-l-2 border-[var(--neon-cyan)] glow-cyan" />
            <div className="absolute -bottom-3 -right-3 h-12 w-12 rounded-br-2xl border-b-2 border-r-2 border-[var(--neon-pink)] glow-purple" />

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass-strong rounded-2xl px-5 py-3 text-center">
              <div className="text-xs text-muted-foreground">Based in</div>
              <div className="font-display text-sm font-semibold">Nilambur, Kerala 🌎</div>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-6 top-12 glass rounded-2xl px-4 py-3 text-xs"
          >
            <div className="font-display text-lg text-gradient-neon">5+</div>
            <div className="text-muted-foreground">Years exp.</div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-6 bottom-24 glass rounded-2xl px-4 py-3 text-xs"
          >
            <div className="font-display text-lg text-gradient-neon">50+</div>
            <div className="text-muted-foreground">Projects</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
