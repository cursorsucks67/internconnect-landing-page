import { redirect } from "next/navigation";

const appStoreUrl = "https://apps.apple.com/us/app/spark-find-your-crew/id6773165790";

export function GET() {
  redirect(process.env.SPARK_APP_STORE_URL ?? appStoreUrl);
}
