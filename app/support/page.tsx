import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Spark Support",
  description: "Contact Spark support.",
};

export default function SupportPage() {
  return (
    <main className="legal-page">
      <section className="legal-shell support-shell">
        <Link className="legal-brand" href="/">
          Spark
        </Link>
        <p className="deep-link-eyebrow">Support</p>
        <h1>How can we help?</h1>
        <p className="legal-intro">
          For account access, safety reports, privacy requests, or App Store review questions, email Spark support.
        </p>
        <div className="deep-link-actions">
          <a className="primary-link" href="mailto:getsparkapp.support@gmail.com?subject=Spark%20support">
            Email support
          </a>
          <Link className="secondary-link" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="secondary-link" href="/terms">
            Terms
          </Link>
        </div>
      </section>
    </main>
  );
}
