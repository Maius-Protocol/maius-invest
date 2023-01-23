import {
  Button,
  Card,
  Input,
  InputNumber,
  Segmented,
  Select,
  Typography,
} from "antd";
import SelectToken from "../src/components/SelectToken";
import SelectFrequency from "../src/components/SelectFrequency";
import SelectTill from "../src/components/SelectTill";
import { useForm } from "react-hook-form";
import { useWallet } from "@solana/wallet-adapter-react";
import tokens from "../src/utils/tokens";
import React, { useEffect, useState } from "react";
import { program, programTypes } from "../utils/maiusInvest";
import { useMutation } from "react-query";
const { Option } = Select;

const webhooksEvents = [
  "Any",
  "NFT_BID",
  "NFT_SALE",
  "NFT_LISTING",
  "NFT_MINT",
  "NFT_BID_CANCELLED",
  "NFT_CANCEL_LISTING",
  "STAKE_TOKEN",
  "UNSTAKE_TOKEN",
  "STAKE_SOL",
  "UNSTAKE_SOL",
  "CLAIM_REWARDS",
  "SWAP",
  "NFT_AUCTION_CREATED",
  "NFT_AUCTION_UPDATED",
  "NFT_AUCTION_CANCELLED",
  "WITHDRAW",
  "DEPOSIT",
  "TRANSFER",
  "BURN",
  "PLATFORM_FEE",
  "LOAN",
  "REPAY_LOAN",
  "CLOSE_POSITION",
  "NFT_PARTICIPATION_REWARD",
  "NFT_MINT_REJECTED",
  "CREATE_STORE",
  "WHITELIST_CREATOR",
  "ADD_TO_WHITELIST",
  "REMOVE_FROM_WHITELIST",
  "AUCTION_MANAGER_CLAIM_BID",
  "EMPTY_PAYMENT_ACCOUNT",
  "UPDATE_PRIMARY_SALE_METADATA",
  "ADD_TOKEN_TO_VAULT",
  "ACTIVATE_VAULT",
  "INIT_VAULT",
  "INIT_BANK",
  "UNKNOWN",
  "INIT_STAKE",
  "MERGE_STAKE",
  "SPLIT_STAKE",
  "SET_BANK_FLAGS",
  "SET_VAULT_LOCK",
  "UPDATE_VAULT_OWNER",
  "UPDATE_BANK_MANAGER",
  "RECORD_RARITY_POINTS",
  "ADD_RARITIES_TO_BANK",
  "INIT_FARM",
  "INIT_FARMER",
  "REFRESH_FARMER",
  "UPDATE_FARM",
  "AUTHORIZE_FUNDER",
  "DEAUTHORIZE_FUNDER",
  "FUND_REWARD",
  "CANCEL_REWARD",
  "LOCK_REWARD",
  "PAYOUT",
  "VALIDATE_SAFETY_DEPOSIT_BOX_V2",
  "SET_AUTHORITY",
  "INIT_AUCTION_MANAGER_V2",
  "UPDATE_EXTERNAL_PRICE_ACCOUNT",
  "AUCTION_HOUSE_CREATE",
  "CLOSE_ESCROW_ACCOUNT",
  "ADD_TO_POOL",
  "REMOVE_FROM_POOL",
  "UNLABELED",
  "CLOSE_ACCOUNT",
  "WITHDRAW_GEM",
  "DEPOSIT_GEM",
  "INIT_SWAP",
  "CANCEL_SWAP",
  "REJECT_SWAP",
  "BUY_SUBSCRIPTION",
  "INITIALIZE_ACCOUNT",
  "TOKEN_MINT",
  "CREATE_APPRAISAL",
  "CANDY_MACHINE_WRAP",
  "CANDY_MACHINE_UNWRAP",
  "CANDY_MACHINE_UPDATE",
  "CANDY_MACHINE_ROUTE",
  "FRACTIONALIZE",
  "DEPOSIT_FRACTIONAL_POOL",
  "FUSE",
  "CREATE_RAFFLE",
  "BUY_TICKETS",
  "UPDATE_ITEM",
  "LIST_ITEM",
  "DELIST_ITEM",
  "ADD_ITEM",
  "CLOSE_ITEM",
  "BUY_ITEM",
  "FILL_ORDER",
  "UPDATE_ORDER",
  "CREATE_ORDER",
  "CLOSE_ORDER",
  "CANCEL_ORDER",
  "KICK_ITEM",
  "UPGRADE_FOX",
  "UPGRADE_FOX_REQUEST",
  "LOAN_FOX",
  "BORROW_FOX",
  "SWITCH_FOX_REQUEST",
  "SWITCH_FOX",
  "CREATE_ESCROW",
  "ACCEPT_REQUEST_ARTIST",
  "CANCEL_ESCROW",
  "ACCEPT_ESCROW_ARTIST",
  "ACCEPT_ESCROW_USER",
  "PLACE_BET",
  "PLACE_SOL_BET",
  "CREATE_BET",
  "INIT_RENT",
  "NFT_RENT_LISTING",
  "NFT_RENT_CANCEL_LISTING",
  "NFT_RENT_UPDATE_LISTING",
  "NFT_RENT_ACTIVATE",
  "NFT_RENT_END",
  "UPGRADE_PROGRAM_INSTRUCTION",
  "FINALIZE_PROGRAM_INSTRUCTION",
];

export default function Home() {
  const { connected } = useWallet();

  const form = useForm({
    defaultValues: {
      from_token: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      to_token: "So11111111111111111111111111111111111111112",
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const { mutateAsync, isLoading } = useMutation((params) => {
    // program.methods.createInvestment(
    // new BN(params.from_token_amount),
    // new BN(123),
    // new BN(123),
    // "sdfs"
    // );
  });

  const onSubmit = (data) => {
    const params = {};
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Typography.Title level={5}>From</Typography.Title>
        <SelectToken {...form} />
      </div>
      <div style={{ marginTop: "16px" }}>
        <Typography.Title level={5}>To</Typography.Title>

        <Select
          size="large"
          defaultValue="So11111111111111111111111111111111111111112"
          style={{ width: "100%" }}
          onChange={(value) => {
            setValue("to_token", value);
          }}
        >
          {tokens?.map((token) => {
            return (
              <Option key={`token_${token.symbol}`} value={token.pubkey}>
                {token.symbol}
              </Option>
            );
          })}
        </Select>
      </div>
      <div style={{ marginTop: "16px" }}>
        <Typography.Title level={5}>Frequency</Typography.Title>
        <SelectFrequency {...form} />
      </div>
      <div style={{ marginTop: "16px" }}>
        <Typography.Title level={5}>Till</Typography.Title>
        <SelectTill {...form} />
      </div>
      <div style={{ marginTop: "16px" }}>
        <Typography.Title level={5}>Helius Event</Typography.Title>
        <Select
          size="large"
          defaultValue="Any"
          style={{ width: "100%" }}
          onChange={(value) => {
            setValue("helius_event", value);
          }}
        >
          {webhooksEvents?.map((e) => {
            return (
              <Option key={`eveent${e}`} value={e}>
                {e}
              </Option>
            );
          })}
        </Select>
      </div>

      <div style={{ marginTop: "16px" }}>
        <Typography.Title level={5}>Account Address</Typography.Title>
        <Input size="large" />
      </div>
      <div style={{ marginTop: "64px" }}>
        {connected && (
          <Button
            size="large"
            type="primary"
            block
            htmlType="submit"
            style={{ marginBottom: "24px" }}
          >
            Submit
          </Button>
        )}
      </div>
    </form>
  );
}
