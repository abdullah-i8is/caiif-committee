
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
import React, { useEffect, useState } from 'react';
import { Card, Table, Typography, Tag, Switch, Tooltip, Modal, Form, Input, Button } from 'antd'
import { Loader } from 'react-overlay-loader';
import { update } from 'firebase/database';

const { Title } = Typography;

const UnitNo = ({ open, handleDepartModal }) => {

    const [confirming, setConfirming] = useState(false)
    const [editDepart, setEditDepart] = useState(null)
    const [loading, setLoading] = useState(false)
    const [switchClick, setSwitchClick] = useState(false)
    const colRef = collection(firestore, "units")

    const columns = [
        {
            title: 'Sr. No',
            dataIndex: 'serial',
            render: (text, record, index) => {
                return index + 1
            },
        },
        {
            title: 'Unit No',
            dataIndex: 'unitNo',
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
                        let itemRef = doc(firestore, "units", record.id)
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
                return <Tooltip title="Active/InActive Unit">
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
                form.setFieldValue("unitNo", find.unitNo)
                console.log(form)
                handleDepartModal()
            }
        }
    }, [editDepart])

    useEffect(() => {
        onSnapshot(colRef, (snapshot) => {
            const res = snapshot.docs.map((doc) => {
                return {
                    ...doc.data(),
                    id: doc.id,
                }
            })
            setData(res)
        });
    }, [])

    console.log(data);

    return (
        <>
            <Loader fullPage loading={loading} />
            <Card>
                <Title level={3}>List Of Unit No</Title>
                <Table columns={columns} dataSource={data} loading={loading} rowKey={(record) => record.serial} />
            </Card>
            <Modal
                title={editDepart ? "Edit Unit No" : "Add Unit No"}
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
                            let itemRef = doc(firestore, "units", editDepart)
                            await setDoc(itemRef, {
                                ...values,
                                unitNo: values.unitNo,
                                status: true,
                            })
                        } else {
                            await addDoc(colRef, {
                                unitNo: values.unitNo,
                                status: true,
                            }).then((res) => {
                                updateDoc(doc(firestore, "units", res.id), {
                                    ...values,
                                    id: res.id
                                })
                            })
                        }
                        setConfirming(false)
                        onReset()
                    }}
                    onFinishFailed={(error) => {
                        console.log({ error });
                    }}>
                    <Form.Item
                        name="unitNo"
                        label="Unit No"
                        rules={[
                            {
                                required: true,
                                message: "Please Enter Unit No",
                            },
                        ]}
                        hasFeedback>
                        <Input placeholder="Type Unit No" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default UnitNo