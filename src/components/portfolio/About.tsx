import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import profile from "@/assets/profile.jpg";

const stats = [
  { value: 50, suffix: "+", label: "Projects Completed", grad: "var(--gradient-neon)" },
  { value: 30, suffix: "+", label: "Happy Clients", grad: "var(--gradient-pink)" },
  { value: 5, suffix: "+", label: "Years Experience", grad: "var(--gradient-cyan)" },
  { value: 100, suffix: "%", label: "Client Satisfaction", grad: "var(--gradient-green)" },
];

const chips = ["Adobe Suite", "Figma", "Branding", "Type Design", "Art Direction", "Motion", "3D Mockups"];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const start = performance.now();
      const dur = 1400;
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.disconnect();
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <section id="about" className="relative py-28">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[image:var(--gradient-neon)]" />
            About me
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Designing the <span className="text-gradient-neon">future of brands</span>, one pixel at a time.
          </h2>
          <p className="mt-5 text-muted-foreground">
            I'm a multidisciplinary graphic designer obsessed with the intersection of art and
            technology. For half a decade I've partnered with startups, luxury houses and
            cultural institutions to build identities that feel inevitable — strategic at the
            core, magnetic on the surface.
          </p>
          <p className="mt-4 text-muted-foreground">
            My process is collaborative, research-driven and unapologetically detail-obsessed.
            Every kerning pair, every gradient stop, every grid is intentional.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {chips.map((c) => (
              <span key={c} className="glass rounded-full px-3.5 py-1.5 text-xs">
                {c}
              </span>
            ))}
          </div>
        </motion.div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80"
          >
            <div className="absolute inset-0 rounded-full bg-[image:var(--gradient-neon)] opacity-50 blur-2xl" />
            <div className="relative h-full w-full overflow-hidden rounded-full glass-strong p-2">
              <img
                src={profile}
                alt="Portrait"
                width={896}
                height={1152}
                loading="lazy"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="absolute inset-0 rounded-full border border-white/10" />
          </motion.div>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass relative overflow-hidden rounded-2xl p-5"
              >
                <div
                  className="absolute -inset-px rounded-2xl opacity-30"
                  style={{ background: s.grad, filter: "blur(20px)" }}
                />
                <div className="relative">
                  <div
                    className="font-display text-3xl font-semibold"
                    style={{ backgroundImage: s.grad, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
                  >
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
