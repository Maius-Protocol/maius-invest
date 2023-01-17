use {
    crate::state::*,
    anchor_lang::{
        prelude::*,
        solana_program::{system_program, sysvar},
    },
    anchor_spl::{
        associated_token::AssociatedToken,
        token::{self, Mint, TokenAccount, Transfer},
    },
};

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct Deposit<'info> {
    #[account(address = anchor_spl::associated_token::ID)]
    pub associated_token_program: Program<'info, AssociatedToken>,

    #[account(
        address = Investment::pubkey(investment.payer, investment.mint_a, investment.mint_b),
        has_one = payer,
        has_one = mint_a
    )]
    pub investment: Account<'info, Investment>,

    #[account(
        mut,
        associated_token::authority = investment,
        associated_token::mint = mint_a
    )]
    pub investment_mint_a_token_account: Account<'info, TokenAccount>,

    #[account()]
    pub mint_a: Account<'info, Mint>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mut,
        associated_token::authority = payer,
        associated_token::mint = mint_a
    )]
    pub payer_mint_a_token_account: Account<'info, TokenAccount>,

    #[account(address = sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,

    #[account(address = anchor_spl::token::ID)]
    pub token_program: Program<'info, anchor_spl::token::Token>
}

pub fn handler<'info>(ctx: Context<'_, '_, '_, 'info, Deposit<'info>>, amount: u64) -> Result<()> {
    // get accounts
    let investment_mint_a_token_account = &mut ctx.accounts.investment_mint_a_token_account;
    let payer = &ctx.accounts.payer;
    let payer_mint_a_token_account = &mut ctx.accounts.payer_mint_a_token_account;
    let token_program = &ctx.accounts.token_program;

    // deposit funds from sender's token account to escrow token account
    token::transfer(
        CpiContext::new(
            token_program.to_account_info(), 
            Transfer {
                from: investment_mint_a_token_account.to_account_info(),
                to: payer_mint_a_token_account.to_account_info(),
                authority: payer.to_account_info()
            }
        ),
        amount
    )?;

    Ok(())
}