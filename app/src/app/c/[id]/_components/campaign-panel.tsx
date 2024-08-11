import { serverWagmiConfig } from "@/core/config/wagmi-server";
import { Button } from "@/shared/components/ui/button";
import { readFairpayGetCampaign } from "@/shared/generated";
import donationsClient, { ResponseType } from "@/shared/gql-clients/donations-client";
import { getEndsInString } from "@/shared/utils/dates";
import { buildIpfsUrl } from "@/shared/utils/ipfs";
import { buildWarpcastIntentUrl, buildXIntentUrl } from "@/shared/utils/social";
import { cn } from "@/shared/utils/tailwind";
import { gql } from "@apollo/client";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatUnits } from "viem";
import { DonationItem } from "./donation-item";
import { RecipientSection } from "./recipient-section";

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

export const dynamic = "force-dynamic";

export async function CampaignPanel(props: { id: number }) {
  const campaign = await fetchCampaign(props.id);
  const latestDonations = await fetchLatestDonations(props.id);

  const imageUrl = buildIpfsUrl(campaign.bannerImage);
  const headersList = headers();
  const hostname = headersList.get("host");

  const campaignUrl = `https://${hostname}/c/${props.id}`;
  const farcasterUrl = buildWarpcastIntentUrl("Check out this campaign on Fairpay!", [campaignUrl]);
  const XUrl = buildXIntentUrl("Check out this campaign on Fairpay!", campaignUrl);

  const prettyAmount = formatUnits(campaign.totalRaised, 6);
  const prettyGoal = Number(campaign.goal);
  const prettyEndDate = getEndsInString(new Date(Number(campaign.endDate) * 1000));

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
          <div
            className={cn(
              "absolute grid grid-cols-2 left-4 right-4 bottom-4 gap-2",
              !campaign.goal || !campaign.endDate ? "grid-cols-1" : ""
            )}
          >
            <div className="flex justify-center items-center bg-white/70 backdrop-blur-md rounded-md p-2 font-semibold text-lg text-center">
              <span>${prettyAmount}</span>
              {campaign.goal && <span className="mx-0.5">/</span>}
              {campaign.goal && <span>{prettyGoal}</span>}
            </div>
            {campaign.endDate && (
              <div className="flex justify-center items-center bg-white/70 backdrop-blur-md rounded-md p-2 font-semibold text-lg text-center">
                {prettyEndDate}
              </div>
            )}
          </div>
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold">{campaign.title}</h1>
          <RecipientSection recipient={campaign.recipient} />
          <p>{campaign.description}</p>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 gap-2">
            <Button asChild>
              <Link href={`/c/${props.id}?mode=donate`}>Donate</Link>
            </Button>

            <div className="flex flex-col md:flex-row gap-2">
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
