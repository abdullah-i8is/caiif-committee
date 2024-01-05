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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import memberIcon from '../assets/images/member2.svg'
import deleteIcon from '../assets/images/del-icon.svg'
import StatisticsHeader from "../components/statistics/statisticsHeader";
import axios from "axios";
import { API_URL } from "../config/api";
import { setApproveMembers } from "../store/membersSlice/membersSlice";

function Members() {

    const { Title, Text } = Typography;
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
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>{record?.name}</Title>
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
            dataIndex: 'contactNumber',
            key: 'contactNumber',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.contactNumber}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Tier</Title>,
            dataIndex: 'level',
            key: 'level',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.level}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}></Title>,
            render: (text, record) => {
                return (
                    <Button style={{ margin: "0 0 0 20px" }} onClick={() => navigate(`/verification-details/${record._id}`)} className="add-cycle-btn">View</Button>
                )
            }
        },
    ];

    const column2 = [
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Name</Title>,
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>{record?.name}</Title>
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
            dataIndex: 'contactNumber',
            key: 'contactNumber',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.contactNumber}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Tier</Title>,
            dataIndex: 'level',
            key: 'level',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.level}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}></Title>,
            render: (text, record) => {
                return (
                    <Button style={{ margin: "0 0 0 20px" }} onClick={() => navigate(`/verification-details/${record._id}`)} className="add-cycle-btn">View</Button>
                )
            }
        },
    ];

    const approveMembers = useSelector((state) => state.members.approveMembers)
    const committees = useSelector((state) => state.committees.committees)

    return (
        <>
            <StatisticsHeader approveMembers={approveMembers} committees={committees} user={loginUser} />
            <div style={{ marginBottom: "20px" }}>
                <Title style={{ color: "#166805", margin: 0 }} level={3}>Approval members Request</Title>
            </div>
            <Card className="my-card" style={{ marginBottom: "20px" }}>
                <Table dataSource={approveMembers?.filter((user) => user.approve === false)} columns={column} />
            </Card>
            <div style={{ marginBottom: "20px", marginTop: "40px" }}>
                <Title style={{ color: "#166805", margin: 0 }} level={3}>Approved members</Title>
            </div>
            <Card className="my-card" style={{ marginBottom: "20px" }}>
                <Table dataSource={approveMembers?.filter((user) => user.approve === true)} columns={column2} />
            </Card>
        </>
    );
}

export default Members;