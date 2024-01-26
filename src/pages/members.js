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
    const [show, setShow] = useState(false)
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
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Committee ID</Title>,
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return <Title onClick={() => navigate(`/members/verification-details/${record._id}`)}
                    style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600", cursor: "pointer" }}>
                    {record?.committeeList[0]?.cid?.uniqueId}
                </Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Committee No</Title>,
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return <Title onClick={() => navigate(`/members/verification-details/${record._id}`)}
                    style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600", cursor: "pointer" }}>
                    {record?.committeeList[0]?.committeeNumber}
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
                        <Title onClick={() => navigate(`/members/verification-details/${record._id}`)} style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600", cursor: "pointer" }}>{record?.firstName + " " + record?.lastName}</Title>
                        <Title onClick={() => navigate(`/members/verification-details/${record._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181", cursor: "pointer" }}>{record?.email}</Title>
                        <Title onClick={() => navigate(`/members/verification-details/${record._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181", cursor: "pointer" }}>{record?.contactNumber}</Title>
                    </>
                )
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Occupation</Title>,
            dataIndex: 'jobOccupation',
            key: 'jobOccupation',
            render: (text, record) => {
                return <Title onClick={() => navigate(`/members/verification-details/${record._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181", cursor: "pointer" }}>{record?.jobOccupation}</Title>
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
                                setCommitteeId(record?.committeeList[0]?.cid)
                                setUserId(record._id)
                                setShow(true)
                            }}
                            style={{ margin: "0", width: "100px" }}
                            className="deny-btn">
                            <img width={15} src={denyIcon} style={{ margin: "0 5px 0 0" }} />
                            Delete
                        </Button>
                        <Button
                            loading={userId === record._id ? loading : false}
                            style={{ margin: "0 0 0 10px", width: "100px" }}
                            onClick={async () => {
                                setUserId(record._id)
                                setLoading(true)
                                try {
                                    const response = await axios.post(`${API_URL}/admin/approveAccount/${record._id}`, {
                                        approve: true,
                                        cId: record?.committeeList[0]?.cid
                                    }, {
                                        headers: {
                                            Authorization: "Bearer " + token
                                        }
                                    })
                                    if (response.status === 200) {
                                        console.log(response);
                                        setLoading(false)
                                        setLoading2(false)
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
                okButtonProps={{ style: { backgroundColor: "#166805" }, loading: loading2 }}
                okText="Delete"
                centered
                open={show}
                onOk={async () => {
                    setLoading2(true)
                    try {
                        const response = await axios.post(`${API_URL}/admin/approveAccount/${userId}`, {
                            approve: false,
                            cId: committeeId
                        }, {
                            headers: {
                                Authorization: "Bearer " + token
                            }
                        })
                        if (response.status === 200) {
                            console.log(response);
                            setLoading2(false)
                            setShow(false)
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
                        setShow(false)
                        setLoading2(false)
                        console.log(error);
                        api.error({
                            message: `Notification`,
                            description: error?.response?.data?.message ? error?.response?.data?.message : "network error",
                            placement: "bottomRight",
                        });
                    }
                }}
                onCancel={() => setShow(false)}
            >
                <Title style={{ color: "#166805", margin: "0 0 20px 0" }} level={5}>Are your sure want to delete this user ?</Title>
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