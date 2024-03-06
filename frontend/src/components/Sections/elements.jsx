import { Input } from "antd";
import styled from "styled-components";

export const StyledInput = styled((props) => {
  return <Input {...props} />;
})`
  &.ant-input-disabled {
    background-color: #fafafa !important;
    color: #262626 !important;
  }
`;

export const StyledTextArea = styled((props) => {
  return <Input.TextArea {...props} />;
})`
  &.ant-input-disabled {
    background-color: #fafafa !important;
    color: #262626 !important;
  }
`;
