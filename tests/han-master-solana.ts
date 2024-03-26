import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HanMasterSolana } from "../target/types/han_master_solana";

describe("han-master-solana", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.HanMasterSolana as Program<HanMasterSolana>;

  let Master = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().accounts({
      master: Master.publicKey,
      user: anchor.getProvider().publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).signers([Master]).rpc();
    console.log("Your transaction signature", tx);
  });
});
