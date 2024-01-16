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
    DatePicker,
    notification
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
        uniqueId: ""
    });
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
                    openNotification("topRight", "Committee created successfully")
                    setTimeout(() => {
                        navigate("/")
                    }, 2000);
                }
            } catch (error) {
                setLoading(false)
                openNotification("topRight", "network error")
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
                amount: formFields.payment !== null && formFields.members !== null ? Math.ceil(formFields.payment / formFields.members) : 0
            }
        })
    }, [formFields.payment, formFields.members])

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
                    // const startDate = moment(field.value);
                    // const adjustedMonths = formFields.cycle.type === "Bi-weekly" ? formFields.members / 2 : formFields.members;
                    // const endDate = startDate.clone().add(adjustedMonths, 'months').date(0).endOf('month');
                    // console.log({ startDate });
                    // console.log({ adjustedMonths });
                    // console.log({ endDate });
                    // form.setFieldsValue({ endDate });
                    if (formFields.cycle.type === "Monthly") {
                        const member = formFields?.members;
                        const start_date_str = field?.value;
                        const start_date = new Date(start_date_str);
                        const end_date = new Date(start_date);
                        end_date.setMonth(end_date.getMonth() + member);
                        end_date.setDate(0);
                        const month = String(end_date.getMonth() + 1).padStart(2, '0');
                        const day = String(end_date.getDate()).padStart(2, '0');
                        const year = end_date.getFullYear();
                        const end_date_str = `${month}-${day}-${year}`;
                        console.log("Start Date:", new Date(start_date_str));
                        console.log("End Date:", new Date(end_date_str));
                        return {
                            ...prevFields,
                            [field.type]: new Date(field?.value),
                            endDate: end_date_str,
                        };
                    }
                    if (formFields.cycle.type === "Bi-weekly") {
                        const member = formFields?.members / 2;
                        const start_date_str = field?.value;
                        const start_date = new Date(start_date_str);
                        const end_date = new Date(start_date);
                        end_date.setMonth(end_date.getMonth() + member);
                        end_date.setDate(0);
                        const month = String(end_date.getMonth() + 1).padStart(2, '0');
                        const day = String(end_date.getDate()).padStart(2, '0');
                        const year = end_date.getFullYear();
                        const end_date_str = `${month}-${day}-${year}`;
                        console.log("Start Date:", new Date(start_date_str));
                        console.log("End Date:", new Date(end_date_str));
                        return {
                            ...prevFields,
                            [field.type]: new Date(field?.value),
                            endDate: end_date_str,
                        };
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

    console.log(formFields);

    return (
        <>
            {contextHolder}
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
                                        message: 'Please input committee ID!',
                                    },
                                ]}
                                name="uniqueId"
                                label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>ID</Title>}>
                                <Input
                                    onChange={(e) => handleChange({ value: e, type: "uniqueId" })}
                                    placeholder="Committee ID"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input committee Name!',
                                    },
                                ]}
                                name="name"
                                label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Committee Name</Title>}>
                                <Input
                                    onChange={(e) => handleChange({ value: e, type: "name" })}
                                    placeholder="Committee Name"
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
                            >
                                <Input value={formFields.endDate} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
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