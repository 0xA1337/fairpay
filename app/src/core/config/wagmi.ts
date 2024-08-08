import { APP_CHAIN } from "@/shared/constants";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { coinbaseWallet } from "@rainbow-me/rainbowkit/wallets";
import { base, baseSepolia } from "viem/chains";
import { createConfig, http } from "wagmi";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [coinbaseWallet],
    },
  ],
  {
    appName: "Fairpay",
    projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "",
  }
);

export const wagmiConfig = createConfig({
  chains: [APP_CHAIN],
  multiInjectedProviderDiscovery: false,
  connectors,
  ssr: true,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});
