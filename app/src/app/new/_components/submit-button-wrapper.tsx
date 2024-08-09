"use client";

import LoginButton from "@/app/_components/login-button";
import { fairpayAbi } from "@/core/abis/Fairpay";
import { APP_CHAIN } from "@/shared/constants";
import { fairpayAddress } from "@/shared/generated";
import {
  Transaction,
  TransactionButton,
  TransactionError,
  TransactionResponse,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { Address, ContractFunctionParameters } from "viem";
import { useAccount } from "wagmi";

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
  const mintTo = address;

  const finalGoal = goal ? BigInt(goal) : undefined;
  const finalEndDate = endDate ? BigInt(Math.floor(endDate.getTime() / 1000)) : undefined;

  const contracts = [
    {
      address: fairpayAddress,
      abi: fairpayAbi,
      functionName: "createCampaign",
      args: [title, description, undefined, recipient, finalGoal, finalEndDate],
    },
  ] as unknown as ContractFunctionParameters[];

  const handleError = (err: TransactionError) => {
    console.error("Transaction error:", err);
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log("Transaction successful", response);
  };

  return (
    <div className="flex w-[450px]">
      {!address && <LoginButton />}
      {address && (
        <Transaction
          address={address}
          contracts={contracts}
          className="w-[450px]"
          chainId={APP_CHAIN.id}
          onError={handleError}
          onSuccess={handleSuccess}
        >
          <TransactionButton
            className="mt-0 mr-auto ml-auto w-[450px] max-w-full text-[white]"
            text="Collect"
          />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
        </Transaction>
      )}
    </div>
  );
}
