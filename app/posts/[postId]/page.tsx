import type { Metadata } from "next";
import { DeepLinkFallbackPage } from "../../../components/DeepLinkFallbackPage";
import { buildSharePreviewMetadata, getSharePreview } from "../../../lib/sharePreview";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postId: string }>;
}): Promise<Metadata> {
  const { postId } = await params;
  return buildSharePreviewMetadata(await getSharePreview("post", postId));
}

export default async function PostFallbackPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  return <DeepLinkFallbackPage id={postId} kind="post" />;
}
