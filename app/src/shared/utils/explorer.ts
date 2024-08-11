import { baseSepolia } from "viem/chains";
import { APP_CHAIN } from "../constants";

export function makeTransactionUrl(txHash: string) {
  if (APP_CHAIN.id === baseSepolia.id) {
    return `https://base-sepolia.blockscout.com/tx/${txHash}`;
  }
  return `https://base.blockscout.com/tx/${txHash}`;
}
