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
import { GetAllMembers } from "../middlewares/members";
import { setApproveMembers } from "../store/membersSlice/membersSlice";


function PayoutHistory() {

    const { Title, Text } = Typography;
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const approveMembers = useSelector((state) => state.members.approveMembers)
    const committees = useSelector((state) => state.committees.committees)
    const token = useSelector((state) => state.common.token)
    const user = useSelector((state) => state.auth.user)

    const column = [
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Date</Title>,
            dataIndex: 'date',
            key: 'date',
            render: (text, record) => {
                return <Title onClick={() => navigate(`/members/verification-details/${record?.userId?._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181", cursor:"pointer" }}>{new Date(record?.date).toLocaleDateString()}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Committee ID</Title>,
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return <Title onClick={() => navigate(`/members/verification-details/${record?.userId?._id}`)} style={{ fontSize: "18px", margin: 0, cursor:"pointer" }}>{record?.cid?.name}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Name</Title>,
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return <Title onClick={() => navigate(`/members/verification-details/${record?.user?.name}`)} style={{ fontSize: "18px", margin: 0, cursor:"pointer" }}>{record?.userId?.firstName + " " + record?.userId?.lastName}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Email</Title>,
            dataIndex: 'email',
            key: 'email',
            render: (text, record, index) => {
                return <Title onClick={() => navigate(`/members/verification-details/${record?.userId?._id}`)} style={{ fontSize: "18px", margin: 0, cursor:"pointer" }}>{record?.userId?.email}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Status</Title>,
            dataIndex: 'amount',
            key: 'amount',
            render: (text, record) => {
                console.log(record);
                return <Title onClick={() => navigate(`/members/verification-details/${record?.userId?._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181", cursor:"pointer" }}>{record?.isPaid}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Payout Amount</Title>,
            dataIndex: 'members',
            key: 'members',
            render: (text, record) => {
                return (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Title onClick={() => navigate(`/members/verification-details/${record?.userId?._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181", cursor:"pointer" }}>$ {record?.paymentAmount}</Title>
                    </div>
                )
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Note</Title>,
            dataIndex: 'date',
            key: 'date',
            render: (text, record) => {
                return <Title onClick={() => navigate(`/members/verification-details/${record?.userId?._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181", cursor:"pointer" }}>{record?.note}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}></Title>,
            render: (text, record) => {
                return (
                    <Button onClick={() => navigate(`/members/verification-details/${record?.userId?._id}`)} className="add-cycle-btn">View</Button>
                )
            }
        },
    ];

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

        GetAllMembers(token)
            .then((res) => {
                console.log(res?.data);
                dispatch(setApproveMembers(res?.data?.users))
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                    <Title style={{ color: "#166805", margin: 0 }} level={3}>Payout History</Title>
                </div>
            </div>
            <Card className="my-card" style={{ marginTop: 20 }}>
                <Table
                    dataSource={data?.filter((f) => f.isPaid === "PAYOUT")?.sort((a, b) => b?.createdAt - a?.createdAt)}
                    columns={column}
                    loading={loading}
                    pagination={false}
                />
            </Card>
        </>
    );
}

export default PayoutHistory;