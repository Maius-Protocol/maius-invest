use {
    crate::state::*,
    anchor_lang::{
        prelude::*,
        solana_program::{system_program, sysvar},
    },
    anchor_spl::token::{self, Mint, TokenAccount, Transfer},
};

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct Claim<'info> {
    #[account(
        seeds = [
            SEED_INVESTMENT, 
            investment.investor.as_ref(),
            investment.pc_mint.as_ref(),
            investment.coin_mint.as_ref(),
        ], 
        bump,
        has_one = investor,
        has_one = coin_mint
    )]
    pub investment: Account<'info, Investment>,

    #[account(
        mut,
        associated_token::authority = investment,
        associated_token::mint = investment.coin_mint,
    )]
    pub investment_coin_vault: Account<'info, TokenAccount>,

    #[account()]
    pub coin_mint: Account<'info, Mint>,

    #[account(mut)]
    pub investor: Signer<'info>,

    #[account(
        mut,
        associated_token::authority = investment.investor,
        associated_token::mint = investment.coin_mint,
    )]
    pub investor_coin_vault: Account<'info, TokenAccount>,

    #[account(address = sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,

    #[account(address = clockwork_sdk::ID)]
    pub scheduler_program: Program<'info, clockwork_sdk::ThreadProgram>,

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,

    #[account(address = anchor_spl::token::ID)]
    pub token_program: Program<'info, anchor_spl::token::Token>,
}

pub fn handler<'info>(ctx: Context<'_, '_, '_, 'info, Claim<'info>>, amount: u64) -> Result<()> {
    // Get accounts
    let investment = &ctx.accounts.investment;
    let investment_coin_vault = &mut ctx.accounts.investment_coin_vault;
    let investor_coin_vault = &mut ctx.accounts.investor_coin_vault;
    let token_program = &ctx.accounts.token_program;

    // get investment bump
    let bump = *ctx.bumps.get("investment").unwrap();

    // claim coin_mint token after swap from investment's coin vault to investor's coin vault
    token::transfer(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            Transfer {
                from: investment_coin_vault.to_account_info(),
                to: investor_coin_vault.to_account_info(),
                authority: investment.to_account_info(),
            },
            &[&[
                SEED_INVESTMENT,
                investment.investor.as_ref(),
                investment.pc_mint.as_ref(),
                investment.coin_mint.as_ref(),
                &[bump],
            ]]
        ),
        amount,
    )?;

    Ok(())
}
