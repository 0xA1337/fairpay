"use client";

import { fairpayAbi } from "@/core/abis/Fairpay";
import { LoginButton } from "@/shared/components/login-button";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { APP_CHAIN } from "@/shared/constants";
import { fairpayAddress, usdcAbi, usdcAddress } from "@/shared/generated";
import { makeTransactionUrl } from "@/shared/utils/explorer";
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
import { CompassIcon, HouseIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ContractFunctionParameters, parseUnits } from "viem";
import { useAccount } from "wagmi";

interface SubmitButtonWrapperProps {
  campaignId: number;
  amountUsdc: number;
}

export function DonateButtonWrapper({ campaignId, amountUsdc }: SubmitButtonWrapperProps) {
  const { address } = useAccount();
  const finalAmount = parseUnits(amountUsdc.toString(), 6);
  const [isDonationComplete, setIsDonationComplete] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

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
    setIsDonationComplete(true);
    const [tx] = response.transactionReceipts;
    setTxHash(tx.transactionHash);
  };

  return (
    <>
      <Dialog open={isDonationComplete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Donation Complete!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 justify-center items-center py-6">
            <Image src="/assets/checkmark-icon.svg" width={100} height={100} alt="" />
            {txHash && (
              <Button variant={"link"}>
                <Link href={makeTransactionUrl(txHash)} target="_blank">
                  View transaction
                </Link>
              </Button>
            )}
          </div>
          <DialogFooter>
            <Button size={"sm"} variant={"outline"} className="w-full md:w-1/2" asChild>
              <Link href="/explore">
                <CompassIcon className="w-4 h-4 mr-2" />
                Explore
              </Link>
            </Button>
            <Button size={"sm"} asChild className="w-full md:w-1/2 mb-2 md:mb-0">
              <Link href="/">
                <HouseIcon className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {!address && (
        <>
          <LoginButton className="!h-12" text="Log in to donate" />
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
          capabilities={{
            paymasterService: {
              url: process.env.NEXT_PUBLIC_PAYMASTER_ENDPOINT || "",
            },
          }}
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
