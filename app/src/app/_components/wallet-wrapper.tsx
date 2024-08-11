"use client";

import { cn } from "@/shared/utils/tailwind";
import { Avatar, Identity, Name } from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
  WalletDropdownLink,
} from "@coinbase/onchainkit/wallet";

type WalletWrapperParams = {
  text?: string;
  className?: string;
  withWalletAggregator?: boolean;
};
export default function WalletWrapper({
  className,
  text,
  withWalletAggregator = false,
}: WalletWrapperParams) {
  return (
    <>
      <Wallet>
        <ConnectWallet
          withWalletAggregator={withWalletAggregator}
          text={text}
          className={cn(
            "h-10 px-3 !min-w-0 md:px-4 py-2 rounded-md [&>span]:text-sm [&>span]:font-medium",
            className
          )}
        >
          <Avatar className="h-6 w-6" />
          <div className="text-secondary-foreground font-medium">Account</div>
        </ConnectWallet>
        <WalletDropdown className="shadow-md pb-0">
          <Identity className={cn("px-4 pt-3 pb-2")}>
            <Avatar />
            <Name />
          </Identity>
          <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com" className="py-2">
            Go to wallet dashboard
          </WalletDropdownLink>
          <WalletDropdownDisconnect className="py-2" />
        </WalletDropdown>
      </Wallet>
    </>
  );
}
