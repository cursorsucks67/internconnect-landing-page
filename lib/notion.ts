import { Client } from "@notionhq/client";
import type {
  CreatePageParameters,
  QueryDataSourceResponse,
} from "@notionhq/client/build/src/api-endpoints";
import {
  fallbackLivePulse,
  fallbackPulseEvents,
  type Lead,
  type LivePulse,
  type PulseEvent,
} from "./pulse";

type NotionPageProperties = CreatePageParameters["properties"];

const token = process.env.NOTION_TOKEN;
const signupsDatabaseId = process.env.NOTION_SIGNUPS_DATABASE_ID;
const signupsDataSourceId =
  process.env.NOTION_SIGNUPS_DATA_SOURCE_ID || signupsDatabaseId;

const notion = token ? new Client({ auth: token }) : null;

const notionConfigured = Boolean(notion && signupsDatabaseId);

const richText = (content: string) => ({
  rich_text: content ? [{ text: { content } }] : [],
});

const title = (content: string) => ({
  title: content ? [{ text: { content } }] : [],
});

const email = (content: string) => ({
  email: content || null,
});

const date = (content: string) => ({
  date: content ? { start: content } : null,
});

const numericYear = (value: string) => {
  const year = Number.parseInt(value, 10);
  return Number.isFinite(year) ? year : null;
};

const textFromProperty = (property: unknown): string => {
  if (!property || typeof property !== "object") return "";
  const typed = property as {
    type?: string;
    title?: Array<{ plain_text?: string }>;
    rich_text?: Array<{ plain_text?: string }>;
    email?: string | null;
    number?: number | null;
  };

  if (typed.type === "title") {
    return typed.title?.map((item) => item.plain_text ?? "").join("") ?? "";
  }

  if (typed.type === "rich_text") {
    return (
      typed.rich_text?.map((item) => item.plain_text ?? "").join("") ?? ""
    );
  }

  if (typed.type === "email") return typed.email ?? "";
  if (typed.type === "number") return String(typed.number ?? "");

  return "";
};

const normalizeUniqueValue = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase();

const getSignupRows = async () => {
  if (!notion || !signupsDataSourceId) return [];

  const rows: QueryDataSourceResponse["results"] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.dataSources.query({
      data_source_id: signupsDataSourceId,
      page_size: 100,
      start_cursor: cursor,
    });

    rows.push(...response.results);
    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return rows.filter((page) => "properties" in page);
};

export const getNotionConnectionState = () => ({
  configured: notionConfigured,
  databaseId: signupsDatabaseId,
  dataSourceId: signupsDataSourceId,
});

export const createSignup = async (lead: Lead) => {
  if (!notion || !signupsDatabaseId) {
    return { configured: false, pageId: null };
  }

  const properties: NotionPageProperties = {
    Name: title(lead.name),
    email: email(lead.email),
    school: richText(lead.school),
    graduation_year: { number: numericYear(lead.graduation_year) },
    role: richText(lead.role),
    company: richText(lead.company),
    user_id: richText(lead.user_id),
    source: richText(lead.source),
    referrer: richText(lead.referrer),
    created_at: date(lead.created_at),
    company_pod_status: richText(lead.company_pod_status),
    school_crew_status: richText(lead.school_crew_status),
    verification_status: richText(lead.verification_status),
  };

  const page = await notion.pages.create({
    parent: { database_id: signupsDatabaseId },
    properties,
  });

  return { configured: true, pageId: page.id };
};

export const getLivePulse = async (): Promise<{
  configured: boolean;
  pulse: LivePulse;
  events: PulseEvent[];
}> => {
  if (!notion || !signupsDatabaseId || !signupsDataSourceId) {
    return {
      configured: false,
      pulse: fallbackLivePulse,
      events: fallbackPulseEvents,
    };
  }

  const rows = await getSignupRows();
  const schools = new Set<string>();
  const companies = new Set<string>();

  rows.forEach((page) => {
    const properties = page.properties as Record<string, unknown>;
    const school = normalizeUniqueValue(textFromProperty(properties.school));
    const company = normalizeUniqueValue(textFromProperty(properties.company));

    if (school) schools.add(school);
    if (company) companies.add(company);
  });

  const pulse: LivePulse = {
    interns: rows.length,
    schools: schools.size,
    companies: companies.size,
    quests: fallbackLivePulse.quests,
    updatedAt: new Date().toISOString(),
  };

  return {
    configured: true,
    pulse,
    events: fallbackPulseEvents,
  };
};
