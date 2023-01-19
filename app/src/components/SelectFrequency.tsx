import { InputNumber, Select } from "antd";
import React from "react";
const { Option } = Select;

const SelectFrequency = (props) => {
  const { setValue, watch } = props;
  const selectAfter = (
    <Select
      onChange={(value) => {
        setValue("frequency", value);
      }}
      defaultValue="MM"
      style={{ width: 120 }}
    >
      <Option value="MM">Minutes</Option>
      <Option value="HH">Hours</Option>
      <Option value="DD">Days</Option>
    </Select>
  );
  return (
    <InputNumber
      size="large"
      style={{ width: "100%" }}
      addonAfter={selectAfter}
      onChange={(value) => {
        setValue("frequency_amount", value);
      }}
    />
  );
};

export default SelectFrequency;
