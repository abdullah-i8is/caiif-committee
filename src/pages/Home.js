import { useEffect, useLayoutEffect, useState } from "react";

import {
  Card,
  Col,
  Row,
  Typography,
  Tooltip,
  Progress,
  Upload,
  message,
  Button,
  Timeline,
  Radio,
  notification,
  Badge,
  Table,
  Tag,
  Modal,
  FloatButton,
} from "antd";
import {
  CarOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import memberIcon from '../assets/images/member2.svg'
import StatisticsHeader from "../components/statistics/statisticsHeader";

function Home() {

  const { Title, Text } = Typography;
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [approveTrips, setApproveTrips] = useState()
  const [flightBudget, setFlightBudget] = useState(0)
  const [hotelBudget, setHotelBudget] = useState(0)
  const [data, setData] = useState([
    { property: "Premium Pro Ultra Max", amount: "250", members: "60", startDate: "1st January 2023", endDate: "31 December 2027", cycle: "1 Month", available: "60", payment: "15,000" },
    { property: "Premium Pro Ultra Max", amount: "250", members: "60", startDate: "1st January 2023", endDate: "31 December 2027", cycle: "1 Month", available: "60", payment: "15,000" },
    { property: "Premium Pro Ultra Max", amount: "250", members: "60", startDate: "1st January 2023", endDate: "31 December 2027", cycle: "1 Month", available: "60", payment: "15,000" },
    { property: "Premium Pro Ultra Max", amount: "250", members: "60", startDate: "1st January 2023", endDate: "31 December 2027", cycle: "1 Month", available: "60", payment: "15,000" },
    { property: "Premium Pro Ultra Max", amount: "250", members: "60", startDate: "1st January 2023", endDate: "31 December 2027", cycle: "1 Month", available: "60", payment: "15,000" },
  ])

  const column = [
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Property</Title>,
      dataIndex: 'property',
      key: 'property',
      render: (text, record, index) => {
        return <Title style={{ fontSize: "18px", margin: 0 }}>Premium Pro Ultra Max</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Amount</Title>,
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>$ {record?.amount}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Members</Title>,
      dataIndex: 'members',
      key: 'members',
      render: (text, record) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img width={30} src={memberIcon} />
            <Title style={{ fontSize: "16px", margin: "0 0 0 10px", color: "#818181" }}>{record?.members}</Title>
          </div>
        )
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Start Date</Title>,
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.startDate}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>End Date</Title>,
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.endDate}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Cycle</Title>,
      dataIndex: 'cycle',
      key: 'cycle',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.cycle}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Available</Title>,
      dataIndex: 'available',
      key: 'available',
      render: (text, record) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img width={30} src={memberIcon} />
            <Title style={{ fontSize: "16px", margin: "0 0 0 10px", color: "#818181" }}>{record?.available}</Title>
          </div>
        )
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Payment</Title>,
      dataIndex: 'payment',
      key: 'payment',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.payment}</Title>
      }
    },
  ];

  const user = useSelector((state) => state.auth.user)

  return (
    <>
      <Modal
        style={{ minWidth: 400, maxWidth: "100%" }}
        footer={[
          <>
            <Button type="default">Reject</Button>
            <Button type="primary">Approve</Button>
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
      <StatisticsHeader user={user} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <Title style={{ color: "#166805", margin: 0 }} level={3}>Committee</Title>
        </div>
        <div>
          {user.userType === "admin" && <Button onClick={() => navigate("/committee-details")} className="view-all-btn">Create Committee</Button>}
          <Button style={{ margin: "0 0 0 20px" }} onClick={() => navigate("/view-all-committee")} className="view-all-btn">View All</Button>
        </div>
      </div>
      <Card className="my-card">
        <Table dataSource={data} columns={column} />
      </Card>
      {/* {Number(loginUser.role) === 3 ? (
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
      ) : ""} */}
    </>
  );
}

export default Home;