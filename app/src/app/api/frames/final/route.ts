import { DonationFrameState } from "@/shared/types/frames";
import { buildWarpcastIntentUrl } from "@/shared/utils/social";
import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from "@coinbase/onchainkit/frame";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const frameRequest: FrameRequest = await request.json();
  const { isValid, message } = await getFrameMessage(frameRequest, {
    allowFramegear: process.env.NEXT_PUBLIC_ENVIRONMENT !== "production",
  });

  if (!isValid || !message) {
    return new Response("Invalid request", { status: 400 });
  }

  const { id, bannerImage }: DonationFrameState = JSON.parse(
    decodeURIComponent(message.state.serialized)
  );

  const campaignUrl = `${process.env.NEXT_PUBLIC_HOST}/c/${id}`;
  const farcasterUrl = buildWarpcastIntentUrl("Check out this campaign on Fairpay!", [campaignUrl]);

  return new NextResponse(
    getFrameHtmlResponse({
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
      ],
      image: bannerImage,
    })
  );
}
