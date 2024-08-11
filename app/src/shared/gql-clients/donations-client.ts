import { ApolloClient, InMemoryCache } from "@apollo/client";
import { isTestnet } from "../constants";

const API_URL = `https://api.goldsky.com/api/public/project_clzol11sg0wjw01w8e11wgd0q/subgraphs/fairpay-data-base${isTestnet ? "-sepolia" : ""}/1.0.0/gn`;

const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

export type ResponseType = {
  campaignId: bigint;
  donor: string;
  amount: bigint;
  timestamp_: bigint;
};

export default client;
