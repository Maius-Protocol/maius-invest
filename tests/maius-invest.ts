import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { MaiusInvest } from "../target/types/maius_invest";

describe("maius_invest", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.MaiusInvest as Program<MaiusInvest>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
