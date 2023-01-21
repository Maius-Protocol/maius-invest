import { Button, Card, InputNumber, Segmented, Select, Typography } from "antd";
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
