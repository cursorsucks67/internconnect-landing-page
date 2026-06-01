import { DeepLinkFallbackPage } from "../../../components/DeepLinkFallbackPage";

export default async function SparkFallbackPage({
  params,
}: {
  params: Promise<{ sparkId: string }>;
}) {
  const { sparkId } = await params;

  return <DeepLinkFallbackPage id={sparkId} kind="spark" />;
}
