use {
    crate::state::*,
    anchor_lang::{
        prelude::*,
        solana_program::{instruction::Instruction, system_program, sysvar},
    },
    anchor_spl::{
        associated_token::{self, AssociatedToken},
        dex::InitOpenOrders,
        token::{self, Mint, TokenAccount},
    },
    clockwork_sdk::{
        state::{Thread, Trigger},
        ThreadProgram,
    },
    std::mem::size_of,
};

#[derive(Accounts)]
#[instruction(swap_amount: u64)]
pub struct CreateInvestment<'info> {
    #[account(address = anchor_spl::associated_token::ID)]
    pub associated_token_program: Program<'info, AssociatedToken>,

    #[account(address = clockwork_sdk::ID)]
    pub clockwork_program: Program<'info, ThreadProgram>,

    #[account(address = anchor_spl::dex::ID)]
    pub dex_program: Program<'info, anchor_spl::dex::Dex>,

    #[account(
        init,
        seeds = [SEED_INVESTMENT, investor.key().as_ref(), pc_mint.key().as_ref(), coin_mint.key().as_ref()],
        bump,
        payer = investor,
        space = 8 + size_of::<Investment>(),
    )]
    pub investment: Box<Account<'info, Investment>>,

    #[account(
        init,
        seeds = [SEED_POSITION, investment.key().as_ref(), investor.key().as_ref()],
        bump,
        payer = investor,
        space = 8 + size_of::<Position>(),
    )]
    pub position: Box<Account<'info, Position>>,

    #[account(
        init,
        payer = investor,
        associated_token::authority = investment,
        associated_token::mint = pc_mint
    )]
    pub investment_pc_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        init,
        payer = investor,
        associated_token::authority = investment,
        associated_token::mint = coin_mint
    )]
    pub investment_coin_vault: Box<Account<'info, TokenAccount>>,

    #[account(address = Thread::pubkey(investment.key(), "investment".into()))]
    pub investment_thread: SystemAccount<'info>,

    #[account()]
    pub pc_mint: Box<Account<'info, Mint>>,

    #[account()]
    pub coin_mint: Box<Account<'info, Mint>>,

    #[account(mut)]
    pub investor: Signer<'info>,

    #[account(
        init,
        payer = investor,
        associated_token::authority = investor,
        associated_token::mint = pc_mint
    )]
    pub investor_pc_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        init,
        payer = investor,
        associated_token::authority = investor,
        associated_token::mint = coin_mint
    )]
    pub investor_coin_vault: Box<Account<'info, TokenAccount>>,

    #[account(address = sysvar::rent::ID)]
    pub rent: Sysvar<'info, Rent>,

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,

    #[account(address = anchor_spl::token::ID)]
    pub token_program: Program<'info, anchor_spl::token::Token>,
}

pub fn handler<'info>(
    ctx: Context<'_, '_, '_, 'info, CreateInvestment<'info>>,
    deposit_amount: u64,
    frequency: u64,
    end_time: u64,
    cron_expression: String,
) -> Result<()> {
    // Get accounts
    let clockwork_program = &ctx.accounts.clockwork_program;
    let dex_program = &ctx.accounts.dex_program;
    let investment = &mut ctx.accounts.investment;
    let position = &mut ctx.accounts.position;
    let investment_pc_vault = &ctx.accounts.investment_pc_vault;
    let pc_mint = &ctx.accounts.pc_mint;
    let coin_mint = &ctx.accounts.coin_mint;
    let investor = &ctx.accounts.investor;
    let investment_thread = &mut ctx.accounts.investment_thread;
    let system_program = &ctx.accounts.system_program;
    let investor_pc_vault = &mut ctx.accounts.investor_pc_vault;
    let token_program = &ctx.accounts.token_program;
    let rent = &ctx.accounts.rent;

    // Get remaining accounts
    let market = ctx.remaining_accounts.get(0).unwrap();
    let mint_a_vault = ctx.remaining_accounts.get(1).unwrap();
    let mint_b_vault = ctx.remaining_accounts.get(2).unwrap();
    let request_thread = ctx.remaining_accounts.get(3).unwrap();
    let event_thread = ctx.remaining_accounts.get(4).unwrap();
    let market_bids = ctx.remaining_accounts.get(5).unwrap();
    let market_asks = ctx.remaining_accounts.get(6).unwrap();
    let open_orders = ctx.remaining_accounts.get(7).unwrap();

    // get investment bump
    let bump = *ctx.bumps.get("investment").unwrap();

    // calculate swap_amount
    let current_time = Clock::get().unwrap().unix_timestamp;
    let swap_amount = u64::try_from(
        i64::try_from(deposit_amount).unwrap()
            / ((i64::try_from(end_time).unwrap() - current_time)
                / i64::try_from(frequency).unwrap()),
    )
    .unwrap();

    // msg!("deposit_amount: {}", deposit_amount);
    // msg!("current_time: {}", current_time);
    // msg!("end_time: {}", end_time);
    // msg!("frequency: {}", frequency);
    // msg!("swap_amount: {}", swap_amount);
    // msg!("cron_expression: {}", cron_expression);

    // initialize investment account
    investment.new(investor.key(), pc_mint.key(), coin_mint.key(), swap_amount)?;

    let number_of_order =
        ((i64::try_from(end_time).unwrap() - current_time) / i64::try_from(frequency).unwrap());
    position.new(
        investment.key(),
        investor.key(),
        i64::from(current_time),
        deposit_amount,
        number_of_order,
    )?;

    // Approve the investment account to spend deposit_amount from the investor's pc vault
    token::approve(
        CpiContext::new(
            token_program.to_account_info(),
            token::Approve {
                to: investor_pc_vault.to_account_info(),
                delegate: investment.to_account_info(),
                authority: investor.to_account_info(),
            },
        ),
        deposit_amount,
    )?;

    // make cpi to openbook dex to init open order account
    anchor_spl::dex::init_open_orders(CpiContext::new_with_signer(
        dex_program.to_account_info(),
        InitOpenOrders {
            open_orders: open_orders.to_account_info(),
            authority: investment.to_account_info(),
            market: market.to_account_info(),
            rent: rent.to_account_info(),
        },
        &[&[
            SEED_INVESTMENT,
            investment.investor.as_ref(),
            investment.pc_mint.as_ref(),
            investment.coin_mint.as_ref(),
            &[bump],
        ]],
    ))?;

    // // create swap ix
    // let swap_ix = Instruction {
    //     program_id: crate::ID,
    //     accounts: vec![
    //         AccountMeta::new_readonly(associated_token::ID, false),
    //         AccountMeta::new_readonly(dex_program.key(), false),
    //         AccountMeta::new_readonly(investment.key(), false),
    //         AccountMeta::new(investment_pc_vault.key(), false),
    //         AccountMeta::new_readonly(investment_thread.key(), false),
    //         AccountMeta::new(clockwork_sdk::utils::PAYER_PUBKEY, true),
    //         AccountMeta::new_readonly(sysvar::rent::ID, false),
    //         AccountMeta::new_readonly(system_program::ID, false),
    //         AccountMeta::new_readonly(token::ID, false),
    //         // Extra Accounts
    //         AccountMeta::new(market.key(), false),
    //         AccountMeta::new(mint_a_vault.key(), false),
    //         AccountMeta::new(mint_b_vault.key(), false),
    //         AccountMeta::new(request_thread.key(), false),
    //         AccountMeta::new(event_thread.key(), false),
    //         AccountMeta::new(market_bids.key(), false),
    //         AccountMeta::new(market_asks.key(), false),
    //         AccountMeta::new(open_orders.key(), false),
    //     ],
    //     data: clockwork_sdk::utils::anchor_sighash("swap").into(),
    // };

    // // Create thread
    // clockwork_sdk::cpi::thread_create(
    //     CpiContext::new_with_signer(
    //         clockwork_program.to_account_info(),
    //         clockwork_sdk::cpi::ThreadCreate {
    //             authority: investment.to_account_info(),
    //             payer: investor.to_account_info(),
    //             thread: investment_thread.to_account_info(),
    //             system_program: system_program.to_account_info(),
    //         },
    //         &[&[
    //             SEED_INVESTMENT,
    //             investment.investor.as_ref(),
    //             investment.pc_mint.as_ref(),
    //             investment.coin_mint.as_ref(),
    //             &[bump],
    //         ]],
    //     ),
    //     "investment".into(),
    //     swap_ix.into(),
    //     Trigger::Cron {
    //         schedule: cron_expression.into(),
    //         skippable: true,
    //     },
    // )?;

    Ok(())
}
