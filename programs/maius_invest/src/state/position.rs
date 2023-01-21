use {
    anchor_lang::{prelude::*, AnchorDeserialize},
    std::convert::TryFrom,
};

pub const SEED_POSITION: &[u8] = b"position";

/**
 * Investment
 */

#[account]
#[derive(Debug)]
pub struct Position {
    pub investment: Pubkey,
    pub position_authority: Pubkey,
    pub deposit_token_amount: u64,
    pub withdraw_token_amount: u64,
    pub deposit_timestamp: i64,
    // deposit_token_amount/number_of_order
    pub periodic_order_amount: u64,
    pub number_of_order: i64
}

impl Position {
    pub fn pubkey(investment: Pubkey, position_authority: Pubkey) -> Pubkey {
        Pubkey::find_program_address(
            &[
                SEED_POSITION,
                investment.as_ref(),
                position_authority.as_ref(),
            ],
            &crate::ID,
        )
            .0
    }
}

impl TryFrom<Vec<u8>> for Position {
    type Error = Error;
    fn try_from(data: Vec<u8>) -> std::result::Result<Self, Self::Error> {
        Position::try_deserialize(&mut data.as_slice())
    }
}

/**
 * InvestmentAccount
 */

pub trait PositionAccount {
    fn new(
        &mut self,
        investment: Pubkey,
        position_authority: Pubkey,
        deposit_timestamp: i64,
        deposit_token_amount: u64,
        number_of_order: i64
    ) -> Result<()>;
}

impl PositionAccount for Account<'_, Position> {
    fn new(
        &mut self,
        investment: Pubkey,
        position_authority: Pubkey,
        deposit_timestamp: i64,
        deposit_token_amount: u64,
        number_of_order: i64
    ) -> Result<()> {
        self.investment = investment;
        self.position_authority = position_authority;
        self.deposit_timestamp = deposit_timestamp;
        self.deposit_token_amount = deposit_token_amount;
        self.number_of_order = number_of_order;
        self.periodic_order_amount = (i64::try_from(deposit_token_amount).unwrap() / number_of_order) as u64;
        self.withdraw_token_amount = 0;
        Ok(())
    }
}
