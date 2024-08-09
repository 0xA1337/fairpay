"use client";

import { fairpayAbi } from "@/core/abis/Fairpay";
import { FormLabel } from "@/shared/components/ui/form";
import { APP_CHAIN } from "@/shared/constants";
import { fairpayAddress } from "@/shared/generated";
import {
  Transaction,
  TransactionButton,
  TransactionError,
  TransactionResponse,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
} from "@coinbase/onchainkit/transaction";
import { useRouter } from "next/navigation";
import { Address, ContractFunctionParameters, parseEventLogs } from "viem";
import { useAccount } from "wagmi";
import { LoginButton } from "./login-button";

interface SubmitButtonWrapperProps {
  title: string;
  description: string;
  bannerImage?: string;
  recipient: Address;
  goal?: number;
  endDate?: Date;
}

export function SubmitButtonWrapper({
  title,
  description,
  bannerImage,
  recipient,
  goal,
  endDate,
}: SubmitButtonWrapperProps) {
  const { address } = useAccount();
  const router = useRouter();

  const finalGoal = goal ? BigInt(goal) : undefined;
  const finalEndDate = endDate ? BigInt(Math.floor(endDate.getTime() / 1000)) : undefined;

  const contracts = [
    {
      address: fairpayAddress,
      abi: fairpayAbi,
      functionName: "createCampaign",
      args: [title, description, bannerImage, recipient, finalGoal, finalEndDate],
    },
  ] as unknown as ContractFunctionParameters[];

  const handleError = (err: TransactionError) => {
    console.error("Transaction error:", err);
  };

  const handleSuccess = (response: TransactionResponse) => {
    const firstReceipt = response.transactionReceipts[0];
    const parsedLogs = parseEventLogs({
      logs: firstReceipt.logs,
      abi: fairpayAbi,
      eventName: "CampaignCreated",
    });
    const campaignId = parsedLogs[0].args.id;
    router.push(`/c/${campaignId}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      {!address && (
        <>
          <FormLabel className="invisible">Submit</FormLabel>
          <LoginButton text="Log in to create" />
        </>
      )}
      {address && (
        <Transaction
          address={address}
          contracts={contracts}
          className="w-[450px]"
          chainId={APP_CHAIN.id}
          onError={handleError}
          onSuccess={handleSuccess}
        >
          <FormLabel className="invisible">Submit</FormLabel>

          <TransactionButton
            className="h-10 px-4 py-2 rounded-md [&>span]:text-sm [&>span]:font-medium w-full mt-0 bg-primary [&>span]:text-primary-foreground hover:bg-primary/90"
            text="Create"
          />
          <TransactionToast>
            <TransactionToastIcon />
            <TransactionToastLabel />
            <TransactionToastAction />
          </TransactionToast>
        </Transaction>
      )}
    </div>
  );
}
