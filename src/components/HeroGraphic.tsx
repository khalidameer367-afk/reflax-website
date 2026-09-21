export default function HeroGraphic({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 480"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="40" y="40" width="180" height="180" fill="var(--ink)" />
      <rect x="220" y="40" width="180" height="180" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <rect x="40" y="220" width="180" height="180" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="330" cy="330" r="90" fill="var(--ink)" opacity="0.06" />
      <circle cx="330" cy="330" r="60" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <path
        d="M40 220 H130 C130 265 100 300 40 300 Z"
        fill="var(--ink)"
      />
      <line x1="245" y1="30" x2="245" y2="410" stroke="var(--ink)" strokeWidth="1" opacity="0.15" />
      <line x1="275" y1="30" x2="275" y2="410" stroke="var(--ink)" strokeWidth="1" opacity="0.15" />
      <line x1="305" y1="30" x2="305" y2="410" stroke="var(--ink)" strokeWidth="1" opacity="0.15" />
    </svg>
  );
}
