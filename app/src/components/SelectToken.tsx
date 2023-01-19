import React from "react";
import { SettingOutlined } from "@ant-design/icons";
import { Cascader, Input, InputNumber, Select, Space } from "antd";
import tokens from "../utils/tokens";

const { Option } = Select;

const SelectToken = (props) => {
  const { setValue, watch } = props;
  const selectBefore = (
    <Select
      onChange={(value) => {
        setValue("from_token", value);
      }}
      defaultValue="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
      style={{ width: 120 }}
    >
      {tokens?.map((token) => {
        return (
          <Option key={`token_${token.symbol}`} value={token.pubkey}>
            {token.symbol}
          </Option>
        );
      })}
    </Select>
  );
  return (
    <InputNumber
      size="large"
      style={{ width: "100%" }}
      addonBefore={selectBefore}
      onChange={(value) => {
        setValue("from_token_amount", value);
      }}
    />
  );
};

export default SelectToken;
