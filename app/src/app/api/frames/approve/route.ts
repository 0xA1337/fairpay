import { DonationFrameState } from "@/shared/types/frames";
import {
  FrameRequest,
  FrameValidationData,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit/frame";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

async function handleDonateButton(message: FrameValidationData) {
  const state: DonationFrameState = JSON.parse(message.state.serialized);

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          action: "tx",
          label: "Approve USDC",
          target: `${process.env.NEXT_PUBLIC_HOST}/api/frames/approve/tx`,
        },
      ],
      image: state.bannerImage,
      input: {
        text: "Amount (USDC)",
      },
      state,
      postUrl: `${process.env.NEXT_PUBLIC_HOST}/api/frames/donate`,
    })
  );
}

export async function POST(request: NextRequest) {
  const frameRequest: FrameRequest = await request.json();
  const { isValid, message } = await getFrameMessage(frameRequest, {
    allowFramegear: process.env.NEXT_PUBLIC_ENVIRONMENT !== "production",
  });

  if (!isValid || !message) {
    return new Response("Invalid request", { status: 400 });
  }

  if (message.button === 3) {
    return await handleDonateButton(message);
  }
}
