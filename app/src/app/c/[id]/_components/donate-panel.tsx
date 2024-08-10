import { serverWagmiConfig } from "@/core/config/wagmi-server";
import { readFairpayGetCampaign } from "@/shared/generated";
import { buildIpfsUrl } from "@/shared/utils/ipfs";
import { notFound } from "next/navigation";
import { DonationForm } from "./donation-form";

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

  return (
    <section className="rounded-lg overflow-hidden border border-border/60">
      <div className="p-6 border-b border-border/40">
        <h1 className="text-3xl font-bold">Donate to “{campaign.title}”</h1>
        <p>Make a one-time donation to support this campaign.</p>
      </div>
      <DonationForm id={props.id} />
    </section>
  );
}
