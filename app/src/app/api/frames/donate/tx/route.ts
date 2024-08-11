import { APP_CHAIN } from "@/shared/constants";
import { fairpayAbi, fairpayAddress } from "@/shared/generated";
import { DonationFrameState } from "@/shared/types/frames";
import {
  FrameRequest,
  FrameTransactionResponse,
  getFrameMessage,
} from "@coinbase/onchainkit/frame";
import { NextResponse, type NextRequest } from "next/server";
import { encodeFunctionData, parseEther, parseUnits } from "viem";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const frameRequest: FrameRequest = await request.json();
  const { isValid, message } = await getFrameMessage(frameRequest, {
    allowFramegear: process.env.NEXT_PUBLIC_ENVIRONMENT !== "production",
  });

  if (!isValid || !message) {
    return new Response("Invalid request", { status: 400 });
  }

  console.log("Message: ", message);

  const { id, amount }: DonationFrameState = JSON.parse(message.state.serialized);

  const data = encodeFunctionData({
    abi: fairpayAbi,
    functionName: "donate",
    args: [BigInt(id), parseUnits((amount || 0).toString(), 6)],
  });

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${APP_CHAIN.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: [],
      data,
      to: fairpayAddress,
      value: parseEther("0.00000").toString(),
    },
  };

  return NextResponse.json(txData);
}
