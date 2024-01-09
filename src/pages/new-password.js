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
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../store/commonSlice/commonSlice";
import { API_URL } from "../config/api";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../store/authSlice/authSlice";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

export default function NewPassword() {

    const [form] = Form.useForm();

    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [userType, setUserType] = useState("");
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [formFields, setFormFields] = useState({
        password: "",
    });

    const onFinish = (values) => {
        console.log("Success:", values);
        if (values?.password) {
            setFormFields({
                password: values.password,
            })
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const handleCreatePassword = async () => {
        setLoading(true)
        try {
            const response = await axios.post(`${API_URL}/user/createPassword`, {
                newPassword: formFields.password,
                userId: params.id
            })
            if (response.status === 200) {
                setLoading(false)
                setErr(response.data.message)
                setTimeout(() => {
                    navigate("/sign-in")
                }, 3000);
                console.log(response);
            }
        } catch (error) {
            setLoading(false)
            setErr(error.response.data.message)
            console.log(error);
        }
    }

    useEffect(() => {
        if (formFields.password !== "") {
            handleCreatePassword()
        }
    }, [formFields])

    console.log(formFields);

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
                                form={form}
                                layout="vertical"
                                name="basic"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                className="row-col"
                            >

                                <Title level={3} style={{ margin: "0 0 20px 0", color: '#166805', textAlign: "center" }}>Create a new password</Title>

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

                                {err !== null && <Title style={{ fontSize: "16px", margin: "0 0 20px 0", color: "red" }}>{err}</Title>}

                                <Form.Item>
                                    <Button
                                        loading={loading2}
                                        style={{ width: "100%", backgroundColor: "#166805", color: 'white' }}
                                        type="primary"
                                        htmlType="submit"
                                    >
                                        CREATE
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