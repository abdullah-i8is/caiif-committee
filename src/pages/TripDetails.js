import {
    Col,
    Row,
    Typography,
    Button,
    Steps,
    DatePicker,
    Form,
    Select,
    Input,
    Card,
    notification,
    Modal,
    TimePicker,
} from "antd";
import { addDoc, collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CardComp from "../components/cards/cards";
import Summary from "../components/summary/summary";
import { firestore } from "../config/firebase";
import { LoadingOverlay, Loader } from 'react-overlay-loader';
import { useSelector } from "react-redux"
import { CloseCircleOutlined, RetweetOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';

function TripDetail() {

    const { Title, Text } = Typography;
    const [currentUser, setCurrentUser] = useState()
    const [current, setCurrent] = useState(0);
    const [amount, setAmount] = useState("")
    const [currency, setCurrency] = useState("")
    const [cities, setCities] = useState([])
    const loginUser = useSelector((state) => state.auth.user)
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)
    const location = useLocation()
    const [form] = Form.useForm();
    const [designation, setDesignation] = useState(null)
    const [depart, setDepart] = useState(null)
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState()
    const [api, contextHolder] = notification.useNotification();
    const [tripDetails, setTripDetails] = useState([
        {
            flyingTo: { cityName: "", id: "" },
            flyingFrom: { cityName: "", id: "" },
            departure: null,
            arrival: null,
            tripDetails: [
                {
                    purpose: "client",
                    name: "",
                    comment: "",
                    purposeDate: null,
                    purposeTime: null
                },
            ],
            hotelArrival: null,
            hotelDeparture: null,
            rooms: 2,
            guests: {
                guestsPerRoom: null,
                guestsDetails: null
            },
            remarks: "",
            luggage: 0,
            isVisaRequired: null
        },
    ])

    function disabledDate(current, index, name) {
        // Disable dates before today
        // console.log(current,"Disable",dayjs().startOf('day'),current,current < dayjs().startOf('day'))
        if (name === "departure") {
            if (index > 0) {
                return current && current < dayjs(tripDetails[index - 1].arrival).startOf('day');
            } else {
                return current && current < dayjs().startOf('day');
            }
        } else if (name === "arrival") {
            return current && current < dayjs(tripDetails[index].departure).startOf('day');
        }
    }

    const steps = [
        {
            title: 'First',
            content: 'First-content',
        },
        {
            title: 'Second',
            content: 'Second-content',
        },
        {
            title: 'Last',
            content: 'Last-content',
        },
    ];

    const next = () => {
        setLoading(true)
        if (current === 0) {
            let check = false
            tripDetails.map((val, ind) => {
                Object.entries(val).map(([k, v]) => {
                    if (k !== "guests" && k !== "rooms" && k !== "remarks" && k !== "isVisaRequired" && k !== "hotelArrival" && k !== "hotelDeparture") {
                        if (typeof v === "object" && v !== null) {
                            Object.values(v).map(a => {
                                if (k === "tripDetails") {
                                    v.map((val) => {
                                        if (val.purposeDate === null || val.purposeTime === null || val.name === "") {
                                            check = true
                                            api.error({
                                                message: `${k} is required`,
                                                description: "Please fill this field"
                                            })
                                        }
                                    })
                                }
                                else if (a === "" || a === null) {
                                    check = true
                                    api.error({
                                        message: `${k} is required`,
                                        description: "Please fill this field"
                                    })
                                }
                            })
                        }
                        else if (v === "" || v === null) {
                            check = true
                            api.error({
                                message: `${k} is required`,
                                description: "Please fill this field"
                            })
                        }
                    }
                })
            })
            if (check) {
                setLoading(false)
                api.error({
                    message: "Error"
                })
            }
            else {
                setLoading(true)
                setTimeout(() => {
                    setLoading(false)
                    setCurrent(current + 1);
                }, 1000)
            }
        }
        else if (current === 1) {
            let check = false
            // tripDetails.map((val, ind) => {
            //     Object.entries(val).map(([k, v]) => {
            //         if (k !== "arrival" && k !== "departure" && k !== "flyingFrom" && k !== "flyingTo" && k !== "tripDetails" && k !== "isVisaRequired") {
            //             if (typeof v === "object" && v !== null) {
            //                 Object.values(v).map(a => {
            //                     if (a === "" || a === null) {
            //                         check = true
            //                         api.error({
            //                             message: `${k} is required`,
            //                             description: "Please fill this field"
            //                         })
            //                     }
            //                 })
            //             }
            //             else if (v === "" || v === null) {
            //                 check = true
            //                 api.error({
            //                     message: `${k} is required`,
            //                     description: "Please fill this field"
            //                 })
            //             }
            //         }
            //     })
            // })
            if (check) {
                setLoading(false)
                api.error({
                    message: "Error"
                })
            }
            else {
                setLoading(true)
                setTimeout(() => {
                    setLoading(false)
                    setCurrent(current + 1);
                }, 1000)
            }
        }
    };

    const prev = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setCurrent(current - 1);
        }, 1000)
    };

    const handleChange = (args) => {
        const { e, index, name, indd } = args
        console.log(args);
        if (name === "flyingTo" || name === "flyingFrom") {
            setTripDetails((prevDetails) => {
                return prevDetails.map((v, i) => {
                    if (index === i) {
                        return {
                            ...v,
                            [name]: { id: e, cityName: cities.find(f => e === f.id).city },
                        }
                    }
                    else {
                        return v
                    }
                })
            })
        }
        else if (name === "purpose" || name === "purposeDate" || name === "purposeTime") {
            setTripDetails((prevDetails) => {
                return prevDetails.map((v, i) => {
                    if (index === i) {
                        return {
                            ...v,
                            tripDetails: v.tripDetails.map((val, ind) => {
                                if (indd === ind) {
                                    if (name === "purposeDate") {
                                        console.log(e);
                                        return {
                                            ...val,
                                            [name]: e !== null && dayjs(e),
                                            purposeDate: e !== null && dayjs(e),
                                        }
                                    }
                                    else if (name === "purposeTime") {
                                        console.log(e);
                                        return {
                                            ...val,
                                            [name]: e !== null && dayjs(e),
                                            // purposeTime: new Date(e).toLocaleTimeString(),
                                        }
                                    }
                                    else {
                                        return {
                                            ...val,
                                            [name]: e,
                                        }
                                    }
                                }
                                else {
                                    return val
                                }
                            })
                        }
                    }
                    else {
                        return v
                    }
                })
            })
        }
        else {
            setTripDetails((prevDetails) => {
                return prevDetails.map((value, ind) => {
                    if (index === ind) {
                        if (e?.target?.value) {
                            if (name === "remarks") {
                                return {
                                    ...value,
                                    [name]: e.target.value
                                }
                            }
                            else if (name === "luggage") {
                                return {
                                    ...value,
                                    [name]: e.target.value
                                }
                            }
                            else {
                                return {
                                    ...value,
                                    tripDetails: value.tripDetails.map((v, inddd) => {
                                        if (indd === inddd) {
                                            return {
                                                ...v,
                                                [name]: e.target.value
                                            }
                                        }
                                        else {
                                            return v
                                        }
                                    })
                                }
                            }
                        }
                        else {
                            if (name === "departure") {
                                console.log(e);
                                return {
                                    ...value,
                                    [name]: e !== null && dayjs(e),
                                    hotelDeparture: e !== null && dayjs(e),
                                }
                            }
                            else if (name === "arrival") {
                                console.log(e);
                                return {
                                    ...value,
                                    [name]: e !== null && dayjs(e),
                                    hotelArrival: e !== null && dayjs(e),
                                }
                            }
                            else {
                                return {
                                    ...value,
                                    [name]: e
                                }
                            }
                        }
                    }
                    else {
                        return value
                    }
                })
            })
        }
    }

    const addMoreTrips = () => {
        setTripDetails((prevTrips) => {
            return [
                ...prevTrips,
                {
                    flyingTo: { cityName: "", id: "" },
                    flyingFrom: { cityName: "", id: "" },
                    departure: prevTrips[prevTrips.length - 1].arrival,
                    arrival: prevTrips[prevTrips.length - 1].arrival,
                    tripDetails: [
                        {
                            purpose: "client",
                            name: "",
                            comment: "",
                            purposeDate: "",
                            purposeTime: "",
                        }
                    ],
                    hotelArrival: prevTrips[prevTrips.length - 1].arrival,
                    hotelDeparture: prevTrips[prevTrips.length - 1].arrival,
                    rooms: 0,
                    guests: {
                        guestsPerRoom: location.state.length,
                        guestsDetails: location.state
                    },
                    remarks: "",
                    isVisaRequired: null
                }]
        })
    }

    const addMoreDetail = (index) => {
        setTripDetails((prevTrips) => {
            return prevTrips.map((val, ind) => {
                if (index === ind) {
                    return {
                        ...val,
                        tripDetails: [
                            ...val.tripDetails,
                            {

                                purpose: "client",
                                name: "",
                                comment: "",
                                purposeDate: "",
                                purposeTime: ""
                            }
                        ]
                    }
                }
                else {
                    return val
                }
            })
        })
    }

    useEffect(() => {
        const colRef = collection(firestore, "city")
        onSnapshot(colRef, (snapshot) => {
            let cities = snapshot.docs.map((doc) => {
                return {
                    ...doc.data(),
                    id: doc.id,
                }
            })
            setCities(cities)
        })
    }, [])

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

    useLayoutEffect(() => {
        getDepartment()
        getDesignation()
    }, [])

    function handleSubmitTrip() {
        // console.log({
        //     tripDetails: tripDetails.map(t => {
        //         return {
        //             ...t,
        //             arrival: new Date(t.arrival),
        //             departure: new Date(t.departure),
        //             hotelArrival: new Date(t.hotelArrival),
        //             hotelDeparture: new Date(t.hotelDeparture),
        //             tripDetails: t.tripDetails.map((f) => {
        //                 return { ...f, purposeDate: new Date(f.purposeDate), purposeTime: new Date(f.purposeTime) }
        //             })
        //         }
        //     }),
        //     guest: tripDetails[0].guests.guestsDetails.map(g => g.email),
        //     tripDepartMent: loginUser.department,
        //     createdBy: loginUser.id,
        //     createdAt: new Date(),
        //     tripNo: "Trip - " + Date.now(),
        //     tripStatus: 0,
        //     amount: amount,
        //     currency: currency
        // })
        setModalOpen(false)
        setLoading(true)
        const colRef = collection(firestore, "trips")
        addDoc(colRef, {
            tripDetails: tripDetails.map(t => {
                return {
                    ...t,
                    arrival: new Date(t.arrival),
                    departure: new Date(t.departure),
                    hotelArrival: new Date(t.hotelArrival),
                    hotelDeparture: new Date(t.hotelDeparture),
                    tripDetails: t.tripDetails.map((f) => {
                        return { ...f, purposeDate: new Date(f.purposeDate), purposeTime: new Date(f.purposeTime) }
                    })
                }
            }),
            // guest: tripDetails[0].guests.guestsDetails.map(g => g.email),
            tripDepartment: loginUser.department,
            createdBy: loginUser.id,
            createdAt: new Date(),
            tripNo: "Trip - " + Date.now(),
            tripStatus: 0,
            amount: amount,
            currency: currency,
            passengerDetails: location?.state?.tripUsers ? location?.state?.tripUsers : location?.state?.loginUser ? currentUser : null
        })
            .then((res) => {
                setLoading(false)
                api.success({
                    message: `Success`,
                    description: "Trip added successfully",
                    placement: "topRight",
                });
                navigate("/")
                console.log(res);
            })
            .catch((err) => {
                setLoading(false)
                api.error({
                    message: `Error`,
                    description: "Error",
                    placement: "topRight",
                });
                console.log(err);
            })
    }

    console.log("TRIP DETAILS", tripDetails);
    console.log(currency, amount);

    const getEmployess = () => {
        if (location?.state?.loginUser) {
            const colRef = collection(firestore, "employess")
            const q = query(colRef, where("email", "==", location?.state?.loginUser?.email))
            onSnapshot(q, (snapshot) => {
                return snapshot.docs.map((doc) => {
                    setCurrentUser({ ...doc.data(), docID: doc.id })
                    setTripDetails((prevDetails) => {
                        return prevDetails.map((f) => {
                            return {
                                ...f,
                                guests: { guestsDetails: doc.data(), guestsPerRoom: 1 },
                            }
                        })
                    })
                })
            })
        }
        else if (location?.state?.tripUsers) {
            setTripDetails((prevDetails) => {
                return prevDetails.map((f) => {
                    return {
                        ...f,
                        guests: { guestsDetails: location?.state?.tripUsers, guestsPerRoom: location?.state?.tripUsers?.length },
                    }
                })
            })
        }
        else {
            return null
        }
    }

    useEffect(() => {
        getEmployess()
    }, [location?.state?.loginUser, location?.state?.tripUsers])

    console.log(user);

    console.log(location.state);

    return (
        <>
            {contextHolder}
            <Loader fullPage loading={loading} />
            <Title level={3}>TRIP DETAILS</Title>
            <CardComp>
                <Steps current={current} style={{ margin: "0 0 40px 0" }}>
                    <Steps.Step title="Flight Details" />
                    <Steps.Step title="Hotel Details" />
                    <Steps.Step title="Trip Summary" />
                </Steps>
                {current === 0 ? (
                    <Form
                        form={form}
                        layout="vertical"
                    >
                        {tripDetails.map((val, index) => {
                            return (
                                <>
                                    <Card style={{ marginBottom: "20px" }}>
                                        {tripDetails.length > 1 &&
                                            <Button
                                                danger
                                                onClick={() => setTripDetails(tripDetails.filter((v, i) => i !== index))}
                                            >
                                                Remove
                                            </Button>
                                        }
                                        <Row gutter={[24, 0]}>
                                            <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                                                <Form.Item label="Flying To">
                                                    <Select placeholder="Select City" onChange={(e) => handleChange({ e: e, index: index, name: "flyingTo" })}>
                                                        {cities ? cities.filter((d, i) => d.status).map((city, index) => {
                                                            return <Select.Option value={city.id}>{city.city}</Select.Option>
                                                        }) : null}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                                                <Form.Item label="Flying From">
                                                    <Select placeholder="Select City" onChange={(e) => handleChange({ e: e, index: index, name: "flyingFrom" })}>
                                                        {cities ? cities.filter((d, i) => d.status).map((city, index) => {
                                                            return <Select.Option value={city.id}>{city.city}</Select.Option>
                                                        }) : null}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                                                <Form.Item label="Departure">
                                                    <DatePicker value={val.departure} disabledDate={(date) => disabledDate(date, index, "departure")} onChange={(value, dateString) => dateString !== null && handleChange({ e: dateString, index: index, name: "departure" })} style={{ width: "100%" }} />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={4} lg={4} xl={4}>
                                                <Form.Item label="Arrival">
                                                    <DatePicker value={val.arrival} disabledDate={(date) => disabledDate(date, index, "arrival")} onChange={(value, dateString) => dateString !== null && handleChange({ e: dateString, index: index, name: "arrival" })} style={{ width: "100%" }} />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                                <Form.Item label="Luggage">
                                                    <Input value={val.luggage} name="Luggage" onChange={(e) => handleChange({ e: e, index: index, name: "luggage" })} />
                                                </Form.Item>
                                            </Col>
                                            {val?.tripDetails?.map((v, indd) => {
                                                return (
                                                    <>
                                                        <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ textAlign: "end" }}>
                                                            {val.tripDetails.length > 1 &&
                                                                <Button
                                                                    danger
                                                                    onClick={() => setTripDetails((prev) => {
                                                                        return prev.map((p, pi) => {
                                                                            if (pi === index) {
                                                                                return {
                                                                                    ...p,
                                                                                    tripDetails: p.tripDetails.filter((f, fi) => fi !== indd)
                                                                                }
                                                                            } else {
                                                                                return p
                                                                            }
                                                                        })
                                                                    })}
                                                                >
                                                                    Remove
                                                                </Button>
                                                            }
                                                        </Col>
                                                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                                            <Form.Item label="Trip Purpose">
                                                                <Select placeholder="Trip Purpose" value={v.purpose} onChange={(e) => handleChange({ e: e, index: index, name: "purpose", indd: indd })}>
                                                                    <Select.Option value="exhibition">Exhibition</Select.Option>
                                                                    <Select.Option value="client">Client</Select.Option>
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                                            <Form.Item label="Purpose Date">
                                                                <DatePicker value={v.purposeDate} disabledDate={(date) => disabledDate(date, indd, "purposeDate")} onChange={(value, dateString) => handleChange({ e: dateString, index: index, name: "purposeDate", indd: indd })} style={{ width: "100%" }} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                                            <Form.Item label="Purpose Time">
                                                                <TimePicker style={{ width: "100%" }} value={v.purposeTime} onChange={(value) => handleChange({ e: value, index: index, name: "purposeTime", indd: indd })} />
                                                                {/* <DatePicker value={v.purposeTime} disabledDate={(date) => disabledDate(date, indd, "purposeTime")} onChange={(value, dateString) => handleChange({ e: dateString, index: index, name: "purposeTime", indd: indd })} style={{ width: "100%" }} /> */}
                                                            </Form.Item>
                                                        </Col>

                                                        {v?.purpose === "client" ? (
                                                            <>
                                                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                                    <Form.Item label="Name" hasFeedback>
                                                                        <Input value={v.name} name="name" onChange={(e) => handleChange({ e: e, index: index, name: "name", indd: indd })} />
                                                                    </Form.Item>
                                                                </Col>
                                                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                                    <Form.Item label="Comment" hasFeedback>
                                                                        <Input value={v.comment} name="comment" type="textarea" onChange={(e) => handleChange({ e: e, index: index, name: "comment", indd: indd })} />
                                                                    </Form.Item>
                                                                </Col>
                                                            </>
                                                        ) : ""}
                                                        {v?.purpose === "exhibition" ? (
                                                            <>
                                                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                                    <Form.Item label="Name" hasFeedback>
                                                                        <Input value={v.name} name="name" onChange={(e) => handleChange({ e: e, index: index, name: "name", indd: indd })} />
                                                                    </Form.Item>
                                                                </Col>
                                                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                                    <Form.Item label="Comment" hasFeedback>
                                                                        <Input value={v.comment} name="comment" type="textarea" onChange={(e) => handleChange({ e: e, index: index, name: "comment", indd: indd })} />
                                                                    </Form.Item>
                                                                </Col>
                                                            </>
                                                        ) : ""}
                                                    </>
                                                )
                                            })}
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                                                <Button onClick={() => addMoreDetail(index)} type="default">Add More Detail</Button>
                                            </Col>
                                        </Row>
                                    </Card>
                                </>
                            )
                        })}
                    </Form>
                ) : current === 1 ? (
                    tripDetails.map((val, index) => {
                        return (
                            <Form
                                form={form}
                                layout="vertical"
                            >
                                <Row gutter={[24, 0]}>
                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                        <Form.Item
                                            label={`Hotel Check Inn ${val?.flyingFrom?.cityName}`}
                                        >
                                            <DatePicker value={val.hotelDeparture} disabledDate={(date) => disabledDate(date, index, "departure")} onChange={(value, dateString) => handleChange({ e: dateString, index: index, name: "hotelDeparture" })} style={{ width: "100%" }} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                        <Form.Item
                                            label={`Hotel Check Out ${val?.flyingTo?.cityName}`}
                                        >
                                            <DatePicker value={val.hotelArrival} disabledDate={(date) => disabledDate(date, index, "arrival")} onChange={(value, dateString) => handleChange({ e: dateString, index: index, name: "hotelArrival" })} style={{ width: "100%" }} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                        <Form.Item label="Guest Per Room">
                                            <Input value={val.guests.guestsPerRoom} style={{ height: 32 }} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                        <Form.Item label="Rooms">
                                            <Input value={val.rooms} style={{ height: 32 }} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                        <Form.Item label="Remarks">
                                            <Input value={val.remarks} onChange={(e) => handleChange({ e: e, index: index, name: "remarks" })} style={{ height: 32 }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        )
                    })
                ) : current === 2 ? (
                    <>
                        {tripDetails.map((guest) => {
                            return (
                                <>
                                    <Title level={2}>TRIP SUMMARY</Title>
                                    <Card>
                                        <Title level={4} style={{ marginBottom: 30 }}>No Of Guests {location.state.length}</Title>
                                        <Row gutter={[24, 0]}>
                                            <Col xs={24} sm={24} md={6} lg={6} xl={6} className="mb-24">
                                                {location?.state?.tripUsers ? guest?.guests?.guestsDetails?.map((guest) => {
                                                    return (
                                                        <div style={{ display: "flex", flexDirection: "column", justifyItems: "space-around" }}>
                                                            <Title level={5}>Name:</Title>{guest.firstname + " " + guest.lastname}
                                                            <Title level={5}>Email:</Title>{guest.email}
                                                            {designation ? designation.filter(f => f.id === guest.designation).map((m) => {
                                                                return <> <Title level={5}>Designation:</Title>{m.designation}</>
                                                            }) : null}
                                                        </div>
                                                    )
                                                }) : location?.state?.loginUser ? (
                                                    <div style={{ display: "flex", flexDirection: "column", justifyItems: "space-around" }}>
                                                        <Title level={5}>Name:</Title>{guest?.guests?.guestsDetails?.firstname + " " + guest?.guests?.guestsDetails?.lastname}
                                                        <Title level={5}>Email:</Title>{guest?.guests?.guestsDetails?.email}
                                                        {designation ? designation.filter(f => f.id === guest?.guests?.guestsDetails?.designation).map((m) => {
                                                            return <> <Title level={5}>Designation:</Title>{m.designation}</>
                                                        }) : null}
                                                    </div>
                                                ) : null}
                                            </Col>
                                        </Row>
                                    </Card>
                                </>
                            )
                        })}
                        {tripDetails.map((tripSummary) => {
                            return (
                                <Summary>
                                    <Col xs={24} sm={24} md={4} lg={4} xl={4} className="mb-24"><Title level={5}>Flying To:</Title> {tripSummary?.flyingTo?.cityName}</Col>
                                    <Col xs={24} sm={24} md={4} lg={4} xl={4} className="mb-24"><Title level={5}>Flying From:</Title> {tripSummary?.flyingFrom?.cityName}</Col>
                                    <Col xs={24} sm={24} md={4} lg={4} xl={4} className="mb-24"><Title level={5}>Departure: </Title>{dayjs(tripSummary?.departure).format('YYYY-MM-DD')}</Col>
                                    <Col xs={24} sm={24} md={4} lg={4} xl={4} className="mb-24"><Title level={5}>Arrival: </Title>{dayjs(tripSummary?.arrival).format('YYYY-MM-DD')}</Col>
                                    <Col xs={24} sm={24} md={4} lg={4} xl={4} className="mb-24"><Title level={5}>Hotel Check Inn:</Title> {dayjs(tripSummary?.hotelArrival).format('YYYY-MM-DD')}</Col>
                                    <Col xs={24} sm={24} md={4} lg={4} xl={4} className="mb-24"><Title level={5}>Hotel Check Out:</Title> {dayjs(tripSummary?.hotelDeparture).format('YYYY-MM-DD')}</Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                                        <Title level={5}>
                                            Trip Purpose
                                        </Title>
                                    </Col>
                                    {tripSummary.tripDetails.map(({ purpose, name, comment }) => {
                                        return (
                                            <>
                                                <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mb-24">
                                                    <Title level={5}>Purpose:</Title>{purpose}
                                                </Col>
                                                <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mb-24">
                                                    <Title level={5}>Name:</Title>{name}
                                                </Col>
                                                <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mb-24">
                                                    <Title level={5}>Comment</Title>{comment}
                                                </Col>
                                            </>
                                        )
                                    })}
                                </Summary>
                            )
                        })}
                    </>
                ) : ""}

                <div style={{ textAlign: "end" }}>
                    {current === 0 && (
                        <Button
                            style={{ margin: "0 10px 0 0" }}
                            type="default"
                            onClick={addMoreTrips}
                        >
                            Add More Trips
                        </Button>
                    )}
                    {current > 0 && (
                        <Button
                            style={{
                                margin: '0 8px',
                            }}
                            onClick={() => prev()}
                        >
                            Previous
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button
                            type="primary"
                            onClick={next}>
                            Next
                        </Button>
                    )}


                    {current === 2 && (
                        <>
                            <Modal
                                centered
                                title="Are you sure want to submit trip ?"
                                open={modalOpen}
                                onOk={handleSubmitTrip}
                                onCancel={() => setModalOpen(false)}
                                footer={
                                    <>
                                        <Button key="back" onClick={() => {
                                            setModalOpen(false)
                                        }}>
                                            Close
                                        </Button>,
                                        <Button disabled={!amount || !currency} key="submit" type="primary" onClick={handleSubmitTrip}>
                                            Submit
                                        </Button>,
                                    </>
                                }
                            >
                                <Row gutter={[24, 0]}>
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                        <Input type="number" value={amount} placeholder="Enter amount" onChange={(e) => setAmount(e.target.value)} />
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                        <Select style={{ width: "100%" }} value={currency} placeholder="Select Currency" onChange={(e) => setCurrency(e)}>
                                            <Select.Option value="PKR">PKR</Select.Option>
                                            <Select.Option value="USD">USD</Select.Option>
                                            <Select.Option value="DIR">DIR</Select.Option>
                                        </Select>
                                    </Col>
                                </Row>
                            </Modal>
                            <Button type="primary" onClick={() => setModalOpen(true)}>
                                Done
                            </Button>
                        </>
                    )}
                </div>
                {/* <div style={{ textAlign: "end" }}>
                    <Button onClick={addMoreTrips}>Add more</Button>
                </div> */}
            </CardComp>
        </>
    );
}

export default TripDetail;