import { isValidInteger } from "@/shared/utils/numbers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CampaignPanel } from "./_components/campaign-panel";
import { SkeletonCampaignPanel } from "./_components/skeleton-campaign-panel";

export default function CampaignPage({ params }: { params: { id: string } }) {
  const { id } = params;

  if (!id || !isValidInteger(id)) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl py-8">
      <Suspense fallback={<SkeletonCampaignPanel />}>
        <CampaignPanel id={+id} />
      </Suspense>
    </main>
  );
}
