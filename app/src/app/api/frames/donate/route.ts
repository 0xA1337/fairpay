import { DonationFrameState } from "@/shared/types/frames";
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

  console.log("vvvvvvvvv", message);
  const state: DonationFrameState = JSON.parse(decodeURIComponent(message.state.serialized));

  // check if message.number isn't a positive integer
  if (!Number.isInteger(+message.input) || +message.input <= 0) {
    return new Response("Invalid input", { status: 400 });
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          action: "tx",
          label: "Donate",
          target: `${process.env.NEXT_PUBLIC_HOST}/api/frames/donate/tx`,
        },
      ],
      image: state.bannerImage,
      state: {
        ...state,
        amount: +message.input,
      },
      postUrl: `${process.env.NEXT_PUBLIC_HOST}/api/frames/final`,
    })
  );
}
