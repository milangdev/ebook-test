import styled from "styled-components";
import { List } from "antd";

export const StyledList = styled((props) => {
  return <List.Item.Meta {...props} />;
})`
  .ant-list-item-meta-content {
    display: flex;
  }
  .ant-list-item-meta-description {
    margin-left: 8px;
  }
`;
