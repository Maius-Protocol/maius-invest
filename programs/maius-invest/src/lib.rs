pub mod id;
pub mod state;

mod instructions;

pub use id::ID;

use anchor_lang::prelude::*;
use instructions::*;

#[program]
pub mod clockwork_investments {
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
        swap_amount: u64,
    ) -> Result<()> {
        create_investment::handler(ctx, swap_amount)
    }

    /*
     * deposit into investment mint A token account
     */
    pub fn deposit<'info>(
        ctx: Context<'_, '_, '_, 'info, Deposit<'info>>,
        amount: u64,
    ) -> Result<()> {
        deposit::handler(ctx, amount)
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
}
