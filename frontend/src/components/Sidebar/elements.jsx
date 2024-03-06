import { Layout } from "antd";
import styled from "styled-components";
const { Sider } = Layout;

export const StyledSider = styled((props) => {
  return <Sider {...props} />;
})`
  && {
    min-width: 250px !important;
    padding-top: 12px;
  }
  .ant-menu-title-content {
    a span {
      margin-left: 10px;
    }
  }

  .ant-menu-submenu div > span {
    margin-left: 20px;
  }

  ::-webkit-scrollbar {
    width: 5px !important; /* adjust this value to change the width of the scrollbar */
  }

  :where(.css-dev-only-do-not-override-1drr2mu).ant-tree {
    color: rgb(255 255 255 / 88%);
    background: #031529;
  }

  :where(.css-dev-only-do-not-override-1drr2mu).ant-tree
    .ant-tree-node-content-wrapper.ant-tree-node-selected,
  :where(.css-dev-only-do-not-override-1drr2mu).ant-tree
    .ant-tree-checkbox
    + span.ant-tree-node-selected {
    background-color: #031529;
  }

  .ant-layout-sider-children {
    margin-left: 1rem;
  }
  .ant-tree-list-holder-inner {
    overflow: auto;
  }

  :where(.css-dev-only-do-not-override-1drr2mu).ant-btn-sm {
    font-size: 9px;
    /* line-height: 2.571429; */
    height: 18px;
    padding: 0px 4px;
    border-radius: 4px;
  }

  :where(.css-dev-only-do-not-override-1drr2mu).ant-btn-default {
    background: #031529;
    border-color: #d9d9d9;
    color: rgb(255 255 255 / 88%);
    box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
  }
`;

export const StyledLayout = styled((props) => {
  return <Layout {...props} />;
})`
  .ant-layout {
    height: calc(100vh - 86px);
  }
`;

export const CountBadge = styled((props) => {
  return <span {...props} />;
})`
  font-size: 12px;
  color: white;
  padding: 5px;
  border-radius: 100%;
  background-color: red;
`;
