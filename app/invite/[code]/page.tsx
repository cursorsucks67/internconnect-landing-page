import { DeepLinkFallbackPage } from "../../../components/DeepLinkFallbackPage";

export default async function InviteFallbackPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return <DeepLinkFallbackPage id={code} kind="invite" />;
}
