import React, { Component, useEffect, useState } from "react";
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
import { useDispatch } from "react-redux";
import { setToken } from "../store/commonSlice/commonSlice";
import { API_URL } from "../config/api";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../store/authSlice/authSlice";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

export default function SignIn() {

  const [form] = Form.useForm();

  const dispatch = useDispatch()
  const [userType, setUserType] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });
  const [width, setWidth] = useState(0)

  const onFinish = (values) => {
    console.log("Success:", values);
    if (values?.email || values?.password) {
      setFormFields({
        email: values.email,
        password: values.password,
      })
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleSignin = async () => {
    if (userType === "admin") {
      setLoading(true)
      try {
        const response = await axios.post(`${API_URL}/signin/admin`, {
          ...formFields
        })
        if (response.status === 200) {
          setLoading(false)
          const token = response.data.token
          const user = jwtDecode(token)
          dispatch(setToken(token))
          dispatch(setUser(user))
          console.log(response);
        }
      } catch (error) {
        setLoading(false)
        setErr(error?.response?.data?.message)
        console.log(error);
      }
    }
    if (userType === "user") {
      setLoading2(true)
      try {
        const response = await axios.post(`${API_URL}/signin`, {
          ...formFields
        })
        if (response.status === 200) {
          setLoading2(false)
          const token = response.data.token
          const user = jwtDecode(token)
          console.log(response);
          dispatch(setToken(token))
          dispatch(setUser(user))
          console.log(response);
        }
      } catch (error) {
        setLoading2(false)
        setErr(error?.response?.data?.message)
        console.log(error);
      }
    }
  }
  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Remove event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  useEffect(() => {
    if (formFields.email !== "" || formFields.password !== "") {
      handleSignin()
    }
  }, [formFields])

  console.log(formFields);

  const navigate = useNavigate()

  return (
    <div>

      {/* <div style={{ width: "100%", backgroundColor: "#166805", padding: "20px" }} onClick={() => navigate("/sign-in")}>
        <img width={200} src={logo} alt="" />
      </div> */}

      <div>
        <Card>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
            <div style={{ margin: "0 30px" }}>
              <Form
                form={form}
                layout="vertical"
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                className="row-col"
              >

                <Title level={3} style={{ margin: "0 0 20px 0", color: '#166805', textAlign: "center" }}>Please sign in to continue</Title>

                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Email!',
                    },
                  ]}
                  name="email">
                  <Input style={{ width: "300px" }} placeholder="Email" />
                </Form.Item>

                <Form.Item
                  style={{ marginBottom: 10 }}
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Password!',
                    },
                  ]}
                  name="password">
                  <Input.Password style={{ width: "300px" }} placeholder="Password" />
                </Form.Item>


                <Title onClick={() => navigate("/reset-password")} style={{ fontSize: "16px", margin: "0 0 20px 0", color: "#166805", cursor: "pointer", textDecoration: "underline" }}>Forget password</Title>

                {err !== null && <Title style={{ fontSize: "16px", margin: "0 0 20px 0", color: "red" }}>Login Failed!</Title>}

                <Form.Item>
                  <Button
                    loading={loading2}
                    style={{ width: "100%", backgroundColor: "#166805", color: 'white' }}
                    type="primary"
                    htmlType="submit"
                    onClick={() => setUserType("user")}
                  >
                    SIGN IN
                  </Button>
                  <Button
                    loading={loading}
                    style={{ width: "100%", backgroundColor: "#166805", color: 'white', marginTop: "10px" }}
                    type="primary"
                    htmlType="submit"
                    onClick={() => setUserType("admin")}
                  >
                    SIGN IN AS ADMIN
                  </Button>
                </Form.Item>

              </Form>
            </div>
            {width > 768 && <div style={{ margin: "0 30px" }}>
              <img src={loginImg} />
            </div>}
          </div>
        </Card>
      </div>
    </div>
  );
}