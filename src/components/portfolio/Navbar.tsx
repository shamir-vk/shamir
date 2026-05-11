import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#skills", label: "Skills" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2"
    >
      <nav
        className={`flex items-center justify-between rounded-full px-4 py-2.5 transition-all sm:px-6 ${
          scrolled ? "glass-strong" : "glass"
        }`}
      >
        <a href="#home" className="flex items-center gap-2 px-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[image:var(--gradient-neon)] font-display text-sm font-bold">
            A
          </span>
          <span className="font-display text-sm font-semibold tracking-tight">Shamir<span className="text-gradient-neon">.vk</span></span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="rounded-full bg-[image:var(--gradient-neon)] px-4 py-2 text-sm font-medium text-white shadow-[var(--shadow-glow-purple)] transition hover:scale-[1.03]"
        >
          Hire me
        </a>
      </nav>
    </motion.header>
  );
}
