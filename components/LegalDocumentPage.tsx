import Link from "next/link";

export type LegalSection = {
  body: string[];
  title: string;
};

type LegalDocumentPageProps = {
  effectiveDate: string;
  intro?: string;
  sections: LegalSection[];
  title: string;
};

export function LegalDocumentPage({ effectiveDate, intro, sections, title }: LegalDocumentPageProps) {
  return (
    <main className="legal-page">
      <article className="legal-shell">
        <Link className="legal-brand" href="/">
          Spark
        </Link>
        <p className="deep-link-eyebrow">Last updated {effectiveDate}</p>
        <h1>{title}</h1>
        {intro ? <p className="legal-intro">{intro}</p> : null}
        {sections.map((section) => (
          <section className="legal-section" key={section.title}>
            <h2>{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </article>
    </main>
  );
}
