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
  Row,
  Select
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
import { GetUserCommittees } from "../middlewares/commitee";
import { setCommittees } from "../store/committeeSlice/committeeSlice";
import { useDispatch, useSelector } from "react-redux";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

export default function SignUp() {

  const [form] = Form.useForm();

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const state = useSelector((state) => state.committees.committees)
  const [success, setSuccess] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formSubmit, setFormSubmit] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [monthDuration, setMonthDuration] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [committeeId, setCommitteeId] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [formFields, setFormFields] = useState({
    cId: "",
    name: "",
    email: "",
    contactNumber: "",
    committee: "",
    nicFront: imageUrl,
    nicBack: imageUrl2,
    userType: "user",
    note: ""
    // password: "",
    // userType: "customer",
    // bankName: "",
    // bankBranchName: "",
    // accountNumber: "",
    // workAddress: "",
    // residentialAddress: "",
    // monthlyIncome: "",
    // jobOccupation: "",
    // emergencyContactRelation: "",
    // emergencyContact: "",
  });

  const onFinish = (values) => {
    console.log("Success:", values);
    if (values?.name || values?.email || values?.contactNumber || values?.committee || values?.duration || values?.monthlyPayment) {
      // setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setFormFields((prevFields) => {
        return {
          ...prevFields,
          cId: committeeId,
          name: values.name,
          email: values.email,
          contactNumber: values.contactNumber,
          committee: values?.committee,
          note: values?.committeeNote
        }
      })
    }
    // if (
    //   values?.bankName ||
    //   values?.bankBranchName ||
    //   values?.accountNumber ||
    //   values?.workAddress ||
    //   values?.residentialAddress ||
    //   values?.monthlyIncome ||
    //   values?.jobOccupation ||
    //   values?.emergencyContactRelation ||
    //   values?.emergencyContact
    // ) {
    //   setFormFields((prevFields) => {
    //     return {
    //       ...prevFields,
    //       bankName: values.bankName,
    //       bankBranchName: values.bankBranchName,
    //       accountNumber: values.accountNumber,
    //       workAddress: values.workAddress,
    //       residentialAddress: values.residentialAddress,
    //       monthlyIncome: values.monthlyIncome,
    //       jobOccupation: values.jobOccupation,
    //       emergencyContactRelation: values.emergencyContactRelation,
    //       emergencyContact: values.emergencyContact,
    //     }
    //   })
    // }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleSignup = async () => {
    setLoading(true)
    setFormSubmit(false)
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        ...formFields
      })
      if (response.status === 200) {
        if (response.data.message === "request entity too large") {
          setLoading(false)
          setFormSubmit(false)
          setStatus(response.data.success)
          setSuccess(response.data.message)
        }
        else {
          setLoading(false)
          setFormSubmit(true)
          setStatus(response.data.success)
          setSuccess(response.data.message)
        }
        setTimeout(() => {
          navigate("/sign-in")
        }, 2000);
        console.log(response);
      }
    } catch (error) {
      setFormSubmit(false)
      setLoading(false)
      setStatus(error.response.data.success)
      setSuccess(error.response.data.message)
      console.log(error);
    }
  }

  useEffect(() => {
    if (formFields.name !== "" || formFields.email !== "" || formFields.contactNumber !== "" || formFields.committee !== "") {
      handleSignup()
      console.log("bhai mein nahi chaloonga");
    }
  }, [formFields])

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
      console.log(info);
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
        setFormFields((prevFields) => {
          return {
            ...prevFields,
            nicFront: url
          }
        })
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
        setFormFields((prevFields) => {
          return {
            ...prevFields,
            nicBack: url
          }
        })
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

  useEffect(() => {
    GetUserCommittees()
      .then((res) => {
        const committee = res.data.allCommittees
        dispatch(setCommittees([...committee.level1, ...committee.level2, ...committee.level3]))
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  useEffect(() => {
    const findCommittee = state?.find((f) => f.committee._id === committeeId)
    const startDateObj = new Date(findCommittee?.committee.startDate);
    const endDateObj = new Date(findCommittee?.committee.endDate);
    const yearsDiff = endDateObj.getUTCFullYear() - startDateObj.getUTCFullYear();
    const monthsDiff = endDateObj.getUTCMonth() - startDateObj.getUTCMonth();
    const totalMonths = yearsDiff * 12 + monthsDiff;
    setMonthDuration(totalMonths)
    setMonthlyPayment(findCommittee?.committee?.payment)
  }, [committeeId])

  // console.log(state);
  console.log(formFields);
  // console.log(monthDuration);

  return (
    <div>

      <div style={{ width: "100%", backgroundColor: "#166805", padding: "20px" }}>
        <img width={200} src={logo} alt="" />
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: '90vh' }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
            <div style={{ margin: "0" }}>
              {/* {activeStep === 0 ? (
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
              ) : "" */}
              <div>
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
                    {formSubmit ? (
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "40px" }}>
                          <div style={{ marginBottom: 20 }}>
                            <Title>Account created successfully</Title>
                          </div>
                          <div>
                            <img width={100} src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/1200px-Eo_circle_green_checkmark.svg.png" alt="" />
                          </div>
                        </div>
                      </Col>
                    ) : (
                      <>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                          <Title style={{ fontSize: "16px", margin: "0 0 8px 0", color: "#4E4E4E" }}>CNIC Front</Title>
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
                          <Title style={{ fontSize: "16px", margin: "0 0 8px 0", color: "#4E4E4E" }}>CNIC Back</Title>
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
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                          <Form.Item name="name"
                            rules={[
                              {
                                required: true,
                                message: 'Please input your Name !',
                              },
                            ]}
                            label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Name</Title>}>
                            <Input value={formFields.name} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                          <Form.Item name="email"
                            rules={[
                              {
                                required: true,
                                message: 'Please input your Email !',
                              },
                            ]}
                            label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Email</Title>}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                          <Form.Item name="contactNumber"
                            rules={[
                              {
                                required: true,
                                message: 'Please input your Phone Number !',
                              },
                            ]}
                            label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Phone Number</Title>}>
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                          <Form.Item name="committee"
                            rules={[
                              {
                                required: true,
                                message: 'Please select your Committee !',
                              },
                            ]}
                            label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Committee</Title>}>
                            <Select
                              defaultValue="Select"
                              style={{ width: "100%" }}
                              options={state?.map(f => {
                                return { value: f?.committee._id, label: f?.committee.name }
                              })}
                              onChange={(e) => setCommitteeId(e)}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                          <Form.Item
                            label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Duration</Title>}>
                            <Input disabled={true} value={monthDuration} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                          <Form.Item
                            label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Monthly Payment</Title>}>
                            <Input disabled={true} value={monthlyPayment} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <Form.Item name="committeeNote"
                            label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Note</Title>}>
                            <Input.TextArea style={{ height: "100px" }} />
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
                            SUBMIT
                          </Button>
                        </Col>
                      </>
                    )}
                    {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Fo
                        rm.Item name="bankBranchName" rules={[
                          {
                            required: true,
                            message: 'Please input your Bank Branch Name!',
                          },
                        ]} label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Bank Branch Name</Title>}>
                          <Input />
                        </Form.Item>
                      </Col> */}
                    {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
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
                      </Col> */}
                    {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
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
                      </Col> */}
                    {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
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
                      </Col> */}
                    {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
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
                      </Col> */}
                    {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
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
                      </Col> */}
                    {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
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
                      </Col> */}
                    {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
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
                      </Col> */}
                  </Row>
                </Form>
              </div>
            </div>
            {/* {activeStep === 0 && (
              <div style={{ margin: "0 30px" }}>
                <img src={loginImg} />
              </div>
            )} */}
          </div >
        </Card >
      </div >
    </div >
  );
}