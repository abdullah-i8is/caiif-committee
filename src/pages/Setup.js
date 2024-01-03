import { useEffect, useLayoutEffect, useState } from "react";

import {
  Card,
  Col,
  Row,
  Typography,
  Tooltip,
  Button,
  notification,
  Table,
  Tag,
  Modal,
  FloatButton,
  Form,
  Input,
} from "antd";
import {
  CarOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../config/firebase";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import memberIcon from '../assets/images/member2.svg'
import deleteIcon from '../assets/images/del-icon.svg'
import StatisticsHeader from "../components/statistics/statisticsHeader";

function Setup() {

  const { Title, Text } = Typography;
  const [api, contextHolder] = notification.useNotification();
  const loginUser = useSelector((state) => state.auth.user)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [approveTrips, setApproveTrips] = useState()
  const [flightBudget, setFlightBudget] = useState(0)
  const [hotelBudget, setHotelBudget] = useState(0)
  const data = [
    { username: "Hassan Soomro", email: "hassansoomro@i8is.com", phonenumber: "+92300000333", CNIC: "4230142301423", enroll: 3, },
    { username: "Nisa Hoorain", email: "nisahoorain@i8is.com", phonenumber: "+92300000333", CNIC: "4230142301423", enroll: 4, },
    { username: "Bilawal Soomro", email: "bilawalsoomro@i8is.com", phonenumber: "+92300000333", CNIC: "4230142301423", enroll: 1, },
    { username: "Hayat Ahmed", email: "hayatahmed@i8is.com", phonenumber: "+92300000333", CNIC: "4230142301423", enroll: 2, },
  ]
  const data2 = [
    { username: "Hassan Soomro", accountnumber: "4003830171874018", email: "hassansoomro@i8is.com", phonenumber: "+92300000333", CNIC: "4230142301423", pdf: "Upload Pdf" },
    { username: "Nisa Hoorain", accountnumber: "4003830171874018", email: "nisahoorain@i8is.com", phonenumber: "+92300000333", CNIC: "4230142301423", pdf: "Upload Pdf" },
    { username: "Bilawal Soomro", accountnumber: "4003830171874018", email: "bilawalsoomro@i8is.com", phonenumber: "+92300000333", CNIC: "4230142301423", pdf: "Upload Pdf" },
    { username: "Hayat Ahmed", accountnumber: "4003830171874018", email: "hayatahmed@i8is.com", phonenumber: "+92300000333", CNIC: "4230142301423", pdf: "Upload Pdf" },
  ]
  const [form] = Form.useForm();

  const column = [
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Name</Title>,
      dataIndex: 'username',
      key: 'username',
      render: (text, record, index) => {
        return <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>{record?.username}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Email</Title>,
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.email}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Phone Number</Title>,
      dataIndex: 'phonenumber',
      key: 'phonenumber',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.phonenumber}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>CNIC</Title>,
      dataIndex: 'CNIC',
      key: 'CNIC',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.CNIC}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Enroll</Title>,
      dataIndex: 'enroll',
      key: 'enroll',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.enroll}</Title>
      }
    },
  ];

  const column2 = [
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Name</Title>,
      dataIndex: 'username',
      key: 'username',
      render: (text, record, index) => {
        return <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>{record?.username}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Account</Title>,
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.accountnumber}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Phone Number</Title>,
      dataIndex: 'phonenumber',
      key: 'phonenumber',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.phonenumber}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>CNIC</Title>,
      dataIndex: 'CNIC',
      key: 'CNIC',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.CNIC}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>PDF’S</Title>,
      dataIndex: 'enroll',
      key: 'enroll',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.pdf}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}></Title>,
      render: (text, record) => {
        return (
          <div>
            <img src={deleteIcon} />
            <Button style={{ margin: "0 0 0 20px" }} onClick={() => navigate("/view-all-committee")} className="add-cycle-btn">Add cycle</Button>
          </div>
        )
      }
    },
  ];

  const handleApproveTrip = (name) => {
    console.log(name);
    setLoading(true)
    const docRef = doc(firestore, "trips", approveTrips.id)
    setModalOpen(false)
    updateDoc(docRef, {
      ...approveTrips,
      tripStatus: name === "approve" ? 3 : name === "reject" ? 4 : ""
    }).then(() => {
      setLoading(false)
    })
  }

  return (
    <>
      {contextHolder}
      <Modal
        style={{ minWidth: 400, maxWidth: "100%" }}
        footer={[
          <>
            <Button onClick={() => handleApproveTrip("reject")} type="default">Reject</Button>
            <Button onClick={() => handleApproveTrip("approve")} type="primary">Approve</Button>
          </>
        ]}
        centered
        title="Trips"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Text style={{ fontSize: 20 }}>Trip No</Text>: <Text style={{ fontSize: 20 }}>{approveTrips ? approveTrips.tripNo : ""}</Text>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Text style={{ fontSize: 20 }}>Trip Status</Text>: <Tag color={"warning"}>{approveTrips ? approveTrips.tripStatus === 2 ? "PENDING" : "" : ""}</Tag>
          </Col>
          <Card style={{ width: "100%", margin: "10px 0" }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Row gutter={[24, 0]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Title level={5}>Total Flight Budget</Title> {flightBudget}
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <Title level={5}>Total Hotel Budget</Title> {hotelBudget}
                </Col>
              </Row>
            </Col>
          </Card>
        </Row>
      </Modal>
      <StatisticsHeader />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <Title style={{ color: "#166805", margin: 0 }} level={3}>Committee members list’s</Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Title style={{ color: "#166805", margin: "0 15px 0 0" }} level={3}>Available Members: 3/12</Title>
          <img width={40} src={memberIcon} />
        </div>
      </div>
      <Card className="my-card" style={{ marginBottom: "20px" }}>
        <Table dataSource={data} columns={column} />
      </Card>
      <Form
        form={form}
        layout="vertical"
      >
        <Card>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Name</Title>}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Cycle</Title>}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Amount</Title>}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Total Amount</Title>}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Start Date</Title>}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>End Date</Title>}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", marginTop: "40px" }}>
        <Title style={{ color: "#166805", margin: 0 }} level={3}>Committee Received</Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Title style={{ color: "#166805", margin: "0 15px 0 0" }} level={3}>Committee Remaining: 10/12</Title>
          <img width={40} src={memberIcon} />
        </div>
      </div>
      <Card className="my-card" style={{ marginBottom: "20px" }}>
        <Table dataSource={data2} columns={column2} />
      </Card>
      {Number(loginUser.role) === 3 ? (
        <Tooltip title="Add Trip">
          <FloatButton
            onClick={() => {
              navigate({ pathname: `/add-trip-detail` }, { state: { loginUser: loginUser } })
            }}
            shape="circle"
            trigger="hover"
            type="primary"
            icon={<CarOutlined />}
          >
          </FloatButton>
        </Tooltip>
      ) : ""}
    </>
  );
}

export default Setup;