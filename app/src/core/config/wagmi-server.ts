import { APP_CHAIN } from "@/shared/constants";
import { base, baseSepolia } from "viem/chains";
import { createConfig, http } from "wagmi";

export const serverWagmiConfig = createConfig({
  chains: [APP_CHAIN],
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});
