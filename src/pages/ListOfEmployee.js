import { CommentOutlined, PlusOutlined, UserAddOutlined, HeatMapOutlined, CarOutlined, ArrowRightOutlined, ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import {
    Typography,
    Tooltip,
    FloatButton,
    Select,
    Col,
    Row,
    DatePicker,
    Form,
    Button,
    Modal,
    Tag,
    Switch,
    Radio,
    Checkbox,
    notification,
    Input,
    Table
} from "antd";
import { addDoc, collection, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import { auth, firestore, } from "../config/firebase";
import { Loader } from 'react-overlay-loader';
import 'react-overlay-loader/styles.css';
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import dayjs from 'dayjs';
function AddEmployess() {

    const { Title, Text } = Typography;
    const [confirming, setConfirming] = useState(false)
    const [designation, setDesignation] = useState(null)
    const [depart, setDepart] = useState(null)
    const [unitNo, setUnitNO] = useState()
    const [status, setStatus] = useState(false)
    const [switchClick, setSwitchClick] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [selectionType, setSelectionType] = useState("");
    const [editEmployee, setEditEmployee] = useState(null)
    const [tripUsers, setTripUsers] = useState([])
    const [form] = Form.useForm();
    const [error, setError] = useState(true)
    const navigate = useNavigate()
    // const [api, contextHolder] = notification.useNotification();
    const [multiAirline, setMultiAirline] = useState([
        {
            airline: "",
            ff: ""
        }
    ])

    useEffect(() => {
        if (editEmployee) {
            let find = data.find(d => d.id === editEmployee)
            console.log("find", find);
            if (find) {
                form.setFieldsValue({
                    ...find,
                    dateofbirth: dayjs(find.dateofbirth),
                    // passportexpiry: dayjs(find.passportexpiry)
                })
                setMultiAirline(find?.airline ? find?.airline : null)
                setShowModal(true)
            }
        }
    }, [editEmployee])


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

    const getEmployess = () => {
        setLoading(true)
        const colRef2 = collection(firestore, "employess")
        onSnapshot(colRef2, (snapshot) => {
            const employess = snapshot.docs.map((doc) => {
                let data = doc.data()
                return {
                    ...doc.data(),
                    dateofbirth: data?.dateofbirth?.toDate(),
                    id: doc.id,
                }
            })
            setData(employess)
            setLoading(false)
        })
    }

    const getUnitNO = () => {
        const colRef = collection(firestore, "units")
        onSnapshot(colRef, (snapshot) => {
            const units = snapshot.docs.map((doc) => {
                return { ...doc.data(), id: doc.id }
            })
            setUnitNO(units)
        })
    }

    const handleOpenModal = () => {
        setShowModal(true)
        form.resetFields()
    };

    const onReset = () => {
        form.resetFields();
    };

    const handleOk = () => {
        console.log(form.getFieldsValue());
        form.submit()
        setShowModal(false)
    }

    const handleChange = (e, i, name) => {
        setMultiAirline((prev) => {
            return prev.map((f, ind) => {
                if (i === ind) {
                    return { ...f, [name]: e.target.value }
                } else {
                    return f
                }
            })
        })
    }

    function handleAddMoreAirlines() {
        setMultiAirline((prev) => {
            return [...prev, { airline: "", ff: "" }]
        })
    }

    function handleDeleteAirlines(i) {
        setMultiAirline((prev) => {
            return prev.filter((f, ind) => i !== ind)
        })
    }

    console.log("multiAirline", multiAirline);

    const handleAddEmployess = async (values) => {
        if (editEmployee !== null) {
            setConfirming(true)
            const docRef = doc(firestore, "employess", editEmployee)
            await updateDoc(docRef, {
                unitNo: values.unitNo,
                employeeId: values.employeeId,
                firstname: values.firstname,
                lastname: values.lastname,
                email: values.email,
                dateofbirth: new Date(values.dateofbirth),//new Date(values.dateofbirth).getTime(),
                designation: values.designation,
                department: values.department,
                emergencyname: values.emergencyname,
                emergencycontact: values.emergencycontact,
                whatsappcontact: values.whatsappcontact,
                passportcountry: values.passportcountry,
                passportnumber: values.passportnumber,
                passportexpiry: new Date(values.passportexpiry),
                description: values.description,
                airline: multiAirline
            }).then((res) => {
                // alert("Fine")
                // api.success({
                //     message: "Success",
                //     description: "Employee updated successfully",
                //     placement: "topRight",
                // });
            }).catch((err) => {
                alert("Error")
                setError(true)
                // api.error({
                //     message: err.message,
                //     description: "Employee updated error",
                //     placement: "topRight",
                // });
            })
            setEditEmployee(null)
            setConfirming(false)
            setShowModal(false)
        }
        else {
            setError(false)
            const colRef = collection(firestore, "employess")
            const users = collection(firestore, "users")
            setConfirming(true)
            await createUserWithEmailAndPassword(auth, values.email, "Abcd@123")
                .then(async (d) => {
                    console.log('values', values);
                    let uid = d.user.uid
                    await addDoc(users, {
                        email: values.email,
                        user: `${values.firstname} ${values.lastname}`,
                        role: '3',
                        status: true,
                        uid: uid,
                        department: values.department,
                    })
                    await addDoc(colRef, {
                        uid: uid,
                        unitNo: values.unitNo,
                        employeeId: values.employeeId,
                        firstname: values.firstname,
                        lastname: values.lastname,
                        email: values.email,
                        dateofbirth: new Date(values.dateofbirth),
                        designation: values.designation,
                        department: values.department,
                        emergencyname: values.emergencyname,
                        emergencycontact: values.emergencycontact,
                        whatsappcontact: values.whatsappcontact,
                        passportcountry: values.passportcountry,
                        passportnumber: values.passportnumber,
                        passportexpiry: new Date(values.passportexpiry),
                        description: values.description,
                        airline: multiAirline,
                        status: true,
                    }).then((res) => {
                        console.log(res);
                        setShowModal(false)
                    }).catch((err) => {
                        // alert("Error")
                        console.log(err);
                    })
                }).catch((err) => {
                    setError(true)
                    // api.error({
                    //     message: err.message,
                    //     description: "User already registerd please try another email!",
                    //     placement: "topRight",
                    // });
                })
            setEditEmployee(null)
            setConfirming(false)
            // 
        }

    }

    // const handleChangeStatus = async (e, record) => {
    //     await setDoc(doc(firestore, "employess", record.id), {
    //         ...record,
    //         status: e,
    //     })
    // }

    useEffect(() => {
        getUnitNO()
        getDepartment()
        getDesignation()
        getEmployess()
    }, [])

    // function handleAddTripUsers(e, record) {
    //     if (e.target.checked) {
    //         setTripUsers((prevUsers) => {
    //             return [...prevUsers, record]
    //         })
    //     } else {
    //         let unSelectUser = tripUsers.filter((user, index) => {
    //             return user.id !== record.id
    //         })
    //         setTripUsers(unSelectUser)
    //     }
    // }

    console.log(tripUsers);

    const columns = [
        {
            title: 'Unit NO',
            dataIndex: 'unitNo',
            key: 'unitNo',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                return record.firstname + " " + record.lastname
            }
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
            render: (text, record) => {
                let des = designation.find((d) => d.id == record.designation)
                console.log(des, "des find", record.designation)
                return des ? des?.designation : "N/A"
                // return "N/A"
            }
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            render: (text, record) => {
                let dep = depart.find((d, i) => d.id === record.department)
                return dep ? dep?.department : "N/A"
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                return (
                    <Tag color={text === false ? 'error' : "success"}>
                        {text ? "Active" : "In Active"}
                    </Tag>
                )
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => {
                console.log(record);
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
                                let itemRef = doc(firestore, "employess", record.id)
                                // await 
                                await setDoc(itemRef, {
                                    ...record,
                                    status: !record.status,
                                })
                                setSwitchClick(false)
                            }} />
                        </Tooltip>
                        <Tooltip title="Active/InActive User">
                            <Button onClick={() => setEditEmployee(record.id)}>Edit</Button>
                        </Tooltip>
                    </div>
                )
            }
        },
    ];

    return (
        <>
            {/* {contextHolder} */}
            <Loader fullPage loading={loading} />
            <Title level={3}>LIST OF EMPLOYEES</Title>
            <Table
                dataSource={data}
                columns={columns}
            />
            <Modal
                centered
                width="50%"
                title={editEmployee ? "EDIT EMPLOYEE" : "ADD EMPLOYEE"}
                onOk={handleOk}
                onCancel={() => {
                    setShowModal(false)
                    setEditEmployee(null)
                }}
                open={showModal}
                footer={editEmployee ? [
                    <>
                        <Button key="back" onClick={() => {
                            setEditEmployee(null)
                            onReset()
                            setShowModal(false)
                        }}>
                            Close
                        </Button>
                        <Button key="submit" type="primary" loading={confirming} onClick={handleOk}>
                            Submit
                        </Button>
                    </>
                ] : [
                    <>
                        <Button key="back" onClick={() => {
                            setEditEmployee(null)
                            onReset()
                            setShowModal(false)
                        }}>
                            Close
                        </Button>
                        <Button key="back" onClick={onReset}>
                            Reset
                        </Button>
                        <Button key="submit" type="primary" loading={confirming} onClick={handleOk}>
                            Submit
                        </Button>
                    </>
                ]}
            >
                <Form
                    onReset={onReset}
                    form={form}
                    layout="vertical"
                    onFinish={(values) => handleAddEmployess(values)}>
                    <Row gutter={[24, 0]}>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Form.Item
                                label="Unit NO"
                                name="unitNo"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Fields are required!',
                                    },

                                ]}>
                                <Select placeholder="Select Unit NO">
                                    {unitNo ? unitNo.filter(f => f.status).map((m) => {
                                        return <Select.Option value={m.id}>{m.unitNo}</Select.Option>
                                    }) : null}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Form.Item
                                label="Employee Id"
                                name="employeeId"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Fields are required!',
                                    },
                                ]}>
                                <Input value="" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Form.Item
                                label="First name"
                                name="firstname"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Fields are required!',
                                    },
                                ]}>
                                <Input value="" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Form.Item
                                label="Last name"
                                name="lastname"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Fields are required!',
                                    },
                                ]}>
                                <Input value="" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Form.Item
                                label="Email"
                                name="email"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Fields are required!',
                                    },
                                    { type: "email", message: "please enter valid email" }
                                ]}>
                                <Input value="" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Form.Item
                                label="Date of birth"
                                name="dateofbirth"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Fields are required!',
                                    },
                                ]}>
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
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
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
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
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Form.Item
                                label="Passport Country"
                                name="passportcountry"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Fields are required!',
                                    },
                                ]}>
                                <Input value="" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Form.Item
                                label="Passport Number"
                                name="passportnumber"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Fields are required!',
                                    },
                                ]}>
                                <Input value="" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Form.Item
                                label="Passport Expiry"
                                name="passportexpiry"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Fields are required!',
                                    },
                                ]}>
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Form.Item
                                label="Emergency name"
                                name="emergencyname"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Fields are required!',
                                    },
                                ]}>
                                <Input value="" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Form.Item
                                label="Whatsapp Contact"
                                name="whatsappcontact"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Fields are required!',
                                    },
                                    // { type: "number", message: "please enter valid phone number" }
                                ]}>
                                <Input value="" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Form.Item
                                label="Emergency Contact"
                                name="emergencycontact"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Fields are required!',
                                    },
                                    // { type: "number", message: "please enter valid phone number" }
                                ]}>
                                <Input value="" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <Form.Item
                                label="Description"
                                name="description"
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Fields are required!',
                                    },
                                    // { type: "number", message: "please enter valid phone number" }
                                ]}>
                                <Input value="" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button onClick={handleAddMoreAirlines} type="default" style={{ width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                                <PlusOutlined style={{ fontSize: 20 }} />
                            </Button>
                        </Col>
                        {multiAirline ? multiAirline?.map((v, i) => {
                            return (
                                <>
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                        <Form.Item
                                            label="Airline"
                                            hasFeedback>
                                            <Input value={v.airline} onChange={(e) => handleChange(e, i, "airline")} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                        <Form.Item
                                            label="FF"
                                            hasFeedback>
                                            <Input value={v.ff} onChange={(e) => handleChange(e, i, "ff")} />
                                        </Form.Item>
                                    </Col>
                                    {multiAirline.length > 1 ? <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <Button onClick={() => handleDeleteAirlines(i)} type="danger" style={{ width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                                            <DeleteOutlined style={{ fontSize: 20 }} />
                                        </Button>
                                    </Col> : null}
                                </>
                            )
                        }) : ""}
                    </Row>
                </Form>
            </Modal>

            <FloatButton
                shape="circle"
                // trigger="hover"
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleOpenModal}
            >
            </FloatButton>

        </>
    );
}

export default AddEmployess;