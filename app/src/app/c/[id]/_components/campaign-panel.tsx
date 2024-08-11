import { serverWagmiConfig } from "@/core/config/wagmi-server";
import { Button } from "@/shared/components/ui/button";
import { readFairpayGetCampaign } from "@/shared/generated";
import donationsClient, { ResponseType } from "@/shared/gql-clients/donations-client";
import { buildIpfsUrl } from "@/shared/utils/ipfs";
import { buildWarpcastIntentUrl, buildXIntentUrl } from "@/shared/utils/social";
import { gql } from "@apollo/client";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DonationItem } from "./donation-item";

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

async function fetchLatestDonations(campaignId: number) {
  try {
    const query = gql`
      query LatestDonations($campaignId: Int!) {
        donationMades(
          first: 5
          orderBy: timestamp_
          orderDirection: desc
          where: { campaignId: $campaignId }
        ) {
          campaignId
          donor
          amount
          timestamp_
        }
      }
    `;

    const result = await donationsClient.query<{ donationMades: ResponseType[] }>({
      query,
      variables: {
        campaignId,
      },
    });

    return result.data.donationMades;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function CampaignPanel(props: { id: number }) {
  const campaign = await fetchCampaign(props.id);
  const latestDonations = await fetchLatestDonations(props.id);

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
          <Image
            src={imageUrl}
            alt=""
            layout="fill"
            objectFit="cover"
            className="backdrop-brightness-100 brightness-95"
          />
          <div className="absolute left-4 right-4 bottom-4 h-10 bg-white/80 backdrop-blur-md rounded-md ">
            {campaign.goal} -- {campaign.totalRaised}
          </div>
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold">{campaign.title}</h1>
          <p>{campaign.description}</p>
          <div className="flex justify-between items-center mt-4">
            <Button asChild>
              <Link href={`/c/${props.id}?mode=donate`}>Donate</Link>
            </Button>

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
        <h2 className="text-xl font-semibold">Latest donations</h2>
        <div className="space-y-4 mt-4">
          {latestDonations.map((donation) => (
            <DonationItem
              key={donation.timestamp_}
              amount={donation.amount}
              donor={donation.donor}
              timestamp={donation.timestamp_}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
