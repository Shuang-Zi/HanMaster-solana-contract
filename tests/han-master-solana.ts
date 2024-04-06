import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HanMasterSolana } from "../target/types/han_master_solana";
import {  LAMPORTS_PER_SOL } from '@solana/web3.js';
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import {
	findMasterEditionPda,
	findMetadataPda,
	mplTokenMetadata,
	MPL_TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { publicKey } from "@metaplex-foundation/umi";

import {
	TOKEN_PROGRAM_ID,
	ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { min } from "bn.js";

describe("han-master-solana", async() => {
  let provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.HanMasterSolana as Program<HanMasterSolana>;

  const umi = createUmi("https://api.devnet.solana.com")
	.use(walletAdapterIdentity(wallet))
	.use(mplTokenMetadata());

  const mint = anchor.web3.Keypair.generate();
  let token_airdrop = await provider.connection.requestAirdrop(mint.publicKey,
    10 * LAMPORTS_PER_SOL);

 await provider.connection.confirmTransaction(token_airdrop);

  let [nftAddr] = await anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("nft")], program.programId);

  // Derive the associated token address account for the mint
	const associatedTokenAccount = await getAssociatedTokenAddress(
		mint.publicKey,
		wallet.publicKey
	);
  // derive the metadata account
	let metadataAccount = findMetadataPda(umi, {
		mint: publicKey(mint.publicKey),
	})[0];

	//derive the master edition pda
	let masterEditionAccount = findMasterEditionPda(umi, {
		mint: publicKey(mint.publicKey),
	})[0];
  const metadata = {
		name: "Kobeni",
		symbol: "kBN",
		uri: "https://raw.githubusercontent.com/687c/solana-nft-native-client/main/metadata.json",
	};
  // console.log(`publickey: ${mint.publicKey},  ${provider.publicKey},  ${nftAddr}`);
  it("mints nft!", async () => {
		const tx = await program.methods
			.mintNft(metadata.name, metadata.symbol, metadata.uri)
			.accounts({
				user: mint.publicKey,
				tokenMint: nftAddr,
				associatedTokenAccount,
				metadataAccount,
				masterEditionAccount,
				tokenProgram: TOKEN_PROGRAM_ID,
				associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
				tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
				systemProgram: anchor.web3.SystemProgram.programId,
				rent: anchor.web3.SYSVAR_RENT_PUBKEY,
			})
			.signers([mint])
			.rpc();
      console.log(
        `mint nft tx: https://explorer.solana.com/tx/${tx}?cluster=devnet`
      );
      console.log(
        `minted nft: https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`
      );
    });
});
