import React, { useState } from 'react';
import { Card, Table, Typography, Tag, Switch, Tooltip, Modal, Form, Input, Button } from 'antd'
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
    const q = collection(firestore, "designation")
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
            title: 'Designation',
            dataIndex: 'designation',
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
                return <Tooltip title="Active/InActive Designation">

                    <Switch checked={record.status} loading={switchClick} onClick={async () => {
                        setSwitchClick(true)
                        let itemRef = doc(firestore, "designation", record.id)
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
                form.setFieldValue("designation", find.designation)
                console.log(form)
                handleDepartModal()
            }
        }
    }, [editDesignation])

    return (
        <>
            <Loader fullPage loading={loading} />
            <Card>
                <Title level={3}>List Of Designation</Title>
                <Table columns={columns}
                    dataSource={data}
                    rowKey={(record) => record.serial} />
            </Card>

            <Modal
                title={editDesignation ? "Edit Designation" : "Add Designation"}
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
                            let itemRef = doc(firestore, "designation", editDesignation)
                            await setDoc(itemRef, {
                                status: true,
                                designation: values.designation,
                            })
                        } else {
                            await addDoc(q, {
                                designation: values.designation,
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
                        name="designation"
                        label="Designation"
                        rules={[
                            {
                                required: true,
                                message: "Please Enter Designation",
                            },
                            { whitespace: true },
                            { min: 3 },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Type Designation" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Designation