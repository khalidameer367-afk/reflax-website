export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : ""}>
      {eyebrow && (
        <div className="text-sm text-muted mb-3">{eyebrow}</div>
      )}
      <h2 className="display text-3xl md:text-[2.6rem] font-semibold leading-[1.1] tracking-tight text-ink">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-[15px] leading-relaxed text-muted max-w-xl">
          {description}
        </p>
      )}
    </div>
  );
}
