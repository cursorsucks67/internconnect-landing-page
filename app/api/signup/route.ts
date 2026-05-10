import { NextResponse } from "next/server";
import { createSignup } from "../../../lib/notion";
import type { Lead } from "../../../lib/pulse";

const requiredFields: Array<keyof Lead> = [
  "name",
  "email",
  "school",
  "graduation_year",
  "role",
  "company",
];

const clean = (value: unknown) =>
  String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");

const createUserId = () => crypto.randomUUID().replaceAll("-", "");

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Lead>;
    const lead: Lead = {
      name: clean(body.name),
      email: clean(body.email).toLowerCase(),
      school: clean(body.school),
      graduation_year: clean(body.graduation_year),
      role: clean(body.role),
      company: clean(body.company),
      user_id: clean(body.user_id) || createUserId(),
      source: clean(body.source) || "direct",
      referrer: clean(body.referrer),
      created_at: clean(body.created_at) || new Date().toISOString(),
      company_pod_status: clean(body.company_pod_status) || "pending",
      school_crew_status: clean(body.school_crew_status) || "pending",
      verification_status: clean(body.verification_status) || "unverified",
    };

    const missingField = requiredFields.find((field) => !lead[field]);
    if (missingField) {
      return NextResponse.json(
        { ok: false, error: `${missingField} is required` },
        { status: 400 },
      );
    }

    const result = await createSignup(lead);

    return NextResponse.json({
      ok: true,
      notionConfigured: result.configured,
      pageId: result.pageId,
      userId: lead.user_id,
    });
  } catch (error) {
    console.error("Unable to save signup to Notion", error);
    return NextResponse.json(
      { ok: false, error: "Unable to save signup" },
      { status: 500 },
    );
  }
}
