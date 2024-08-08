"use client";

import WalletWrapper from "./wallet-wrapper";

export default function SignupButton() {
  return (
    <WalletWrapper
      className="min-w-[90px] bg-secondary [&>span]:text-secondary-foreground hover:bg-secondary/80"
      text="Sign up"
    />
  );
}
