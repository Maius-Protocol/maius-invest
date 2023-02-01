use {
    crate::state::*,
    anchor_lang::{
        prelude::*,
        solana_program::{instruction::Instruction, system_program, sysvar},
    },
    anchor_spl::token::{self, Mint, TokenAccount, Transfer},
    clockwork_sdk::state::{Thread, ThreadAccount, ThreadResponse},
};

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct Deposit<'info> {
    #[account()]
    pub pc_mint: Account<'info, Mint>,

    #[account()]
    pub coin_mint: Account<'info, Mint>,

    #[account(
        seeds = [
            SEED_INVESTMENT,
            investment.investor.as_ref(),
            investment.pc_mint.as_ref(),
            investment.coin_mint.as_ref(),
        ],
        bump,
        has_one = pc_mint,
        has_one = coin_mint,
    )]
    pub investment: Account<'info, Investment>,

    #[account(
        mut,
        associated_token::mint = pc_mint,
        associated_token::authority = investment,
    )]
    pub investment_pc_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = investment.pc_mint,
        associated_token::authority = investment.investor,
    )]
    pub investor_pc_vault: Account<'info, TokenAccount>,

    #[account(
        signer,
        address = investment_thread.pubkey(),
    )]
    pub investment_thread: Account<'info, Thread>,

    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,

    #[account(address = anchor_spl::token::ID)]
    pub token_program: Program<'info, anchor_spl::token::Token>,
}

pub fn handler<'info>(ctx: Context<'_, '_, '_, 'info, Deposit<'info>>) -> Result<ThreadResponse> {
    // get accounts
    let investment = &ctx.accounts.investment;
    let investor_pc_vault = &mut ctx.accounts.investor_pc_vault;
    let investment_pc_vault = &mut ctx.accounts.investment_pc_vault;
    let investment_thread = &ctx.accounts.investment_thread;
    let system_program = &ctx.accounts.system_program;
    let token_program = &ctx.accounts.token_program;

    // get investment bump
    let bump = *ctx.bumps.get("investment").unwrap();

    // make transfer ix from investor's pc_vault to investment's pc_vault
    // after delegating fund from investor to investment vault
    token::transfer(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            Transfer {
                from: investor_pc_vault.to_account_info(),
                to: investment_pc_vault.to_account_info(),
                authority: investment.to_account_info(),
            },
            &[&[
                SEED_INVESTMENT,
                investment.investor.as_ref(),
                investment.pc_mint.as_ref(),
                investment.coin_mint.as_ref(),
                &[bump],
            ]],
        ),
        investment.swap_amount,
    )?;

    let mut swap_account_metas = vec![
        AccountMeta::new_readonly(anchor_spl::dex::ID, false),
        AccountMeta::new_readonly(investment.key(), false),
        AccountMeta::new(investment_pc_vault.key(), false),
        AccountMeta::new_readonly(investment_thread.key(), true),
        AccountMeta::new_readonly(sysvar::rent::ID, false),
        AccountMeta::new_readonly(system_program.key(), false),
        AccountMeta::new_readonly(token_program.key(), false),
    ];

    let mut remaining_account_metas = ctx
        .remaining_accounts
        .iter()
        .map(|acc| AccountMeta::new(acc.key(), false))
        .collect::<Vec<AccountMeta>>();

    swap_account_metas.append(&mut remaining_account_metas);

    Ok(ThreadResponse {
        kickoff_instruction: None,
        next_instruction: Some(
            Instruction {
                program_id: crate::ID,
                accounts: swap_account_metas,
                data: clockwork_sdk::utils::anchor_sighash("swap").into(),
            }
            .into(),
        ),
    })
}
