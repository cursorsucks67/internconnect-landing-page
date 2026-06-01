import { DeepLinkFallbackPage } from "../../../components/DeepLinkFallbackPage";

export default async function PostFallbackPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  return <DeepLinkFallbackPage id={postId} kind="post" />;
}
