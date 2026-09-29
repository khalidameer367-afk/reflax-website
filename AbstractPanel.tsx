export default function AbstractPanel({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 360"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="0" y="0" width="480" height="360" fill="var(--ink)" opacity="0.03" />
      <circle cx="90" cy="90" r="60" fill="none" stroke="var(--ink)" strokeWidth="1.5" opacity="0.5" />
      <circle cx="90" cy="90" r="34" fill="var(--ink)" />
      <rect x="240" y="40" width="200" height="120" fill="none" stroke="var(--ink)" strokeWidth="1.5" opacity="0.5" />
      <rect x="260" y="60" width="90" height="14" fill="var(--ink)" opacity="0.7" />
      <rect x="260" y="86" width="140" height="10" fill="var(--ink)" opacity="0.25" />
      <rect x="260" y="104" width="120" height="10" fill="var(--ink)" opacity="0.25" />
      <rect x="40" y="220" width="160" height="100" fill="var(--ink)" opacity="0.06" />
      <line x1="40" y1="220" x2="200" y2="320" stroke="var(--ink)" strokeWidth="1" opacity="0.3" />
      <line x1="200" y1="220" x2="40" y2="320" stroke="var(--ink)" strokeWidth="1" opacity="0.3" />
      <circle cx="360" cy="260" r="70" fill="none" stroke="var(--ink)" strokeWidth="1.5" opacity="0.4" />
      <path d="M330 260 L355 285 L400 235" stroke="var(--ink)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
