import { APP_CHAIN } from "@/shared/constants";
import { fairpayAddress, usdcAbi, usdcAddress } from "@/shared/generated";
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

  // check if message.number isn't a positive integer
  if (!Number.isInteger(+message.input) || +message.input <= 0) {
    return new Response("Invalid input", { status: 400 });
  }

  const data = encodeFunctionData({
    abi: usdcAbi,
    functionName: "approve",
    args: [fairpayAddress, parseUnits(message.input, 6)],
  });

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${APP_CHAIN.id}`,
    method: "eth_sendTransaction",
    params: {
      abi: [],
      data,
      to: usdcAddress,
      value: parseEther("0.00000").toString(),
    },
  };

  return NextResponse.json(txData);
}
