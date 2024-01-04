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
  Col,
  Row
} from "antd";

import logo from '../assets/images/caiif-logo-2.svg'
import loginImg from '../assets/images/login-img.svg'
import denyIcon from '../assets/images/deny.svg'
import cnicFront from '../assets/images/cnic-front.png'
import axios from "axios";
import { API_URL } from "../config/api";

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

export default function SignUp() {

  const [form] = Form.useForm();

  const navigate = useNavigate()
  const [success, setSuccess] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formFields, setFormFields] = useState({
    name: "",
    password: "",
    email: "",
    contactNumber: "",
    userType: "customer",
    bankName: "",
    bankBranchName: "",
    accountNumber: "",
    workAddress: "",
    residentialAddress: "",
    monthlyIncome: "",
    jobOccupation: "",
    emergencyContactRelation: "",
    emergencyContact: "",
  });

  const onFinish = (values) => {
    console.log("Success:", values);
    if (values?.name || values?.email || values?.phonenumber || values?.password) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setFormFields((prevFields) => {
        return {
          ...prevFields,
          name: values.name,
          contactNumber: values.phonenumber,
          email: values.email,
          password: values.password,
        }
      })
    }
    if (
      values?.bankName ||
      values?.bankBranchName ||
      values?.accountNumber ||
      values?.workAddress ||
      values?.residentialAddress ||
      values?.monthlyIncome ||
      values?.jobOccupation ||
      values?.emergencyContactRelation ||
      values?.emergencyContact
    ) {
      setFormFields((prevFields) => {
        return {
          ...prevFields,
          bankName: values.bankName,
          bankBranchName: values.bankBranchName,
          accountNumber: values.accountNumber,
          workAddress: values.workAddress,
          residentialAddress: values.residentialAddress,
          monthlyIncome: values.monthlyIncome,
          jobOccupation: values.jobOccupation,
          emergencyContactRelation: values.emergencyContactRelation,
          emergencyContact: values.emergencyContact,
        }
      })
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleSignup = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        ...formFields
      })
      if (response.status === 200) {
        setLoading(false)
        setStatus(response.data.success)
        setSuccess(response.data.message)
        setTimeout(() => {
          navigate("/sign-in")
        }, 2000);
        console.log(response);
      }
    } catch (error) {
      setLoading(false)
      setStatus(error.response.data.success)
      setSuccess(error.response.data.message)
      console.log(error);
    }
  }

  useEffect(() => {
    if (formFields.bankName !== "" || formFields.bankBranchName !== "" || formFields.accountNumber !== "" || formFields.workAddress !== "" || formFields.residentialAddress !== "" || formFields.monthlyIncome !== "" || formFields.jobOccupation !== "" || formFields.emergencyContactRelation !== "" || formFields.emergencyContact !== "") {
      handleSignup()
      console.log("bhai mein nahi chaloonga");
    }
  }, [formFields])

  const [imageUrl, setImageUrl] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const handleChange2 = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl2(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const uploadButton2 = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div>

      <div style={{ width: "100%", backgroundColor: "#166805", padding: "20px" }}>
        <img width={200} src={logo} alt="" />
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: activeStep === 0 ? "100px" : "10px" }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
            <div style={{ margin: "0 30px" }}>
              {activeStep === 0 ? (
                <div className={activeStep === 0 ? 'step-form__step--active' : ''}>
                  <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className="row-col"
                  >

                    <Title level={3} style={{ margin: "0 0 20px 0", color: '#166805', textAlign: "center" }}>Sign Up</Title>

                    <Form.Item name="name" rules={[
                      {
                        required: true,
                        message: 'Please input your name!',
                      },
                    ]}>
                      <Input style={{ width: "300px" }} placeholder="Name" />
                    </Form.Item>

                    <Form.Item name="phonenumber" rules={[
                      {
                        required: true,
                        message: 'Please input your Phone Number!',
                      },
                    ]}>
                      <Input style={{ width: "300px" }} placeholder="Phone Number" />
                    </Form.Item>

                    <Form.Item name="email" rules={[
                      {
                        required: true,
                        message: 'Please input your email!',
                      },
                    ]}>
                      <Input style={{ width: "300px" }} placeholder="Email" />
                    </Form.Item>

                    <Form.Item name="password" rules={[
                      {
                        required: true,
                        message: 'Please input your password!',
                      },
                    ]}>
                      <Input.Password style={{ width: "300px" }} placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        onClick={onFinish}
                        style={{ width: "100%", backgroundColor: "#166805", color: 'white' }}
                        type="primary"
                        htmlType="submit"
                      >
                        NEXT
                      </Button>
                    </Form.Item>

                  </Form>
                </div>
              ) : activeStep === 1 ? (
                <div className={activeStep === 1 ? 'step-form__step--active' : ''}>
                  <Form
                    form={form}
                    layout="vertical"
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className="row-col"
                    style={{ width: '861px' }}
                  >
                    <Row gutter={[24, 0]}>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Card className="my-card" style={{ border: "2px solid #166805", padding: "3px", marginBottom: 20 }}>
                          <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                            // beforeUpload={beforeUpload}
                            onChange={handleChange}
                          >
                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ borderRadius: "10px", width: "100%", height: '150px', objectFit: "cover" }} /> : uploadButton}</Upload>
                        </Card>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Card className="my-card" style={{ border: "2px solid #166805", padding: "3px", marginBottom: 20 }}>
                          <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                            // beforeUpload={beforeUpload}
                            onChange={handleChange2}
                          >
                            {imageUrl2 ? <img src={imageUrl2} alt="avatar" style={{ borderRadius: "10px", width: "100%", height: '150px', objectFit: "cover" }} /> : uploadButton2}</Upload>
                        </Card>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Name</Title>}>
                          <Input value={formFields.name} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item name="bankName" rules={[
                          {
                            required: true,
                            message: 'Please input your Bank Name!',
                          },
                        ]} label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Bank Name</Title>}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item name="bankBranchName" rules={[
                          {
                            required: true,
                            message: 'Please input your Bank Branch Name!',
                          },
                        ]} label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Bank Branch Name</Title>}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                          name="accountNumber"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your Account Number!',
                            },
                          ]} label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Bank Account Number</Title>}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                          name="workAddress"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your Work Address!',
                            },
                          ]}
                          label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Work Address</Title>}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                          name="residentialAddress"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your Residential Address!',
                            },
                          ]}
                          label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Residential Address</Title>}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                          name="monthlyIncome"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your Monthly Income!',
                            },
                          ]}
                          label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Monthly Income</Title>}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                          name="jobOccupation"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your Job Occupation!',
                            },
                          ]}
                          label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Job Occupation</Title>}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                          name="emergencyContactRelation"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your Emergency Contact Relation!',
                            },
                          ]}
                          label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Emergency Contact Relation</Title>}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                          name="emergencyContact"
                          rules={[
                            {
                              required: true,
                              message: 'Please input your Emergency Contact!',
                            },
                          ]}
                          label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Emergency Contact</Title>}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        {success !== "" && <Title style={{ fontSize: "16px", margin: "0 0 20px 0", color: status === true ? "green" : "red" }}>{success}</Title>}
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                        <Button
                          loading={loading}
                          style={{ width: "100%", backgroundColor: "#166805", color: 'white' }}
                          type="primary"
                          htmlType="submit"
                        >
                          SIGN UP
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </div>
              ) : null}
            </div>
            {activeStep === 0 && (
              <div style={{ margin: "0 30px" }}>
                <img src={loginImg} />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}