
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
import { firestore } from '../../config/firebase';
import React, { useState } from 'react';
import { Card, Table, Typography, Tag, Switch, Tooltip, Modal, Form, Input, Button } from 'antd'
import { Loader } from 'react-overlay-loader';

const { Title } = Typography;

const Department = ({ open, handleDepartModal }) => {

    const q = collection(firestore, "department")
    const [confirming, setConfirming] = useState(false)
    const [editDepart, setEditDepart] = useState(null)
    const [loading, setLoading] = useState(false)
    const [switchClick, setSwitchClick] = useState(false)

    const columns = [
        {
            title: 'Sr. No',
            dataIndex: 'serial',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Name',
            dataIndex: 'department',
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
                return <Tooltip title="Active/InActive Departmant">
                    <Switch checked={record.status} loading={switchClick} onClick={async () => {
                        setSwitchClick(true)
                        let itemRef = doc(firestore, "department", record.id)
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
                    <Button onClick={() => setEditDepart(record.id)}>Edit</Button>
                </Tooltip>
            }
        }
    ];

    const [data, setData] = useState()

    const [form] = Form.useForm();

    const onReset = () => {
        form.resetFields();
        handleDepartModal()
    };

    const handleOk = () => form.submit()

    React.useEffect(() => {
        if (editDepart) {
            let find = data.find(d => d.id === editDepart)
            if (find) {
                form.setFieldValue("department", find.department)
                console.log(form)
                handleDepartModal()
            }
        }
    }, [editDepart])

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

    console.log(data);

    return (
        <>
            <Loader fullPage loading={loading} />
            <Card>
                <Title level={3}>List Of Departments</Title>
                <Table columns={columns}
                    dataSource={data}
                    loading={loading}
                    rowKey={(record) => record.serial} />
            </Card>

            <Modal
                title={editDepart ? "Edit Department" : "Add Department"}
                open={open}
                onOk={handleOk}
                confirmLoading={confirming}
                onCancel={() => {
                    // setEditDesignation(null)
                    setEditDepart(null)
                    onReset()
                }
                }
                footer={editDepart ? [
                    <Button key="back" onClick={() => {
                        setEditDepart(null)
                        onReset()
                        // handleDepartModal()
                    }}>
                        Close
                    </Button>,
                    <Button key="submit" type="primary" loading={confirming} onClick={handleOk}>
                        Submit
                    </Button>,
                ] : [
                    <Button key="back" onClick={() => {
                        setEditDepart(null)
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
                        // console.log({ values });
                        // setTimeout(() => { setConfirming(false) }, 3000)
                        if (editDepart) {
                            let itemRef = doc(firestore, "department", editDepart)
                            await setDoc(itemRef, {
                                status: true,
                                department: values.department,
                            })
                        } else {
                            await addDoc(q, {
                                department: values.department,
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
                        name="department"
                        label="Department"
                        rules={[
                            {
                                required: true,
                                message: "Please Enter Department",
                            },
                            { whitespace: true },
                            { min: 3 },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Type Department" />
                    </Form.Item>
                </Form>

            </Modal>
        </>
    )
}

export default Department