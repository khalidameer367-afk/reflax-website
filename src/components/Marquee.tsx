import Link from "next/link";

export default function Marquee({
  items,
}: {
  items: { id: string; href: string; name: string; image: string | null; sub?: string }[];
}) {
  if (items.length === 0) return null;
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <Link
            key={`${item.id}-${i}`}
            href={item.href}
            className="tilt-3d group flex items-center gap-3 border border-line px-5 py-4 mr-4 shrink-0 hover:border-ink transition-colors bg-paper"
          >
            <div className="h-10 w-10 rounded-full bg-ink/5 border border-line flex items-center justify-center text-sm font-semibold text-ink overflow-hidden shrink-0">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              ) : (
                item.name.charAt(0)
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-ink whitespace-nowrap">{item.name}</div>
              {item.sub && <div className="text-xs text-muted whitespace-nowrap">{item.sub}</div>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
