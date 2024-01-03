import React, { Component } from "react";
import {
  Layout,
  Menu,
  Button,
  Typography,
  Card,
  Form,
  Input,
  Checkbox,
} from "antd";

import logo from '../assets/images/caiif-logo-2.svg'
import loginImg from '../assets/images/login-img.svg'
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

export default function SignIn() {
  
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const navigate = useNavigate()

  return (
    <div>

      <div style={{ width: "100%", backgroundColor: "#166805", padding: "20px" }}>
        <img width={200} src={logo} alt="" />
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "100px" }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
            <div style={{ margin: "0 30px" }}>
              <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                className="row-col"
              >

                <Title level={3} style={{ margin: "0 0 20px 0", color: '#166805', textAlign: "center" }}>Please sign in to continue</Title>

                <Form.Item name="email">
                  <Input style={{ width: "300px" }} placeholder="Email" />
                </Form.Item>

                <Form.Item name="password">
                  <Input style={{ width: "300px" }} placeholder="Password" />
                </Form.Item>

                <Form.Item>
                  <Button
                    onClick={() => navigate("/")}
                    style={{ width: "100%", backgroundColor: "#166805", color: 'white' }}
                    type="primary"
                    htmlType="submit"
                  >
                    SIGN IN
                  </Button>
                  <Button
                    onClick={() => navigate("/")}
                    style={{ width: "100%", backgroundColor: "#166805", color: 'white', marginTop:"10px" }}
                    type="primary"
                    htmlType="submit"
                  >
                    SIGN IN AS ADMIN
                  </Button>
                </Form.Item>

              </Form>
            </div>
            <div style={{ margin: "0 30px" }}>
              <img src={loginImg} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}