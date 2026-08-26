export function TechBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* base gradient wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,#0d1424,transparent_70%)]" />
      {/* circuit grid — slowly panning */}
      <div className="tech-grid animate-gridpan absolute inset-0" />
      {/* circuit nodes — dots at intersections, echoing the original Raw AI backdrop */}
      <div className="tech-nodes animate-gridpan absolute inset-0" />
      {/* drifting neon glows */}
      <div className="glow-cyan animate-drift absolute -top-40 -left-24 h-[520px] w-[520px] rounded-full blur-3xl" />
      <div className="glow-green animate-drift2 absolute top-1/3 -right-32 h-[560px] w-[560px] rounded-full blur-3xl" />
      <div className="glow-cyan animate-drift3 absolute bottom-0 left-1/3 h-[440px] w-[440px] rounded-full blur-3xl" />
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_100%_at_50%_50%,transparent_55%,#05070d_100%)]" />
    </div>
  );
}
