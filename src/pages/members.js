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
    const [userId, setUserId] = useState("")
    const [CID, setCID] = useState("")
    const [CID2, setCID2] = useState("")
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const [api, contextHolder] = notification.useNotification();

    const column = [
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Committee</Title>,
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>{record?.committeeList[0]?.cid?.uniqueId}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Name</Title>,
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>{record?.firstName + " " + record?.lastName}</Title>
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
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Enrolled At</Title>,
            dataIndex: 'contactNumber',
            key: 'contactNumber',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{new Date(record?.createdAt).toLocaleDateString()}</Title>
            }
        },
        // {
        //     title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Tier</Title>,
        //     dataIndex: 'level',
        //     key: 'level',
        //     render: (text, record) => {
        //         return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.level}</Title>
        //     }
        // },
        // {
        //     title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}></Title>,
        //     render: (text, record) => {
        //         return (
        //             <Button style={{ margin: "0 0 0 20px" }} onClick={() => navigate(`/members/verification-details/${record._id}`)} className="add-cycle-btn">View</Button>
        //         )
        //     }
        // },
        // {
        //     title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Committee</Title>,
        //     dataIndex: 'level',
        //     key: 'level',
        //     render: (text, record) => {
        //         const res = committees?.filter((f) => {
        //             return record?.committeeList?.some((a) => a?.cid === f?.committee?._id)
        //         })
        //         console.log(res);
        //         return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{res[0]?.committee?.name ? res[0]?.committee?.name : ""}</Title>
        //     }
        // },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>ID</Title>,
            dataIndex: 'note',
            key: 'note',
            render: (text, record) => {
                return (
                    <img src={record?.nic} alt="avatar" style={{ width: '100px' }} />
                )
            }
        },
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
                            style={{ margin: "0 0 0 10px", width: "100px" }}
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
            render: (text, record) => {
                return (
                    <Button style={{ margin: "0 0 0 20px" }} onClick={() => navigate(`/members/verification-details/${record._id}`)} className="add-cycle-btn">View</Button>
                )
            }
        },
    ];

    const column2 = [
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Committee</Title>,
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>{record?.committeeList[0]?.cid?.uniqueId}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Name</Title>,
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>{record?.firstName + " " + record?.lastName}</Title>
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
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Enrolled At</Title>,
            dataIndex: 'contactNumber',
            key: 'contactNumber',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{new Date(record?.createdAt).toLocaleDateString()}</Title>
            }
        },
        // {
        //     title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Committee</Title>,
        //     dataIndex: 'name',
        //     key: 'name',
        //     render: (text, record) => {
        //         const res = committees?.filter((f) => {
        //             return record?.committeeList?.some((a) => a?.cid === f?.committee?._id)
        //         })
        //         return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{res[0]?.committee?.name ? res[0]?.committee?.name : ""}</Title>
        //     }
        // },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>ID</Title>,
            dataIndex: 'note',
            key: 'note',
            render: (text, record) => {
                return (
                    <img src={record?.nic} alt="avatar" style={{ width: '100px' }} />
                )
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}></Title>,
            render: (text, record) => {
                return (
                    <Button style={{ margin: "0 0 0 20px" }} onClick={() => navigate(`/members/verification-details/${record._id}`)} className="add-cycle-btn">View</Button>
                )
            }
        },
        // {
        //     width: "200px",
        //     title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Action</Title>,
        //     render: (text, record) => {
        //         return (
        //             <>
        //                 <Button loading={loading} onClick={() => handleApprove(record._id, "DECLINE")} style={{ margin: "0 0 0 10px", width: "100px" }} className="deny-btn"> <img width={15} src={denyIcon} style={{ margin: "0 5px 0 0" }} /> Deny</Button>
        //                 <Button style={{ margin: "0 0 0 10px", width: "100px" }} onClick={() => handleApprove(record._id, "APPROVE")} className="add-cycle-btn">Approve</Button>
        //             </>
        //         )
        //     }
        // },
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
                    const committee = res.data.allCommittees
                    console.log("res", res);
                    dispatch(setCommittees([...committee.level1, ...committee.level2, ...committee.level3]))
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        if (user?.userType === "user") {
            GetUserCommittees()
                .then((res) => {
                    const committee = res.data.allCommittees
                    dispatch(setCommittees([...committee.level1, ...committee.level2, ...committee.level3]))
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [])

    console.log(approveMembers);
    console.log(committees);

    return (
        <>
            {contextHolder}
            <StatisticsHeader
                approveMembers={approveMembers}
                user={user}
                committees={committees}
            />
            {/* <StatisticsHeader approveMembers={approveMembers} committees={committees} user={loginUser} />
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
            </Card> */}
            {/* <StatisticsHeader approveMembers={approveMembers} committees={committees} user={loginUser} /> */}
            <div style={{ marginBottom: "20px", marginTop: "40px", display: "flex", justifyContent: "space-between" }}>
                <Title style={{ color: "#166805", margin: 0 }} level={3}>Approval members Request</Title>
                <div style={{ display: "flex", margin: 0 }}>
                    <Title style={{ color: "#166805", margin: "3px 10px 0 0" }} level={5}>Filter by</Title>
                    <Select
                        defaultValue={CID === "" ? "Select committee" : CID}
                        style={{ width: "200px" }}
                        options={committees?.map((opt) => (
                            { value: opt?.committeeDetails?.committee?.uniqueId, label: opt?.committeeDetails?.committee?.name }
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
                            approveMembers?.filter((user) => user.approve === false && user.committeeList[0]?.cid?.uniqueId === CID).sort((a, b) => b.createdAt - a.createdAt) :
                            approveMembers?.filter((user) => user.approve === false).sort((a, b) => b.createdAt - a.createdAt)
                    }
                    columns={column}
                />
            </Card>
            <div style={{ marginBottom: "20px", marginTop: "40px", display: "flex", justifyContent: "space-between" }}>
                <Title style={{ color: "#166805", margin: 0 }} level={3}>Approved members</Title>
                <div style={{ display: "flex", margin: 0 }}>
                    <Title style={{ color: "#166805", margin: "3px 10px 0 0" }} level={5}>Filter by</Title>
                    <Select
                        defaultValue={CID2 === "" ? "Select committee" : CID2}
                        style={{ width: "200px" }}
                        options={committees?.map((opt) => (
                            { value: opt?.committeeDetails?.committee?.uniqueId, label: opt?.committeeDetails?.committee?.name }
                        ))}
                        onChange={(e) => setCID2(e)}
                    />
                </div>
            </div>
            <Card className="my-card" style={{ marginBottom: "20px" }}>
                <Table
                    pagination={false}
                    loading={loading3}
                    dataSource={
                        CID2
                            ? approveMembers?.filter((user) => user.approve === true && user.committeeList[0]?.cid?.uniqueId === CID2).sort((a, b) => b.createdAt - a.createdAt)
                            : approveMembers?.filter((user) => user.approve === true).sort((a, b) => b.createdAt - a.createdAt)
                    }
                    columns={column2}
                />
            </Card>
        </>
    );
}

export default Members;