export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-[var(--neon-purple)] opacity-25 blur-3xl animate-float-slow" />
      <div className="absolute top-1/3 -right-40 h-[40rem] w-[40rem] rounded-full bg-[var(--neon-blue)] opacity-20 blur-3xl animate-float" />
      <div className="absolute bottom-0 left-1/4 h-[32rem] w-[32rem] rounded-full bg-[var(--neon-cyan)] opacity-15 blur-3xl animate-float-slow" />
      <div className="absolute top-1/2 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--neon-pink)] opacity-10 blur-3xl" />
    </div>
  );
}
