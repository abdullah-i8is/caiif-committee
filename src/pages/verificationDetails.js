import { useEffect, useState } from "react";

import {
    Card,
    Col,
    Row,
    Typography,
    Button,
    Form,
    Input,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import denyIcon from '../assets/images/deny.svg'
import cnicFront from '../assets/images/cnic-front.png'
import { useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../config/api";

function VerificationDetails() {

    const { Title, Text } = Typography;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const navigate = useNavigate()
    const [formFields, setFormFields] = useState({})
    const token = useSelector((state) => state.common.token)
    const [user, setUser] = useState()

    const { id } = useParams()

    async function getUser() {
        try {
            const response = await axios.get(`${API_URL}/admin/userById/${id}`, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            if (response.status === 200) {
                console.log(response);
                setUser(response.data.user)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUser()
    }, [id])

    async function handleApprove(status) {
        setLoading(status === false ? true : false)
        setLoading2(status === true ? true : false)
        try {
            const response = await axios.post(`${API_URL}/admin/approveAccount/${id}`, {
                approve: status
            }, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            if (response.status === 200) {
                setLoading(false)
                setLoading2(false)
                setTimeout(() => {
                    navigate("/members")
                }, 2000);
                console.log(response);
            }
        } catch (error) {
            setLoading(false)
            setLoading2(false)
            console.log(error);
        }
    }

    console.log(formFields);

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", marginTop: "50px" }}>
                <Title style={{ color: "#166805", margin: 0 }} level={3}>Verification Details</Title>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Button loading={loading} onClick={() => handleApprove(false)} style={{ margin: "0 0 0 10px", width: "100px" }} className="deny-btn"> <img width={15} src={denyIcon} style={{ margin: "0 5px 0 0" }} /> Deny</Button>
                    <Button loading={loading2} onClick={() => handleApprove(true)} style={{ margin: "0 0 0 10px", width: "100px" }} className="add-cycle-btn"> Approve</Button>
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
                                <img src={cnicFront} style={{ borderRadius: "10px", width: "100%" }} />
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Card className="my-card" style={{ border: "2px solid #166805", padding: "3px", marginBottom: 40 }}>
                                <img src={cnicFront} style={{ borderRadius: "10px", width: "100%" }} />
                            </Card>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Name</Title>}>
                                <Input value={user?.name} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Bank Name</Title>}>
                                <Input value={user?.bankName} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Bank Branch Name</Title>}>
                                <Input value={user?.bankBranchName} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Bank Account Number</Title>}>
                                <Input value={user?.accountNumber} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Work Address</Title>}>
                                <Input value={user?.workAddress} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Residential Address</Title>}>
                                <Input value={user?.residentialAddress} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Monthly Income</Title>}>
                                <Input value={user?.monthlyIncome} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Job Occupation</Title>}>
                                <Input value={user?.jobOccupation} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Emergency Contact Relation</Title>}>
                                <Input value={user?.emergencyContactRelation} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Emergency Contact</Title>}>
                                <Input value={user?.emergencyContact} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            </Form>
        </>
    );
}

export default VerificationDetails;