import { serverWagmiConfig } from "@/core/config/wagmi-server";
import { readFairpayGetCampaign } from "@/shared/generated";
import { buildIpfsUrl } from "@/shared/utils/ipfs";
import { notFound } from "next/navigation";

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

export async function DonatePanel(props: { id: number }) {
  const campaign = await fetchCampaign(props.id);

  const imageUrl = buildIpfsUrl(campaign.bannerImage);

  return <section className="space-y-5"></section>;
}
