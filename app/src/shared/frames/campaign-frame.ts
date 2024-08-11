import { getFrameMetadata } from "@coinbase/onchainkit/frame";
import { buildWarpcastIntentUrl } from "../utils/social";

export const getCampaignFrame = (params: { id: number; bannerImage: string }) => {
  const campaignUrl = `${process.env.NEXT_PUBLIC_HOST}/c/${params.id}`;
  const farcasterUrl = buildWarpcastIntentUrl("Check out this campaign on Fairpay!", [campaignUrl]);

  return getFrameMetadata({
    buttons: [
      {
        action: "link",
        label: "Open",
        target: campaignUrl,
      },
      {
        action: "link",
        label: "Share",
        target: farcasterUrl,
      },
      {
        label: "Donate",
        action: "post",
      },
    ],
    image:
      "https://aqua-wooden-kite-259.mypinata.cloud/ipfs/QmahtmC5tLALkxbwDCfvXCgyFvJd9UyZdDEgtRkDwy2o6B",
    postUrl: `${process.env.NEXT_PUBLIC_HOST}/api/frames/approve?id=${params.id}&bannerImage=${params.bannerImage}`,
  });
};
