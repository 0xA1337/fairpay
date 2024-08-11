/* eslint-disable @next/next/no-img-element */
import campaignsClient, { ResponseType } from "@/shared/gql-clients/latest-campaigns-client";
import { buildIpfsUrl } from "@/shared/utils/ipfs";
import { gql } from "@apollo/client";
import Link from "next/link";

async function fetchLatestCampaigns() {
  try {
    const query = gql`
      query LatestCampaigns($timestamp: Int!) {
        campaignCreateds(
          first: 10
          orderBy: timestamp_
          orderDirection: desc
          where: { or: [{ endDate: 0 }, { endDate_gt: $timestamp }] }
        ) {
          idParam
          title
          timestamp_
          endDate
          goal
          recipient
          bannerImage
        }
      }
    `;

    const timestamp = Math.floor(Date.now() / 1000);
    console.log("timestamp", timestamp);

    const result = await campaignsClient.query<{ campaignCreateds: ResponseType[] }>({
      query,
      variables: {
        timestamp,
      },
    });

    return result.data.campaignCreateds;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function CampaignsGrid() {
  const campaigns = await fetchLatestCampaigns();
  return (
    <div className="grid grid-cols-2 gap-6">
      {campaigns.map((campaign) => (
        <Link href={`/c/${campaign.idParam}`} key={campaign.idParam}>
          <div className="w-full h-[300px] shadow-md rounded-md overflow-hidden">
            <div className="h-2/3">
              <img
                src={buildIpfsUrl(campaign.bannerImage)}
                alt={""}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-1/3 overflow-hidden p-3">
              <h3 className="font-semibold text-lg">{campaign.title}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
