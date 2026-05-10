import { NextResponse } from "next/server";
import { getLivePulse } from "../../../lib/notion";

export async function GET() {
  try {
    const livePulse = await getLivePulse();

    return NextResponse.json(livePulse, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Unable to load live pulse from Notion", error);
    return NextResponse.json(
      { ok: false, error: "Unable to load live pulse" },
      { status: 500 },
    );
  }
}
