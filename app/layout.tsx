import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "../styles.css";

export const metadata: Metadata = {
  title: "Spark: Find Your Crew",
  description:
    "Download Spark: Find Your Crew, the NYC intern app for finding people, plans, company pods, school crews, and Quest Sparks around the city.",
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
