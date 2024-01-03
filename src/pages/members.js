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
import { Loader } from "react-overlay-loader";
import memberIcon from '../assets/images/member2.svg'
import deleteIcon from '../assets/images/del-icon.svg'
import StatisticsHeader from "../components/statistics/statisticsHeader";

function Members() {

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
        { username: "Hassan Soomro", email: "hassansoomro@i8is.com", amount: 4230142301423, phonenumber: "+92300000333", CNIC: 4230142301423, enroll: 3, },
        { username: "Nisa Hoorain", email: "nisahoorain@i8is.com", amount: 4230142301423, phonenumber: "+92300000333", CNIC: 4230142301423, enroll: 4, },
        { username: "Bilawal Soomro", email: "bilawalsoomro@i8is.com", amount: 4230142301423, phonenumber: "+92300000333", CNIC: 4230142301423, enroll: 1, },
        { username: "Hayat Ahmed", email: "hayatahmed@i8is.com", amount: 4230142301423, phonenumber: "+92300000333", CNIC: 4230142301423, enroll: 2, },
    ]
    const data2 = [
        { username: "Hassan Soomro", email: "hassansoomro@i8is.com", phonenumber: "+92300000333", CNIC: 4230142301423, tier: 1 },
        { username: "Nisa Hoorain", email: "nisahoorain@i8is.com", phonenumber: "+92300000333", CNIC: 4230142301423, tier: 2 },
        { username: "Bilawal Soomro", email: "bilawalsoomro@i8is.com", phonenumber: "+92300000333", CNIC: 4230142301423, tier: 1 },
        { username: "Hayat Ahmed", email: "hayatahmed@i8is.com", phonenumber: "+92300000333", CNIC: 4230142301423, tier: 3 },
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
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Amount</Title>,
            dataIndex: 'CNIC',
            key: 'CNIC',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.amount}</Title>
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
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Email</Title>,
            dataIndex: 'CNIC',
            key: 'CNIC',
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
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}></Title>,
            render: (text, record) => {
                return (
                    <Button style={{ margin: "0 0 0 20px" }} onClick={() => navigate("/verification-details")} className="add-cycle-btn">View</Button>
                )
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
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Tier</Title>,
            dataIndex: 'tier',
            key: 'tier',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.tier}</Title>
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
            <Loader loading={loading} />
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
            <div style={{ marginBottom: "20px" }}>
                <Title style={{ color: "#166805", margin: 0 }} level={3}>Approval members Request</Title>
            </div>
            <Card className="my-card" style={{ marginBottom: "20px" }}>
                <Table dataSource={data} columns={column} />
            </Card>
            <div style={{ marginBottom: "20px", marginTop: "40px" }}>
                <Title style={{ color: "#166805", margin: 0 }} level={3}>Approved members</Title>
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

export default Members;