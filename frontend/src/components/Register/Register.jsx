import React, { useEffect } from "react";
import { Button, Form, Grid, Input, Select, theme, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { register } from "../../services/apis";
import { ToastSuccess } from "../Toast";
import Cookies from "js-cookie";
import { Error } from "../../services/fetcher";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;
const { Option } = Select;

export const Register = () => {
  const [form] = Form.useForm();
  const { token } = useToken();
  const screens = useBreakpoint();
  const navigate = useNavigate();

  const userToken = Cookies.get("user");
  useEffect(() => {
    if (userToken) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [userToken]);

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      const response = await register(values);
      const _data = response.data;

      if (_data?.success) {
        ToastSuccess(_data?.message);
        Cookies.set("user", JSON.stringify(_data?.data), {
          secure: process.env.NODE_ENV === "production" && true,
          expires: new Date(new Date().getTime() + 1000 * 60 * 60),
        });
        navigate("/");
      }
    } catch (error) {
      Error(error);
    }
  };

  const styles = {
    container: {
      margin: "0 auto",
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px",
    },
    header: {
      marginBottom: token.marginXL,
    },
    section: {
      alignItems: "center",
      backgroundColor: "rgb(3 21 41)",
      display: "flex",
      height: screens.sm ? "100vh" : "auto",
    },
    text: {
      color: token.colorWhite,
      textAlign: "center",
      display: "flex",
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
      color: token.colorWhite,
      textAlign: "center",
    },
  };

  return (
    <div className="">
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.header}>
            <Title style={styles.title}>Ebook Platform</Title>
            <Text style={styles.text}>
              Welcome back to Ebook Platform Please enter your details below to
              sign up.
            </Text>
          </div>
          <Form
            name="normal_login"
            initialValues={{
              remember: true,
            }}
            form={form}
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
          >
            <Form.Item
              name="username"
              rules={[
                {
                  type: "name",
                  required: true,
                  message: "Please input your user name!",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="User name" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
                {
                  required: true,
                  message: "Email address is required!",
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
                {
                  min: 8,
                  message: "Password is too short - should be 8 chars minimum.",
                },
                {
                  max: 16,
                  message: "Password is too long - should be 16 chars maximum.",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item name="role">
              <Select allowClear placeholder="Select Role">
                <Option value="collaborator">Collaborator</Option>
                <Option value="author">Author</Option>
              </Select>
            </Form.Item>
            <Form.Item style={{ marginBottom: "0px" }}>
              <Button block="true" type="primary" htmlType="submit">
                Sign up
              </Button>
              <div
                style={{ textAlign: "end", marginTop: "10px", color: "white" }}
              >
                Already have an account ? &nbsp;
                <Link style={{ color: "#8eeeff" }} to={"/login"}>
                  Login
                </Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </section>
    </div>
  );
};
