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
    const q = collection(firestore, "expensePolicy")
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
            title: 'Policy',
            dataIndex: 'policy',
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
                return <Tooltip title="Active/InActive Policy">

                    <Switch checked={record.status} loading={switchClick} onClick={async () => {
                        setSwitchClick(true)
                        let itemRef = doc(firestore, "expensePolicy", record.id)
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
                return <Tooltip title="Edit Policy">
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
            <Card>
                <Title level={3}>List Of Cities</Title>
                <Table columns={columns}
                    dataSource={data}
                    rowKey={(record) => record.serial} />
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
                            let itemRef = doc(firestore, "expensePolicy", editDesignation)
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
                        name="policy"
                        label="Name"
                        rules={[
                            {
                                required: true,
                                message: "Please Expense Name",
                            },
                            { whitespace: true },
                            { min: 3 },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Type Expense Name" />
                    </Form.Item>
                   
                </Form>
            </Modal>
        </>
    )
}

export default Designation