import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Linkedin, Instagram, Dribbble, Figma } from "./icons";
import { SectionHeading } from "./SectionHeading";
import { useState } from "react";

const info = [
  { icon: Mail, label: "Email", value: "shamirvk84@gmail.com", color: "var(--neon-purple)" },
  { icon: Phone, label: "Phone", value: "+91 82810 43875", color: "var(--neon-cyan)" },
  { icon: MapPin, label: "Location", value: "Nilambur, Malappuram, Kerala", color: "var(--neon-pink)" },
];

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="relative py-28">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Contact"
          title={<>Let's build something <span className="text-gradient-neon">unforgettable.</span></>}
          description="Tell me about your project — I usually reply within 24 hours."
        />

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            {info.map((c) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass flex items-center gap-4 rounded-2xl p-5"
              >
                <div
                  className="grid h-12 w-12 place-items-center rounded-2xl"
                  style={{ background: `linear-gradient(135deg, ${c.color}, var(--neon-blue))`, boxShadow: `0 0 24px ${c.color}` }}
                >
                  <c.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{c.label}</div>
                  <div className="font-display text-base font-semibold">{c.value}</div>
                </div>
              </motion.div>
            ))}

            <div className="glass overflow-hidden rounded-3xl p-1">
              <div className="relative h-56 w-full overflow-hidden rounded-[1.4rem]">
                <iframe
                  title="Map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-9.20%2C38.69%2C-9.10%2C38.75&layer=mapnik"
                  className="h-full w-full opacity-80 grayscale invert-[0.92] hue-rotate-180"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40" />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {[Linkedin, Dribbble, Figma, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-11 w-11 place-items-center rounded-full glass transition hover:scale-110 hover:text-[var(--neon-cyan)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              setTimeout(() => setSent(false), 3000);
            }}
            className="glass-strong relative overflow-hidden rounded-3xl p-7 sm:p-9"
          >
            <div className="pointer-events-none absolute -top-32 -right-32 h-64 w-64 rounded-full bg-[var(--neon-purple)] opacity-30 blur-3xl" />
            <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Your name" placeholder="Ada Lovelace" />
              <Field label="Email" type="email" placeholder="ada@studio.com" />
              <Field label="Subject" placeholder="Brand identity for…" className="sm:col-span-2" />
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">Message</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tell me about your project, timeline and budget…"
                  className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[var(--neon-purple)] focus:bg-white/10 focus:ring-2 focus:ring-[var(--neon-purple)]/40"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-neon)] px-6 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-glow-purple)] transition hover:scale-[1.01] sm:w-auto"
            >
              {sent ? "Sent! 🎉" : (<>Send Message <Send className="h-4 w-4" /></>)}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, className = "", ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className={className}>
      <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <input
        required
        {...rest}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[var(--neon-purple)] focus:bg-white/10 focus:ring-2 focus:ring-[var(--neon-purple)]/40"
      />
    </div>
  );
}
