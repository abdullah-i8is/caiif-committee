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
import { SpinnerRound } from "spinners-react";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

export default function VerifyAccount() {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const params = useParams()
  console.log(params);

  const handleVerifyAccount = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/user/verifyAccount/${params.id}/${params.email}`)
      if (response.status === 200) {
        setLoading(false)
        setMessage(response.data.message)
        setTimeout(() => {
          navigate("/sign-in")
        }, 2000);
      }
      console.log(response);
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  }

  useEffect(() => {
    handleVerifyAccount()
  }, [])

  const navigate = useNavigate()

  return (
    <div>
      <div style={{ width: "100%", backgroundColor: "#166805", padding: "20px" }} onClick={() => navigate("/sign-in")}>
        <img width={200} src={logo} alt="" />
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "40px" }}>
            <div style={{ marginBottom: 20 }}>
              <Title>{loading ? "Verifying Your Account..." : message}</Title>
            </div>
            <div>
              {loading ? <SpinnerRound size={200} thickness={100} speed={100} color="#36ad47" /> : <img width={100} src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/1200px-Eo_circle_green_checkmark.svg.png" alt="" />}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}