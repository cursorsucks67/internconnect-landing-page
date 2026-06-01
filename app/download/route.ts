import { redirect } from "next/navigation";

export function GET() {
  redirect(process.env.SPARK_TESTFLIGHT_URL ?? "https://testflight.apple.com/join/REPLACE_ME");
}
