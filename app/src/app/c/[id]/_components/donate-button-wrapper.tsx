"use client";

import { fairpayAbi } from "@/core/abis/Fairpay";
import { LoginButton } from "@/shared/components/login-button";
import { APP_CHAIN } from "@/shared/constants";
import { fairpayAddress, usdcAbi, usdcAddress } from "@/shared/generated";
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
import { ContractFunctionParameters, parseUnits } from "viem";
import { useAccount } from "wagmi";

interface SubmitButtonWrapperProps {
  campaignId: number;
  amountUsdc: number;
}

export function DonateButtonWrapper({ campaignId, amountUsdc }: SubmitButtonWrapperProps) {
  const { address } = useAccount();
  const router = useRouter();
  const finalAmount = parseUnits(amountUsdc.toString(), 6);

  const contracts = [
    {
      address: usdcAddress,
      abi: usdcAbi,
      functionName: "approve",
      args: [fairpayAddress, finalAmount],
    },
    {
      address: fairpayAddress,
      abi: fairpayAbi,
      functionName: "donate",
      args: [BigInt(campaignId), finalAmount],
    },
  ] as unknown as ContractFunctionParameters[];

  const handleError = (err: TransactionError) => {
    console.error("Transaction error:", err);
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log("Transaction success:", response);
  };

  return (
    <>
      {!address && (
        <>
          <LoginButton text="Log in to donate" />
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
          <TransactionButton
            className="h-12 px-4 py-2 rounded-md [&>span]:text-sm [&>span]:font-medium w-full mt-0 bg-primary [&>span]:text-primary-foreground hover:bg-primary/90"
            text="Donate"
            disabled={amountUsdc <= 0 || amountUsdc > 5_000_000}
          />
          <TransactionToast>
            <TransactionToastIcon />
            <TransactionToastLabel />
            <TransactionToastAction />
          </TransactionToast>
        </Transaction>
      )}
    </>
  );
}
