import { Linkedin, Instagram, Dribbble, Figma } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12">
      <div className="container mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3 md:items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-neon)] font-display font-bold">A</span>
            <span className="font-display text-lg font-semibold">Aria<span className="text-gradient-neon">.studio</span></span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Crafting brands that glow in the dark. Independent design studio, available worldwide.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Explore</h4>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {["Home", "About", "Services", "Skills", "Work", "Contact"].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`} className="text-muted-foreground transition hover:text-foreground">{l}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Follow</h4>
          <div className="mt-4 flex items-center gap-3">
            {[Linkedin, Dribbble, Figma, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-full glass transition hover:scale-110 hover:text-[var(--neon-cyan)]">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-10 max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Aria Lumen. All rights reserved.</p>
          <p>Designed & built with obsession.</p>
        </div>
      </div>
    </footer>
  );
}
