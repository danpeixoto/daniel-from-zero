type SpiralMotifProps = {
  className?: string;
};

/** Subtle concentric circles — signature motif from the logo. */
export function SpiralMotif({ className }: SpiralMotifProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {[40, 70, 100, 130, 160, 190].map((r) => (
        <circle
          key={r}
          cx="200"
          cy="200"
          r={r}
          stroke="var(--color-accent)"
          strokeOpacity="0.07"
          strokeWidth="1.25"
        />
      ))}
    </svg>
  );
}
