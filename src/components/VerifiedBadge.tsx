export default function VerifiedBadge({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-[3px] border ${
        dark
          ? "text-paper bg-paper/10 border-paper/25"
          : "text-ink bg-ink/[0.06] border-ink/15"
      } ${className}`}
      title="Verified by Reflax"
    >
      <svg width="11" height="11" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7.5 10.5L9 12L12.5 8M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Verified
    </span>
  );
}
