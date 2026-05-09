import type { SVGProps } from "react";

const base = "h-4 w-4";

export function Linkedin(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={base} {...p}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.21 0 22.23 0z" />
    </svg>
  );
}
export function Instagram(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={base} {...p}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
export function Dribbble(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={base} {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M8.6 2.6c3.4 5.6 5.6 11 6.4 18.4" />
      <path d="M21.5 10c-7 0-13-1.7-17.6-5" />
      <path d="M2.5 14c5-2.5 11-3.5 18.5-1.4" />
    </svg>
  );
}
export function Figma(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={base} {...p}>
      <path d="M9 22a3 3 0 0 1-3-3v-2h3v5z" />
      <path d="M6 12a3 3 0 0 1 3-3h3v6H9a3 3 0 0 1-3-3z" />
      <path d="M6 6a3 3 0 0 1 3-3h3v6H9a3 3 0 0 1-3-3z" />
      <path d="M12 3h3a3 3 0 0 1 0 6h-3V3z" />
      <circle cx="15" cy="12" r="3" />
    </svg>
  );
}
