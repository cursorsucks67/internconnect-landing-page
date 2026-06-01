import type { Metadata } from "next";
import { LegalDocumentPage } from "../../components/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Spark Terms and Conditions",
  description: "Spark Terms and Conditions for App Store review and Spark users.",
};

export default function TermsPage() {
  return (
    <LegalDocumentPage
      effectiveDate="June 1, 2026"
      title="Spark Terms and Conditions"
      sections={[
        {
          title: "Using Spark",
          body: [
            "You must provide accurate account information and use a school email when signing up. You are responsible for activity on your account and for keeping your password secure.",
          ],
        },
        {
          title: "Community Rules",
          body: [
            "Do not harass, threaten, impersonate, spam, scrape, exploit, or harm other users. Do not post illegal, hateful, sexually explicit, deceptive, or unsafe content.",
            "Meetups and Sparks are user-coordinated. Use judgment, meet in public places, and leave any situation that feels unsafe.",
          ],
        },
        {
          title: "Your Content",
          body: [
            "You keep ownership of content you create, but you give Spark permission to host, display, moderate, and process it so the app can work.",
            "Only share content you have the right to share. Spark may remove content or restrict accounts to protect users, comply with law, or enforce these terms.",
          ],
        },
        {
          title: "Safety and Moderation",
          body: [
            "Spark provides reporting, blocking, and account deletion tools. We may review reports, preserve safety records, remove content, suspend access, or cooperate with lawful requests when needed.",
          ],
        },
        {
          title: "Service Changes",
          body: [
            "Spark may change, pause, or discontinue parts of the service. The app is provided as-is, and Spark is not responsible for user behavior, offline meetups, third-party events, or third-party services.",
          ],
        },
        {
          title: "Contact",
          body: ["Support: getsparkapp.support@gmail.com"],
        },
      ]}
    />
  );
}
