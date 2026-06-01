import type { Metadata } from "next";
import { DeepLinkFallbackPage } from "../../../components/DeepLinkFallbackPage";
import { buildSharePreviewMetadata, getSharePreview } from "../../../lib/sharePreview";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sparkId: string }>;
}): Promise<Metadata> {
  const { sparkId } = await params;
  return buildSharePreviewMetadata(await getSharePreview("spark", sparkId));
}

export default async function SparkFallbackPage({
  params,
}: {
  params: Promise<{ sparkId: string }>;
}) {
  const { sparkId } = await params;

  return <DeepLinkFallbackPage id={sparkId} kind="spark" />;
}
