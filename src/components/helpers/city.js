import React, { useState } from 'react';
import { Card, Table, Typography, Tag, Switch, Tooltip, Modal, Form, Input, Button, Select, Space } from 'antd'
import { firestore } from '../../config/firebase';
import {
    collection,
    query,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    addDoc,
    setDoc
} from 'firebase/firestore';
import { Loader } from 'react-overlay-loader';

const { Title } = Typography;

const Designation = ({ open, handleDepartModal }) => {

    const [confirming, setConfirming] = useState(false)
    const q = collection(firestore, "city")
    const [data, setData] = useState()
    const [editDesignation, setEditDesignation] = useState(null)
    const [loading, setLoading] = useState(false)
    const [switchClick, setSwitchClick] = useState(false)

    const columns = [
        {
            title: 'Sr. No',
            dataIndex: 'serial',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Country',
            dataIndex: 'country',
        },
        {
            title: 'City',
            dataIndex: 'city',
        },
        // {
        //     title: 'Adv. Flight Booking',
        //     dataIndex: 'flightAdv',
        // },
        {
            title: 'Cabin Class',
            dataIndex: 'flightClass',
            render: (text, record) => {

                return text.map(t => <Tag color={t === "economy" ? "lime" : t === "first class" ? "cyan" : "green"}>{t}</Tag>)
            }
        },
        {
            title: 'Flight Budget',
            dataIndex: 'flightBudget',
            render: (text) => `PKR ${text}`
        },
        // {
        //     title: 'Adv. Hotel Booking',
        //     dataIndex: 'hotelAdv',
        // },
        {
            title: 'Hotel Class',
            dataIndex: 'hotelClass',
            render: (text, record) => {
                return text.map(t => <Tag color={t === "one star" ? "magenta" : t === "two start" ? "volcano" : t === "three star" ? "orange" : t === "four star" ? "geekblue" : "gold"}>{t}</Tag>)
            }
        },
        {
            title: 'Hotel Budget',
            dataIndex: 'hotelBudget',
            render: (text) => `PKR ${text}`
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (text, record) => {
                return <Tag color={
                    text === false ? 'error' : "success"
                }>{text ? "Active" : "In Active"}</Tag>
            }
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (text, record) => {
                return <Tooltip title="Active/InActive City">

                    <Switch checked={record.status} loading={switchClick} onClick={async () => {
                        setSwitchClick(true)
                        let itemRef = doc(firestore, "city", record.id)
                        await setDoc(itemRef, {
                            ...record,
                            status: !record.status,
                        })
                        setSwitchClick(false)
                    }} />
                </Tooltip>
            }
        },
        {
            title: "",
            dataIndex: "",
            render: (text, record) => {
                return <Tooltip title="Active/InActive Departmant">
                    <Button onClick={() => setEditDesignation(record.id)}>Edit</Button>
                </Tooltip>
            }
        }
    ];

    const [form] = Form.useForm();

    const onReset = () => {
        form.resetFields();
        handleDepartModal()
    };

    const handleOk = () => form.submit()

    React.useEffect(() => {
        setLoading(true)
        const unsub = onSnapshot(q, (querySnapshot) => {
            let todosArray = [];
            querySnapshot.forEach((doc) => {
                let d = doc.data()
                todosArray.push({
                    ...d,
                    id: doc.id,
                    serial: todosArray.length + 1
                });
            });
            setData(todosArray);
            setLoading(false)
        });
        return () => unsub();
    }, [])

    React.useEffect(() => {
        if (editDesignation) {
            let find = data.find(d => d.id === editDesignation)
            if (find) {
                form.setFieldsValue(find)
                console.log(form)
                handleDepartModal()
            }
        }
    }, [editDesignation])

    return (
        <>
            <Loader fullPage loading={loading} />
            <Card >
                <Title level={3}>List Of Cities</Title>
                <div style={{ padding: 5, width: "100%", overflowX: "scroll", overflowY: "hidden" }}>
                    <Table columns={columns}
                        dataSource={data}
                        rowKey={(record) => record.serial} />
                </div>
            </Card>

            <Modal
                title="City"
                open={open}
                onOk={handleOk}
                confirmLoading={confirming}
                onCancel={() => {
                    setEditDesignation(null)
                    onReset()
                }
                }
                footer={editDesignation ? [<Button key="back" onClick={() => {
                    setEditDesignation(null)
                    onReset()
                    // handleDepartModal()
                }}>
                    Close
                </Button>,
                <Button key="submit" type="primary" loading={confirming} onClick={handleOk}>
                    Submit
                </Button>,] : [
                    <Button key="back" onClick={() => {
                        setEditDesignation(null)
                        onReset()
                        // handleDepartModal()
                    }}>
                        Close
                    </Button>,
                    <Button key="back" onClick={onReset}>
                        Reset
                    </Button>,
                    <Button key="submit" type="primary" loading={confirming} onClick={handleOk}>
                        Submit
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    autoComplete="off"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={async (values) => {
                        setConfirming(true)
                        if (editDesignation) {
                            let itemRef = doc(firestore, "city", editDesignation)
                            await setDoc(itemRef, {
                                status: true,
                                ...values
                            })
                        } else {
                            await addDoc(q, {
                                ...values,
                                status: true,
                            })
                        }
                        setConfirming(false)
                        onReset()
                    }}
                    onFinishFailed={(error) => {
                        console.log({ error });
                    }}
                >
                    <Form.Item
                        name="city"
                        label="Name"
                        rules={[
                            {
                                required: true,
                                message: "Please Enter City Name",
                            },
                            { whitespace: true },
                            { min: 3 },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Type City Name" />
                    </Form.Item>
                    <Form.Item
                        name="country"
                        label="Country"
                        rules={[
                            {
                                required: true,
                                message: "Please Enter Country Name",
                            },
                            { whitespace: true },
                            { min: 3 },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Type Country Name" />
                    </Form.Item>
                    <Form.Item
                        name="flightAdv"
                        label="Flight Advance Booking"
                        rules={[
                            {
                                required: true,
                                message: "Please Enter Advance Days Booking",
                            },
                            { whitespace: true },
                            // { min: 3 },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Type Flight Advance Booking Days" type='number' min={0} />
                    </Form.Item>
                    <Form.Item name="flightClass" label="Cabin class" rules={[
                        {
                            required: true,
                            message: "Please Select Flight Class",
                        }
                    ]}
                        hasFeedback>
                        <Select mode="multiple" placeholder="Select Cabin Class">
                            <Select.Option value="economy">Economy</Select.Option>
                            <Select.Option value="first class">First Class</Select.Option>
                            <Select.Option value="business">Business</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="flightBudget"
                        label="Flight Budget"
                        rules={[
                            {
                                required: true,
                                message: "Please Enter Flight Budget",
                            },
                            { whitespace: true },
                            { min: 3 },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Type Flight Budget" type='number' />
                    </Form.Item>

                    <Form.Item
                        name="hotelAdv"
                        label="Hotel Advance Booking"
                        rules={[
                            {
                                required: true,
                                message: "Please Enter Advance Days Booking",
                            },
                            { whitespace: true },
                            // { min: 3 },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Type Hotel Advance Booking Days" min={0} type='number' />
                    </Form.Item>
                    <Form.Item name="hotelClass" label="Cabin class" rules={[
                        {
                            required: true,
                            message: "Please Select Hotel Class",
                        }
                    ]}
                        hasFeedback>
                        <Select mode="multiple" placeholder="Select Cabin Class">
                            <Select.Option value="one star">One Star</Select.Option>
                            <Select.Option value="two star">Two Star</Select.Option>
                            <Select.Option value="three star">Three Star</Select.Option>
                            <Select.Option value="four star">Four Star</Select.Option>
                            <Select.Option value="five star">Five Star</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="hotelBudget"
                        label="Hotel Budget"
                        rules={[
                            {
                                required: true,
                                message: "Please Enter Hotel Budget",
                            },
                            { whitespace: true },
                            { min: 3 },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Type Hotel Budget" type='number' />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Designation