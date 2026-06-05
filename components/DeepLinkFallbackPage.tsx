import Link from "next/link";

type DeepLinkFallbackPageProps = {
  id: string;
  kind: "invite" | "post" | "spark";
};

const contentLabels: Record<DeepLinkFallbackPageProps["kind"], string> = {
  invite: "invite",
  post: "post",
  spark: "Spark",
};

function buildNativeUrl(kind: DeepLinkFallbackPageProps["kind"], id: string) {
  const encodedId = encodeURIComponent(id);

  if (kind === "invite") {
    return `spark://invite/${encodedId}`;
  }

  return `spark://${kind}s/${encodedId}`;
}

export function DeepLinkFallbackPage({ id, kind }: DeepLinkFallbackPageProps) {
  const label = contentLabels[kind];
  const nativeUrl = buildNativeUrl(kind, id);

  return (
    <main className="deep-link-page">
      <section className="deep-link-shell">
        <p className="deep-link-eyebrow">Spark</p>
        <h1>Open this {label} in Spark</h1>
        <p>
          If Spark is installed, open the app. If not, download Spark from the App Store and come back to this link
          after setup.
        </p>
        <div className="deep-link-actions">
          <a className="primary-link" href={nativeUrl}>
            Open Spark
          </a>
          <Link className="secondary-link" href="/download">
            Download Spark
          </Link>
        </div>
      </section>
    </main>
  );
}
