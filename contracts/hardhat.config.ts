import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-verify";
import { HardhatUserConfig, vars } from "hardhat/config";

const PRIVATE_KEY = vars.get("PRIVATE_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    "base-mainnet": {
      url: "https://mainnet.base.org",
      accounts: [PRIVATE_KEY],
    },
    "base-sepolia": {
      url: "https://sepolia.base.org",
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      "base-mainnet": "x", // Not required
      "base-sepolia": "x", // Not required
    },
    customChains: [
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://base-sepolia.blockscout.com/api",
          browserURL: "https://base-sepolia.blockscout.com/",
        },
      },
      {
        network: "base-mainnet",
        chainId: 8453,
        urls: {
          apiURL: "https://base.blockscout.com/api",
          browserURL: "https://base.blockscout.com/",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
};

export default config;
