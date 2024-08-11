import { serverWagmiConfig } from "@/core/config/wagmi-server";
import { getCampaignFrame } from "@/shared/frames/campaign-frame";
import { readFairpayGetCampaign } from "@/shared/generated";
import { buildIpfsUrl } from "@/shared/utils/ipfs";
import { isValidInteger } from "@/shared/utils/numbers";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CampaignPanel } from "./_components/campaign-panel";
import { DonatePanel } from "./_components/donate-panel";
import { SkeletonCampaignPanel } from "./_components/skeleton-campaign-panel";
import { SkeletonDonatePanel } from "./_components/skeleton-donate-panel";

async function fetchCampaign(id: number) {
  try {
    return await readFairpayGetCampaign(serverWagmiConfig, {
      args: [BigInt(id)],
    });
  } catch (error) {
    console.error(error);
    notFound();
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const { id } = params;

    if (!id || !isValidInteger(id)) {
      notFound();
    }

    const campaign = await fetchCampaign(+id);
    return {
      title: campaign.title.slice(0, 60),
      description: campaign.description.slice(0, 160),
      openGraph: {
        title: campaign.title.slice(0, 60),
        description: campaign.description.slice(0, 160),
        images: [buildIpfsUrl(campaign.bannerImage)],
      },
      other: {
        ...getCampaignFrame({
          id: +id,
          bannerImage: buildIpfsUrl(campaign.bannerImage),
        }),
      },
    };
  } catch (error) {
    console.error(error);
    notFound();
  }
}

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
    <main className="mx-auto w-full max-w-4xl p-4 md:py-8">
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
