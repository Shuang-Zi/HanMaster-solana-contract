use anchor_lang::prelude::*;

declare_id!("9JjymTUKnDM91mAx3g75yvMkxW8udrx16AfVkmRwjNjJ");

#[program]
pub mod han_master_solana {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Initialize master account
        let master = &mut ctx.accounts.master;
        master.total_nft = 0;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub master: Account<'info, Master>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
#[account]
pub struct Master {
    pub total_nft: u64,
}
