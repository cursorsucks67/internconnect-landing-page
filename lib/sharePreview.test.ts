import { describe, expect, test } from "bun:test";
import {
  buildPostPreviewFromRow,
  buildSharePreviewMetadata,
  buildSparkPreviewFromRow,
  getSharePreview,
} from "./sharePreview";

describe("share preview metadata", () => {
  test("builds a rich preview for public Sparks", () => {
    const preview = buildSparkPreviewFromRow("spark-123", {
      description: "Meet near the park entrance after work.",
      exact_location: "Madison Square Park",
      starts_at: "2026-06-02T21:30:00.000Z",
      status: "open",
      title: "Coffee walk",
      visibility: "public",
    });

    const metadata = buildSharePreviewMetadata(preview);

    expect(preview).toMatchObject({
      description: "Meet near the park entrance after work.",
      title: "Coffee walk",
    });
    expect(metadata.openGraph?.url).toBe("https://spark.internconnected.co/sparks/spark-123");
    expect(metadata.openGraph?.images).toEqual([
      {
        alt: "Coffee walk",
        height: 630,
        url: "https://spark.internconnected.co/api/og/sparks/spark-123",
        width: 1200,
      },
    ]);
  });

  test("hides non-public Spark text from public previews", () => {
    const preview = buildSparkPreviewFromRow("school-spark", {
      description: "Private school-only plan",
      exact_location: null,
      starts_at: "2026-06-02T21:30:00.000Z",
      status: "open",
      title: "Secret dinner",
      visibility: "school",
    });

    expect(preview.title).toBe("Open this Spark");
    expect(preview.description).not.toContain("Private school-only plan");
    expect(preview.description).not.toContain("Secret dinner");
  });

  test("builds a rich preview for city-board posts", () => {
    const preview = buildPostPreviewFromRow("post-123", {
      board_scope: "city",
      body: "Are you familiar with any projects worth considering?",
      status: "open",
      title: "Which project is worth paying attention to?",
    });

    const metadata = buildSharePreviewMetadata(preview);

    expect(preview).toMatchObject({
      description: "Are you familiar with any projects worth considering?",
      title: "Which project is worth paying attention to?",
    });
    expect(metadata.openGraph?.url).toBe("https://spark.internconnected.co/posts/post-123");
    expect(metadata.twitter?.images).toEqual(["https://spark.internconnected.co/api/og/posts/post-123"]);
  });

  test("hides scoped post text from public previews", () => {
    const preview = buildPostPreviewFromRow("company-post", {
      board_scope: "company",
      body: "Private company-only post",
      status: "open",
      title: "Company secret",
    });

    expect(preview.title).toBe("Open this Spark post");
    expect(preview.description).not.toContain("Private company-only post");
    expect(preview.description).not.toContain("Company secret");
  });

  test("fetches preview rows from Supabase without exposing client code", async () => {
    const originalUrl = process.env.SUPABASE_URL;
    const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const originalFetch = globalThis.fetch;
    const seenRequests: Array<{ headers: Headers; url: URL }> = [];

    process.env.SUPABASE_URL = "https://project.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "server-key";
    globalThis.fetch = async (input, init) => {
      seenRequests.push({
        headers: new Headers(init?.headers),
        url: new URL(input.toString()),
      });

      return new Response(
        JSON.stringify([
          {
            description: "A quick coffee nearby.",
            exact_location: null,
            starts_at: "2026-06-02T21:30:00.000Z",
            status: "open",
            title: "Coffee nearby",
            visibility: "public",
          },
        ]),
      );
    };

    try {
      const preview = await getSharePreview("spark", "spark with space");

      expect(preview.title).toBe("Coffee nearby");
      expect(seenRequests[0].url.origin).toBe("https://project.supabase.co");
      expect(seenRequests[0].url.pathname).toBe("/rest/v1/sparks");
      expect(seenRequests[0].url.searchParams.get("id")).toBe("eq.spark with space");
      expect(seenRequests[0].headers.get("Authorization")).toBe("Bearer server-key");
    } finally {
      process.env.SUPABASE_URL = originalUrl;
      process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
      globalThis.fetch = originalFetch;
    }
  });
});
