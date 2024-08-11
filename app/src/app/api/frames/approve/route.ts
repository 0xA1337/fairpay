import { DonationFrameState } from "@/shared/types/frames";
import {
  FrameRequest,
  FrameValidationData,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit/frame";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

async function handleDonateButton(message: FrameValidationData, id: number, bannerImage: string) {
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          action: "tx",
          label: "Approve USDC",
          target: `${process.env.NEXT_PUBLIC_HOST}/api/frames/approve/tx`,
        },
      ],
      image: bannerImage,
      input: {
        text: "Amount (USDC)",
      },
      state: {
        id,
        bannerImage,
      } as DonationFrameState,
      postUrl: `${process.env.NEXT_PUBLIC_HOST}/api/frames/donate`,
    })
  );
}

export async function POST(request: NextRequest) {
  const frameRequest: FrameRequest = await request.json();
  const searchParams = request.nextUrl.searchParams;
  const id = Number(searchParams.get("id"));
  const bannerImage = searchParams.get("bannerImage");

  const { isValid, message } = await getFrameMessage(frameRequest, {
    allowFramegear: process.env.NEXT_PUBLIC_ENVIRONMENT !== "production",
  });

  if (!isValid || !message) {
    return new Response("Invalid request", { status: 400 });
  }

  if (message.button === 3) {
    return await handleDonateButton(message, id, bannerImage!);
  }
}
