import React, { useEffect, useLayoutEffect, useState } from "react";

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
    Select,
    DatePicker,
} from "antd";
import {
    CarOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import memberIcon from '../assets/images/member2.svg'
import deleteIcon from '../assets/images/del-icon.svg'
import StatisticsHeader from "../components/statistics/statisticsHeader";
import axios from "axios";
import { API_URL } from "../config/api";
import { GetAdminCommittees, GetUserCommittees } from "../middlewares/commitee";
import { setCommittees } from "../store/committeeSlice/committeeSlice";
import ModalComp from "../components/modals/modals";
import { GetAllMembers } from "../middlewares/members";
import { setApproveMembers } from "../store/membersSlice/membersSlice";

function Setup2() {

    const { Title, Text } = Typography;
    const user = useSelector((state) => state.auth.user)
    const navigate = useNavigate()
    const params = useParams()
    const [committeeUsers, setCommitteeUsers] = useState([])
    const [committeeUsers2, setCommitteeUsers2] = useState([])
    const [committeeDetail, setCommitteeDetail] = useState(null)
    const [paymentHistoryDetails, setPaymentHistoryDetails] = useState({
        date: "",
        paidType: "",
        paymentAmount: "",
        cid: null,
        note: ""
    })
    const [paymentHistory, setPaymentHistory] = useState([])
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [userId, setUserId] = useState(false)
    const committees = useSelector((state) => state.committees.committees)
    const token = useSelector((state) => state.common.token)
    const approveMembers = useSelector((state) => state.members.approveMembers)
    const dispatch = useDispatch()
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement, message) => {
        if (message === "Fields are required") {
            api.error({
                message: `Notification`,
                description: message,
                placement,
            });
        }
        else {
            api.success({
                message: `Notification`,
                description: message,
                placement,
            });
        }
    };

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
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Enrolled At</Title>,
            dataIndex: 'contactNumber',
            key: 'contactNumber',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{new Date(record?.createdAt).toLocaleDateString()}</Title>
            }
        },
        // {
        //     title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Committee</Title>,
        //     dataIndex: 'monthlyIncome',
        //     key: 'monthlyIncome',
        //     render: (text, record) => {
        //         const res = committees?.filter((f) => {
        //             return record?.committeeList?.some((a) => a?.cid === f?.committee?._id)
        //         })
        //         return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{res[0]?.committee?.name ? res[0]?.committee?.name : ""}</Title>
        //     }
        // },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Tier</Title>,
            dataIndex: 'level',
            key: 'level',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.level}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Payment Status</Title>,
            render: (text, record) => {
                return (
                    <Select
                        defaultValue="Select"
                        style={{ width: "100%" }}
                        options={[
                            { value: true, label: "RECEIVED" },
                            { value: false, label: "NOT RECEIVED" }
                        ]}
                        // value={record?.committeeList?.find(f => f.cid === params.id)?.received}
                        onChange={(e) => handleChangeStatus(e, record._id)}
                    />
                )
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Status</Title>,
            dataIndex: 'enroll',
            key: 'enroll',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.committeeList ? record?.committeeList[0]?.received === true ? "RECEIVED" : "NOT RECEIVED" : ""}</Title>
            }
        },
        {
            width: 250,
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}></Title>,
            render: (text, record) => {
                return (
                    <>
                        <Button onClick={() => navigate(`/verification-details/${record._id}`)} className="add-cycle-btn">View</Button>
                        <Button
                            style={{ margin: "0 0 0 10px" }}
                            className="add-cycle-btn"
                            onClick={() => {
                                setShowPaymentModal(true)
                                setUserId(record?._id)
                                setPaymentHistoryDetails((prevDetails) => {
                                    return {
                                        ...prevDetails,
                                        cid: record?._id
                                    }
                                })
                            }}>
                            Add payment history
                        </Button>
                    </>
                )
            }
        },
    ];
    const column3 = [
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Name</Title>,
            dataIndex: 'username',
            key: 'username',
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
            dataIndex: 'phonenumber',
            key: 'phonenumber',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.contactNumber}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Level</Title>,
            dataIndex: 'level',
            key: 'level',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.level}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Enroll</Title>,
            dataIndex: 'enroll',
            key: 'enroll',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.committeeList?.length}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Status</Title>,
            dataIndex: 'enroll',
            key: 'enroll',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.committeeList ? record?.committeeList[0]?.received === true ? "RECEIVED" : "NOT RECEIVED" : ""}</Title>
            }
        },
    ];

    async function fetchCommitteeUsers() {
        if (user?.userType === "admin") {
            setLoading(true)
            try {
                const response = await axios.get(`${API_URL}/admin/committeeById/${params.id}`, {
                    headers: { Authorization: "Bearer " + token }
                })
                const res = response?.data?.data?.enrolledUsers?.length > 0 ? response?.data?.data?.enrolledUsers : null
                const res2 = response?.data?.data?.receivedUsers?.length > 0 ? response?.data?.data?.receivedUsers : null
                setCommitteeUsers(res)
                setCommitteeUsers2(res2)
                setCommitteeDetail(response.data.data.committee)
                setLoading(false)
                console.log(response);
            } catch (error) {
                console.log(error);
                setLoading(false)
            }
        }
        else {
            setLoading(true)
            try {
                const response = await axios.get(`${API_URL}/user/committeeById/${params.id}`, {
                    headers: { Authorization: "Bearer " + token }
                })
                const res = response?.data?.data?.enrolledusers?.length > 0 ? response?.data?.data?.enrolledusers : null
                const res2 = response?.data?.data?.receivedUsers?.length > 0 ? response?.data?.data?.receivedUsers : null
                setCommitteeUsers(res)
                setCommitteeUsers2(res2)
                setCommitteeDetail(response.data.data.committee)
                setLoading(false)
                console.log(response);
                console.log(res);
            } catch (error) {
                console.log(error);
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        fetchCommitteeUsers()
        if (user?.userType === "admin") {
            GetAdminCommittees(token)
                .then((res) => {
                    const committee = res.data.allCommittees
                    dispatch(setCommittees([...committee.level1, ...committee.level2, ...committee.level3]))
                })
                .catch((err) => {
                    console.log(err);
                })
            GetAllMembers(token)
                .then((res) => {
                    console.log(res?.data);
                    dispatch(setApproveMembers(res?.data?.users))
                })
                .catch((error) => {
                    console.log(error);
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
    }, [params.id])

    async function handleChangeStatus(status, id) {
        console.log(status, id);
        try {
            const response = await axios.post(`${API_URL}/admin/receivedStatus/${id}`, {
                received: status,
                cId: committeeDetail._id
            }, {
                headers: { Authorization: "Bearer " + token }
            })
            if (response.status === 200) {
                fetchCommitteeUsers()
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function submitPaymentHistory() {
        if (paymentHistoryDetails.date || paymentHistoryDetails.paidType || paymentHistoryDetails.paymentAmount) {
            setLoading2(true)
            try {
                const response = await axios.post(`${API_URL}/admin/paymentRecord`, {
                    date: paymentHistoryDetails.date,
                    isPaid: paymentHistoryDetails.paidType,
                    paymentAmount: paymentHistoryDetails.paymentAmount,
                    note: paymentHistoryDetails?.note,
                    userId: userId,
                    cid: params.id,
                }, {
                    headers: { Authorization: "Bearer " + token }
                })
                if (response.status === 200) {
                    console.log(response);
                    setLoading2(false)
                    setShowPaymentModal(false)
                    setPaymentHistoryDetails({
                        date: null,
                        paidType: "",
                        paymentAmount: "",
                        cid: null,
                        note: ""
                    })
                    openNotification("topRight", "Payment Added Successfully")
                }
            } catch (error) {
                setLoading2(false)
                console.log(error);
            }
            return null
        }
        else {
            setShowPaymentModal(true)
            openNotification("topRight", "Fields are required")
            return null
        }
    }

    console.log(committeeUsers);
    console.log(committeeDetail);
    console.log(committeeUsers2);
    // console.log(paymentHistoryDetails);
    // console.log(committeeDetail);

    const [dateRanges, setDateRanges] = useState([]);

    useEffect(() => {
        if (committeeDetail?.cycle?.type === "Monthly") {
            const calculateDateRanges = () => {
                const start = new Date(committeeDetail?.startDate);
                const end = new Date(committeeDetail?.endDate);
                const calculatedDateRanges = [];
                while (start <= end) {
                    const rangeStart = new Date(start);
                    const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
                    const rangeEnd = new Date(start);
                    rangeEnd.setDate(daysInMonth);
                    calculatedDateRanges.push({
                        start: rangeStart.toLocaleDateString(),
                        end: rangeEnd.toLocaleDateString(),
                    });
                    start.setDate(1); // Move to the beginning of the next month
                    start.setMonth(start.getMonth() + 1);
                }
                setDateRanges(calculatedDateRanges);
            };
            calculateDateRanges();
        }
        else {

            const calculateDateRanges = () => {
                const start = new Date(committeeDetail?.startDate);
                const end = new Date(committeeDetail?.endDate);
                const calculatedDateRanges = [];

                while (start <= end) {
                    const rangeStart1 = new Date(start);
                    const rangeEnd1 = new Date(start);
                    rangeEnd1.setDate(15); // Set the day to the 15th

                    calculatedDateRanges.push({
                        start: rangeStart1.toLocaleDateString(),
                        end: rangeEnd1.toLocaleDateString(),
                    });

                    const rangeStart2 = new Date(start);
                    const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
                    const rangeEnd2 = new Date(start);
                    rangeEnd2.setDate(daysInMonth);

                    calculatedDateRanges.push({
                        start: rangeEnd1.toLocaleDateString(),
                        end: rangeEnd2.toLocaleDateString(),
                    });

                    start.setDate(1); // Move to the beginning of the next month
                    start.setMonth(start.getMonth() + 1);
                }

                setDateRanges(calculatedDateRanges);
            };
            calculateDateRanges();
        }
    }, [committeeDetail?.startDate, committeeDetail?.endDate]);

    return (
        <>
            {contextHolder}
            {showPaymentModal && (
                <ModalComp setShow={() => setShowPaymentModal(false)} loading={loading2} onClick={submitPaymentHistory} title="Add Payment History" open={showPaymentModal}>
                    {/* <DatePicker
                        placeholder="Payment Date"
                        onChange={(e) => {
                            setPaymentHistoryDetails((prevDetails) => {
                                return {
                                    ...prevDetails,
                                    date: e
                                }
                            })
                        }}
                        style={{ width: "100%", height: "45px" }}
                    /> */}
                    <Select
                        defaultValue="Select date"
                        style={{ width: "100%" }}
                        options={dateRanges?.map((range, index) => ({ value: `${range.start} - ${range.end}`, label: `${range.start} - ${range.end}` }))}
                        onChange={(e) => {
                            console.log(e);
                            setPaymentHistoryDetails((prevDetails) => {
                                return {
                                    ...prevDetails,
                                    date: e
                                }
                            })
                        }}
                    />
                    <br />
                    <br />
                    <Select
                        defaultValue="Select"
                        style={{ width: "100%" }}
                        options={[
                            { value: "TRANSFER", label: "TRANSFER" },
                            { value: "RECIEVED", label: "RECIEVED" }
                        ]}
                        onChange={(e) => {
                            setPaymentHistoryDetails((prevDetails) => {
                                return {
                                    ...prevDetails,
                                    paidType: e
                                }
                            })
                        }}
                    />
                    <br />
                    <br />
                    <Input
                        placeholder="Amount"
                        value={paymentHistoryDetails.paymentAmount}
                        onChange={(e) => {
                            setPaymentHistoryDetails((prevDetails) => {
                                return {
                                    ...prevDetails,
                                    paymentAmount: Number(e.target.value)
                                }
                            })
                        }} />
                    <br />
                    <br />
                    <Input
                        placeholder="Note"
                        value={paymentHistoryDetails.note}
                        onChange={(e) => {
                            setPaymentHistoryDetails((prevDetails) => {
                                return {
                                    ...prevDetails,
                                    note: e.target.value
                                }
                            })
                        }}
                    />
                </ModalComp>
            )}
            {/* <StatisticsHeader user={user} approveMembers={approveMembers} /> */}
            {user.userType === "admin" ? (
                <>
                    <Title style={{ color: "#166805", margin: "0 0 20px 0" }} level={3}>Committee Detail</Title>
                    <Card style={{ marginBottom: "20px" }}>
                        <Row gutter={[24, 0]}>
                            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                                <Title style={{ margin: 0 }} level={4}>Name</Title>
                                <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{committeeDetail?.name}</Title>
                            </Col>
                            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                                <Title style={{ margin: 0 }} level={4}>Cycle</Title>
                                <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{committeeDetail?.cycle?.type}</Title>
                            </Col>
                            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                                <Title style={{ margin: 0 }} level={4}>Duration</Title>
                                <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{committeeDetail?.cycle?.value}</Title>
                            </Col>
                            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                                <Title style={{ margin: 0 }} level={4}>Total Amount</Title>
                                <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{committeeDetail?.payment}</Title>
                            </Col>
                            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                                <Title style={{ margin: 0 }} level={4}>Monthly Payment</Title>
                                <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{committeeDetail?.amount}</Title>
                            </Col>
                            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                                <Title style={{ margin: 0 }} level={4}>Members</Title>
                                <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{committeeDetail?.members}</Title>
                            </Col>
                            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                                <Title style={{ margin: 0 }} level={4}>Start Date</Title>
                                <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{new Date(committeeDetail?.startDate).toLocaleDateString()}</Title>
                            </Col>
                            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                                <Title style={{ margin: 0 }} level={4}>End Date</Title>
                                <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{new Date(committeeDetail?.endDate).toLocaleDateString()}</Title>
                            </Col>
                        </Row>
                    </Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "80px", marginBottom: "20px" }}>
                        <Title style={{ color: "#166805", margin: 0 }} level={3}>Committee members list’s</Title>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Title style={{ color: "#166805", margin: "0 15px 0 0" }} level={3}>Available Members: {committeeUsers?.length > 0 ? committeeUsers?.length : 0}/{committeeDetail?.members > 0 ? committeeDetail?.members : 0}</Title>
                            <img width={40} src={memberIcon} />
                        </div>
                    </div>
                    <Card className="my-card" style={{ marginBottom: "20px" }}>
                        <Table loading={loading} dataSource={committeeUsers} columns={column} />
                    </Card>
                    {/* <Form
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
          </Form> */}
                    {/* <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", marginTop: "40px" }}>
                        <Title style={{ color: "#166805", margin: 0 }} level={3}>Committee Received</Title>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Title style={{ color: "#166805", margin: "0 15px 0 0" }} level={3}>Committee Remaining: 10/12</Title>
                            <img width={40} src={memberIcon} />
                        </div>
                    </div>
                    <Card className="my-card" style={{ marginBottom: "20px" }}>
                        <Table loading={loading} dataSource={committeeUsers2} columns={column} />
                    </Card> */}
                </>
            ) : (
                <>
                    <Title style={{ color: "#166805", margin: "0 0 20px 0" }} level={3}>Committee Detail</Title>
                    <Card style={{ marginBottom: "20px" }}>
                        <Row gutter={[24, 0]}>
                            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                                <Title style={{ margin: 0 }} level={4}>Name</Title>
                                <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{committeeDetail?.name}</Title>
                            </Col>
                            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                                <Title style={{ margin: 0 }} level={4}>Cycle</Title>
                                <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{committeeDetail?.cycle?.type}</Title>
                            </Col>
                            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                                <Title style={{ margin: 0 }} level={4}>Duration</Title>
                                <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{committeeDetail?.cycle?.value}</Title>
                            </Col>
                            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                                <Title style={{ margin: 0 }} level={4}>Total Amount</Title>
                                <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{committeeDetail?.payment}</Title>
                            </Col>
                            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                                <Title style={{ margin: 0 }} level={4}>Monthly Payment</Title>
                                <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{committeeDetail?.amount}</Title>
                            </Col>
                            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                                <Title style={{ margin: 0 }} level={4}>Members</Title>
                                <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{committeeDetail?.members}</Title>
                            </Col>
                            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                                <Title style={{ margin: 0 }} level={4}>Start Date</Title>
                                <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{new Date(committeeDetail?.startDate).toLocaleDateString()}</Title>
                            </Col>
                            <Col xs={24} sm={24} md={4} lg={3} xl={3}>
                                <Title style={{ margin: 0 }} level={4}>End Date</Title>
                                <Title style={{ margin: 0, color: "grey", fontWeight: '500' }} level={5}>{new Date(committeeDetail?.endDate).toLocaleDateString()}</Title>
                            </Col>
                        </Row>
                    </Card>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <Title style={{ color: "#166805", margin: 0 }} level={3}>Committee members</Title>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Title style={{ color: "#166805", margin: "0 15px 0 0" }} level={3}>Available Members: {committeeUsers?.length}/{committeeDetail?.members}</Title>
                            <img width={40} src={memberIcon} />
                        </div>
                    </div>
                    <Card className="my-card" style={{ marginBottom: "20px" }}>
                        <Table loading={loading} dataSource={committeeUsers} columns={column3} />
                    </Card>
                </>
            )}
        </>
    );
}

export default Setup2;