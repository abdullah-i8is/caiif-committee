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
  DatePicker,
  notification
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
import moment from "moment";

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
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [commitee, setCommittee] = useState(null);
  const [termsCondition, setTermsCondition] = useState({
    first: false,
    second: false,
  });
  const [formFields, setFormFields] = useState({
    cId: "",
    userType: "user",
    email: "",
    contactNumber: "",
    jobOccupation: "",
    firstName: "",
    lastName: "",
    contactNumber: "",
    emergencyContact: "",
    sin: "",
    nic: "",
    residentialAddress: "",
    residentialStatus: "",
    grossAnnualIncome: "",
    sourceOfIncome: "",
    employmentStatus: "",
    appointment: {
      date: null,
    },
    DOB: {
      day: "",
      month: "",
      year: "",
    },
    address1: "",
    address2: "",
    city: "",
    province: "",
    postalCode: "",
  });
  const [api, contextHolder] = notification.useNotification();
  const [step, setStep] = useState(1);
  const [width, setWidth] = useState(0);
  const [fieldName, setFieldName] = useState()

  const onFinish = (values) => {
    console.log("Success:", values);
    setFormFields((prevFields) => {
      return {
        ...prevFields,
        email: values.email,
        contactNumber: values.contactNumber,
        jobOccupation: values?.jobOccupation,
        firstName: values?.firstName,
        lastName: values?.lastName,
        contactNumber: values?.contactNumber,
        emergencyContact: values?.emergencyContact,
        sin: values?.sin,
        nic: values?.nic,
        residentialAddress: values?.residentialAddress,
        residentialStatus: values?.residentialStatus,
        grossAnnualIncome: values?.grossAnnualIncome,
        sourceOfIncome: values?.sourceOfIncome,
        employmentStatus: values?.employmentStatus,
        address1: values?.address1,
        address2: values?.address2,
        city: values?.city,
        province: values?.province,
        postalCode: values?.postalCode,
      }
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleSignup = async () => {
    if (
      formFields.email === "" ||
      formFields.contactNumber === "" ||
      formFields.jobOccupation === "" ||
      formFields.firstName === "" ||
      formFields.lastName === "" ||
      formFields.emergencyContact === "" ||
      formFields.sin === "" ||
      formFields.nic === "" ||
      formFields.residentialAddress === "" ||
      formFields.residentialStatus === "" ||
      formFields.grossAnnualIncome === "" ||
      formFields.sourceOfIncome === "" ||
      formFields.employmentStatus === "" ||
      formFields.address1 === "" ||
      formFields.address2 === "" ||
      formFields.city === "" ||
      formFields.province === "" ||
      formFields.postalCode === ""
    ) {
      Object.entries(formFields).forEach(([key, value]) => {
        if (value === "") {
          api.error({
            message: 'Notification',
            description: `${key} is required`,
            placement: {
              top: 24,
              right: 24,
            },
          });
        }
      });
    }
    else {
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
        api.error({
          message: `Notification`,
          description: error?.response?.data?.message ? error?.response?.data?.message : "network error",
          placement: "topRight",
        });
        console.log(error);
      }
    }
  }

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

  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      api.error({
        message: `Notification`,
        description: error?.response?.data?.message ? error?.response?.data?.message : "network error",
        placement: "topRight",
      });
    }
  }

  useEffect(() => {
    console.log(params);
    getCommittee()
  }, [params.cid])

  console.log(formFields);

  return (
    <div>
      {contextHolder}
      <div style={{ display: "flex", justifyContent: "center", alignItems: width < 768 ? "flex-start" : "center", height: formSubmit && "100vh", }}>
        <Card style={{ height: step === 2 && "100vh" }}>
          <div style={{ margin: width < 768 ? 0 : "0 50px" }}>
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
              {formSubmit ? (
                <Row gutter={[24, 0]} type="flex" justify="center" align="middle">
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: width < 768 ? "flex-start" : "center", flexDirection: "column", padding: "40px" }}>
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
                </Row>
              ) : (
                <>

                  <Row gutter={[24, 0]}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ margin: "0 0 50px 0" }}>
                      <div style={{ margin: "20px 0" }}>
                        {/* <Title level={2} style={{ color: "green", fontWeight: "700" }}>CAIIF Committee Registeration</Title> */}
                        {/* <div style={{ display: "flex", alignItems: width < 768 ? "flex-start" : "center", marginBottom: 40 }}>
                          <img width={200} src={logo} />
                          <Title level={1} className="signup-title">Committee</Title>
                        </div> */}
                        <Title level={2} style={{ color: "green", fontWeight: "700", margin: 0 }}>Daily Essentials</Title>
                        {/* <Title level={2} style={{ color: "green", fontWeight: "700", margin: 0 }}>Apply for $ 1000 Committee</Title> */}
                        {/* <Title level={5} style={{ color: "green", fontWeight: "600", margin: "0" }}>
                          This committee operates over an 8-month period. CAIIF charges a 3% fee for the first four members, which reduces to 2% for the 5th and 6th members. The last two members are exempt from these charges. The membership structure involves a tiered fee system, encouraging participation and recognizing the contributions of each member.
                        </Title> */}
                        <Card className="my-card2" style={{ background: "#166805", marginTop: 20 }}>
                          <div style={{ display: 'flex', justifyContent: "space-between", textAlign: width < 768 ? "center" : "", flexDirection: width < 768 ? "column" : "row" }}>
                            <div>
                              <Title level={4} style={{ fontWeight: "700", margin: 0, color: '#F2C649' }}>Cycle</Title>
                              <Title level={4} style={{ fontWeight: "700", margin: 0, color: "white" }}>Monthly</Title>
                            </div>
                            <div style={{ margin: width < 768 ? "20px 0" : "0 30px" }}>
                              <Title level={4} style={{ fontWeight: "700", margin: 0, color: '#F2C649' }}>Monthly Payment</Title>
                              <Title level={4} style={{ fontWeight: "700", margin: 0, color: "white" }}>$ 125</Title>
                            </div>
                            <div>
                              <Title level={4} style={{ fontWeight: "700", margin: 0, color: '#F2C649' }}>Total Amount</Title>
                              <Title level={4} style={{ fontWeight: "700", margin: 0, color: "white" }}>$ 1000</Title>
                            </div>
                            <div style={{ margin: width < 768 ? "20px 0 0 0" : "0 0 0 30px" }}>
                              <Title level={4} style={{ fontWeight: "700", margin: 0, color: '#F2C649' }}>Term</Title>
                              <Title level={4} style={{ fontWeight: "700", margin: 0, color: "white" }}>8 Months</Title>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </Col>
                  </Row>
                  <Title level={2} style={{ color: "green", fontWeight: "600", margin: "0 0 60px 0", textAlign: "center" }}>
                    Personal Information
                  </Title>
                  <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
                    <div style={{ display: "flex", flexDirection: width < 768 ? "column" : "row", justifyContent: "space-between" }}>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: 'Please input your First Name!',
                          },
                        ]}
                        required={true}
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>First name</Title>}
                      >
                        <Input
                          onChange={(e) => {
                            setFieldName({ type: "firstName", value: e.target.value })
                            setFormFields((prevFields) => {
                              return {
                                ...prevFields,
                                firstName: e.target.value
                              }
                            });
                          }}
                          style={{ width: width < 768 ? "100%" : "300px" }}
                          placeholder="First Name"
                          value={formFields.firstName}
                        />
                      </Form.Item>
                      <Form.Item
                        required={true}
                        rules={[
                          {
                            required: true,
                            message: 'Please input your Last Name !',
                          },
                        ]}
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Last name</Title>}>
                        <Input
                          onChange={(e) => {
                            setFieldName({ type: "lastName", value: e.target.value })
                            setFormFields((prevFields) => {
                              return {
                                ...prevFields,
                                lastName: e.target.value
                              }
                            });
                          }}
                          style={{ width: width < 768 ? "100%" : "300px" }}

                          placeholder="Last Name"
                          value={formFields.lastName}
                        />
                      </Form.Item>
                    </div>
                    <Form.Item
                      required={true}
                      rules={[
                        {
                          required: true,
                          message: 'Please input your Email!',
                        },
                        {
                          type: 'email',
                          message: 'The input is not a valid email!',
                        },
                        {
                          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address!',
                        },
                      ]}
                      label={<Title style={{ fontSize: '16px', margin: 0, color: '#4E4E4E' }}>E-mail</Title>}
                    >
                      <Input
                        style={{ width: width < 768 ? "100%" : '100%' }}
                        type="email"
                        placeholder="youremail@email.com"
                        onChange={(e) => {
                          setFieldName({ type: 'email', value: e.target.value });
                          setFormFields((prevFields) => {
                            return {
                              ...prevFields,
                              email: e.target.value,
                            };
                          });
                        }}
                        value={formFields.email}
                      />
                    </Form.Item>

                    <div style={{ display: "flex", flexDirection: width < 768 ? "column" : "row", justifyContent: "space-between" }}>
                      <Form.Item
                        required={true}
                        rules={[
                          {
                            required: true,
                            message: 'Please input your Contact Number !',
                          },
                        ]}
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Primary phone</Title>}>
                        <Input value={formFields.contactNumber} onChange={(e) => {
                          setFieldName({ type: "contactNumber", value: e.target.value })
                          if (e.target.value.length <= 11) {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            const formattedValue = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                            setFormFields((prevFields) => {
                              return {
                                ...prevFields,
                                contactNumber: formattedValue
                              }
                            });
                          }
                        }} style={{ width: width < 768 ? "100%" : "300px" }}
                          placeholder="(___)___-___" />
                      </Form.Item>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: 'Please input your Secondary Contact Number !',
                          },
                        ]}
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Secondary phone (optional)</Title>}>
                        <Input value={formFields.emergencyContact} onChange={(e) => {
                          setFieldName({ type: "emergencyContact", value: e.target.value })
                          if (e.target.value.length <= 11) {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            const formattedValue = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                            setFormFields((prevFields) => {
                              return {
                                ...prevFields,
                                emergencyContact: formattedValue
                              }
                            });
                          }
                        }} style={{ width: width < 768 ? "100%" : "300px" }}

                          placeholder="(___)___-___" />
                      </Form.Item>
                    </div>
                    <div style={{ display: 'flex', flexDirection: width < 768 ? "column" : "row", justifyContent: "space-between" }}>
                      <Form.Item
                        style={{ marginRight: width < 768 ? 0 : 10 }}
                        rules={[
                          {
                            required: true,
                            message: 'Please input your SIN !',
                          },
                        ]}
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Social insurance number (optional)</Title>}>
                        <Input
                          value={formFields.sin}
                          onChange={(e) => {
                            setFieldName({ type: "sin", value: e.target.value })
                            if (e.target.value.length <= 8) {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              setFormFields((prevFields) => {
                                return {
                                  ...prevFields,
                                  sin: value
                                };
                              });
                            }
                          }}
                          style={{ width: width < 768 ? "100%" : "300px" }}
                          placeholder="___-__-___"
                        />
                      </Form.Item>
                      <Form.Item
                        required={true}
                        rules={[
                          {
                            required: true,
                            message: 'Please input your DOB !',
                          },
                        ]}
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>DOB</Title>}>
                        <DatePicker
                          style={{ width: '100px', height: "40px" }}
                          picker="month"
                          format="MM"
                          placeholder="MM"
                          onChange={(e, dateString) => {
                            console.log(dateString);
                            setFormFields((prevFields) => {
                              return {
                                ...prevFields,
                                DOB: {
                                  ...prevFields.DOB,
                                  day: dateString
                                }
                              }
                            })
                          }}
                        />
                        <DatePicker
                          style={{ width: '100px', height: "40px" }}
                          picker="date"
                          format="DD"
                          placeholder="DD"
                          onChange={(e, dateString) => {
                            console.log(dateString);
                            setFormFields((prevFields) => {
                              return {
                                ...prevFields,
                                DOB: {
                                  ...prevFields.DOB,
                                  month: dateString
                                }
                              }
                            })
                          }}
                        />
                        <DatePicker
                          style={{ width: '100px', height: "40px" }}
                          picker="year"
                          format="YYYY"
                          placeholder="YYYY"
                          onChange={(e, dateString) => {
                            console.log(dateString);
                            setFormFields((prevFields) => {
                              return {
                                ...prevFields,
                                DOB: {
                                  ...prevFields.DOB,
                                  year: dateString
                                }
                              }
                            })
                          }}
                        />
                      </Form.Item>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Address 1 (no P.O. Box)</Title>
                      <Title onClick={() => setShowManualEntry(true)} className="choose-manual-link" style={{ fontSize: "16px", margin: 0, color: "#038203", fontWeight: "400" }}>Choose manual entry</Title>
                    </div>
                    <Form.Item
                      required={true}

                      rules={[
                        {
                          required: true,
                          message: 'Please input your Address 1 !',
                        },
                      ]}>
                      <Input value={formFields.address1} onChange={(e) => {
                        setFieldName({ type: "address1", value: e.target.value })
                        setFormFields((prevFields) => {
                          return {
                            ...prevFields,
                            address1: e.target.value
                          }
                        });
                      }} style={{ width: width < 768 ? "100%" : "300px" }}

                        placeholder="Address" />
                    </Form.Item>
                    {showManualEntry && (
                      <>
                        <Form.Item
                          required={true}

                          rules={[
                            {
                              required: true,
                              message: 'Please input your Street Address !',
                            },
                          ]}
                          label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Address 2</Title>}>
                          <Input value={formFields.address2} onChange={(e) => {

                            setFieldName({ type: "address2", value: e.target.value })
                            setFormFields((prevFields) => {
                              return {
                                ...prevFields,
                                address2: e.target.value
                              }
                            });
                          }} style={{ width: width < 768 ? "300px" : "100%" }}
                            placeholder="Street Address" />
                        </Form.Item>
                        <div style={{ display: 'flex', flexDirection: width < 768 ? "column" : "row" }}>
                          <Form.Item
                            style={{ marginRight: 10 }}
                            required={true}

                            rules={[
                              {
                                required: true,
                                message: 'Please input your City !',
                              },
                            ]}
                            label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>City</Title>}>
                            <Input value={formFields.city} onChange={(e) => {
                              setFieldName({ type: "city", value: e.target.value })
                              setFormFields((prevFields) => {
                                return {
                                  ...prevFields,
                                  city: e.target.value
                                }
                              });
                            }} style={{ width: width < 768 ? "300px" : "300px" }}
                              placeholder="City" />
                          </Form.Item>

                          <Form.Item
                            required={true}
                            style={{ marginRight: 10 }}
                            rules={[
                              {
                                required: true,
                                message: 'Please input your Provice !',
                              },
                            ]}
                            label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Province</Title>}>
                            <Select
                              defaultValue="Select Province"
                              style={{ width: width < 768 ? "300px" : "100%" }}
                              options={[
                                { value: 'AB', label: 'Alberta' },
                                { value: 'BC', label: 'British Columbia' },
                                { value: 'MB', label: 'Manitoba' },
                                { value: 'NB', label: 'New Brunswick' },
                                { value: 'NL', label: 'Newfoundland and Labrador' },
                                { value: 'NS', label: 'Nova Scotia' },
                                { value: 'NT', label: 'Northwest Territories' },
                                { value: 'NU', label: 'Nunavut' },
                                { value: 'ON', label: 'Ontario' },
                                { value: 'PE', label: 'Prince Edward Island' },
                                { value: 'QC', label: 'Quebec' },
                                { value: 'SK', label: 'Saskatchewan' },
                                { value: 'YT', label: 'Yukon' },
                              ]}
                              onChange={(e) => {
                                setFieldName({ type: "province", value: e })
                                setFormFields((prevFields) => {
                                  return {
                                    ...prevFields,
                                    province: e,
                                  }
                                })
                              }}
                            />
                          </Form.Item>

                          <Form.Item
                            required={true}
                            rules={[
                              {
                                required: true,
                                message: 'Please input your Postal Code !',
                              },
                            ]}
                            label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Postal Code</Title>}>
                            <Input value={formFields.postalCode} onChange={(e) => {
                              if (e.target.value.length <= 6) {
                                setFieldName({ type: "postalCode", value: e.target.value })
                                setFormFields((prevFields) => {
                                  return {
                                    ...prevFields,
                                    postalCode: e.target.value
                                  }
                                });
                              }
                            }} style={{ width: width < 768 ? "300px" : "100%" }} placeholder="Postal Code" />
                          </Form.Item>
                        </div>

                      </>
                    )}
                    {/* <Form.Item
                        required={true}

                        rules={[
                          {
                            required: true,
                            message: 'Please input your Residential Address !',
                          },
                        ]}
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Residential Address</Title>}>
                        <Input
                          onChange={(e) => {
                            setFieldName({ type: "residentialAddress", value: e.target.value })
                            setFormFields((prevFields) => {
                              return {
                                ...prevFields,
                                residentialAddress: e.target.value
                              }
                            });
                          }}
                          style={{ width: width < 768 ? "300px" : "300px" }}
                          placeholder="Residential Address" value={formFields.residentialAddress} />
                      </Form.Item> */}
                    <Form.Item
                      required={true}

                      rules={[
                        {
                          required: true,
                          message: 'Please select your Residential Status !',
                        },
                      ]}
                      label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Your residential status</Title>}>
                      <Select
                        defaultValue="Select Residential Status"
                        style={{ width: width < 768 ? "100%" : "100%" }}
                        options={[
                          { value: 'ownsHome', label: 'Owns Home' },
                          { value: 'rents', label: 'Rents' },
                          { value: 'livingWithFamily', label: 'Living with Family' },
                          { value: 'studentHousing', label: 'Student Housing' },
                          { value: 'temporaryAccommodation', label: 'Temporary Accommodation' },
                        ]}
                        onChange={(e) => {
                          setFieldName({ type: "residentialStatus", value: e })
                          setFormFields((prevFields) => {
                            return {
                              ...prevFields,
                              residentialStatus: e,
                            }
                          })
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      required={true}

                      rules={[
                        {
                          required: true,
                          message: 'Please input your Job Occupation !',
                        },
                      ]}
                      label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Occupation</Title>}>
                      <Input onChange={(e) => {
                        setFieldName({ type: "jobOccupation", value: e.target.value })
                        setFormFields((prevFields) => {
                          return {
                            ...prevFields,
                            jobOccupation: e.target.value
                          }
                        });
                      }} style={{ width: width < 768 ? "100%" : "100%" }} placeholder="Occupation" />
                    </Form.Item>
                    <div style={{ display: "flex", flexDirection: width < 768 ? "column" : "row" }}>
                      <Form.Item
                        style={{ marginRight: width < 768 ? 0 : 10 }}
                        required={true}

                        rules={[
                          {
                            required: true,
                            message: 'Please input your Gross Annual Income !',
                          },
                        ]}
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Gross annual income</Title>}>
                        <Input onChange={(e) => {
                          setFieldName({ type: "grossAnnualIncome", value: e.target.value })
                          setFormFields((prevFields) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            return {
                              ...prevFields,
                              grossAnnualIncome: value
                            }
                          });
                        }} style={{ width: width < 768 ? "100%" : "320px" }}
                          placeholder="Gross Annual Income" value={formFields.grossAnnualIncome} />
                      </Form.Item>
                      <Form.Item
                        required={true}
                        rules={[
                          {
                            required: true,
                            message: 'Please select your Source Of Income !',
                          },
                        ]}
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Source of income</Title>}>
                        <Select
                          defaultValue="Select Source Of Income"
                          style={{ width: width < 768 ? "100%" : "320px" }}

                          options={[
                            { value: 'employment', label: 'Employment' },
                            { value: 'selfEmployment', label: 'Self-Employment' },
                            { value: 'freelance', label: 'Freelance' },
                            { value: 'businessOwner', label: 'Business Owner' },
                            { value: 'investment', label: 'Investment' },
                            { value: 'retirement', label: 'Retirement' },
                            { value: 'rentalIncome', label: 'Rental Income' },
                            { value: 'governmentAssistance', label: 'Government Assistance' },
                            { value: 'other', label: 'Other' },
                          ]}
                          onChange={(e) => {
                            setFieldName({ type: "sourceOfIncome", value: e })
                            setFormFields((prevFields) => {
                              return {
                                ...prevFields,
                                sourceOfIncome: e,
                              }
                            })
                          }}
                        />
                      </Form.Item>
                    </div>
                    <Form.Item
                      required={true}

                      rules={[
                        {
                          required: true,
                          message: 'Please select your Employment Status !',
                        },
                      ]}
                      label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Employment Status</Title>}>
                      <Select
                        defaultValue="Select Employment Status"
                        style={{ width: width < 768 ? "100%" : "100%" }}
                        options={[
                          { value: 'fullTime', label: 'Full-Time' },
                          { value: 'partTime', label: 'Part-Time' },
                          { value: 'contract', label: 'Contract' },
                          { value: 'temporary', label: 'Temporary' },
                          { value: 'intern', label: 'Intern' },
                          { value: 'freelancer', label: 'Freelancer' },
                          { value: "selfEmployed", label: "Self-Employed" },
                          { value: "unEmployed", label: "Un-Employed" },
                        ]}
                        onChange={(e) => {
                          setFieldName({ type: "employmentStatus", value: e })
                          setFormFields((prevFields) => {
                            return {
                              ...prevFields,
                              employmentStatus: e,
                            }
                          })
                        }}
                      />
                    </Form.Item>
                    <div style={{ textAlign: width < 768 ? "center" : "left" }}>
                      <div style={{ width: width < 768 ? "100%" : "600px", marginBottom: 20 }}>
                        <Title style={{ fontSize: "16px", margin: "0 0 8px 0", color: "#4E4E4E" }}>ID</Title>
                        <Upload showUploadList={false} name="file" onChange={(e) => handleUpload(e.file.originFileObj)}>
                          <Button loading={uploading} icon={<UploadOutlined />}>Upload NIC</Button>
                        </Upload>
                      </div>
                      {formFields?.nic ? <img style={{ width: "100% !important", margin: "20px 0 0 0", borderRadius: "5px" }} src={formFields?.nic} /> : ""}
                      <div style={{ width: width < 768 ? "100%" : "600px" }}>
                        <Title level={2} style={{ color: "green", fontWeight: "600", margin: "30px 0" }}>
                          Appointment Details
                        </Title>
                        <Title style={{ fontSize: "16px", margin: "0 0 8px 0", color: "#4E4E4E" }}>Availability: Mon to Fri - 9am to 5am</Title>
                        <DatePicker
                          showTime={{
                            format: 'h A',
                            minuteStep: 60,
                          }}
                          format="YYYY-MM-DD h A"
                          style={{ width: width < 768 ? "300px" : '100%' }}
                          onChange={(e) => {
                            setFieldName({ type: "appointment", value: e });
                            setFormFields((prevFields) => {
                              return {
                                ...prevFields,
                                appointment: {
                                  date: e
                                }
                              }
                            });
                          }}
                          inputReadOnly={true}
                          disabledDate={(current) => {
                            // Disable Sundays (0) and Saturdays (6)
                            const dayOfWeek = current.day();
                            if (dayOfWeek === 0 || dayOfWeek === 6) {
                              return true;
                            }

                            // Disable previous year dates
                            const currentYear = moment().year();
                            const currentMonth = moment().month();
                            const currentDay = moment().date();

                            const isPreviousYear = current.year() < currentYear;
                            const isCurrentYear = current.year() === currentYear;
                            const isPastDateInCurrentYear = isCurrentYear && (
                              (current.month() < currentMonth) ||
                              (current.month() === currentMonth && current.date() < currentDay)
                            );

                            return isPreviousYear || isPastDateInCurrentYear;
                          }}
                          renderExtraFooter={() => (
                            <div>
                              <span>Selected Date: {formFields.appointment.date ? formFields.appointment.date.format('YYYY-MM-DD HH') : 'None'}</span>
                            </div>
                          )}
                        />
                      </div>
                      <div style={{ width: width < 768 ? "300px" : "600px", margin: "25px 0" }}>
                        <Title style={{ fontSize: "16px" }}>Terms & conditions.</Title>
                        <Checkbox style={{ margin: 0 }} onChange={(e) => setTermsCondition((prevCondition) => {
                          return {
                            ...prevCondition,
                            first: e.target.checked
                          }
                        })} checked={termsCondition.first}>
                          <Title style={{ fontSize: "13px" }}>
                            Enrollment confirms your eligibility and agreement to all CAIIF terms and conditions.
                          </Title>
                        </Checkbox>
                        <Checkbox style={{ margin: 0 }} onChange={(e) => setTermsCondition((prevCondition) => {
                          return {
                            ...prevCondition,
                            second: e.target.checked
                          }
                        })} checked={termsCondition.second}>
                          <Title style={{ fontSize: "13px" }}>
                            You agree to the 8-month commitment and fee structure based on committee membership.
                          </Title>
                        </Checkbox>
                      </div>
                      <div style={{ width: width < 768 ? "100%" : "600px" }}>
                      </div>
                      <div style={{ width: width < 768 ? "100%" : "600px" }}>
                        <Button
                          onClick={handleSignup}
                          disabled={termsCondition.first && termsCondition.second ? false : true}
                          loading={loading}
                          style={{ width: "100%", backgroundColor: termsCondition.first && termsCondition.second ? "#166805" : !termsCondition.first || !termsCondition.second ? "grey" : "", color: 'white' }}
                          type="primary"
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    {success !== "" && <Title style={{ fontSize: "16px", margin: "0 0 20px 0", color: status === true ? "green" : "red" }}>{success}</Title>}
                  </Col> */}

                  {/* </Col> */}
                  {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}> */}
                  {/* </Col> */}
                  {/* <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                      <Form.Item name="interestedDate"
                        rules={[
                          {
                            required: false,
                            message: 'Please input your Interested Date !',
                          },
                        ]}
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Interested Date</Title>}>
                        <DatePicker
                          picker="month"
                          style={{ width: "100%" }}
                          onChange={(date, dateString) => {
                            const month = moment(dateString).month() + 1;
                            const year = moment(dateString).year();
                            setFormFields((prevFields) => {
                              return {
                                ...prevFields,
                                interestedDate: Number(month) + "/" + Number(year)
                              }
                            })
                          }}
                        />
                      </Form.Item>
                    </Col> */}
                  {/* <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: 'Please select your Committee !',
                          },
                        ]}
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Select Committee</Title>}>
                        <Select
                          defaultValue="Select"
                          style={{ width: "100%" }}
                          options={state?.map(f => {
                            return { value: f?.committee._id, label: f?.committee.name }
                          })}
                          onChange={(e) => {
                            setFormFields((prevFields) => {
                              return {
                                ...prevFields,
                                cId: e,
                                committee: e,
                              }
                            })
                            const findCom = state?.find((f) => f?.committee._id === e)
                            console.log(findCom?.committee);
                            setCommittee(findCom?.committee)
                            const startDateObj = new Date(findCom?.committee?.startDate);
                            const endDateObj = new Date(findCom?.committee?.endDate);
                            const yearsDiff = endDateObj.getUTCFullYear() - startDateObj.getUTCFullYear();
                            const monthsDiff = endDateObj.getUTCMonth() - startDateObj.getUTCMonth();
                            const totalMonths = yearsDiff * 12 + monthsDiff;
                            setMonthDuration(totalMonths + 1)
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                      <Form.Item
                        rules={[
                          {
                            required: true,
                            message: 'Please select your Committee !',
                          },
                        ]}
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Committee</Title>}>
                        <Input disabled={true} value={commitee?.name} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                      <Form.Item
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Duration</Title>}>
                        <Input disabled={true} value={`${monthDuration} months`} />
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
                    </Col> */}
                  {/* <Col xs={24} sm={24} md={6} lg={4} xl={4}>
                      <Form.Item
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Start Date</Title>}>
                        <Input disabled={true} value={new Date(commitee?.startDate).toLocaleDateString()} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={6} lg={4} xl={4}>
                      <Form.Item
                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Start Date</Title>}>
                        <Input disabled={true} value={new Date(commitee?.endDate).toLocaleDateString()} />
                      </Form.Item>
                    </Col> */}
                  {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item name="committeeNote"
                      label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Note</Title>}>
                      <Input.TextArea placeholder="Note" style={{ height: "100px" }} />
                    </Form.Item>
                  </Col> */}

                  {/* </Row> */}
                </>
              )}
              {/* <Col span={8}>
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
              {/* <Col span={8}>
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
              {/* <Col span={8}>
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
              {/* <Col span={8}>
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
              {/* <Col span={8}>
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
              {/* <Col span={8}>
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
              {/* <Col span={8}>
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
              {/* <Col span={8}>
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
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}