import { useEffect, useLayoutEffect, useState } from "react";

import {
    Card,
    Col,
    Row,
    Typography,
    Button,
    Form,
    Input,
    Select,
    DatePicker
} from "antd";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import axios from "axios";
import { useSelector } from "react-redux";
import moment from "moment";

function CommitteeDetails() {

    const { RangePicker } = DatePicker;
    const { Title, Text } = Typography;
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm();
    const [err, setErr] = useState(null);
    const [formFields, setFormFields] = useState({
        name: "",
        amount: null,
        cycle: {
            type: "",
            value: null
        },
        payment: null,
        startDate: null,
        endDate: null,
        members: null,
    });
    const token = useSelector((state) => state.common.token)

    const onFinish = (values) => {
        console.log("Success:", values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const handleCreateCommittee = async () => {
        if (formFields.name && formFields.amount && formFields.cycle && formFields.payment && formFields.startDate && formFields.endDate && formFields.members) {
            setLoading(true)
            try {
                const response = await axios.post(`${API_URL}/admin/createCommittee`, {
                    ...formFields
                }, {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                })
                if (response.status === 200) {
                    console.log(response);
                    setLoading(false)
                    setErr(response.data.message)
                    setTimeout(() => {
                        navigate("/")
                    }, 2000);
                }
            } catch (error) {
                setLoading(false)
                setErr(error.response.data.message)
                console.log(error);
            }
        }
        else {
            return null
        }
    }

    console.log(formFields);

    useEffect(() => {
        setFormFields((prevFields) => {
            return {
                ...prevFields,
                amount: formFields.payment / formFields.members
            }
        })
    }, [formFields.payment])

    function handleChange(field) {
        if (field.type === "cycle") {
            setFormFields((prevFields) => {
                return {
                    ...prevFields,
                    cycle: {
                        type: field?.label,
                        value: field?.value
                    }
                }
            })
        }
        else {
            setFormFields((prevFields) => {
                if (field.type === "startDate") {
                    const endDate = moment(field.value).set('date', 1).add(formFields.members, 'months');
                    form.setFieldsValue({ endDate });
                    return {
                        ...prevFields,
                        [field.type]: field.value,
                        endDate: endDate,
                    }
                }
                if (field.type === "payment" || field.type === "members") {
                    return {
                        ...prevFields,
                        [field.type]: Number(field.value.target.value)
                    }
                }
                else {
                    return {
                        ...prevFields,
                        [field.type]: field.value.target.value
                    }
                }
            })
        }
        console.log(field);
    }

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                className="row-col"
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", marginTop: "50px" }}>
                    <Title style={{ color: "#166805", margin: 0 }} level={3}>Committee Details</Title>
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            onClick={() => {
                                handleCreateCommittee()
                            }}
                            loading={loading}
                            htmlType="submit"
                            style={{ margin: "0 0 0 10px", width: "100px" }}
                            className="add-cycle-btn">
                            Submit
                        </Button>
                    </Form.Item>
                </div>
                <Card>
                    <Row gutter={[24, 0]}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Name!',
                                    },
                                ]}
                                name="name"
                                label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Committee Name</Title>}>
                                <Input
                                    onChange={(e) => handleChange({ value: e, type: "name" })}
                                    placeholder="New Title"
                                />
                            </Form.Item>
                        </Col>
                        {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Cycle!',
                                    },
                                ]}
                                name="cycle"
                                label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Cycle</Title>}>
                                <Input placeholder="New Title" />
                            </Form.Item>
                        </Col> */}
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item name="cycle"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select your Cycle !',
                                    },
                                ]}
                                label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Cycle</Title>}>
                                <Select
                                    defaultValue="Select"
                                    style={{ width: "100%" }}
                                    options={[
                                        { value: 15, label: "Bi-weekly" },
                                        { value: 30, label: "Monthly" }
                                    ]}
                                    onChange={(e, opt) => handleChange({ value: e, label: opt.label, type: "cycle" })}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Total Amount!',
                                    },
                                ]}
                                name="payment"
                                label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Total Amount</Title>}>
                                <Input
                                    onChange={(e, opt) => handleChange({ value: e, type: "payment" })}
                                    placeholder="$ 000"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Total Member’s!',
                                    },
                                ]}
                                name="members"
                                label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Total Member’s</Title>}>
                                <Input
                                    placeholder={99}
                                    onChange={(e, opt) => handleChange({ value: e, type: "members" })}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                            <div style={{ marginBottom: "8px" }}>
                                <Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Start Date</Title>
                            </div>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Start Date!',
                                    },
                                ]}
                                name="startDate"
                            >
                                <DatePicker onChange={(e) => handleChange({ value: e, type: "startDate" })} style={{ width: "100%", height: "45px" }} />
                            </Form.Item>
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
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your End Date!',
                                    },
                                ]}
                                name="endDate"
                            >
                                <DatePicker style={{ width: "100%", height: "45px" }} />
                            </Form.Item>
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
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Payment!',
                                    },
                                ]}>
                                <Input
                                    disabled={true}
                                    value={formFields.amount}
                                    placeholder="$ 000"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            </Form>
        </>
    );
}

export default CommitteeDetails;