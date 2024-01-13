import { useEffect, useState } from "react";

import {
    Card,
    Col,
    Row,
    Typography,
    Button,
    Form,
    Input,
    notification,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import denyIcon from '../assets/images/deny.svg'
import { useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../config/api";

function VerificationDetails() {

    const { Title, Text } = Typography;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const [additionalDetail, setAdditionalDetail] = useState(false)
    const navigate = useNavigate()
    const token = useSelector((state) => state.common.token)
    const [user, setUser] = useState()
    const [commitee, setCommittee] = useState()
    const [note, setNote] = useState("");
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement, message) => {
        api.success({
            message: `Notification`,
            description: message,
            placement,
        });
        if (message === "network error") {
            api.error({
                message: `Notification`,
                description: "network error",
                placement,
            });
        }
    };
    const { id, cid } = useParams()

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
                try {
                    const res = await axios.get(`${API_URL}/user/committeeById/${response.data.user?.committeeList[0]?.cid}`)
                    setCommittee(res?.data?.data?.committee)
                    console.log(res);
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUser()
    }, [id])

    async function handleSubmit() {
        setLoading(true)
        try {
            const response = await axios.post(`${API_URL}/admin/additionalData/${id}`, {
                adminNote: note,
                name: user?.name,
                email: user?.email,
                contactNumber: user?.contactNumber,
                jobOccupation: user?.jobOccupation,
            }, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            if (response.status === 200) {
                setLoading(false)
                notification("topRight", "Profile update successfully")
                getUser()
                console.log(response);
            }
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    const handleChange = async (value, name) => {
        setUser((prevDetail) => {
            return {
                ...prevDetail,
                [name]: value
            }
        })
    }

    console.log(user);
    // console.log(commitee);
    // console.log(id);

    return (
        <>
            {contextHolder}
            <div style={{ marginBottom: "20px", marginTop: "50px" }}>
                <Title style={{ color: "#166805", margin: 0 }} level={3}>Verification Details</Title>
                {/* <div style={{ display: "flex", alignItems: "center" }}>
                    <Button loading={loading} onClick={() => handleApprove(false)} style={{ margin: "0 0 0 10px", width: "100px" }} className="deny-btn"> <img width={15} src={denyIcon} style={{ margin: "0 5px 0 0" }} /> Deny</Button>
                    <Button loading={loading2} onClick={() => handleApprove(true)} style={{ margin: "0 0 0 10px", width: "100px" }} className="add-cycle-btn"> Approve</Button>
                </div> */}
            </div>
            <Form
                form={form}
                layout="vertical"
            >
                <Card>
                    <Row gutter={[24, 0]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Card style={{ border: "2px solid #166805", marginBottom: 40 }}>
                                <img src={user?.nic} style={{ borderRadius: "10px", width: "100%", height: "300px", objectFit: "contain" }} />
                            </Card>
                        </Col>
                        <Col xs={16} sm={24} md={8} lg={8} xl={8}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Name</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "name")} value={user?.name} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Email Address</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "email")} value={user?.email} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Phone Number</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "contactNumber")} value={user?.contactNumber} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Job Occupation</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "jobOccupation")} value={user?.jobOccupation} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Committee</Title>}>
                                <Input value={commitee?.name} />
                            </Form.Item>
                        </Col>
                        {user?.adminNotes?.length > 0 && <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ marginBottom: additionalDetail ? 30 : 0 }}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Notes</Title>}>
                                {user?.adminNotes?.map((f) => <Input value={f} style={{ margin: "10px 0" }} />)}
                            </Form.Item>
                        </Col>}
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ marginBottom: additionalDetail ? 30 : 0 }}>
                            <Button onClick={() => setAdditionalDetail(true)} className="add-cycle-btn">Add Additional Detail</Button>
                        </Col>
                        {additionalDetail && (
                            <>
                                {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Form.Item name="bankBranchName" rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Bank Branch Name!',
                                        },
                                    ]} label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Bank Branch Name</Title>}>
                                        <Input onChange={(e) => handleChange(e.target.value, "bankBranchName")} />
                                    </Form.Item>
                                </Col> */}
                                {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        name="accountNumber"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Account Number!',
                                            },
                                        ]} label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Bank Account Number</Title>}>
                                        <Input onChange={(e) => handleChange(e.target.value, "bankBranchName")} />
                                    </Form.Item>
                                </Col> */}
                                {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        name="workAddress"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Work Address!',
                                            },
                                        ]}
                                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Work Address</Title>}>
                                        <Input />
                                    </Form.Item>
                                </Col> */}
                                {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        name="residentialAddress"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Residential Address!',
                                            },
                                        ]}
                                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Residential Address</Title>}>
                                        <Input />
                                    </Form.Item>
                                </Col> */}
                                {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        name="monthlyIncome"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Monthly Income!',
                                            },
                                        ]}
                                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Monthly Income</Title>}>
                                        <Input />
                                    </Form.Item>
                                </Col> */}
                                {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        name="emergencyContactRelation"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Emergency Contact Relation!',
                                            },
                                        ]}
                                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Emergency Contact Relation</Title>}>
                                        <Input />
                                    </Form.Item>
                                </Col> */}
                                {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        name="emergencyContact"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Emergency Contact!',
                                            },
                                        ]}
                                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Emergency Contact</Title>}>
                                        <Input />
                                    </Form.Item>
                                </Col> */}
                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        name="note"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Note!',
                                            },
                                        ]}
                                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Note</Title>}>
                                        <Input.TextArea value={note} onChange={(e) => setNote(e.target.value)} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Button loading={loading} onClick={handleSubmit} className="add-cycle-btn">Submit</Button>
                                </Col>
                            </>
                        )}
                    </Row>
                </Card>
            </Form>
        </>
    );
}

export default VerificationDetails;