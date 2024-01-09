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
import { useNavigate, useParams } from "react-router-dom";
import memberIcon from '../assets/images/member2.svg'
import deleteIcon from '../assets/images/del-icon.svg'
import StatisticsHeader from "../components/statistics/statisticsHeader";
import axios from "axios";
import { API_URL } from "../config/api";

function Setup2() {

    const { Title, Text } = Typography;
    const user = useSelector((state) => state.auth.user)
    const navigate = useNavigate()
    const params = useParams()
    const [committeeUsers, setCommitteeUsers] = useState([])
    const committees = useSelector((state) => state.committees.committees)
    const token = useSelector((state) => state.common.token)
    const approveMembers = useSelector((state) => state.members.approveMembers)

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
    const data3 = [
        { username: "Hassan Soomro", accountnumber: "4003830171874018", email: "hassansoomro@i8is.com", phonenumber: "+92300000333", CNIC: "4230142301423", pdf: "Upload Pdf" },
        { username: "Nisa Hoorain", accountnumber: "4003830171874018", email: "nisahoorain@i8is.com", phonenumber: "+92300000333", CNIC: "4230142301423", pdf: "Upload Pdf" },
        { username: "Bilawal Soomro", accountnumber: "4003830171874018", email: "bilawalsoomro@i8is.com", phonenumber: "+92300000333", CNIC: "4230142301423", pdf: "Upload Pdf" },
        { username: "Hayat Ahmed", accountnumber: "4003830171874018", email: "hayatahmed@i8is.com", phonenumber: "+92300000333", CNIC: "4230142301423", pdf: "Upload Pdf" },
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
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Job Occupation</Title>,
            dataIndex: 'jobOccupation',
            key: 'jobOccupation',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.jobOccupation}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Monthly Income</Title>,
            dataIndex: 'monthlyIncome',
            key: 'monthlyIncome',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.monthlyIncome}</Title>
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

    const column3 = [
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

    useEffect(() => {
        const filterCommitteeUsers = approveMembers?.filter((approveUsers, index) => {
            return approveUsers?.committeeList.some((committeeList) => committeeList.cid === params.id)
        })
        setCommitteeUsers(filterCommitteeUsers)
    }, [])

    async function fetchCommitteeUsers() {
        try {
            const response = await axios.get(`${API_URL}/admin/committeeById/${params.id}`, {
                headers: {Authorization: "Bearer " + token}
            })
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCommitteeUsers()
    }, [params.id])

    console.log(committeeUsers);

    return (
        <>
            <StatisticsHeader user={user} />
            {user.userType === "admin" ? (
                <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <Title style={{ color: "#166805", margin: 0 }} level={3}>Committee members list’s</Title>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Title style={{ color: "#166805", margin: "0 15px 0 0" }} level={3}>Available Members: 3/12</Title>
                            <img width={40} src={memberIcon} />
                        </div>
                    </div>
                    <Card className="my-card" style={{ marginBottom: "20px" }}>
                        <Table dataSource={committeeUsers} columns={column} />
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
                </>
            ) : (
                <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <Title style={{ color: "#166805", margin: 0 }} level={3}>Committee members</Title>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Title style={{ color: "#166805", margin: "0 15px 0 0" }} level={3}>Available Members: 3/12</Title>
                            <img width={40} src={memberIcon} />
                        </div>
                    </div>
                    <Card className="my-card" style={{ marginBottom: "20px" }}>
                        <Table dataSource={data3} columns={column3} />
                    </Card>
                </>
            )}
        </>
    );
}

export default Setup2;