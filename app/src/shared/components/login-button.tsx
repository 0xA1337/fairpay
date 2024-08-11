"use client";

import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import { cn } from "../utils/tailwind";

export function LoginButton(props: { text?: string; className?: string }) {
  return (
    <ConnectWallet
      text={props.text ?? "Log in"}
      className={cn(
        props.className,
        "bg-primary [&>span]:text-primary-foreground hover:bg-primary/90 w-full h-10 px-4 py-2 rounded-md [&>span]:text-sm [&>span]:font-medium"
      )}
    />
  );
}
