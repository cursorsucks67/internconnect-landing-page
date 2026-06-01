import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "../styles.css";

export const metadata: Metadata = {
  title: "Internconnected",
  description:
    "Join Internconnected, the verified 2026 NYC intern map for finding other interns by company, school, role, pods, and city quests before summer starts.",
  icons: {
    icon: "/spark-logo.jpg",
    shortcut: "/spark-logo.jpg",
    apple: "/spark-logo.jpg",
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
