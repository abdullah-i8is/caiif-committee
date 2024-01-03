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
import memberIcon from '../assets/images/member2.svg'
import deleteIcon from '../assets/images/del-icon.svg'
import denyIcon from '../assets/images/deny.svg'
import cnicFront from '../assets/images/cnic-front.png'

import StatisticsHeader from "../components/statistics/statisticsHeader";

function VerificationDetails() {

    const { Title, Text } = Typography;
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm();

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", marginTop: "50px" }}>
                <Title style={{ color: "#166805", margin: 0 }} level={3}>Verification Details</Title>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button style={{ margin: "0 0 0 10px", width: "100px" }} className="deny-btn"> <img width={15} src={denyIcon} style={{ margin: "0 5px 0 0" }} /> Deny</Button>
                    <Button onClick={() => navigate("/committee-details")} style={{ margin: "0 0 0 10px", width: "100px" }} className="add-cycle-btn"> Approve</Button>
                </div>
            </div>
            <Form
                form={form}
                layout="vertical"
            >
                <Card>
                    <Row gutter={[24, 0]}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Card className="my-card" style={{ border: "2px solid #166805", padding: "3px", marginBottom: 40 }}>
                                <img src={cnicFront} style={{ borderRadius: "10px", width:"100%" }} />
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Card className="my-card" style={{ border: "2px solid #166805", padding: "3px", marginBottom: 40 }}>
                                <img src={cnicFront} style={{ borderRadius: "10px", width:"100%" }} />
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Name</Title>}>
                                <Input value="Hassan Soomro" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Bank Name</Title>}>
                                <Input value="Meezan" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Bank Branch Name</Title>}>
                                <Input value="M.A Jinnah Road" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Bank Account Number</Title>}>
                                <Input value={4123718934793278} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Work Address</Title>}>
                                <Input value="Nipa Chorangi" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Residential Address</Title>}>
                                <Input value="Gulshan e Iqbal" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Monthly Income</Title>}>
                                <Input value="$5200 Dollars" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Job Occupation</Title>}>
                                <Input value="Textile Designer" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Emergency Contact Relation</Title>}>
                                <Input value="Brother" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Emergency Contact</Title>}>
                                <Input value={9231740137732} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            </Form>
        </>
    );
}

export default VerificationDetails;