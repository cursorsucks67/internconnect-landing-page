import { ImageResponse } from "next/og";
import {
  getSharePreview,
  normalizeSharePreviewRouteKind,
  truncatePreviewText,
} from "../../../../../lib/sharePreview";

export const runtime = "edge";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string; kind: string }>;
  },
) {
  const { id, kind: rawKind } = await params;
  const kind = normalizeSharePreviewRouteKind(rawKind);
  const preview = kind ? await getSharePreview(kind, id) : null;
  const title = truncatePreviewText(preview?.title ?? "Open this in Spark", 86);
  const description = truncatePreviewText(preview?.description ?? "Open Spark to see the details.", 150);
  const subtitle = preview?.subtitle ?? "Spark";
  const eyebrow = preview?.kind === "post" ? "POST" : "SPARK";

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#edf8f1",
          color: "#10231e",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Avenir Next, Inter, Arial, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: 64,
          width: "100%",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: 22 }}>
          <div
            style={{
              alignItems: "center",
              background: "#12302a",
              borderRadius: 999,
              color: "#ffffff",
              display: "flex",
              fontSize: 44,
              fontWeight: 800,
              height: 88,
              justifyContent: "center",
              width: 88,
            }}
          >
            S
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ color: "#2f9a6c", fontSize: 30, fontWeight: 800 }}>{eyebrow}</div>
            <div style={{ color: "#60746d", fontSize: 30, fontWeight: 700 }}>{subtitle}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              color: "#10231e",
              display: "flex",
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.02,
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "#5e716b",
              display: "flex",
              fontSize: 42,
              fontWeight: 650,
              lineHeight: 1.18,
              maxWidth: 1020,
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            borderTop: "3px solid #d8e6dd",
            color: "#2f9a6c",
            display: "flex",
            fontSize: 34,
            fontWeight: 800,
            justifyContent: "space-between",
            paddingTop: 28,
          }}
        >
          <span>Open in Spark</span>
          <span>spark.internconnected.co</span>
        </div>
      </div>
    ),
    {
      height: 630,
      width: 1200,
    },
  );
}
