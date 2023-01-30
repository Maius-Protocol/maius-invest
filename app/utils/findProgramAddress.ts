import { PublicKey } from "@solana/web3.js";
import { programID } from "./constants";

const SEED_INVESTMENT = "investment";

export const findInvestmentAddress = async ({
  payer,
  mint_a,
  mint_b,
}: {
  payer: PublicKey;
  mint_a: PublicKey;
  mint_b: PublicKey;
}) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(SEED_INVESTMENT),
      payer.toBuffer(),
      mint_a.toBuffer(),
      mint_b.toBuffer(),
    ],
    programID
  );
};
