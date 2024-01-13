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
import { useDispatch, useSelector } from "react-redux";
import { setToken } from "../store/commonSlice/commonSlice";
import { API_URL } from "../config/api";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { setUser, setUserVerification } from "../store/authSlice/authSlice";
import { SpinnerRound } from "spinners-react";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

export default function NewPassword() {

    const [form] = Form.useForm();

    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [err, setErr] = useState("");
    const [message, setMessage] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [formFields, setFormFields] = useState({
        password: "",
    });
    const isVerified = useSelector((state) => state.auth.isVerified)

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
                userId: userId
            })
            if (response.status === 200) {
                setLoading(false)
                setErr(response.data.message)
                console.log(response);
                const token = response.data.token
                const user = jwtDecode(token)
                dispatch(setToken(token))
                dispatch(setUser(user))
                window.open("https://caiif.ca/dashboard", "_self")
            }
        } catch (error) {
            setLoading(false)
            setErr(error.response.data.message)
            console.log(error);
        }
    }

    const handleVerify = async () => {
        setLoading2(true)
        dispatch(setUserVerification(false))
        try {
            const response = await axios.post(`${API_URL}/user/verifyAccount/${params.id}/${params.email}`)
            if (response.status === 200) {
                setMessage(response.data.message)
                setLoading2(false)
                setTimeout(() => {
                    dispatch(setUserVerification(true))
                }, 3000);
                setUserId(response.data.user._id)
            }
        } catch (error) {
            setLoading2(false)
            console.log(error);
        }
    }

    useEffect(() => {
        if (formFields.password !== "") {
            handleCreatePassword()
        }
    }, [formFields])

    useEffect(() => {
        handleVerify()
    }, [])

    console.log(params);
    console.log(isVerified);

    return (
        <div>

            <div style={{ width: "100%", backgroundColor: "#166805", padding: "20px" }}>
                <img width={200} src={logo} alt="" />
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                {isVerified === false ? (
                    <Card>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "40px" }}>
                            <div style={{ marginBottom: 20 }}>
                                <Title level={3}>{loading2 ? "Verifying Your Account..." : message}</Title>
                            </div>
                            <div>
                                {loading2 ? <SpinnerRound size={200} thickness={100} speed={100} color="#36ad47" /> : <img width={60} src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/1200px-Eo_circle_green_checkmark.svg.png" alt="" />}
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

                                    {err && <Title style={{ fontSize: "16px", margin: "0 0 20px 0", color: "red" }}>{err}</Title>}

                                    <Form.Item>
                                        <Button
                                            loading={loading}
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
                )}
            </div>
        </div>
    );
}