"use client";

import { useAccount } from "wagmi";
import LoginButton from "./login-button";
import SignupButton from "./signup-button";

export function HeaderAuthSection() {
  const { address } = useAccount();
  return (
    <div className="flex items-center space-x-4">
      {!address && <LoginButton />}
      <SignupButton />
    </div>
  );
}
