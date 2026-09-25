export default function FaqSection({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  return (
    <section className="container-x py-16 md:py-20 border-t border-line">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        }}
      />
      <h2 className="display text-2xl md:text-3xl font-semibold text-ink mb-10">
        Frequently asked questions
      </h2>
      <div className="max-w-3xl space-y-0 border-t border-line">
        {faqs.map((f) => (
          <details key={f.question} className="group border-b border-line py-5">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="text-[15px] font-medium text-ink pr-6">{f.question}</span>
              <span className="text-muted shrink-0 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
