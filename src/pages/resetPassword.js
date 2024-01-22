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
    notification,
} from "antd";

import logo from '../assets/images/caiif-logo-2.svg'
import loginImg from '../assets/images/login-img.svg'
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../store/commonSlice/commonSlice";
import { API_URL } from "../config/api";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { setUser, setUserVerification } from "../store/authSlice/authSlice";
import { SpinnerRound } from "spinners-react";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

export default function ResetPassword() {

    const [form] = Form.useForm();
    const [width, setWidth] = useState(0)

    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [err, setErr] = useState("");
    const [message, setMessage] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [formFields, setFormFields] = useState({
        email: "",
    });

    const onFinish = (values) => {
        console.log("Success:", values);
        if (values?.email) {
            handleForgotPassword()
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const handleForgotPassword = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/user/forgetPassword/${formFields.email}`);
            if (response.status === 200) {
                setLoading(false);
                setEmailSent(true)
            }
        } catch (error) {
            setLoading(false);
            setMessage(error?.response?.data?.message ? error?.response?.data?.message : 'Network Error');
            console.log(error);
        }
    };

    console.log(formFields);

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

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                {emailSent === true ? (
                    <Card>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "40px" }}>
                            <div style={{ marginBottom: 20 }}>
                                <Title level={3}>Email send successfully</Title>
                            </div>
                            <div>
                                <img width={60} src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/1200px-Eo_circle_green_checkmark.svg.png" alt="" />
                            </div>
                        </div>
                    </Card>
                ) : (
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

                                    <Title level={3} style={{ margin: "0 0 20px 0", color: '#166805', textAlign: "center" }}>Enter email to reset password</Title>

                                    <Form.Item
                                        style={{ marginBottom: 10 }}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Email!',
                                            },
                                        ]}
                                        name="email">
                                        <Input
                                            onChange={(e) => {
                                                setFormFields({ email: e.target.value })
                                            }}
                                            placeholder="Email" />
                                    </Form.Item>

                                    {message && <Title style={{ fontSize: "16px", margin: "0 0 20px 0", color: "red" }}>{message}</Title>}

                                    <Form.Item>
                                        <Button
                                            loading={loading}
                                            style={{ width: "100%", backgroundColor: "#166805", color: 'white' }}
                                            type="primary"
                                            htmlType="submit"
                                        >
                                            SEND
                                        </Button>
                                    </Form.Item>

                                </Form>
                            </div>
                            {width > 768 && <div style={{ margin: "0 30px" }}>
                                <img src={loginImg} />
                            </div>}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}