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
  Select,
  DatePicker
} from "antd";

import logo from '../assets/images/caiif-logo.svg'
import loginImg from '../assets/images/login-img.svg'
import denyIcon from '../assets/images/deny.svg'
import cnicFront from '../assets/images/cnic-front.png'
import axios from "axios";
import { API_URL } from "../config/api";

import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { useNavigate, useParams } from "react-router-dom";
import { GetUserCommittees } from "../middlewares/commitee";
import { setCommittees } from "../store/committeeSlice/committeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { storage } from "../config/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

export default function SignUp() {

  const [form] = Form.useForm();
  const params = useParams();

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const state = useSelector((state) => state.committees.committees)
  const [success, setSuccess] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formSubmit, setFormSubmit] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [monthDuration, setMonthDuration] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [committeeId, setCommitteeId] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");
  const [commitee, setCommittee] = useState(null);
  const [termsCondition, setTermsCondition] = useState({
    first: false,
    second: false,
  });
  const [formFields, setFormFields] = useState({
    cId: "",
    name: "",
    email: "",
    contactNumber: "",
    committee: "",
    nic: "",
    userType: "user",
    jobOccupation: "",
    note: "",
    interestedDate: null
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
    if (values?.name || values?.email || values?.contactNumber || values?.jobOccupation) {
      setFormFields((prevFields) => {
        return {
          ...prevFields,
          name: values.name,
          email: values.email,
          contactNumber: values.contactNumber,
          jobOccupation: values?.jobOccupation,
          note: values?.committeeNote,
          interestedDate: values?.interestedDate
        }
      })
    }
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
        setLoading(false)
        setFormSubmit(true)
        setStatus(response?.data?.success)
        setSuccess(response?.data?.message)
        console.log(response);
      }
    } catch (error) {
      setFormSubmit(false)
      setLoading(false)
      setStatus(error?.response?.data?.success)
      setSuccess(error?.response?.data?.message)
      console.log(error);
    }
  }

  useEffect(() => {
    if (formFields.name && formFields.email && formFields.contactNumber && formFields.jobOccupation && formFields.interestedDate) {
      handleSignup()
      console.log("bhai mein nahi chaloonga");
    }
  }, [formFields])

  const handleUpload = async (imgFile) => {
    setUploading(true)
    const imgRef = ref(storage, `images/${imgFile.name}`)
    uploadBytesResumable(imgRef, imgFile)
      .then((res) => {
        getDownloadURL(res.ref)
          .then(async (url) => {
            console.log("IMAGE UPLOADED", url);
            setStatus("image uploaded")
            setUploading(false)
            setFormFields((prevFields) => {
              return {
                ...prevFields,
                nic: url
              }
            })
          })
          .catch((err) => {
            setUploading(false)
            console.log("IMAGE UPLOAD ERROR", err);
          })
      })
  }

  // async function getCommittee() {
  //   try {
  //     const response = await axios.get(`${API_URL}/user/committeeById/${params.id}`)
  //     console.log(response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // useEffect(() => {
  //   getCommittee()
  // }, [params.id])

  // const getBase64 = (img, callback) => {
  //   const reader = new FileReader();
  //   reader.addEventListener('load', () => callback(reader.result));
  //   reader.readAsDataURL(img);
  // };

  // const handleChange = (info) => {
  //   if (info.file.status === 'uploading') {
  //     setLoading(true);
  //     return;
  //   }
  //   if (info.file.status === 'done') {
  //     console.log(info);
  //     getBase64(info.file.originFileObj, (url) => {
  //       setLoading(false);
  //       setImageUrl(url);
  //       console.log(url);
  //       setFormFields((prevFields) => {
  //         return {
  //           ...prevFields,
  //           nicFront: url
  //         }
  //       })
  //     });
  //   }
  // };

  // const uploadButton = (
  //   <button style={{ border: 0, background: 'none' }} type="button">
  //     {loading ? <LoadingOutlined /> : <PlusOutlined />}
  //     <div style={{ marginTop: 8 }}>Upload</div>
  //   </button>
  // );

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

  async function getCommittee() {
    try {
      const response = await axios.get(`${API_URL}/user/committeeById/${params.cid}`)
      setCommittee(response?.data?.data?.committee)
      const startDateObj = new Date(response?.data?.data?.committee?.startDate);
      const endDateObj = new Date(response?.data?.data?.committee?.endDate);
      const yearsDiff = endDateObj.getUTCFullYear() - startDateObj.getUTCFullYear();
      const monthsDiff = endDateObj.getUTCMonth() - startDateObj.getUTCMonth();
      const totalMonths = yearsDiff * 12 + monthsDiff;
      setMonthDuration(totalMonths + 1)
      setFormFields((prevFields) => {
        return {
          ...prevFields,
          cId: response?.data?.data?.committee?._id,
          committee: response?.data?.data?.committee?._id,
        }
      })
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log(params);
    getCommittee()
  }, [params.cid])

  console.log(commitee);
  console.log(monthDuration);
  console.log(formFields);

  return (
    <div>

      {/* <div style={{ width: "100%", backgroundColor: "#166805", padding: "20px" }} onClick={() => navigate("/sign-in")}>
      </div> */}

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: formSubmit && "100vh", }}>
        {/* <Title level={3} style={{ margin: "0 0 20px 0", color: '#166805', textAlign: "center", }}>REGISTER CAIIF COMMITTEE</Title> */}
        <Card>
          {/* <img style={{ display: "block", margin: "0 auto 30px auto" }} width={200} src={logo} alt="" /> */}
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
          <div style={{ margin: "0 50px" }}>
            {/* <img style={{ marginBottom: 70, display: "block", margin: "0 auto" }} width={300} src={logo} /> */}
            <Form
              form={form}
              layout="vertical"
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="row-col"
              style={{ width: '100%' }}
            >
              <Row gutter={[24, 0]}>
                {formSubmit ? (
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", padding: "40px" }}>
                      <div style={{ marginBottom: 20, textAlign: "center" }}>
                        <Title level={1} style={{ color: '#166805' }}>Form Submitted</Title>
                        <Title level={3}>Our team will be in touch shortly. Thank you for your patience.</Title>
                        <Title level={3}>+1 289-586-910</Title>
                      </div>
                      <div>
                        <img width={60} src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/1200px-Eo_circle_green_checkmark.svg.png" alt="" />
                      </div>
                      <Button
                        onClick={() => window.open("https://caiif.ca/")}
                        style={{ width: "200px", backgroundColor: "#166805", color: 'white', marginTop: 40 }}
                        type="primary"
                      >
                        Go back to home
                      </Button>
                    </div>
                  </Col>
                ) : (
                  <>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ margin: "0 0 50px 0" }}>
                      <div style={{ margin: "20px 0" }}>
                        <Title level={2} style={{ color: "green", fontWeight: "700" }}>CAIIF Committee Registeration</Title>
                      </div>
                      {commitee?.payment === "1000" ? (
                        <Title level={5} style={{ color: "green", fontWeight: "600", margin: "0" }}>
                          Ideal for beginners, this committee offers a supportive environment to learn and grow within Islamic financial principles. Members can expect to build a foundational investment portfolio with minimized risks and consistent guidance.
                          <br />
                          This committee operates over an 8-month period. CAIIF charges a 3% fee for the first four members, which reduces to 2% for the 5th and 6th members. The last two members are exempt from these charges.
                        </Title>

                      ) : commitee?.payment === "3000" ? (

                        <Title level={5} style={{ color: "green", fontWeight: "600", margin: "0" }}>
                          Aimed at investors seeking intermediate-level involvement, this committee emphasizes diversified investment strategies and portfolio expansion, balancing risk and reward efficiently.
                          <br />
                          This committee operates over an 8-month period. CAIIF charges a 3% fee for the first four members, which reduces to 2% for the 5th and 6th members. The last two members are exempt from these charges.
                        </Title>
                      ) : commitee?.payment === "5000" ? (
                        <Title level={5} style={{ color: "green", fontWeight: "600", margin: "0" }}>
                          This is for advanced investors focused on significant capital growth. It offers opportunities in sophisticated investment strategies, leveraging the expertise of seasoned investors and Islamic financial principles.
                          <br />
                          This committee operates over an 8-month period. CAIIF charges a 3% fee for the first four members, which reduces to 2% for the 5th and 6th members. The last two members are exempt from these charges.
                        </Title>
                      ) : null}
                    </Col>
                    <Col xs={24} sm={24} md={6} lg={4} xl={4}>
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
                    <Col xs={24} sm={24} md={6} lg={4} xl={4}>
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
                    <Col xs={24} sm={24} md={6} lg={4} xl={4}>
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
                    <Col xs={24} sm={24} md={6} lg={4} xl={4}>
                      <Form.Item name="jobOccupation"
                        rules={[
                          {
                            required: true,
                            message: 'Please input your Job Occupation !',
                          },
                        ]}
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Job Occupation</Title>}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={6} lg={8} xl={8}>
                      <Form.Item name="interestedDate"
                        rules={[
                          {
                            required: true,
                            message: 'Please input your Interested Date !',
                          },
                        ]}
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Interested Date</Title>}>
                        <DatePicker style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={6} lg={4} xl={4}>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: 'Please select your Committee !',
                          },
                        ]}
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Committee</Title>}>
                        {/* <Select
                          defaultValue="Select"
                          style={{ width: "100%" }}
                          options={state?.map(f => {
                            return { value: f?.committee._id, label: f?.committee.name }
                          })}
                          onChange={(e) => setCommitteeId(e)}
                        /> */}
                        <Input disabled={true} value={commitee?.name} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={6} lg={4} xl={4}>
                      <Form.Item
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Duration</Title>}>
                        <Input disabled={true} value={monthDuration} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={6} lg={4} xl={4}>
                      <Form.Item
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Total Amount</Title>}>
                        <Input disabled={true} value={commitee?.payment} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={6} lg={4} xl={4}>
                      <Form.Item
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Monthly Payment</Title>}>
                        <Input disabled={true} value={commitee?.amount} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={6} lg={8} xl={8}>
                      <Form.Item
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Start Date</Title>}>
                        <Input disabled={true} value={new Date(commitee?.startDate).toLocaleDateString()} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item name="committeeNote"
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Note</Title>}>
                        <Input.TextArea style={{ height: "100px" }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={2} lg={2} xl={2} style={{ marginBottom: 10 }}>
                      <Title style={{ fontSize: "16px", margin: "0 0 8px 0", color: "#4E4E4E" }}>ID</Title>
                      {/* <Form.Item name="CNIC">
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
                      </Form.Item> */}
                      {/* <input type="file" onChange={(e) => handleUpload(e.target.files[0])} /> */}
                      <Upload showUploadList={false} name="file" onChange={(e) => handleUpload(e.file.originFileObj)}>
                        <Button loading={uploading} icon={<UploadOutlined />}>Upload NIC</Button>
                      </Upload>
                      {formFields?.nic ? <img style={{ width: "100% !important", margin: "20px 0 0 0", borderRadius: "5px" }} src={formFields?.nic} /> : ""}
                      {/* {status ? <p style={{ color: "green", fontSize: "20px", fontWeight: "700" }}>{status}</p> : ""} */}
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      {success !== "" && <Title style={{ fontSize: "16px", margin: "0 0 20px 0", color: status === true ? "green" : "red" }}>{success}</Title>}
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ margin: "40px 0 0 0" }}>
                      <Title style={{ fontSize: "16px" }}>Terms & conditions.</Title>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Checkbox onChange={(e) => setTermsCondition((prevCondition) => {
                        return {
                          ...prevCondition,
                          first: e.target.checked
                        }
                      })} checked={termsCondition.first}>
                        <Title style={{ fontSize: "13px" }}>
                          Enrollment confirms your eligibility and agreement to all CAIIF terms and conditions.
                        </Title>
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Checkbox onChange={(e) => setTermsCondition((prevCondition) => {
                        return {
                          ...prevCondition,
                          second: e.target.checked
                        }
                      })} checked={termsCondition.second}>
                        <Title style={{ fontSize: "13px" }}>
                          You agree to the 8-month commitment and fee structure based on committee membership.
                        </Title>
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={3} xl={3} style={{ marginTop: 30 }}>
                      <Button
                        disabled={termsCondition.first && termsCondition.second ? false : true}
                        loading={loading}
                        style={{ width: "100%", backgroundColor: termsCondition.first && termsCondition.second ? "#166805" : !termsCondition.first || !termsCondition.second ? "grey" : "", color: 'white' }}
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
          {/* {activeStep === 0 && (
              <div style={{ margin: "0 30px" }}>
                <img src={loginImg} />
              </div>
            )} */}
        </Card>
      </div >
    </div >
  );
}