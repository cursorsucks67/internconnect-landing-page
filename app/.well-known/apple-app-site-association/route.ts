import { NextResponse } from "next/server";

const appleTeamId = process.env.APPLE_TEAM_ID;
const productionBundleId = "com.sparknyc.app";
const devBundleId = process.env.APPLE_DEV_BUNDLE_ID;

const appIDs = [
  appleTeamId ? `${appleTeamId}.${productionBundleId}` : null,
  appleTeamId && devBundleId ? `${appleTeamId}.${devBundleId}` : null,
].filter((appId): appId is string => Boolean(appId));

export function GET() {
  return NextResponse.json(
    {
      applinks: {
        apps: [],
        details: [
          {
            appIDs,
            paths: ["/invite/*", "/sparks/*", "/posts/*"],
          },
        ],
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300",
        "Content-Type": "application/json",
      },
    },
  );
}
