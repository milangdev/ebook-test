import React, { useEffect } from "react";
import { Button, Form, Grid, Input, theme, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { login } from "../../services/apis";
import { ToastSuccess } from "../Toast";
import { Error } from "../../services/fetcher";

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

export const Login = () => {
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
      const response = await login(values);
      const _data = response.data;

      if (_data?.success) {
        ToastSuccess(_data?.message);
        Cookies.set("user", JSON.stringify(_data?.data), {
          secure: process.env.NODE_ENV === "production" && true,
          expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365),
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
              sign in.
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
            <Form.Item style={{ marginBottom: "0px" }}>
              <Button block="true" type="primary" htmlType="submit">
                Log in
              </Button>
              <div style={{ textAlign: "end", marginTop: "10px" }}>
                <Link style={{ color: "#8eeeff" }} to={"/register"}>
                  Sign up now
                </Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </section>
    </div>
  );
};
