mod utils;

use {
    anchor_lang::{prelude::*, solana_program::sysvar, system_program, InstructionData},
    anchor_spl::{
        associated_token,
        dex::serum_dex::{
            instruction::{initialize_market, NewOrderInstructionV3, SelfTradeBehavior},
            matching::{OrderType, Side},
            state::OpenOrders,
        },
        token,
    },
    clockwork_client::{
        thread::{self, instruction::thread_create, state::Thread, state::Trigger},
        Client, ClientResult, SplToken,
    },
    clockwork_sdk::utils::PAYER_PUBKEY,
    serum_common::client::rpc::mint_to_new_account,
    solana_sdk::{
        instruction::Instruction, native_token::LAMPORTS_PER_SOL, signature::Keypair,
        signer::Signer,
    },
    std::{mem::size_of, num::NonZeroU64},
    utils::*,
};

fn main() -> ClientResult<()> {
    // Create Client
    let payer = Keypair::new();
    let client = Client::new(payer, "http://localhost:8899".into());
    let bob = Keypair::new();
    println!("payer: {}", client.payer_pubkey());
    println!("bob: {}", bob.pubkey());
    println!("anchor dex id: {}", &anchor_spl::dex::ID);

    // airdrop a bunch bc it's expensive to setup a dex market and for all of the txs lol
    client.airdrop(&client.payer_pubkey(), 2 * LAMPORTS_PER_SOL)?;
    client.airdrop(&client.payer_pubkey(), 2 * LAMPORTS_PER_SOL)?;
    client.airdrop(&client.payer_pubkey(), 2 * LAMPORTS_PER_SOL)?;
    client.airdrop(&client.payer_pubkey(), 2 * LAMPORTS_PER_SOL)?;
    client.airdrop(&client.payer_pubkey(), 2 * LAMPORTS_PER_SOL)?;
    client.airdrop(&client.payer_pubkey(), 2 * LAMPORTS_PER_SOL)?;
    client.airdrop(&bob.pubkey(), 2 * LAMPORTS_PER_SOL)?;

    // setup market
    let market_keys = setup_market(&client)?;

    print_market_keys(&market_keys)?;

    // derive investment_program PDAs
    let investment = maius_invest::state::Investment::pubkey(
        client.payer_pubkey(),
        market_keys.pc_mint,
        market_keys.coin_mint,
    );
    println!("investment: {}", investment);
    let position = maius_invest::state::Position::pubkey(investment, client.payer_pubkey());

    let investment_thread = Thread::pubkey(investment, "investment".to_string());
    println!("investment_thread: {}", investment_thread);
    print_explorer_link(investment_thread, "investment_thread".to_string())?;

    // init openbook_crank program
    initialize_openbook_crank(&client, &market_keys, "SOL_USDC_OPENBOOK_TEST_2".into())?;

    let bob_mint_b_wallet = mint_to_new_account(
        &client,
        &bob,
        &client.payer(),
        &market_keys.coin_mint,
        1_000_000_000_000_000,
    )
    .unwrap();

    let mut oo_account_bob = None;

    init_open_orders_account(
        &client,
        &anchor_spl::dex::ID,
        &bob,
        &market_keys,
        &mut oo_account_bob,
    )?;

    // // Derive ATA pubkeys
    let payer_mint_a_token_account = anchor_spl::associated_token::get_associated_token_address(
        &client.payer_pubkey(),
        &market_keys.pc_mint,
    );
    let payer_mint_b_token_account = anchor_spl::associated_token::get_associated_token_address(
        &client.payer_pubkey(),
        &market_keys.coin_mint,
    );
    let investment_mint_a_token_account =
        anchor_spl::associated_token::get_associated_token_address(
            &investment,
            &market_keys.pc_mint,
        );
    let investment_mint_b_token_account =
        anchor_spl::associated_token::get_associated_token_address(
            &investment,
            &market_keys.coin_mint,
        );

    print_explorer_link(
        payer_mint_a_token_account.key(),
        "payer_mint_a_token_account".to_string(),
    )?;
    print_explorer_link(
        payer_mint_b_token_account.key(),
        "payer_mint_b_token_account".to_string(),
    )?;
    print_explorer_link(
        investment_mint_a_token_account,
        "investment_mint_a_token_account".to_string(),
    )?;
    print_explorer_link(
        investment_mint_b_token_account,
        "investment_mint_b_token_account".to_string(),
    )?;

    // place Ask orders for Bob
    for _ in 0..5 {
        place_order(
            &client,
            &anchor_spl::dex::ID,
            &bob,
            &bob_mint_b_wallet.pubkey(),
            &market_keys,
            &mut oo_account_bob,
            NewOrderInstructionV3 {
                side: Side::Ask,
                limit_price: NonZeroU64::new(500).unwrap(),
                max_coin_qty: NonZeroU64::new(1_000).unwrap(),
                max_native_pc_qty_including_fees: NonZeroU64::new(500_000).unwrap(),
                order_type: OrderType::Limit,
                client_order_id: 019269,
                self_trade_behavior: SelfTradeBehavior::DecrementTake,
                limit: std::u16::MAX,
            },
        )?;
    }

    // Alice's open orders account
    let mut oo_account_alice = None;

    init_dex_account(&client, &mut oo_account_alice)?;

    create_investment_and_deposit(
        &client,
        investment,
        position,
        investment_mint_a_token_account,
        investment_mint_b_token_account,
        investment_thread,
        &market_keys,
        &mut oo_account_alice,
        payer_mint_a_token_account,
        payer_mint_b_token_account,
    )?;

    Ok(())
}

fn setup_market(client: &Client) -> ClientResult<MarketKeys> {
    // generate 2 mints to list on market
    let coin_mint = client
        .create_token_mint(&client.payer_pubkey(), 9)
        .unwrap()
        .pubkey();

    let pc_mint = client
        .create_token_mint(&client.payer_pubkey(), 9)
        .unwrap()
        .pubkey();

    // get market listing keys
    let (listing_keys, mut ix) = gen_listing_params(
        client,
        &anchor_spl::dex::ID,
        &client.payer_pubkey(),
        &coin_mint,
        &pc_mint,
    )?;

    // destructuring market listing keys
    let ListingKeys {
        market_key,
        req_q_key,
        event_q_key,
        bids_key,
        asks_key,
        vault_signer,
        vault_signer_nonce,
    } = listing_keys;

    // create ata vaults for the respective mints
    let coin_vault =
        client.create_associated_token_account(&client.payer(), &vault_signer, &coin_mint)?;

    let pc_vault =
        client.create_associated_token_account(&client.payer(), &vault_signer, &pc_mint)?;

    // get the init market ix
    let init_market_ix = initialize_market(
        &market_key.pubkey(),
        &anchor_spl::dex::ID,
        &coin_mint,
        &pc_mint,
        &coin_vault,
        &pc_vault,
        None,
        None,
        &bids_key.pubkey(),
        &asks_key.pubkey(),
        &req_q_key.pubkey(),
        &event_q_key.pubkey(),
        1_000_000_000,
        1_000_000_000,
        vault_signer_nonce,
        100,
    )
    .unwrap();

    // add init_market_ix to vector
    ix.push(init_market_ix);

    sign_send_and_confirm_tx(
        &client,
        ix,
        Some(vec![
            client.payer(),
            &market_key,
            &req_q_key,
            &event_q_key,
            &bids_key,
            &asks_key,
            &req_q_key,
            &event_q_key,
        ]),
        "setup_market".to_string(),
    )?;

    // create wallets to then mint to
    let coin_wallet = mint_to_new_account(
        &client,
        &client.payer(),
        &client.payer(),
        &coin_mint,
        1_000_000_000_000_000,
    )
    .unwrap()
    .pubkey();

    let pc_wallet = mint_to_new_account(
        &client,
        &client.payer(),
        &client.payer(),
        &pc_mint,
        1_000_000_000_000_000,
    )
    .unwrap()
    .pubkey();

    Ok(MarketKeys {
        market: market_key.pubkey(),
        req_q: req_q_key.pubkey(),
        event_q: event_q_key.pubkey(),
        bids: bids_key.pubkey(),
        asks: asks_key.pubkey(),
        coin_mint,
        coin_vault,
        pc_mint,
        pc_vault,
        vault_signer,
        pc_wallet,
        coin_wallet,
    })
}

fn initialize_openbook_crank(
    client: &Client,
    market_keys: &MarketKeys,
    id: String,
) -> ClientResult<()> {
    // derive openbook_crank PDAs
    let crank =
        openbook_crank::state::Crank::pubkey(client.payer_pubkey(), market_keys.market, id.clone());
    let crank_thread =
        clockwork_client::thread::state::Thread::pubkey(client.payer_pubkey(), id.clone());

    print_explorer_link(crank_thread, "crank_thread".to_string())?;

    client.airdrop(&crank_thread, LAMPORTS_PER_SOL)?;

    // define initialize ix
    let initialize_ix = Instruction {
        program_id: openbook_crank::ID,
        accounts: vec![
            AccountMeta::new(crank, false),
            AccountMeta::new_readonly(anchor_spl::dex::ID, false),
            AccountMeta::new_readonly(market_keys.event_q, false),
            AccountMeta::new_readonly(market_keys.market, false),
            AccountMeta::new_readonly(market_keys.pc_mint, false),
            AccountMeta::new_readonly(market_keys.pc_vault, false),
            AccountMeta::new_readonly(market_keys.coin_mint, false),
            AccountMeta::new_readonly(market_keys.coin_vault, false),
            AccountMeta::new(client.payer_pubkey(), true),
            AccountMeta::new_readonly(system_program::ID, false),
        ],
        data: openbook_crank::instruction::Initialize { id: id.clone() }.data(),
    };

    // create thread with read events ix
    let thread_create = thread_create(
        client.payer_pubkey(),
        id,
        Instruction {
            program_id: openbook_crank::ID,
            accounts: vec![
                AccountMeta::new(crank.key(), false),
                AccountMeta::new(crank_thread.key(), true),
                AccountMeta::new_readonly(anchor_spl::dex::ID, false),
                AccountMeta::new_readonly(market_keys.event_q, false),
                AccountMeta::new_readonly(market_keys.market, false),
                AccountMeta::new(PAYER_PUBKEY, true),
                AccountMeta::new_readonly(system_program::ID, false),
            ],
            data: openbook_crank::instruction::ReadEvents.data(),
        }
        .into(),
        client.payer_pubkey(),
        crank_thread,
        Trigger::Account {
            address: market_keys.event_q,
            offset: 8 + 8,
            size: 8,
        },
    );

    sign_send_and_confirm_tx(
        &client,
        [initialize_ix, thread_create].to_vec(),
        None,
        "initialize_openbook_crank".to_string(),
    )?;

    Ok(())
}

fn create_investment_and_deposit(
    client: &Client,
    investment: Pubkey,
    position: Pubkey,
    investment_mint_a_token_account: Pubkey,
    investment_mint_b_token_account: Pubkey,
    investment_thread: Pubkey,
    market_keys: &MarketKeys,
    orders: &mut Option<Pubkey>,
    payer_mint_a_token_account: Pubkey,
    payer_mint_b_token_account: Pubkey,
) -> ClientResult<()> {
    init_dex_account(client, orders)?;

    client.airdrop(&investment_thread, LAMPORTS_PER_SOL)?;

    let create_investment_ix = Instruction {
        program_id: maius_invest::ID,
        accounts: vec![
            AccountMeta::new_readonly(associated_token::ID, false),
            AccountMeta::new_readonly(thread::ID, false),
            AccountMeta::new_readonly(anchor_spl::dex::ID, false),
            AccountMeta::new(investment, false),
            AccountMeta::new(position, false),
            AccountMeta::new(investment_mint_a_token_account, false),
            AccountMeta::new(investment_mint_b_token_account, false),
            AccountMeta::new(investment_thread, false),
            AccountMeta::new_readonly(market_keys.pc_mint, false),
            AccountMeta::new_readonly(market_keys.coin_mint, false),
            AccountMeta::new(client.payer_pubkey(), true),
            AccountMeta::new(payer_mint_a_token_account, false),
            AccountMeta::new(payer_mint_b_token_account, false),
            AccountMeta::new_readonly(sysvar::rent::ID, false),
            AccountMeta::new_readonly(system_program::ID, false),
            AccountMeta::new_readonly(token::ID, false),
            // Extra accounts
            AccountMeta::new(market_keys.market, false),
            AccountMeta::new(market_keys.pc_vault, false),
            AccountMeta::new(market_keys.coin_vault, false),
            AccountMeta::new(market_keys.req_q, false),
            AccountMeta::new(market_keys.event_q, false),
            AccountMeta::new(market_keys.bids, false),
            AccountMeta::new(market_keys.asks, false),
            AccountMeta::new(orders.unwrap(), false),
        ],
        data: maius_invest::instruction::CreateInvestment {
            deposit_amount: 1_000_000_000_000_000,
            frequency: 10,
            end_time: 1675245386,
            cron_expression: "*/10 * * * * * *".into(),
        }
        .data(),
    };

    let create_orders_ix = Instruction {
        program_id: maius_invest::ID,
        accounts: vec![
            AccountMeta::new_readonly(anchor_spl::dex::ID, false),
            AccountMeta::new_readonly(investment, false),
            AccountMeta::new(client.payer_pubkey(), true),
            AccountMeta::new_readonly(sysvar::rent::ID, false),
            AccountMeta::new_readonly(system_program::ID, false),
            // Extra accounts
            AccountMeta::new_readonly(market_keys.market, false),
            AccountMeta::new(orders.unwrap(), false),
        ],
        data: maius_invest::instruction::CreateOrders {}.data(),
    };

    sign_send_and_confirm_tx(
        &client,
        [create_investment_ix, create_orders_ix].to_vec(),
        None,
        "create_investment_and_orders".to_string(),
    )?;

    // mint to payer's mint A ATA
    client.mint_to(
        &client.payer(),
        &market_keys.pc_mint,
        &payer_mint_a_token_account,
        2_000_000_000_000_000,
        9,
    )?;

    let deposit_ix = Instruction {
        program_id: maius_invest::ID,
        accounts: vec![
            AccountMeta::new_readonly(associated_token::ID, false),
            AccountMeta::new_readonly(investment, false),
            AccountMeta::new(investment_mint_a_token_account, false),
            AccountMeta::new_readonly(market_keys.pc_mint, false),
            AccountMeta::new(client.payer_pubkey(), true),
            AccountMeta::new(payer_mint_a_token_account, false),
            AccountMeta::new_readonly(sysvar::rent::ID, false),
            AccountMeta::new_readonly(system_program::ID, false),
            AccountMeta::new_readonly(token::ID, false),
        ],
        data: maius_invest::instruction::Deposit {
            amount: 1_000_000_000_000_000,
        }
        .data(),
    };

    sign_send_and_confirm_tx(
        &client,
        [deposit_ix].to_vec(),
        None,
        "deposit_ix".to_string(),
    )?;

    Ok(())
}

pub fn init_dex_account(client: &Client, orders: &mut Option<Pubkey>) -> ClientResult<()> {
    let orders_keypair;
    let mut ix = Vec::new();
    let mut signers = Vec::new();

    let orders_pk = match *orders {
        Some(pk) => pk,
        None => {
            let (orders_key, instruction) = create_dex_account(
                client,
                &anchor_spl::dex::ID,
                &client.payer_pubkey(),
                size_of::<OpenOrders>(),
            )?;
            orders_keypair = orders_key;
            signers.push(&orders_keypair);
            ix.push(instruction);
            orders_keypair.pubkey()
        }
    };

    *orders = Some(orders_pk);

    signers.push(client.payer());

    sign_send_and_confirm_tx(client, ix, Some(signers), "init_dex_account".to_string())?;

    Ok(())
}

pub fn init_open_orders_account(
    client: &Client,
    program_id: &Pubkey,
    owner: &Keypair,
    market_keys: &MarketKeys,
    orders: &mut Option<Pubkey>,
) -> ClientResult<()> {
    let orders_keypair;
    let mut ix = Vec::new();
    let mut signers = Vec::new();

    let orders_pubkey = match *orders {
        Some(pk) => pk,
        None => {
            let (orders_key, instruction) = create_dex_account(
                client,
                program_id,
                &client.payer_pubkey(),
                size_of::<OpenOrders>(),
            )
            .unwrap();
            orders_keypair = orders_key;
            signers.push(&orders_keypair);
            ix.push(instruction);
            orders_keypair.pubkey()
        }
    };
    *orders = Some(orders_pubkey);
    ix.push(
        init_open_orders_ix(
            program_id,
            &orders_pubkey,
            &owner.pubkey(),
            &market_keys.market,
        )
        .unwrap(),
    );

    signers.push(owner);
    signers.push(client.payer());

    sign_send_and_confirm_tx(
        client,
        ix,
        Some(signers),
        "create open orders account".into(),
    )?;

    Ok(())
}

pub fn place_order(
    client: &Client,
    program_id: &Pubkey,
    payer: &Keypair,
    wallet: &Pubkey,
    market_keys: &MarketKeys,
    orders: &mut Option<Pubkey>,
    new_order: anchor_spl::dex::serum_dex::instruction::NewOrderInstructionV3,
) -> ClientResult<()> {
    let mut instructions = Vec::new();
    let orders_keypair;
    let mut signers = Vec::new();
    let orders_pubkey = match *orders {
        Some(pk) => pk,
        None => {
            let (orders_key, instruction) =
                create_dex_account(client, program_id, &payer.pubkey(), size_of::<OpenOrders>())?;
            orders_keypair = orders_key;
            signers.push(&orders_keypair);
            instructions.push(instruction);
            orders_keypair.pubkey()
        }
    };
    *orders = Some(orders_pubkey);
    let _side = new_order.side;
    let data =
        anchor_spl::dex::serum_dex::instruction::MarketInstruction::NewOrderV3(new_order).pack();
    let instruction = Instruction {
        program_id: *program_id,
        data,
        accounts: vec![
            AccountMeta::new(market_keys.market, false),
            AccountMeta::new(orders_pubkey, false),
            AccountMeta::new(market_keys.req_q, false),
            AccountMeta::new(market_keys.event_q, false),
            AccountMeta::new(market_keys.bids, false),
            AccountMeta::new(market_keys.asks, false),
            AccountMeta::new(*wallet, false),
            AccountMeta::new_readonly(payer.pubkey(), true),
            AccountMeta::new(market_keys.coin_vault, false),
            AccountMeta::new(market_keys.pc_vault, false),
            AccountMeta::new_readonly(token::spl_token::ID, false),
            AccountMeta::new_readonly(solana_sdk::sysvar::rent::ID, false),
        ],
    };
    instructions.push(instruction);
    signers.push(payer);
    signers.push(client.payer());

    sign_send_and_confirm_tx(client, instructions, Some(signers), "place_order".into())?;
    Ok(())
}

fn create_investment(
    client: &Client,
    investment: Pubkey,
    market_keys: &MarketKeys,
    investment_thread_id: String,
    claim_thread_id: String,
) -> ClientResult<()> {
    let mut investment_open_orders_account = None;
    init_dex_account(client, &mut investment_open_orders_account)?;

    let investment_thread = Thread::pubkey(client.payer_pubkey(), investment_thread_id.clone());
    let claim_thread = Thread::pubkey(client.payer_pubkey(), claim_thread_id.clone());

    let investor_pc_vault = anchor_spl::associated_token::get_associated_token_address(
        &client.payer_pubkey(),
        &market_keys.pc_mint,
    );

    let investor_coin_vault = anchor_spl::associated_token::get_associated_token_address(
        &client.payer_pubkey(),
        &market_keys.coin_mint,
    );

    let investment_pc_vault = anchor_spl::associated_token::get_associated_token_address(
        &investment,
        &market_keys.pc_mint,
    );

    let investment_coin_vault = anchor_spl::associated_token::get_associated_token_address(
        &investment,
        &market_keys.coin_mint,
    );

    let position = maius_invest::state::Position::pubkey(investment, client.payer_pubkey());

    let create_investment_ix = Instruction {
        program_id: maius_invest::ID,
        accounts: vec![
            AccountMeta::new_readonly(associated_token::ID, false),
            AccountMeta::new_readonly(thread::ID, false),
            AccountMeta::new_readonly(anchor_spl::dex::ID, false),
            AccountMeta::new(investment, false),
            AccountMeta::new(position, false),
            AccountMeta::new(investment_pc_vault, false),
            AccountMeta::new(investment_coin_vault, false),
            AccountMeta::new_readonly(investment_thread, false),
            AccountMeta::new_readonly(market_keys.pc_mint, false),
            AccountMeta::new_readonly(market_keys.coin_mint, false),
            AccountMeta::new(client.payer_pubkey(), true),
            AccountMeta::new(investor_pc_vault, false),
            AccountMeta::new(investor_coin_vault, false),
            AccountMeta::new_readonly(sysvar::rent::ID, false),
            AccountMeta::new_readonly(system_program::ID, false),
            AccountMeta::new_readonly(token::ID, false),
        ],
        data: maius_invest::instruction::CreateInvestment {
            deposit_amount: 1_000_000_000_000_000,
            frequency: 10,
            end_time: 1675245386,
            cron_expression: "*/10 * * * * * *".into(),
        }
        .data(),
    };

    let thread_create_deposit_ix = thread_create(
        client.payer_pubkey(),
        investment_thread_id,
        Instruction {
            program_id: maius_invest::ID,
            accounts: vec![
                AccountMeta::new_readonly(market_keys.pc_mint, false),
                AccountMeta::new_readonly(market_keys.coin_mint, false),
                AccountMeta::new(investment, false),
                AccountMeta::new(investment_pc_vault, false),
                AccountMeta::new(investor_pc_vault, false),
                AccountMeta::new_readonly(investment_thread, true),
                AccountMeta::new_readonly(system_program::ID, false),
                AccountMeta::new_readonly(token::ID, false),
                // Extra accounts
                AccountMeta::new(market_keys.market, false),
                AccountMeta::new(market_keys.pc_vault, false),
                AccountMeta::new(market_keys.coin_vault, false),
                AccountMeta::new(market_keys.req_q, false),
                AccountMeta::new(market_keys.event_q, false),
                AccountMeta::new(market_keys.bids, false),
                AccountMeta::new(market_keys.asks, false),
                AccountMeta::new(investment_open_orders_account.unwrap(), false),
            ],
            data: maius_invest::instruction::Deposit {}.data(),
        }
        .into(),
        client.payer_pubkey(),
        investment_thread,
        Trigger::Cron {
            schedule: "*/10 * * * * * *".into(),
            skippable: true,
        },
    );

    let thread_create_claim_ix = thread_create(
        client.payer_pubkey(),
        claim_thread_id,
        Instruction {
            program_id: maius_invest::ID,
            accounts: vec![
                AccountMeta::new_readonly(anchor_spl::dex::ID, false),
                AccountMeta::new(investment, false),
                AccountMeta::new(investment_coin_vault, false),
                AccountMeta::new_readonly(market_keys.coin_mint, false),
                AccountMeta::new(investment_thread, true),
                AccountMeta::new(investor_coin_vault, false),
                AccountMeta::new_readonly(client.payer_pubkey(), false),
                AccountMeta::new_readonly(sysvar::rent::ID, false),
                AccountMeta::new(market_keys.market, false),
                AccountMeta::new_readonly(system_program::ID, false),
                AccountMeta::new_readonly(token::ID, false),
                // Extra accounts
                AccountMeta::new(market_keys.pc_vault, false),
                AccountMeta::new(market_keys.pc_wallet, false),
                AccountMeta::new(market_keys.coin_vault, false),
                AccountMeta::new(market_keys.coin_wallet, false),
                AccountMeta::new(investment_open_orders_account.unwrap(), false),
                AccountMeta::new(market_keys.vault_signer, false),
            ],
            data: maius_invest::instruction::Claim {}.data(),
        }
        .into(),
        client.payer_pubkey(),
        claim_thread,
        Trigger::Account {
            address: investment_open_orders_account.unwrap(),
            offset: 8 + 8 + 32 + 32 + 8,
            size: 8,
        },
    );

    Ok(())
}
