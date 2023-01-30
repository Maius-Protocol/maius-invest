
use {
    crate::state::{Investment, SEED_INVESTMENT},
    anchor_lang::{
        prelude::*,
    },
    clockwork_sdk::state::{ThreadResponse, Thread},
    clockwork_sdk::{
        ThreadProgram,
    }
};

#[derive(Accounts)]
pub struct PauseThread<'info> {
    #[account(
        mut,
        seeds = [
            SEED_INVESTMENT,
            investment.investor.key().as_ref(),
            investment.pc_mint.as_ref(),
            investment.coin_mint.as_ref(),
        ],
        bump,
    )]
    pub investment: Account<'info, Investment>,

    #[account(mut, address = Thread::pubkey(investment.key(), "investment".into()))]
    pub investment_thread: Account<'info, Thread>,

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(address = clockwork_sdk::ID)]
    pub clockwork_program: Program<'info, ThreadProgram>,
}

pub fn handler(ctx: Context<PauseThread>) -> Result<ThreadResponse> {
    let investment = &ctx.accounts.investment;
    let investment_thread = &ctx.accounts.investment_thread;
    let clockwork_program = &ctx.accounts.clockwork_program;
    // get investment bump
    let bump = *ctx.bumps.get("investment").unwrap();
    clockwork_sdk::cpi::thread_pause(CpiContext::new_with_signer(
        clockwork_program.to_account_info(),
        clockwork_sdk::cpi::ThreadPause {
            authority: investment.to_account_info(),
            thread: investment_thread.to_account_info(),
        },
        &[&[
            SEED_INVESTMENT,
            investment.investor.as_ref(),
            investment.pc_mint.as_ref(),
            investment.coin_mint.as_ref(),
            &[bump],
        ]],
    ))?;

    Ok(ThreadResponse {
        next_instruction: None,
        kickoff_instruction: None,
    })

}