import type { Metadata } from "next";
import { LegalDocumentPage } from "../../components/LegalDocumentPage";

export const metadata: Metadata = {
  title: "Spark Privacy Policy",
  description: "Spark Privacy Policy for App Store review and Spark users.",
};

export default function PrivacyPage() {
  return (
    <LegalDocumentPage
      effectiveDate="June 2, 2026"
      title="Spark Privacy Policy"
      sections={[
        {
          title: "Information We Collect",
          body: [
            "Account information: email address, school email, name, username, profile photo, school, company, role, graduation year, and profile settings.",
            "Verification and directory information: school verification status, school/company membership, company office selection, company pod visibility, and school crew visibility.",
            "Social content and activity: posts, comments, reactions, Spark/activity details, reports, blocks, RSVPs, interests, referrals, invites, past internship entries, and related timestamps.",
            "Permission and location-related signals: whether location access was granted, denied, or skipped; precise device location such as latitude and longitude when you allow location during onboarding or event check-in; approximate map areas; selected office Pulse Zone; and nearby Spark check-in signals. Spark does not expose your exact live personal location to other users.",
            "Notifications and device data: Expo push notification tokens, device notification permission status, and delivery-related identifiers needed to send Spark reminders and updates.",
            "Analytics and operations data: analytics events such as invites shared, Sparks created, RSVPs, thread messages, app events, error states, moderation actions, account deletion requests, and legal acceptance timestamps/versions used to operate and improve the service.",
          ],
        },
        {
          title: "How We Use Information",
          body: [
            "We use information to operate account access, verify school and company context, show relevant school/company/community surfaces, power map and Spark discovery, send notifications you allow, support moderation and safety, prevent abuse, process invites and referrals, improve the product, and respond to support or deletion requests.",
          ],
        },
        {
          title: "Sharing",
          body: [
            "We do not sell personal information. Some profile and social content may be visible to other verified users depending on the surface. Service providers such as Supabase, Expo, Apple Maps, Google, Brandfetch, email providers, hosting providers, and app distribution providers may process data so the app can function.",
          ],
        },
        {
          title: "Third-Party Disclosure",
          body: [
            "We do not sell, rent, trade, or otherwise provide your personal information to third parties for their own commercial purposes. Data is shared only with the infrastructure providers necessary to operate the app:",
            "Supabase - database, authentication, storage, Edge Functions, and backend services.",
            "Expo - app delivery, update infrastructure, and push notification delivery.",
            "Apple Maps - map display, place search, reverse geocoding, and device permission flows on iOS.",
            "Google - app distribution, device-level notification routing where applicable, and server-side place/company address lookup where enabled.",
            "Brandfetch - company logo CDN and brand asset lookup for company/school identity surfaces.",
            "No third parties receive your personal data for their own advertising or resale. We will not share your information with advertisers, data brokers, analytics resellers, or other external parties beyond the infrastructure providers needed to operate Spark and comply with law.",
          ],
        },
        {
          title: "Safety",
          body: [
            "Users can report content and block other users from comment/thread surfaces. Admins may review reports, remove unsafe content, lock threads, and process account deletion or safety requests.",
          ],
        },
        {
          title: "Account Deletion",
          body: [
            "Users can request account deletion in the app from Profile > Settings > Delete account. The flow requires typing confirm. The server deletes the authenticated account and keeps only safety/legal records if required.",
          ],
        },
        {
          title: "Support",
          body: ["Email support: getsparkapp.support@gmail.com"],
        },
      ]}
    />
  );
}
