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

type SupabaseApiKey = {
  value: string;
};

type SharePreviewRpcRow = SparkPreviewRow &
  PostPreviewRow & {
    id: string;
    kind: SharePreviewKind;
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
  const cleanValue = value?.trim().replace(/^['"]|['"]$/g, "");
  return cleanValue || undefined;
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

function getFirstJsonDictionaryValue(value: string | undefined) {
  const cleanValue = cleanEnvValue(value);

  if (!cleanValue) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(cleanValue) as Record<string, unknown>;
    const defaultValue = typeof parsed.default === "string" ? cleanEnvValue(parsed.default) : undefined;

    if (defaultValue) {
      return defaultValue;
    }

    for (const entry of Object.values(parsed)) {
      if (typeof entry === "string") {
        const cleanEntry = cleanEnvValue(entry);
        if (cleanEntry) {
          return cleanEntry;
        }
      }
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function getSupabaseApiKey(): SupabaseApiKey | null {
  const currentKey =
    cleanEnvValue(process.env.SUPABASE_SECRET_KEY) ??
    getFirstJsonDictionaryValue(process.env.SUPABASE_SECRET_KEYS) ??
    cleanEnvValue(process.env.SUPABASE_PUBLISHABLE_KEY) ??
    getFirstJsonDictionaryValue(process.env.SUPABASE_PUBLISHABLE_KEYS) ??
    cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ??
    cleanEnvValue(process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

  if (currentKey) {
    return {
      value: currentKey,
    };
  }

  const legacyKey =
    cleanEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY) ??
    cleanEnvValue(process.env.SUPABASE_ANON_KEY) ??
    cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ??
    cleanEnvValue(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

  return legacyKey
    ? {
        value: legacyKey,
      }
    : null;
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

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function fetchSharePreviewRpcRow(kind: SharePreviewKind, id: string): Promise<SharePreviewRpcRow | null> {
  const supabaseUrl = getSupabaseUrl();
  const supabaseApiKey = getSupabaseApiKey();

  if (!supabaseUrl || !supabaseApiKey || !isUuid(id)) {
    return null;
  }

  const url = new URL("/rest/v1/rpc/get_public_share_preview", supabaseUrl);

  try {
    const headers = new Headers({
      apikey: supabaseApiKey.value,
      Authorization: `Bearer ${supabaseApiKey.value}`,
      "Content-Type": "application/json",
    });

    const response = await fetch(url, {
      body: JSON.stringify({
        target_id: id,
        target_kind: kind,
      }),
      headers,
      method: "POST",
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    const rows = (await response.json()) as SharePreviewRpcRow[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function getSharePreview(kind: SharePreviewKind, id: string): Promise<SharePreview> {
  const row = await fetchSharePreviewRpcRow(kind, id);

  if (kind === "spark") {
    return buildSparkPreviewFromRow(id, row);
  }

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
