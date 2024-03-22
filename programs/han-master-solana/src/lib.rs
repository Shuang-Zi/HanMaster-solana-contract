use anchor_lang::prelude::*;

declare_id!("9JjymTUKnDM91mAx3g75yvMkxW8udrx16AfVkmRwjNjJ");

#[program]
pub mod han_master_solana {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
