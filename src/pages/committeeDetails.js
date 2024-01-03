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
    Select,
} from "antd";
import {
    CarOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../config/firebase";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import memberIcon from '../assets/images/member2.svg'
import deleteIcon from '../assets/images/del-icon.svg'
import denyIcon from '../assets/images/deny.svg'
import cnicFront from '../assets/images/cnic-front.png'

import StatisticsHeader from "../components/statistics/statisticsHeader";

function CommitteeDetails() {

    const { Title, Text } = Typography;
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm();

    return (
        <>
            {contextHolder}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", marginTop: "50px" }}>
                <Title style={{ color: "#166805", margin: 0 }} level={3}>Committee Details</Title>
                <Button onClick={() => navigate("/enroll-requests")} style={{ margin: "0 0 0 10px", width: "100px" }} className="add-cycle-btn">Submit</Button>
            </div>
            <Form
                form={form}
                layout="vertical"
            >
                <Card>
                    <Row gutter={[24, 0]}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Committee Name</Title>}>
                                <Input placeholder="New Title" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Cycle</Title>}>
                                <Input placeholder="New Title" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Total Amount</Title>}>
                                <Input placeholder="$ 000" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Total Member’s</Title>}>
                                <Input placeholder={99} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <div style={{ marginBottom: "8px" }}>
                                <Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Start Date</Title>
                            </div>
                            <Select style={{ width: "100%" }} />
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <div>
                                    <Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>End Date</Title>
                                </div>
                                <div>
                                    <Title style={{ fontSize: "16px", margin: 0, color: "rgba(22, 104, 5, 0.50)" }}>This date is auto generated</Title>
                                </div>
                            </div>
                            <Select style={{ width: "100%" }} />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} style={{ marginTop: "24px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <div>
                                    <Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Amount per month</Title>
                                </div>
                                <div>
                                    <Title style={{ fontSize: "16px", margin: 0, color: "rgba(22, 104, 5, 0.50)" }}>This amount is auto generated</Title>
                                </div>
                            </div>
                            <Form.Item>
                                <Input placeholder="$ 000" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            </Form>
        </>
    );
}

export default CommitteeDetails;