import { isValidInteger } from "@/shared/utils/numbers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CampaignPanel } from "./_components/campaign-panel";
import { DonatePanel } from "./_components/donate-panel";
import { SkeletonCampaignPanel } from "./_components/skeleton-campaign-panel";
import { SkeletonDonatePanel } from "./_components/skeleton-donate-panel";

export default function CampaignPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { mode?: string };
}) {
  const { id } = params;

  if (!id || !isValidInteger(id)) {
    notFound();
  }

  const isDonateMode = searchParams.mode === "donate";

  return (
    <main className="mx-auto w-full max-w-4xl py-8">
      {isDonateMode ? (
        <Suspense fallback={<SkeletonDonatePanel />}>
          <DonatePanel id={+id} />
        </Suspense>
      ) : (
        <Suspense fallback={<SkeletonCampaignPanel />}>
          <CampaignPanel id={+id} />
        </Suspense>
      )}
    </main>
  );
}
