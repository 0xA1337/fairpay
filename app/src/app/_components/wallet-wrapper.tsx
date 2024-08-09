"use client";

import { cn } from "@/shared/utils/tailwind";
import { Address, Avatar, EthBalance, Identity, Name } from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
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
            "h-10 px-4 py-2 rounded-md [&>span]:text-sm [&>span]:font-medium",
            className
          )}
        >
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className={cn("px-4 pt-3 pb-2")} hasCopyAddressOnClick={true}>
            <Avatar />
            <Name />
            <Address />
            <EthBalance />
          </Identity>

          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </>
  );
}