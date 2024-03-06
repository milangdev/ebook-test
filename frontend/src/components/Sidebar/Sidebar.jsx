import React, { useEffect, useState } from "react";
import { StyledLayout, StyledSider } from "./elements";
import { Layout, Menu, Tree } from "antd";
import { FolderOpenOutlined, BookOutlined } from "@ant-design/icons";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import { getSections } from "../../services/apis";
import { truncateString } from "../../services/utils";

const { Content } = Layout;
const { TreeNode } = Tree;

export const Sidebar = (props) => {
  const location = useLocation();
  const [sections, setSections] = useState([]);
  const [data, setData] = useState([]);
  const { bookId, sectionId } = useParams();
  const fetchSections = async () => {
    try {
      const response = await getSections(bookId);
      const _data = response.data;
      if (_data?.success) {
        setSections(_data?.data[0]?.sections);
        setData(_data?.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (bookId) {
      fetchSections();
    }
    // eslint-disable-next-line
  }, [sectionId, props.editTitle]);

  const renderTreeNodes = (data) => {
    if (data && data.length > 0) {
      return data.map((item) => (
        <TreeNode
          title={
            <NavLink
              style={({ isActive }) => {
                return {
                  color: isActive ? "black" : "white",
                  backgroundColor: isActive && "white",
                  padding: "4px 8px",
                  display: "block",
                  borderRadius: "5px",
                };
              }}
              to={`/books/${bookId}/section/${item?._id}`}
            >
              <span>
                <FolderOpenOutlined style={{ marginRight: 4 }} />{" "}
                <span title={item?.title}>
                  {truncateString(item?.title, 15)}
                </span>
              </span>
            </NavLink>
          }
          key={item?._id}
        >
          {renderTreeNodes(item?.nestedChildren)}
        </TreeNode>
      ));
    }
    return null;
  };

  const items = [
    {
      id: 1,
      icon: <BookOutlined style={{ fontSize: "22px" }} />,
      label: "Books",
    },
  ];
  return (
    <StyledLayout>
      <Layout>
        {location.pathname === "/" ? (
          <StyledSider width={250}>
            <Menu
              style={{
                fontSize: "16px",
              }}
              theme="dark"
              mode="inline"
              items={items}
            />
          </StyledSider>
        ) : (
          <StyledSider width={"fit-content"}>
            <div
              style={{
                width: "100%",
                borderBottom: "1px solid white",
                marginBottom: "16px",
              }}
            >
              <Link
                style={{
                  color: "white",
                  marginBottom: "8px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  display: "block",
                }}
                to={`/books/${data?._id}`}
                title={data?.title}
              >
                {truncateString(data?.title, 20)}
              </Link>
            </div>
            <Tree autoExpandParent expandedKeys={[sectionId]}>
              {renderTreeNodes(sections)}
            </Tree>
          </StyledSider>
        )}
        <StyledLayout>
          <Layout style={{ height: "100%", width: "100%", overflow: "auto" }}>
            <Content
              style={{
                margin: "24px 16px 0",
              }}
            >
              {props.children}
            </Content>
          </Layout>
        </StyledLayout>
      </Layout>
    </StyledLayout>
  );
};
