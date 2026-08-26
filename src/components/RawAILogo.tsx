export function RawAILogo({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display font-bold tracking-tight text-lg leading-none select-none ${className}`}
    >
      <span className="text-[var(--text)]">RAW</span>
      <span className="grad-text"> AI</span>
    </span>
  );
}
