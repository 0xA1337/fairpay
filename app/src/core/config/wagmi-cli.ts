import { defineConfig } from "@wagmi/cli";
import { actions, react } from "@wagmi/cli/plugins";
import { Address, zeroAddress } from "viem";
import { fairpayAbi } from "../abis/Fairpay";

export default defineConfig({
  out: "src/shared/generated.ts",
  contracts: [
    {
      name: "Fairpay",
      abi: fairpayAbi,
      address: (process.env.FAIRPAY_ADDRESS || zeroAddress) as Address,
    },
  ],
  plugins: [react(), actions()],
});
