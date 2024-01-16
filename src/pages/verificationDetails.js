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
    Select,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import denyIcon from '../assets/images/deny.svg'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../config/api";
import { GetAdminCommittees } from "../middlewares/commitee";
import { setCommittees } from "../store/committeeSlice/committeeSlice";

function VerificationDetails() {

    const { Title, Text } = Typography;
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [additionalDetail, setAdditionalDetail] = useState(false)
    const navigate = useNavigate()
    const token = useSelector((state) => state.common.token)
    const [user, setUser] = useState()
    const [commitee, setCommittee] = useState()
    const state = useSelector((state) => state)
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
        GetAdminCommittees(token)
            .then((res) => {
                const committee = res.data.allCommittees
                dispatch(setCommittees([...committee.level1, ...committee.level2, ...committee.level3]))
                if (res.status === 200) {
                    console.log(res);
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.log(err);
                setLoading(false)
            })
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
                cId: user?.cId
            }, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            if (response.status === 200) {
                setLoading(false)
                openNotification("topRight", "Profile update successfully")
                getUser()
                console.log(response);
            }
        } catch (error) {
            setLoading(false)
            api.error({
                message: `Notification`,
                description: error?.response?.data?.message,
                placement:"topRight",
            });
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
        if (name === "cId") {
            console.log(value);
            const findCom = state?.committees?.committees?.find((f) => f?.committeeDetails?.committee._id === value)
            console.log(findCom?.committeeDetails?.committee);
            setCommittee(findCom?.committeeDetails?.committee)
            setUser((prevDetail) => {
                return {
                    ...prevDetail,
                    [name]: findCom?.committeeDetails?.committee?._id
                }
            })
        }
    }

    console.log(user);
    console.log(commitee);

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
                        <Col xs={16} sm={24} md={6} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Name</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "name")} value={user?.name} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={12} xl={12}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Email Address</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "email")} value={user?.email} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={8} xl={8}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Phone Number</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "contactNumber")} value={user?.contactNumber} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={8} xl={8}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Interested Date</Title>}>
                                <Input value={user?.interestedDate} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={8} xl={8}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Job Occupation</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "jobOccupation")} value={user?.jobOccupation} />
                            </Form.Item>
                        </Col>
                        {user?.approve === false && <Col xs={24} sm={24} md={12} lg={24} xl={24}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Select Committee</Title>}>
                                <Select
                                    defaultValue="Select Committee"
                                    style={{ width: "100%" }}
                                    options={state?.committees?.committees?.map((opt) => ({ value: opt?.committeeDetails?.committee?._id, label: opt?.committeeDetails?.committee?.name }))}
                                    onChange={(e) => handleChange(e, "cId")}
                                />
                            </Form.Item>
                        </Col>}
                        {/* <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Committee Number</Title>}>
                                <Input disabled={user?.approve === true ? true : false} onChange={(e) => setCommittee((prevDetail) => {
                                    return {
                                        ...prevDetail,
                                        commiteeNumber: e.target.value
                                    }
                                })} value={commitee?.commiteeNumber} />
                            </Form.Item>
                        </Col> */}
                        <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Committee</Title>}>
                                <Input disabled={user?.approve === true ? true : false} value={commitee?.name} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Payment</Title>}>
                                <Input disabled={user?.approve === true ? true : false} value={`$ ${commitee?.amount}`} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Amount</Title>}>
                                <Input disabled={user?.approve === true ? true : false} value={`$ ${commitee?.payment}`} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Members</Title>}>
                                <Input disabled={user?.approve === true ? true : false} value={commitee?.members} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Start Date</Title>}>
                                <Input disabled={user?.approve === true ? true : false} value={new Date(commitee?.startDate).toLocaleDateString()} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>End Date</Title>}>
                                <Input disabled={user?.approve === true ? true : false} value={new Date(commitee?.endDate).toLocaleDateString()} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                name="note"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Please input your Note!',
                                    },
                                ]}
                                label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Note</Title>}>
                                <Input.TextArea value={note} onChange={(e) => setNote(e.target.value)} />
                            </Form.Item>
                        </Col>
                        {user?.adminNotes?.length > 0 && <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ marginBottom: 0 }}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Notes</Title>}>
                                {user?.adminNotes?.map((f) => f === "" ? null : <Input value={f} style={{ margin: "10px 0" }} />)}
                            </Form.Item>
                        </Col>}
                        {/* <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ marginBottom: additionalDetail ? 30 : 0 }}>
                            <Button onClick={() => setAdditionalDetail(true)} className="add-cycle-btn">Add Additional Detail</Button>
                        </Col> */}
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Button loading={loading} onClick={handleSubmit} className="add-cycle-btn">Submit</Button>
                        </Col>
                        {/* {additionalDetail && ( */}
                        {/* <> */}
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

                        {/* </>
                        )} */}
                    </Row>
                </Card>
            </Form>
        </>
    );
}

export default VerificationDetails;