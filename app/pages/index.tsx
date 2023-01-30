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
import { useMutation } from "react-query";
import { BN } from "@project-serum/anchor";
import { useProgram } from "../contexts/useProgram";
import {
  AnchorDexId,
  SplAssociatedTokenAccount,
  ThreadProgramId,
  webhooksEvents,
} from "../utils/constants";
import { PublicKey } from "@solana/web3.js";
import { findInvestmentAddress } from "../utils/findProgramAddress";
const { Option } = Select;

export default function Home() {
  const { connected, wallet } = useWallet();
  const { program } = useProgram();

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

  const { mutateAsync, isLoading } = useMutation(
    async ({ from_token, from_token_amount }) => {
      const response = await program.methods
        .createInvestment(
          new BN(1_000_000_000_000_000),
          new BN(10),
          new BN(1675245386),
          "*/10 * * * * * *"
        )
        .accounts({
          associatedTokenProgram: new PublicKey(SplAssociatedTokenAccount),
          clockworkProgram: new PublicKey(ThreadProgramId),
          dexProgram: new PublicKey(AnchorDexId),
          investment: findInvestmentAddress({
            payer: wallet?.adapter.publicKey,
            mint_a:
          }),
        })
        .rpc();
      console.log(response);
    }
  );

  const onSubmit = async (data) => {
    await mutateAsync({ ...data });
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ opacity: connected ? 1.0 : 0.3 }}
    >
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
        <Button
          size="large"
          type="primary"
          loading={isLoading}
          block
          htmlType="submit"
          style={{ marginBottom: "24px" }}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
