import { readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";

describe("App Store download fallback", () => {
  test("routes download fallback to the App Store listing", () => {
    const routeSource = readFileSync("app/download/route.ts", "utf8");

    expect(routeSource).toContain("SPARK_APP_STORE_URL");
    expect(routeSource).toContain("https://apps.apple.com/us/app/spark-find-your-crew/id6773165790");
    expect(routeSource).not.toContain("testflight.apple.com");
  });

  test("uses App Store copy on deep-link fallback pages", () => {
    const fallbackSource = readFileSync("components/DeepLinkFallbackPage.tsx", "utf8");

    expect(fallbackSource).toContain("download Spark from the App Store");
    expect(fallbackSource).not.toContain("TestFlight");
  });
});
