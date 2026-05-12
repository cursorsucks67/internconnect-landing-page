import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "../styles.css";

export const metadata: Metadata = {
  title: "Internconnected",
  description:
    "Join Internconnected, the verified 2026 NYC intern map for finding other interns by company, school, role, pods, and city quests before summer starts.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#071422",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
