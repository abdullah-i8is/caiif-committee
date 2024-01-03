import React, { useState, useRef } from 'react';
import { Card, Table, Typography, Tag, Switch, Tooltip, Modal, Form, Input, Button, Select, Space, notification } from 'antd'
import { firestore, auth } from '../../config/firebase';
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
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updatePassword } from 'firebase/auth';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { Loader } from 'react-overlay-loader';


const { Title } = Typography;




const Designation = ({ open, handleDepartModal }) => {

    const [confirming, setConfirming] = useState(false)
    const q = collection(firestore, "users")
    const [data, setData] = useState()
    const [editDesignation, setEditDesignation] = useState(null)
    const [designation, setDesignation] = useState(null)
    const [depart, setDepart] = useState(null)
    const [loading, setLoading] = useState(false)
    const [switchClick, setSwitchClick] = useState(false)
    const [showDepart, setShowDepart] = useState(false)
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        //   type="primary"
                        type="link"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                    >
                        Search
                    </Button>
                    <Button
                        type="link"
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const getDesignation = () => {
        const colRef1 = collection(firestore, "designation")
        onSnapshot(colRef1, (snapshot) => {
            const data = snapshot.docs.map((doc) => {
                return {
                    ...doc.data(),
                    id: doc.id,
                }
            })
            setDesignation(data)
        })
    }

    const getDepartment = () => {
        const colRef2 = collection(firestore, "department")
        onSnapshot(colRef2, (snapshot) => {
            const data = snapshot.docs.map((doc) => {
                return {
                    ...doc.data(),
                    id: doc.id,
                }
            })
            setDepart(data)
        })
    }

    React.useLayoutEffect(() => {
        getDepartment()
        getDesignation()
    }, [])

    const columns = [
        {
            title: 'Sr. No',
            dataIndex: 'serial',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Name',
            dataIndex: 'user',
            key: 'user',
            ...getColumnSearchProps('user'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            render: (text, record) => {
                console.log(record.role);
                return (
                    <Tag color={Number(record.role) === 0 ? 'magenta' : Number(record.role)  === 1 ? "orange" : Number(record.role)  === 2 ? "cyan" : "purple"}>
                        {Number(record.role)  === 0 ? "Admin" : Number(record.role)  === 1 ? "Managment" : Number(record.role)  === 2 ? "H.O.D" : "Travler"}
                    </Tag>
                )
            }
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
                return (
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        width: "100%",
                        alignContent: 'center',
                        alignItems: "center"

                    }}>
                        <Tooltip title="Active/InActive User">
                            <Switch checked={record.status} loading={switchClick} onClick={async () => {
                                setSwitchClick(true)
                                let itemRef = doc(firestore, "users", record.id)
                                // await 
                                await setDoc(itemRef, {
                                    ...record,
                                    status: !record.status,
                                })
                                setSwitchClick(false)
                            }} />
                        </Tooltip>
                        <Tooltip title="Active/InActive User">
                            <Button onClick={() => setEditDesignation(record.id)}>Edit</Button>
                        </Tooltip>
                        <Tooltip title="send Email">
                            <Button disabled={confirming} loading={confirming} onClick={async () => {
                                setConfirming(true)
                                await sendPasswordResetEmail(auth, record.email)
                                setConfirming(false)
                            }}>Reset Password</Button>
                        </Tooltip>
                    </div>)
            }
        }
    ];

    const [form] = Form.useForm();

    const onReset = () => {
        form.resetFields();
        handleDepartModal()
        setEditDesignation(null)
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

    console.log(form.getFieldValue('role'), "Role")

    return (
        <>
            <Loader fullPage loading={loading} />
            <Card>
                <Title level={3}>List Of Users</Title>
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
                    // handleDepartModal()
                }}
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
                            let itemRef = doc(firestore, "users", editDesignation)
                            let find = data.find(f => f.id === editDesignation)
                            await setDoc(itemRef, {
                                status: true,
                                ...find,
                                ...values
                            })
                            setConfirming(false)
                            onReset()
                            setEditDesignation(null)
                        } else {

                            await createUserWithEmailAndPassword(auth, values.email, values.password).then(async d => {
                                let uid = d.user.uid;
                                const colRef = collection(firestore, "employess")
                                // await sendEmailVerification(uid)
                                await addDoc(q, {
                                    email: values.email,
                                    user: values.user,
                                    role: values.role,
                                    status: true,
                                    uid: uid,
                                })
                                Number(values.role) !== 1 &&
                                    await addDoc(colRef, {
                                        firstname: values.user,
                                        email: values.email,
                                        status: true,
                                        designation: values.designation,
                                        department: values.department
                                    })
                                setConfirming(false)
                                onReset()
                            }).catch(e => {
                                console.table(e)
                                notification.error({
                                    message: "Error",
                                    description: e.message
                                })
                                setConfirming(false)

                            })
                            // await addDoc(q, {
                            //     ...values,
                            //     status: true,
                            // })
                        }

                    }}
                    onFinishFailed={(error) => {
                        console.log({ error });
                    }}
                >
                    <Form.Item
                        name="user"
                        label="Name"
                        rules={[
                            {
                                required: true,
                                message: "Please Enter User Name",
                            },
                            { whitespace: true },
                            { min: 3 },
                        ]}
                        hasFeedback
                    >
                        <Input placeholder="Type User Name" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"

                        rules={[
                            {
                                required: true,
                                message: "Please Enter Email Address",
                            },
                            { type: "email", message: "Please enter a valid email" },
                            // { min: 3 },
                        ]}
                        hasFeedback
                    >
                        <Input disabled={editDesignation} placeholder="Type your email" />
                    </Form.Item>
                    {editDesignation ? null : <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: editDesignation ? false : true,
                            },
                            { min: 8 },
                            {
                                validator: (_, value) =>

                                    value && /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/.test(value)
                                        ? Promise.resolve()
                                        : Promise.reject(`
                                        Should contain at least a capital letter,
                                        Should contain at least a small letter,
                                        Should contain at least a number,
                                        Should contain at least a special character,
                                        minimum 8 characters`)
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password placeholder="Type your password" />
                    </Form.Item>}

                    {editDesignation ? null : <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={["password"]}
                        rules={[
                            {
                                required: editDesignation ? false : true,
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        "The two passwords that you entered does not match."
                                    );
                                },
                            }),
                        ]}
                        hasFeedback
                    >
                        <Input.Password placeholder="Confirm your password" />
                    </Form.Item>}
                    <Form.Item name="role" label="Role" rules={[
                        {
                            required: true,
                            message: "Please Select User Role",
                        }
                    ]}
                        hasFeedback>
                        <Select placeholder="Select Cabin Class" onChange={e => {
                            console.log(e, "event")
                            setShowDepart(Number(e) !== 1)
                        }}>
                            <Select.Option value="0">Admin</Select.Option>
                            <Select.Option value="1">Managment</Select.Option>
                            <Select.Option value="2">H.O.D</Select.Option>
                            <Select.Option value="3">Travler</Select.Option>
                        </Select>
                    </Form.Item>
                    {showDepart &&
                        <Form.Item
                            label="Department"
                            name="department"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Fields are required!',
                                },
                            ]}>
                            <Select placeholder="Select Department">
                                {depart ? depart.filter(f => f.status).map((m) => {
                                    return <Select.Option value={m.id}>{m.department}</Select.Option>
                                }) : null}
                            </Select>
                        </Form.Item>

                    }
                    {showDepart &&
                        <Form.Item
                            label="Designation"
                            name="designation"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Fields are required!',
                                },

                            ]}>
                            <Select placeholder="Select Designation">
                                {designation ? designation.filter(f => f.status).map((m) => {
                                    return <Select.Option value={m.id}>{m.designation}</Select.Option>
                                }) : null}
                            </Select>
                        </Form.Item>

                    }

                </Form>
            </Modal>
        </>
    )
}
export default Designation