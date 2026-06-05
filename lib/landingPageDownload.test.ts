import { readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";

describe("Spark landing page download CTA", () => {
  test("brands the public landing page as Spark: Find Your Crew", () => {
    const layoutSource = readFileSync("app/layout.tsx", "utf8");
    const landingSource = readFileSync("components/LandingPage.tsx", "utf8");
    const staticSource = readFileSync("index.html", "utf8");

    expect(layoutSource).toContain('title: "Spark: Find Your Crew"');
    expect(layoutSource).toContain('icon: "/spark-logo.jpg"');
    expect(landingSource).toContain("Spark: Find Your Crew");
    expect(landingSource).toContain('className="brand-logo"');
    expect(landingSource).toContain('src="/spark-logo.jpg"');
    expect(landingSource).not.toContain('<span className="brand-mark"');
    expect(staticSource).toContain("<title>Spark: Find Your Crew</title>");
    expect(staticSource).toContain('href="/spark-logo.jpg"');
    expect(staticSource).toContain('class="brand-logo"');
    expect(staticSource).toContain('src="/spark-logo.jpg"');
    expect(staticSource).not.toContain('<span class="brand-mark"');
    expect(landingSource).not.toContain("Internconnected");
    expect(staticSource).not.toContain("Internconnected");
  });

  test("replaces the waitlist form with App Store download actions", () => {
    const landingSource = readFileSync("components/LandingPage.tsx", "utf8");
    const staticSource = readFileSync("index.html", "utf8");
    const stylesSource = readFileSync("styles.css", "utf8");

    expect(landingSource).toContain('href="/download"');
    expect(staticSource).toContain('href="/download"');
    expect(landingSource).toContain('src="/apple-download.svg"');
    expect(staticSource).toContain('src="/apple-download.svg"');
    expect(landingSource).toContain("Download on the App Store");
    expect(staticSource).toContain("Download on the App Store");
    expect(landingSource).not.toContain("<Apple");
    expect(stylesSource).not.toContain(".app-store-button:hover");
    expect(stylesSource).not.toContain(".app-store-button:active");
    expect(stylesSource).not.toContain(".app-store-button {\n  align-items: center;\n  border-radius: 10px;\n  box-shadow:");
    expect(landingSource).not.toContain("signup-form");
    expect(staticSource).not.toContain("signup-form");
    expect(landingSource).not.toContain("Join Internconnected");
    expect(staticSource).not.toContain("Join Internconnected");
    expect(landingSource).not.toContain("handleSubmit");
    expect(staticSource).not.toContain("script.js");
  });
});
