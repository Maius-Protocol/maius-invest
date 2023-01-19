import React from "react";
import type { DatePickerProps } from "antd";
import { DatePicker, Space } from "antd";

const SelectTill = (props) => {
  const { setValue } = props;

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setValue("till", date?.toISOString());
  };
  return (
    <DatePicker
      showTime
      size="large"
      style={{ width: "100%" }}
      onChange={onChange}
    />
  );
};

export default SelectTill;
