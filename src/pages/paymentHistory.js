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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import memberIcon from '../assets/images/member2.svg'
import StatisticsHeader from "../components/statistics/statisticsHeader";
import axios from "axios";
import { API_URL } from "../config/api";
import { SpinnerCircular } from "spinners-react";
import { setCommittees } from "../store/committeeSlice/committeeSlice";
import { GetAdminCommittees, GetUserCommittees } from "../middlewares/commitee";


function PaymentHistory() {

    const { Title, Text } = Typography;
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const column = [
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Date</Title>,
            dataIndex: 'date',
            key: 'date',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{new Date(record?.date).toLocaleDateString()}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Committee</Title>,
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return <Title style={{ fontSize: "18px", margin: 0 }}>{record?.cid?.name}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Name</Title>,
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return <Title style={{ fontSize: "18px", margin: 0 }}>{record?.userId?.name}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Email</Title>,
            dataIndex: 'email',
            key: 'email',
            render: (text, record, index) => {
                return <Title style={{ fontSize: "18px", margin: 0 }}>{record?.userId?.email}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Payment Status</Title>,
            dataIndex: 'amount',
            key: 'amount',
            render: (text, record) => {
                console.log(record);
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.isPaid}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Payment Amount</Title>,
            dataIndex: 'members',
            key: 'members',
            render: (text, record) => {
                return (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>$ {record?.paymentAmount}</Title>
                    </div>
                )
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Note</Title>,
            dataIndex: 'date',
            key: 'date',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.note}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}></Title>,
            render: (text, record) => {
                return (
                    <Button style={{ margin: "0 0 0 20px" }} onClick={() => navigate(`/verification-details/${record?.userId?._id}`)} className="add-cycle-btn">View</Button>
                )
            }
        },
        // {
        //   title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Available</Title>,
        //   dataIndex: 'available',
        //   key: 'available',
        //   render: (text, record) => {
        //     return (
        //       <div style={{ display: "flex", alignItems: "center" }}>
        //         <img width={30} src={memberIcon} />
        //         <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.committeeDetails?.committee?.available}</Title>
        //       </div>
        //     )
        //   }
        // },
        // {
        //   title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Payment</Title>,
        //   dataIndex: 'payment',
        //   key: 'payment',
        //   render: (text, record) => {
        //     return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.committeeDetails?.committee?.payment}</Title>
        //   }
        // },
    ];

    const token = useSelector((state) => state.common.token)

    async function getPaymentHistory() {
        setLoading(true)
        try {
            const response = await axios.get(`${API_URL}/admin/PaymentHistory`, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            setLoading(false)
            setData(response.data.payments)
            console.log(response);
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    useEffect(() => {
        getPaymentHistory()
    }, [])

    return (
        <>
            {/* <StatisticsHeader approveMembers={approveMembers} user={user} committees={committees} enrolledCommittess={committees?.filter((com) => com?.committee?.userIds?.some((id) => id === user?._id))} /> */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                    <Title style={{ color: "#166805", margin: 0 }} level={3}>Payment History</Title>
                </div>
            </div>
            <Card className="my-card" style={{ marginTop: 40 }}>
                <Table
                    dataSource={data}
                    columns={column}
                    loading={loading}
                />
            </Card>
        </>
    );
}

export default PaymentHistory;