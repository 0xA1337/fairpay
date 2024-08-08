"use client";

import WalletWrapper from "./wallet-wrapper";

export default function LoginButton() {
  return (
    <WalletWrapper
      className="min-w-[90px] bg-primary [&>span]:text-primary-foreground hover:bg-primary/90"
      text="Log in"
      withWalletAggregator={true}
    />
  );
}
