use {
    crate::state::*,
    anchor_lang::{
        prelude::*,
        solana_program::{system_program, sysvar},
    },
    anchor_spl::{
        token::{self, Mint, TokenAccount, Transfer}, 
        dex::{self, SettleFunds}
    },
};

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct Claim<'info> {
    #[account(address = anchor_spl::dex::ID)]
    pub dex_program: Program<'info, anchor_spl::dex::Dex>,

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

    #[account(mut)]
    pub market: AccountInfo<'info>,

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,

    #[account(address = anchor_spl::token::ID)]
    pub token_program: Program<'info, anchor_spl::token::Token>,
}

pub fn handler<'info>(ctx: Context<'_, '_, '_, 'info, Claim<'info>>, amount: u64) -> Result<()> {
    // Get accounts
    let dex_program = &ctx.accounts.dex_program;
    let market = &mut ctx.accounts.market;
    let investment = &ctx.accounts.investment;
    let investment_coin_vault = &mut ctx.accounts.investment_coin_vault;
    let investor_coin_vault = &mut ctx.accounts.investor_coin_vault;
    let token_program = &ctx.accounts.token_program;
    
    // Get remaining accounts
    let pc_vault = ctx.remaining_accounts.get(0).unwrap();
    let pc_wallet = ctx.remaining_accounts.get(1).unwrap();
    let coin_vault = ctx.remaining_accounts.get(2).unwrap();
    let coin_wallet = ctx.remaining_accounts.get(3).unwrap();
    let open_orders = ctx.remaining_accounts.get(4).unwrap();
    let vault_signer = ctx.remaining_accounts.get(5).unwrap();

    // get investment bump
    let bump = *ctx.bumps.get("investment").unwrap();

    // Settle funds from investment's open_orders account to investment's coin vault
    dex::settle_funds(CpiContext::new_with_signer(
        dex_program.to_account_info(),
        SettleFunds {
            market: market.to_account_info(),
            token_program: token_program.to_account_info(),
            open_orders: open_orders.to_account_info(),
            open_orders_authority: investment.to_account_info(),
            coin_vault: coin_vault.to_account_info(),
            pc_vault: pc_vault.to_account_info(),
            coin_wallet: coin_wallet.to_account_info(),
            pc_wallet: pc_wallet.to_account_info(),
            vault_signer: vault_signer.to_account_info(),
        },
        &[&[
            SEED_INVESTMENT,
            investment.investor.as_ref(),
            investment.pc_mint.as_ref(),
            investment.coin_mint.as_ref(),
            &[bump]
        ]]
    ))?;

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
