import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";

const skills = [
  { name: "Adobe Photoshop", value: 95, grad: "var(--gradient-neon)" },
  { name: "Adobe Illustrator", value: 98, grad: "var(--gradient-pink)" },
  { name: "Adobe InDesign", value: 90, grad: "var(--gradient-cyan)" },
  { name: "Typography", value: 92, grad: "var(--gradient-green)" },
  { name: "Branding", value: 96, grad: "var(--gradient-neon)" },
  { name: "Color Theory", value: 94, grad: "var(--gradient-pink)" },
];

export function Skills() {
  return (
    <section id="skills" className="relative py-28">
      <div className="container mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Skills"
          title={<>Tools mastered, <span className="text-gradient-neon">craft refined.</span></>}
        />
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {skills.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass rounded-2xl p-5"
            >
              <div className="mb-3 flex items-baseline justify-between">
                <span className="font-display text-base font-semibold">{s.name}</span>
                <span className="font-display text-sm text-muted-foreground">{s.value}%</span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 + i * 0.05 }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundImage: s.grad, boxShadow: "0 0 20px currentColor" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
