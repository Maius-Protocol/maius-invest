
use {
    crate::state::{Investment, SEED_INVESTMENT},
    crate::state::*,
    anchor_lang::{
        prelude::*,
        solana_program::{system_program, sysvar},
    },
    anchor_spl::{
        associated_token::AssociatedToken,
        token::{self, Mint, TokenAccount, Transfer},
    },
    clockwork_sdk::state::{ThreadResponse, Thread},
    clockwork_sdk::{
        thread_program::{
            self,
            accounts::{Thread, ThreadAccount},
            ThreadProgram,
        }
    }
};


#[derive(Accounts)]
pub struct PauseThread<'info> {
    #[account(
        seeds = [
            SEED_INVESTMENT,
            investment.payer.key().as_ref(),
            investment.mint_a.key().as_ref(),
            investment.mint_b.key().as_ref()
        ],
        bump,
    )]
    pub investment: Account<'info, Investment>,

    #[account(
        address = investment_thread.pubkey(),
        constraint = investment_thread.id.eq("investment")
    )]
    pub investment_thread: Account<'info, Thread>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(address = sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
    #[account(address = thread_program::ID)]
    pub thread_program: Program<'info, ThreadProgram>,
}

pub fn handler(ctx: Context<PauseThread>) -> Result<ThreadResponse> {
    let investment = &ctx.accounts.investment;
    let investment_thread = &ctx.accounts.investment_thread;
    // get investment bump
    let bump = *ctx.bumps.get("investment").unwrap();

    clockwork_sdk::thread_program::cpi::thread_stop(CpiContext::new_with_signer(
        thread_program.to_account_info(),
        clockwork_sdk::thread_program::cpi::accounts::ThreadStop {
            authority: investment.to_account_info(),
            thread: investment_thread.to_account_info(),
        },
        &[&[
            SEED_INVESTMENT,
            investment.payer.as_ref(),
            investment.mint_a.as_ref(),
            investment.mint_b.as_ref(),
            &[bump],
        ]],
    ))?;

    Ok(ThreadResponse {
        next_instruction: None,
        kickoff_instruction: None,
    })

}