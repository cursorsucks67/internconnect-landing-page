import type { Metadata } from "next";

export type SharePreviewKind = "post" | "spark";

type SparkPreviewRow = {
  description: string | null;
  exact_location?: string | null;
  starts_at: string | null;
  status: string | null;
  title: string | null;
  visibility: string | null;
};

type PostPreviewRow = {
  board_scope: string | null;
  body: string | null;
  status: string | null;
  title: string | null;
};

export type SharePreview = {
  description: string;
  id: string;
  imageUrl: string;
  isGeneric: boolean;
  kind: SharePreviewKind;
  pageUrl: string;
  subtitle: string;
  title: string;
};

const DEFAULT_SITE_URL = "https://spark.internconnected.co";
const APP_NAME = "Spark";
const GENERIC_SPARK_DESCRIPTION = "See the plan and who is joining in the Spark app.";
const GENERIC_POST_DESCRIPTION = "Read the post and replies in the Spark app.";

function cleanEnvValue(value: string | undefined) {
  return value?.trim().replace(/^['"]|['"]$/g, "");
}

export function getSiteUrl() {
  return (
    cleanEnvValue(process.env.NEXT_PUBLIC_SITE_URL) ??
    cleanEnvValue(process.env.SPARK_PUBLIC_SITE_URL) ??
    DEFAULT_SITE_URL
  ).replace(/\/+$/, "");
}

function getSupabaseUrl() {
  return (
    cleanEnvValue(process.env.SUPABASE_URL) ??
    cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL) ??
    cleanEnvValue(process.env.EXPO_PUBLIC_SUPABASE_URL)
  )?.replace(/\/+$/, "");
}

function getSupabaseKey() {
  return (
    cleanEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY) ??
    cleanEnvValue(process.env.SUPABASE_SECRET_KEY) ??
    cleanEnvValue(process.env.SUPABASE_ANON_KEY) ??
    cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ??
    cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ??
    cleanEnvValue(process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ??
    cleanEnvValue(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY)
  );
}

export function truncatePreviewText(value: string, maxLength: number) {
  const cleanValue = value.replace(/\s+/g, " ").trim();

  if (cleanValue.length <= maxLength) {
    return cleanValue;
  }

  return `${cleanValue.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
}

function cleanPreviewText(value: string | null | undefined, fallback: string, maxLength: number) {
  const cleanValue = value?.replace(/\s+/g, " ").trim();
  return truncatePreviewText(cleanValue || fallback, maxLength);
}

function routeSegmentForKind(kind: SharePreviewKind) {
  return kind === "spark" ? "sparks" : "posts";
}

export function getSharePreviewPageUrl(kind: SharePreviewKind, id: string) {
  return `${getSiteUrl()}/${routeSegmentForKind(kind)}/${encodeURIComponent(id)}`;
}

export function getSharePreviewImageUrl(kind: SharePreviewKind, id: string) {
  return `${getSiteUrl()}/api/og/${routeSegmentForKind(kind)}/${encodeURIComponent(id)}`;
}

export function getFallbackSharePreview(kind: SharePreviewKind, id: string): SharePreview {
  const isSpark = kind === "spark";

  return {
    description: isSpark ? GENERIC_SPARK_DESCRIPTION : GENERIC_POST_DESCRIPTION,
    id,
    imageUrl: getSharePreviewImageUrl(kind, id),
    isGeneric: true,
    kind,
    pageUrl: getSharePreviewPageUrl(kind, id),
    subtitle: isSpark ? "Spark invite" : "Spark post",
    title: isSpark ? "Open this Spark" : "Open this Spark post",
  };
}

function isVisibleSpark(row: SparkPreviewRow | null | undefined): row is SparkPreviewRow {
  if (!row) {
    return false;
  }

  const status = row.status?.toLowerCase();
  return row.visibility === "public" && status !== "cancelled" && status !== "canceled" && status !== "removed";
}

function isVisibleCityPost(row: PostPreviewRow | null | undefined): row is PostPreviewRow {
  if (!row) {
    return false;
  }

  return row.board_scope === "city" && row.status?.toLowerCase() !== "removed";
}

function formatSparkSubtitle(row: SparkPreviewRow) {
  if (!row.starts_at) {
    return "Spark invite";
  }

  const startsAt = new Date(row.starts_at);
  if (Number.isNaN(startsAt.getTime())) {
    return "Spark invite";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    timeZone: "America/New_York",
  }).format(startsAt);
}

export function buildSparkPreviewFromRow(id: string, row: SparkPreviewRow | null | undefined): SharePreview {
  if (!isVisibleSpark(row)) {
    return getFallbackSharePreview("spark", id);
  }

  return {
    description: cleanPreviewText(row.description, GENERIC_SPARK_DESCRIPTION, 180),
    id,
    imageUrl: getSharePreviewImageUrl("spark", id),
    isGeneric: false,
    kind: "spark",
    pageUrl: getSharePreviewPageUrl("spark", id),
    subtitle: formatSparkSubtitle(row),
    title: cleanPreviewText(row.title, "Open this Spark", 90),
  };
}

export function buildPostPreviewFromRow(id: string, row: PostPreviewRow | null | undefined): SharePreview {
  if (!isVisibleCityPost(row)) {
    return getFallbackSharePreview("post", id);
  }

  return {
    description: cleanPreviewText(row.body, GENERIC_POST_DESCRIPTION, 180),
    id,
    imageUrl: getSharePreviewImageUrl("post", id),
    isGeneric: false,
    kind: "post",
    pageUrl: getSharePreviewPageUrl("post", id),
    subtitle: "City board",
    title: cleanPreviewText(row.title, "Open this Spark post", 90),
  };
}

async function fetchSupabaseRow<T>(table: string, select: string, id: string): Promise<T | null> {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseKey();

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  const url = new URL(`/rest/v1/${table}`, supabaseUrl);
  url.searchParams.set("id", `eq.${id}`);
  url.searchParams.set("limit", "1");
  url.searchParams.set("select", select);

  try {
    const response = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    const rows = (await response.json()) as T[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function getSharePreview(kind: SharePreviewKind, id: string): Promise<SharePreview> {
  if (kind === "spark") {
    const row = await fetchSupabaseRow<SparkPreviewRow>(
      "sparks",
      "title,description,visibility,status,starts_at,exact_location",
      id,
    );
    return buildSparkPreviewFromRow(id, row);
  }

  const row = await fetchSupabaseRow<PostPreviewRow>("threads", "title,body,board_scope,status", id);
  return buildPostPreviewFromRow(id, row);
}

export function normalizeSharePreviewRouteKind(value: string): SharePreviewKind | null {
  if (value === "sparks" || value === "spark") {
    return "spark";
  }

  if (value === "posts" || value === "post") {
    return "post";
  }

  return null;
}

export function buildSharePreviewMetadata(preview: SharePreview): Metadata {
  return {
    alternates: {
      canonical: preview.pageUrl,
    },
    description: preview.description,
    metadataBase: new URL(getSiteUrl()),
    openGraph: {
      description: preview.description,
      images: [
        {
          alt: preview.title,
          height: 630,
          url: preview.imageUrl,
          width: 1200,
        },
      ],
      siteName: APP_NAME,
      title: preview.title,
      type: "article",
      url: preview.pageUrl,
    },
    title: `${preview.title} | ${APP_NAME}`,
    twitter: {
      card: "summary_large_image",
      description: preview.description,
      images: [preview.imageUrl],
      title: preview.title,
    },
  };
}
