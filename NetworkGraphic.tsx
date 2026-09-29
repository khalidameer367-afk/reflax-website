export default function NetworkGraphic({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 480"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* connecting lines */}
      <line x1="240" y1="240" x2="110" y2="120" stroke="var(--ink)" strokeWidth="1.2" opacity="0.22" />
      <line x1="240" y1="240" x2="370" y2="110" stroke="var(--ink)" strokeWidth="1.2" opacity="0.22" />
      <line x1="240" y1="240" x2="100" y2="330" stroke="var(--ink)" strokeWidth="1.2" opacity="0.22" />
      <line x1="240" y1="240" x2="360" y2="350" stroke="var(--ink)" strokeWidth="1.2" opacity="0.22" />
      <line x1="240" y1="240" x2="240" y2="70" stroke="var(--ink)" strokeWidth="1.2" opacity="0.22" />
      <line x1="240" y1="240" x2="240" y2="410" stroke="var(--ink)" strokeWidth="1.2" opacity="0.22" />

      {/* central hub — Reflax */}
      <circle cx="240" cy="240" r="46" fill="var(--ink)" />
      <circle cx="240" cy="240" r="46" fill="none" stroke="var(--ink)" strokeWidth="1" />

      {/* profiles — circles */}
      <circle cx="110" cy="120" r="26" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="100" cy="330" r="20" fill="var(--ink)" opacity="0.08" />
      <circle cx="100" cy="330" r="20" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="240" cy="70" r="18" fill="none" stroke="var(--ink)" strokeWidth="1.5" />

      {/* businesses — squares */}
      <rect x="345" y="85" width="50" height="50" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <rect x="332" y="322" width="56" height="56" fill="var(--ink)" opacity="0.06" />
      <rect x="332" y="322" width="56" height="56" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
      <rect x="212" y="388" width="56" height="44" fill="none" stroke="var(--ink)" strokeWidth="1.5" />
    </svg>
  );
}
