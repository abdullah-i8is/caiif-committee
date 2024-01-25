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
    Upload,
    Select,
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
import { GetAllMembers } from "../middlewares/members";
import denyIcon from '../assets/images/deny.svg'
import { GetAdminCommittees, GetUserCommittees } from "../middlewares/commitee";
import { setCommittees } from "../store/committeeSlice/committeeSlice";

function Members() {

    const { Title, Text } = Typography;
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [loading3, setLoading3] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [committeeId, setCommitteeId] = useState("")
    const [userId, setUserId] = useState("")
    const [CID, setCID] = useState("")
    const [CID2, setCID2] = useState("")
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const [api, contextHolder] = notification.useNotification();
    const [committeeDetail, setCommitteeDetail] = useState(null)

    const column = [
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Committee</Title>,
            dataIndex: 'name',
            key: 'name',
            // render: (text, record, index) => {
            //     return <Title className="committee-id" onClick={() => {
            //         setShowModal(true)
            //         setCommitteeId(record?.committeeList[0]?.cid?.uniqueId)
            //     }}
            //         style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>
            //         {record?.committeeList[0]?.cid?.uniqueId}
            //     </Title>
            // }
            render: (text, record, index) => {
                return <Title
                    style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>
                    {record?.committeeList[0]?.cid?.uniqueId}
                </Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Person Info</Title>,
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return (
                    <>
                        <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>{record?.firstName + " " + record?.lastName}</Title>
                        <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.email}</Title>
                        <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.contactNumber}</Title>
                    </>
                )
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Sin</Title>,
            dataIndex: 'sin',
            key: 'sin',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.sin}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Job Occupation</Title>,
            dataIndex: 'jobOccupation',
            key: 'jobOccupation',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.jobOccupation}</Title>
            }
        },
        // {
        //     title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>ID</Title>,
        //     dataIndex: 'note',
        //     key: 'note',
        //     render: (text, record) => {
        //         return (
        //             <img src={record?.nic} alt="avatar" style={{ width: '100px' }} />
        //         )
        //     }
        // },
        {
            width: "200px",
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Action</Title>,
            render: (text, record) => {
                return (
                    <>
                        <Button
                            loading={userId === record._id ? loading2 : false}
                            onClick={() => {
                                handleApprove(record._id, record?.committeeList?.length > 0 && record?.committeeList[0]?.cid, "DECLINE")
                                setUserId(record._id)
                            }}
                            style={{ margin: "0", width: "100px" }}
                            className="deny-btn">
                            <img width={15} src={denyIcon} style={{ margin: "0 5px 0 0" }} />
                            Delete
                        </Button>
                        <Button
                            loading={userId === record._id ? loading : false}
                            style={{ margin: "0 0 0 10px", width: "100px" }}
                            onClick={() => {
                                handleApprove(record._id, record?.committeeList?.length > 0 && record?.committeeList[0]?.cid, "APPROVE")
                                setUserId(record._id)
                            }}
                            className="add-cycle-btn">
                            Approve
                        </Button>
                    </>
                )
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}></Title>,
            width: "100px",
            render: (text, record) => {
                return (
                    <>
                        <Button style={{ margin: "0" }} onClick={() => navigate(`/members/verification-details/${record._id}`)} className="add-cycle-btn">View Detail</Button>
                    </>
                )
            }
        },
    ];

    async function handleApprove(id, cid, type) {
        setLoading(type === "APPROVE" ? true : false)
        setLoading2(type === "DECLINE" ? true : false)
        try {
            const response = await axios.post(`${API_URL}/admin/approveAccount/${id}`, {
                approve: type === "APPROVE" ? true : false,
                cId: cid
            }, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            if (response.status === 200) {
                console.log(response);
                setLoading(false)
                setLoading2(false)
                // openNotification("topRight", type === "APPROVE" ? "Account Approved Successfully" : "Account Deleted Successfully")
                api.success({
                    message: `Notification`,
                    description: response?.data?.message,
                    placement: "bottomRight",
                });
                GetAllMembers(token)
                    .then((res) => {
                        console.log(res?.data);
                        dispatch(setApproveMembers(res?.data?.users))
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            }
        } catch (error) {
            setLoading(false)
            setLoading2(false)
            console.log(error);
            api.error({
                message: `Notification`,
                description: error?.response?.data?.message ? error?.response?.data?.message : "network error",
                placement: "bottomRight",
            });
        }
    }

    const approveMembers = useSelector((state) => state.members.approveMembers)
    const committees = useSelector((state) => state.committees.committees)
    const state = useSelector((state) => state)
    const token = useSelector((state) => state.common.token)

    useEffect(() => {
        setLoading3(true)
        GetAllMembers(token)
            .then((res) => {
                console.log(res?.data);
                setLoading3(false)
                dispatch(setApproveMembers(res?.data?.users))
            })
            .catch((error) => {
                setLoading3(false)
                console.log(error);
            })
        if (user?.userType === "admin") {
            GetAdminCommittees(token)
                .then((res) => {
                    console.log("res", res);
                    dispatch(setCommittees(res.data.allCommittees))
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        if (user?.userType === "user") {
            GetUserCommittees()
                .then((res) => {
                    dispatch(setCommittees(res.data.allCommittees))
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [])

    console.log(approveMembers);
    console.log(committees);
    console.log(state);

    useEffect(() => {
        const find = committees?.find((f) => f?.committeeDetails?.committee?.uniqueId === committeeId)
        setCommitteeDetail(find)
    }, [committeeId])

    return (
        <>
            {contextHolder}
            <Modal
                okButtonProps={{ style: { backgroundColor: "#166805" } }}
                centered
                open={showModal}
                onOk={() => setShowModal(false)}
                onCancel={() => setShowModal(false)}
            >
                <Title style={{ color: "#166805", margin: "0 0 20px 0" }} level={3}>Committee Detail</Title>
                <Card style={{ marginBottom: "20px" }}>
                    <Row gutter={[24, 0]}>
                        <Col xs={24} sm={24} md={4} lg={6} xl={6}>
                            <Title style={{ margin: 0 }} level={5}>Name</Title>
                            <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{committeeDetail?.committeeDetails?.committee?.name}</Title>
                        </Col>
                        <Col xs={24} sm={24} md={4} lg={6} xl={6}>
                            <Title style={{ margin: 0 }} level={5}>Cycle</Title>
                            <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{committeeDetail?.committeeDetails?.committee?.cycle?.type}</Title>
                        </Col>
                        <Col xs={24} sm={24} md={4} lg={6} xl={6}>
                            <Title style={{ margin: 0 }} level={5}>Cycle Duration</Title>
                            <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>8 months</Title>
                        </Col>
                        <Col xs={24} sm={24} md={4} lg={6} xl={6}>
                            <Title style={{ margin: 0 }} level={5}>Total Amount</Title>
                            <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{committeeDetail?.committeeDetails?.committee?.payment}</Title>
                        </Col>
                        <Col xs={24} sm={24} md={4} lg={6} xl={6}>
                            <Title style={{ margin: 0 }} level={5}>Monthly Payment</Title>
                            <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{committeeDetail?.committeeDetails?.committee?.amount}</Title>
                        </Col>
                        <Col xs={24} sm={24} md={4} lg={6} xl={6}>
                            <Title style={{ margin: 0 }} level={5}>Members</Title>
                            <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{committeeDetail?.committeeDetails?.committee?.members}</Title>
                        </Col>
                        <Col xs={24} sm={24} md={4} lg={6} xl={6}>
                            <Title style={{ margin: 0 }} level={5}>Start Date</Title>
                            <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{new Date(committeeDetail?.committeeDetails?.committee?.startDate).toLocaleDateString()}</Title>
                        </Col>
                        <Col xs={24} sm={24} md={4} lg={6} xl={6}>
                            <Title style={{ margin: 0 }} level={5}>End Date</Title>
                            <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{new Date(committeeDetail?.committeeDetails?.committee?.endDate).toLocaleDateString()}</Title>
                        </Col>
                    </Row>
                </Card>
            </Modal>
            <div style={{ marginBottom: "20px", marginTop: "40px", display: "flex", justifyContent: "space-between" }}>
                <Title style={{ color: "#166805", margin: 0 }} level={3}>Approval members Request</Title>
                <div style={{ display: "flex", margin: 0 }}>
                    <Title style={{ color: "#166805", margin: "3px 10px 0 0" }} level={5}>Filter by</Title>
                    <Select
                        defaultValue={CID === "" ? "Select committee" : CID}
                        style={{ width: "200px" }}
                        options={committees?.map((opt) => (
                            { value: opt?.committeeDetails?.committee?.uniqueId, label: opt?.committeeDetails?.committee?.uniqueId }
                        ))}
                        onChange={(e) => setCID(e)}
                    />
                </div>
            </div>
            <Card className="my-card" style={{ marginBottom: "20px" }}>
                <Table
                    pagination={false}
                    loading={loading3}
                    dataSource={
                        CID ?
                            approveMembers?.filter((user) => user.approve === false && user.committeeList[0]?.cid?.uniqueId === CID)
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) :
                            approveMembers?.filter((user) => user.approve === false)
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    }                    
                    columns={column}
                />
            </Card>
        </>
    );
}

export default Members;