pub mod id;
pub mod state;

mod instructions;

pub use id::ID;

use anchor_lang::prelude::*;
use instructions::*;

#[program]
pub mod maius_invest {
    use super::*;

    /*
     * initialize open orders account
     */
    pub fn create_orders<'info>(
        ctx: Context<'_, '_, '_, 'info, CreateOrders<'info>>,
    ) -> Result<()> {
        create_orders::handler(ctx)
    }

    /*
     *  create investment account and initialize clockwork thread
     */
    pub fn create_investment<'info>(
        ctx: Context<'_, '_, '_, 'info, CreateInvestment<'info>>,
        deposit_amount: u64,
        frequency: u64,
        end_time: u64,
        cron_expression: String,
    ) -> Result<()> {
        create_investment::handler(ctx, deposit_amount, frequency, end_time, cron_expression)
    }

    /*
     * deposit into investment mint A token account
     */
    pub fn deposit<'info>(
        ctx: Context<'_, '_, '_, 'info, Deposit<'info>>,
    ) -> Result<clockwork_sdk::state::ThreadResponse> {
        deposit::handler(ctx)
    }

    /*
     * withdraw from investment mint A token account
     */
    pub fn withdraw<'info>(
        ctx: Context<'_, '_, '_, 'info, Withdraw<'info>>,
        amount: u64,
    ) -> Result<()> {
        withdraw::handler(ctx, amount)
    }

    /*
     * withdraw from investment mint B token account
     */
    pub fn claim<'info>(ctx: Context<'_, '_, '_, 'info, Claim<'info>>, amount: u64) -> Result<()> {
        claim::handler(ctx, amount)
    }

    /*
     * swap
     */
    pub fn swap<'info>(
        ctx: Context<'_, '_, '_, 'info, Swap<'info>>,
    ) -> Result<clockwork_sdk::state::ThreadResponse> {
        swap::handler(ctx)
    }

    /*
     * pause_thread
     */
    pub fn pause_thread<'info>(
        ctx: Context<'_, '_, '_, 'info, PauseThread<'info>>,
    ) -> Result<clockwork_sdk::state::ThreadResponse> {
        pause_thread::handler(ctx)
    }
}
