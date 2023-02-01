use {
    crate::state::{Investment, SEED_INVESTMENT},
    anchor_lang::{
        __private::bytemuck::Contiguous,
        prelude::*,
        solana_program::{instruction::Instruction, system_program, sysvar},
    },
    anchor_spl::{
        associated_token::get_associated_token_address,
        dex::{
            serum_dex::{
                instruction::SelfTradeBehavior,
                matching::{OrderType, Side},
            },
            NewOrderV3,
        },
        token::{Token, TokenAccount},
    },
    clockwork_sdk::state::{Thread, ThreadAccount, ThreadResponse},
    std::num::NonZeroU64,
};

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(address = anchor_spl::dex::ID)]
    pub dex_program: Program<'info, anchor_spl::dex::Dex>,

    #[account(
        seeds = [
            SEED_INVESTMENT,
            investment.investor.key().as_ref(),
            investment.pc_mint.key().as_ref(),
            investment.coin_mint.key().as_ref()
        ],
        bump,
    )]
    pub investment: Box<Account<'info, Investment>>,

    #[account(
        mut,
        associated_token::authority = investment,
        associated_token::mint = investment.pc_mint
    )]
    pub investment_pc_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        signer,
        address = investment_thread.pubkey(),
    )]
    pub investment_thread: Box<Account<'info, Thread>>,

    #[account(address = sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,

    #[account(address = anchor_spl::token::ID)]
    pub token_program: Program<'info, Token>,
}

pub fn handler<'info>(ctx: Context<'_, '_, '_, 'info, Swap<'info>>) -> Result<ThreadResponse> {
    // get accounts
    let dex_program = &ctx.accounts.dex_program;
    let investment = &ctx.accounts.investment;
    let investment_pc_vault = &mut ctx.accounts.investment_pc_vault;
    let investment_thread = &ctx.accounts.investment_thread;
    let rent = &ctx.accounts.rent;
    let token_program = &ctx.accounts.token_program;

    // get remaining accounts
    let market = ctx.remaining_accounts.get(0).unwrap();
    let pc_vault = ctx.remaining_accounts.get(1).unwrap();
    let coin_vault = ctx.remaining_accounts.get(2).unwrap();
    let request_queue = ctx.remaining_accounts.get(3).unwrap();
    let event_queue = ctx.remaining_accounts.get(4).unwrap();
    let market_bids = ctx.remaining_accounts.get(5).unwrap();
    let market_asks = ctx.remaining_accounts.get(6).unwrap();
    let open_orders = ctx.remaining_accounts.get(7).unwrap();

    // get investment bump
    let bump = *ctx.bumps.get("investment").unwrap();

    // msg!("swap_amount: {}", investment.swap_amount);

    // place order on openbook dex
    anchor_spl::dex::new_order_v3(
        CpiContext::new_with_signer(
            dex_program.to_account_info(),
            NewOrderV3 {
                market: market.to_account_info(),
                open_orders: open_orders.to_account_info(),
                request_queue: request_queue.to_account_info(),
                event_queue: event_queue.to_account_info(),
                market_bids: market_bids.to_account_info(),
                market_asks: market_asks.to_account_info(),
                order_payer_token_account: investment_pc_vault.to_account_info(),
                open_orders_authority: investment.to_account_info(),
                coin_vault: coin_vault.to_account_info(),
                pc_vault: pc_vault.to_account_info(),
                token_program: token_program.to_account_info(),
                rent: rent.to_account_info(),
            },
            &[&[
                SEED_INVESTMENT,
                investment.investor.as_ref(),
                investment.pc_mint.as_ref(),
                investment.coin_mint.as_ref(),
                &[bump],
            ]],
        ),
        Side::Bid,
        NonZeroU64::new(NonZeroU64::MAX_VALUE).unwrap(),
        NonZeroU64::new(NonZeroU64::MAX_VALUE).unwrap(),
        NonZeroU64::new(investment.swap_amount).unwrap(),
        SelfTradeBehavior::DecrementTake,
        OrderType::Limit,
        019269,
        std::u16::MAX,
    )?;

    let investor_pc_vault = get_associated_token_address(&investment.investor, &investment.pc_mint);

    let deposit_account_metas = vec![
        AccountMeta::new_readonly(investment.pc_mint, false),
        AccountMeta::new_readonly(investment.coin_mint, false),
        AccountMeta::new_readonly(investment.key(), false),
        AccountMeta::new(investment_pc_vault.key(), false),
        AccountMeta::new(investor_pc_vault.key(), false),
        AccountMeta::new_readonly(investment_thread.key(), true),
        AccountMeta::new_readonly(system_program::ID, false),
        AccountMeta::new_readonly(token_program.key(), false),
        // Extra accounts
        AccountMeta::new(market.key(), false),
        AccountMeta::new(pc_vault.key(), false),
        AccountMeta::new(coin_vault.key(), false),
        AccountMeta::new(request_queue.key(), false),
        AccountMeta::new(event_queue.key(), false),
        AccountMeta::new(market_bids.key(), false),
        AccountMeta::new(market_asks.key(), false),
        AccountMeta::new(open_orders.key(), false),
    ];

    Ok(ThreadResponse {
        kickoff_instruction: Some(
            Instruction {
                program_id: crate::ID,
                accounts: deposit_account_metas,
                data: clockwork_sdk::utils::anchor_sighash("deposit").into(),
            }
            .into(),
        ),
        next_instruction: None,
    })
}
