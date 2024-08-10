import { serverWagmiConfig } from "@/core/config/wagmi-server";
import { Button } from "@/shared/components/ui/button";
import { readFairpayGetCampaign } from "@/shared/generated";
import { buildIpfsUrl } from "@/shared/utils/ipfs";
import { buildWarpcastIntentUrl, buildXIntentUrl } from "@/shared/utils/social";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export async function CampaignPanel(props: { id: number }) {
  const campaign = await readFairpayGetCampaign(serverWagmiConfig, {
    args: [BigInt(props.id)],
  });

  const imageUrl = buildIpfsUrl(campaign.bannerImage);
  const headersList = headers();
  const hostname = headersList.get("host");

  const campaignUrl = `https://${hostname}/c/${props.id}`;
  const farcasterUrl = buildWarpcastIntentUrl("Check out this campaign on Fairpay!", [campaignUrl]);
  const XUrl = buildXIntentUrl("Check out this campaign on Fairpay!", campaignUrl);

  return (
    <section className="space-y-5">
      <div className="rounded-lg overflow-hidden border border-border/40">
        <div className="w-full h-[500px] relative overflow-hidden">
          <Image src={imageUrl} alt="" layout="fill" objectFit="cover" />
          <div className="absolute left-4 right-4 bottom-4 h-10 bg-white/80 backdrop-blur-md rounded-md ">
            {campaign.goal} -- {campaign.totalRaised}
          </div>
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold">{campaign.title}</h1>
          <p>{campaign.description}</p>
          <div className="flex justify-between items-center mt-4">
            <Button>Donate</Button>

            <div className="space-x-2">
              <Button variant={"x"} asChild>
                <Link href={XUrl} target="_blank">
                  Share on X
                </Link>
              </Button>
              <Button variant={"farcaster"} asChild>
                <Link href={farcasterUrl} target="_blank">
                  Share on Farcaster
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 rounded-lg overflow-hidden border border-border/40">
        <h2 className="text-xl font-semibold">Campaign details</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
      </div>
    </section>
  );
}
