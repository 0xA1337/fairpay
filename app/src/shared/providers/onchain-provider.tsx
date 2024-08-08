"use client";

import { wagmiConfig } from "@/core/config/wagmi";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { lightTheme, RainbowKitProvider, Theme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { APP_CHAIN } from "../constants";

const queryClient = new QueryClient();

const rainbowTheme: Theme = lightTheme({
  accentColor: "#facc15",
  accentColorForeground: "#69492E",
  borderRadius: "small",
  overlayBlur: "small",
});

export const OnchainProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider apiKey="process.env.NEXT_PUBLIC_OCK_API_KEY" chain={APP_CHAIN}>
          <RainbowKitProvider modalSize={"compact"} theme={rainbowTheme}>
            {children}
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
