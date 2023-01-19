import { PublicKey } from "@solana/web3.js";

export type ClusterType = "mainnet-beta" | "testnet" | "devnet" | "custom";

export const CLOCKWORKS_CRANK_PROGRAM_ID = new PublicKey(
  "BM8qtWUVWL6srduS6dSdYLCWds1Y866arsRrL22tFAz6"
);

export const EXPLORER_ADDRESS_BASE = "https://explorer.solana.com/address/";
