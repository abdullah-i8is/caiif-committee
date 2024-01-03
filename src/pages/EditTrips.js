import React from "react";
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
    AutoComplete,
    Modal,
    TimePicker
} from "antd";
import { addDoc, collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CardComp from "../components/cards/cards";
import Summary from "../components/summary/summary";
import { firestore } from "../config/firebase";
import { LoadingOverlay, Loader } from 'react-overlay-loader';
// import World from "../../worlCountryAndCity";
import dayjs from 'dayjs'

function EditTrips() {

    const { Title, Text } = Typography;
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const [api, contextHolder] = notification.useNotification();
    const [current, setCurrent] = useState(0)
    const [data, setData] = useState(location.state.tripDetails)
    const [cities, setCities] = useState([])
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false)
    const [form] = Form.useForm();
    const [designation, setDesignation] = useState(null)
    const [depart, setDepart] = useState(null)
    const [value, setValue] = useState('');
    const [options, setOptions] = useState([]);
    const [flightDetails, setFlightDetails] = useState()
    const [arrivalFlight, setArrivalFlight] = useState()
    const [hotelDetails, setHotelDetails] = useState()

    React.useEffect(() => {
        if (location.state.tripDetails) {
            // console.log(dayjs(location.state.tripDetails[current].departure),"location.state.tripDetails[current].departure")
            setFlightDetails([{
                airline: "",
                flightNumber: "",
                flightPrice: "",
                departureDate: dayjs(location.state.tripDetails[current].departure),
                departureTime: dayjs(location.state.tripDetails[current].departureTime),
                flightClass: "",
                ticketNumber: "",
            }])
            setHotelDetails([
                {
                    hotelName: "",
                    hotelPrice: "",
                    checkIn: dayjs(location.state.tripDetails[current].hotelDeparture),
                    checkOut: dayjs(location.state.tripDetails[current].hotelArrival),
                    hotelClass: ""
                }
            ])
            setArrivalFlight([{
                airline: "",
                flightNumber: "",
                flightPrice: "",
                arrivalDate: dayjs(location.state.tripDetails[location.state.tripDetails.length - 1].arrival),
                arrivalTime: dayjs(location.state.tripDetails[location.state.tripDetails.length - 1].arrivalTime),
                flightClass: "",
            }])
        }
    }, [location.state])

    const next = () => {
        if (current === 0) {
            let check = false
            flightDetails.map((val) => {
                Object.entries(val).map(([k, v]) => {
                    if (typeof v === "string" && v === "") {
                        check = true
                    }
                })
            })
            if (check) {
                setLoading(false)
                api.error({
                    message: "Error Flight"
                })
                return null
            }
            hotelDetails.map((val) => {
                Object.entries(val).map(([k, v]) => {
                    if (v === "") {
                        check = true
                    }
                })
            })
            if (check) {
                setLoading(false)
                api.error({
                    message: "Error Hotel"
                })
                return null
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
            arrivalFlight.map((val, ind) => {
                Object.entries(val).map(([k, v]) => {
                    if (v === "") {
                        check = true
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
        // if (current < data.length) {
        //     setData((prevData) => {
        //         return prevData.map((data, index) => {
        //             if (index === current) {
        //                 return {
        //                     ...data,
        //                     current,
        //                     flightDetails: flightDetails.map(f => {
        //                         return {
        //                             ...f,
        //                             departureDate: new Date(f.departureDate)
        //                         }
        //                     }),
        //                     hotelDetails: hotelDetails.map(g => {
        //                         return {
        //                             ...g,
        //                             checkIn: new Date(g.checkIn),
        //                             checkOut: new Date(g.checkOut),
        //                         }
        //                     })
        //                 }
        //             }
        //             else {
        //                 return data
        //             }
        //         })
        //     })
        // }
        // if (current + 1 < data.length) {
        //     setFlightDetails([
        //         {
        //             airline: "",
        //             flightNumber: "",
        //             flightPrice: "",
        //             departureDate: dayjs(location.state.tripDetails[current + 1].departure),
        //             departureTime: "",
        //             flyingClass: "",
        //         }
        //     ])
        //     setHotelDetails([
        //         {
        //             hotelName: "",
        //             hotelPrice: "",
        //             checkIn: dayjs(location.state.tripDetails[current + 1].hotelDeparture),
        //             checkOut: dayjs(location.state.tripDetails[current + 1].hotelArrival),
        //             hotelClass: ""
        //         }
        //     ])
        // }
    };

    const prev = () => {
        setCurrent(current - 1);
        let flights = data.find((val) => val.current === current)
        if (flights) {
            flights.flightDetails.map(f => {
                return {
                    ...f,
                    departureDate: dayjs(f.departureDate)
                }
            })
            setFlightDetails(flights.flightDetails)
        }
        let hotels = data.find((val) => val.current === current)
        if (hotels) {
            hotels.hotelDetails.map(h => {
                return {
                    ...h,
                    checkIn: dayjs(h.checkIn),
                    checkOut: dayjs(h.checkOut),
                }
            })
            setHotelDetails(hotels.hotelDetails)
        }
    };

    const handleFlightChange = (args) => {
        const { e, index, name, indd } = args
        setFlightDetails((prevDetails) => {
            return prevDetails.map((value, ind) => {
                if (index === ind) {
                    if (e?.target?.value) {
                        return {
                            ...value,
                            [name]: e.target.value
                        }
                    }
                    else {
                        if (name === "departureDate") {
                            return {
                                ...value,
                                [name]: e !== null && dayjs(e)
                            }
                        }
                        else if (name === "departureTime") {
                            return {
                                ...value,
                                [name]: e !== null && dayjs(e)
                            }
                        }
                        else {
                            return {
                                ...value,
                                [name]: typeof e === "string" ? e : ""
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
    const handleFlightChangeArrival = (args) => {
        const { e, index, name, indd } = args
        setArrivalFlight((prevDetails) => {
            return prevDetails.map((value, ind) => {
                if (index === ind) {
                    if (e?.target?.value) {
                        return {
                            ...value,
                            [name]: e.target.value
                        }
                    }
                    else {
                        if (name === "arrivalDate") {
                            return {
                                ...value,
                                [name]: e !== null && dayjs(e)
                            }
                        }
                        else if (name === "arrivalTime") {
                            return {
                                ...value,
                                [name]: e !== null && dayjs(e)
                            }
                        }
                        else {
                            return {
                                ...value,
                                [name]: typeof e === "string" ? e : ""
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

    const handleHotelChange = (args) => {
        const { e, index, name, indd } = args
        setHotelDetails((prevDetails) => {
            return prevDetails.map((value, ind) => {
                if (index === ind) {
                    if (e?.target?.value) {
                        return {
                            ...value,
                            [name]: e.target.value
                        }
                    }
                    else {
                        if (name === "checkIn") {
                            return {
                                ...value,
                                [name]: e !== null && dayjs(e)
                            }
                        } else if (name === "checkOut") {
                            return {
                                ...value,
                                [name]: e !== null && dayjs(e)
                            }
                        } else {
                            return {
                                ...value,
                                [name]: typeof e === "string" ? e : ""
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

    const addMoreFlights = () => {

        setFlightDetails([
            ...flightDetails,
            {
                airline: "",
                flightNumber: "",
                flightPrice: "",
                departureDate: dayjs(location.state.tripDetails[current].departure),
                departureTime: "",
                flyingClass: "",
                ticketNumber: "",
            }
        ])
    }
    const addMoreArrivalFlights = () => {
        setArrivalFlight([...arrivalFlight, {
            airline: "",
            flightNumber: "",
            flightPrice: "",
            arrivalDate: dayjs(location.state.tripDetails[location.state.tripDetails.length - 1].arrival),
            arrivalTime: "",
            flyingClass: "",
        }])
    }
    const addMoreHotels = () => {
        setHotelDetails([
            ...hotelDetails,
            {
                hotelName: "",
                hotelPrice: "",
                checkIn: dayjs(location.state.tripDetails[current].hotelDeparture),
                checkOut: dayjs(location.state.tripDetails[current].hotelArrival),
                hotelClass: ""
            }
        ])
    }

    const removeDetails = (index, name) => {
        if (name === "removeFlights") {
            setFlightDetails(flightDetails.filter((v, i) => i !== index))
        } else if (name == "arrival") {
            setArrivalFlight(arrivalFlight.filter((v, i) => i !== index))
        }
        else {
            setHotelDetails(hotelDetails.filter((v, i) => i !== index))
        }
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

    function submitDetails() {
        setModalOpen(false)
        setLoading(true)
        const colRef = doc(firestore, "trips", location.state.id)
        updateDoc(colRef, {
            tripNo: location.state.tripNo,
            arrivalFlight: arrivalFlight?.map(a => {
                return {
                    ...a,
                    arrivalDate: new Date(a.arrivalDate),
                }
            }),
            tripDetails: data.map((f) => {
                return {
                    ...f,
                    flightDetails: flightDetails?.map((a) => {
                        return {
                            ...a,
                            departureDate: new Date(a.departureDate),
                            departureTime: new Date(a.departureTime)
                        }
                    }),
                    hotelDetails: hotelDetails?.map((a) => {
                        return {
                            ...a,
                            checkIn: new Date(a.checkIn),
                            checkOut: new Date(a.checkOut)
                        }
                    }),
                }
            }),
            tripStatus: 1
        })
            .then((res) => {
                setLoading(false)
                const docRef = doc(firestore, "trips", location.state.id)
                updateDoc(docRef, {
                    tripStatus: 3,
                })
                api.success({
                    message: `Success`,
                    description: "Trip Details added successfully",
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

    console.log(location.state);

    return (
        <>
            {contextHolder}
            <Loader fullPage loading={loading} />
            <Title>EDIT TRIPS</Title>
            {current === 0 && (
                <Row gutter={[24, 0]}>
                    {data[0]?.guests?.guestsDetails.map((guest) => {
                        return (
                            <>
                                <Col xs={24} sm={24} md={12} lg={8} xl={8} className="mb-24">
                                    <Card style={{ marginBottom: "20px" }}>
                                        <Title level={5}>Name:</Title>{guest.firstname + " " + guest.lastname}
                                        <Title level={5}>Phone Number:</Title>{guest.emergencycontact}
                                        <Title level={5}>Passport Number:</Title>{guest.passportnumber}
                                        {designation ? designation.filter(f => f.id === guest.designation).map((m) => {
                                            return (
                                                <>
                                                    <Title level={5}>Designation:</Title>{m.designation}
                                                </>
                                            )
                                        }) : null}
                                    </Card>
                                </Col>
                            </>
                        )
                    })}
                </Row>
            )}
            <Steps current={current} style={{ margin: "0 0 40px 0" }}>
                {location.state.tripDetails.map((f) => {
                    return <Steps.Step key={f.flyingTo.id} title={f.flyingTo.cityName} />
                })}
                <Steps.Step title="Return Trip" />
                <Steps.Step title="Trip Summary" />
            </Steps>
            {current < data.length && (
                <Card style={{ marginBottom: "20px" }}>
                    <Title level={3}>
                        DETAILS
                    </Title>
                    <Card style={{ marginBottom: "20px" }}>
                        <Row gutter={[24, 0]}>
                            {data?.map((dat, ind) => {
                                console.log('dat', dat);
                                return (
                                    <>

                                        <Col xs={24} sm={24} md={6} lg={6} xl={6} className="mb-24">
                                            <Title level={5}>Departure:</Title>{new Date(dat.departure).toLocaleDateString()}
                                        </Col>
                                        <Col xs={24} sm={24} md={6} lg={6} xl={6} className="mb-24">
                                            <Title level={5}>Arrival:</Title>{new Date(dat.arrival).toLocaleDateString()}
                                        </Col>
                                        <Col xs={24} sm={24} md={6} lg={6} xl={6} className="mb-24">
                                            <Title level={5}>flying From:</Title>{dat.flyingFrom?.cityName}
                                        </Col>
                                        <Col xs={24} sm={24} md={6} lg={6} xl={6} className="mb-24">
                                            <Title level={5}>flying To:</Title>{dat.flyingTo?.cityName}
                                        </Col>
                                        <Col xs={24} sm={24} md={6} lg={6} xl={6} className="mb-24">
                                            <Title level={5}>Guests Per Room:</Title>{dat.guests.guestsPerRoom}
                                        </Col>
                                        <Col xs={24} sm={24} md={6} lg={6} xl={6} className="mb-24">
                                            <Title level={5}>User Remarks:</Title>{dat.guests.remarks ? dat.guests.remarks : "N/A"}
                                        </Col>
                                    </>
                                )
                            })}
                        </Row>
                    </Card>
                </Card>
            )}
            <CardComp>
                {current <= data.length - 1 ? (
                    <Form form={form} layout="vertical">

                        {/* <Row style={{ alignItems: "center" }}>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                                <Title level={5}>Flight Details</Title>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24" style={{ textAlign: "end" }}>
                                <Button onClick={() => addMoreFlights()} type="default">Add More Flights</Button>
                            </Col>
                        </Row> */}
                        {flightDetails?.map((val, index) => {
                            return (
                                <Card style={{ marginBottom: "20px" }}>
                                    {/* {flightDetails.length > 1 && <div style={{ textAlign: "right" }}>
                                        <Button
                                            onClick={() => removeDetails(index, "removeFlights")}
                                            type="default" danger>
                                            Remove
                                        </Button>
                                    </div>} */}
                                    <Row gutter={[24, 0]}>
                                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                            <Form.Item label="Airline">
                                                <Input value={val.airline} style={{ height: 32 }} onChange={(e) => handleFlightChange({ e: e, index: index, name: "airline" })} placeholder="Select Airline" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                            <Form.Item label="Flight Number">
                                                <Input value={val.flightNumber} style={{ height: 32 }} placeholder="Flight Number" onChange={(e) => handleFlightChange({ e: e, index: index, name: "flightNumber" })}>
                                                </Input>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                            <Form.Item label="Flight Price">
                                                <Input type="number" value={val.flightPrice} style={{ height: 32 }} placeholder="Flight Price" onChange={(e) => handleFlightChange({ e: e, index: index, name: "flightPrice" })}>
                                                </Input>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                            <Form.Item label="Ticket Number">
                                                <Input value={val.ticketNumber} style={{ height: 32 }} placeholder="Ticket Number" onChange={(e) => handleFlightChange({ e: e, index: index, name: "ticketNumber" })}>
                                                </Input>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                            <Form.Item label="Departure Date">
                                                <DatePicker defaultValue={null} value={val.departureDate} onChange={(value, dateString) => handleFlightChange({ e: dateString, index: index, name: "departureDate" })} style={{ width: "100%" }} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                            <Form.Item label="Departure Time">
                                                <TimePicker style={{ width: "100%" }} value={val.departureTime} onChange={(e) => handleFlightChange({ e: e, index: index, name: "departureTime" })} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                            <Form.Item label="Class">
                                                <Select value={val.flightClass} placeholder="Select Class" onChange={(e) => handleFlightChange({ e: e, index: index, name: "flightClass" })}>
                                                    {/* {cities ? cities.filter((d, i) => d.status).map((city, index) => {
                                                        return <Select.Option value={city.id}>{city.city}</Select.Option>
                                                    }) : null} */}
                                                    <Select.Option value={'Economy'}>Economy</Select.Option>
                                                    <Select.Option value={'First Class'}>First Class</Select.Option>
                                                    <Select.Option value={'Business'}>Business</Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            )
                        })}
                        {/* <Row style={{ alignItems: "center" }}>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                                <Title level={5}>Hotel Details</Title>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24" style={{ textAlign: "end" }}>
                                <Button onClick={() => addMoreHotels()} type="default">Add More Hotels</Button>
                            </Col>
                        </Row> */}
                        {hotelDetails?.map((val, index) => {
                            return (
                                <Card style={{ marginBottom: "20px" }}>
                                    {/* {hotelDetails.length > 1 && <div style={{ textAlign: "right" }}>
                                        <Button
                                            onClick={() => removeDetails(index, "removeHotels")}
                                            type="default">
                                            Remove
                                        </Button>
                                    </div>} */}
                                    <Row gutter={[24, 0]}>
                                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                            <Form.Item label="Hotel Name">
                                                <Input value={val.hotelName} style={{ height: 32 }} placeholder="Hotel Name" onChange={(e) => handleHotelChange({ e: e, index: index, name: "hotelName" })}>
                                                </Input>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                            <Form.Item label="Hotel Price">
                                                <Input type="number" value={val.hotelPrice} style={{ height: 32 }} placeholder="Hotel Price" onChange={(e) => handleHotelChange({ e: e, index: index, name: "hotelPrice" })}>
                                                </Input>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                            <Form.Item label="Check In">
                                                <DatePicker value={val.checkIn} onChange={(value, dateString) => handleHotelChange({ e: dateString, index: index, name: "checkIn" })} style={{ width: "100%" }} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                            <Form.Item label="Check Out">
                                                <DatePicker value={val.checkOut} onChange={(value, dateString) => handleHotelChange({ e: dateString, index: index, name: "checkOut" })} style={{ width: "100%" }} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                            <Form.Item label="Hotel Class">
                                                <Select value={val.hotelClass} placeholder="Select Class" onChange={(e) => handleHotelChange({ e: e, index: index, name: "hotelClass" })}>

                                                    <Select.Option value={'One Star'}>One Star</Select.Option>
                                                    <Select.Option value={'Two Start'}>Two Start</Select.Option>
                                                    <Select.Option value={'Three Start'}>Three Start</Select.Option>
                                                    <Select.Option value={'Four Start'}>Four Start</Select.Option>
                                                    <Select.Option value={'Five Start'}>Five Start</Select.Option>

                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            )
                        })}
                    </Form>
                ) : current === data?.length ? <Form form={form} layout="vertical">

                    <Row style={{ alignItems: "center" }}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                            <Title level={5}>Flight Details</Title>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24" style={{ textAlign: "end" }}>
                            <Button onClick={addMoreArrivalFlights} type="default">Add More Flights</Button>
                        </Col>
                    </Row>
                    {arrivalFlight?.map((val, index) => {
                        return (
                            <Card style={{ marginBottom: "20px" }}>
                                {arrivalFlight.length > 1 && <div style={{ textAlign: "right" }}>
                                    <Button
                                        onClick={() => removeDetails(index, "arrival")}
                                        type="default">
                                        Remove
                                    </Button>
                                </div>}
                                <Row gutter={[24, 0]}>
                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                        <Form.Item label="Airline">
                                            <Input value={val.airline} style={{ height: 32 }} onChange={(e) => handleFlightChangeArrival({ e: e, index: index, name: "airline" })} placeholder="Select Airline" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                        <Form.Item label="Flight Number">
                                            <Input value={val.flightNumber} style={{ height: 32 }} placeholder="Flight Number" onChange={(e) => handleFlightChangeArrival({ e: e, index: index, name: "flightNumber" })}>
                                            </Input>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                        <Form.Item label="Flight Price">
                                            <Input type="number" value={val.flightPrice} style={{ height: 32 }} placeholder="Flight Price" onChange={(e) => handleFlightChangeArrival({ e: e, index: index, name: "flightPrice" })}>
                                            </Input>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                        <Form.Item label="Arrival Date">
                                            <DatePicker defaultValue={null} value={val.arrivalDate} onChange={(value, dateString) => handleFlightChangeArrival({ e: dateString, index: index, name: "arrivalDate" })} style={{ width: "100%" }} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                        <Form.Item label="Arrival Time">
                                            <TimePicker style={{ width: "100%" }} value={val.arrivalTime} onChange={(e) => handleFlightChangeArrival({ e: e, index: index, name: "arrivalTime" })} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                        <Form.Item label="Class">
                                            <Select value={val.flightClass} placeholder="Select Class" onChange={(e) => handleFlightChangeArrival({ e: e, index: index, name: "flightClass" })}>
                                                {/* {cities ? cities.filter((d, i) => d.status).map((city, index) => {
                                                return <Select.Option value={city.id}>{city.city}</Select.Option>
                                            }) : null} */}
                                                <Select.Option value={'Economy'}>Economy</Select.Option>
                                                <Select.Option value={'First Class'}>First Class</Select.Option>
                                                <Select.Option value={'Business'}>Business</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                        )
                    })}
                </Form> : current === data?.length + 1 ? (
                    <>
                        <Modal
                            centered
                            title="Are you sure want to submit trip ?"
                            open={modalOpen}
                            onOk={submitDetails}
                            onCancel={() => setModalOpen(false)}
                            footer={
                                <>
                                    <Button key="back" onClick={() => {
                                        setModalOpen(false)
                                    }}>
                                        Close
                                    </Button>,
                                    <Button key="submit" type="primary" onClick={submitDetails}>
                                        Submit
                                    </Button>,
                                </>
                            }
                        >
                        </Modal>
                        <Title level={2}>TRIP SUMMARY</Title>
                        <Row gutter={[24, 0]}>
                            {data[0]?.guests?.guestsDetails.map((guest) => {
                                return (
                                    <>
                                        <Col xs={24} sm={24} md={12} lg={8} xl={8} className="mb-24">
                                            <Card style={{ marginBottom: "20px" }}>
                                                <Title level={5}>Name:</Title>{guest.firstname + " " + guest.lastname}
                                                <Title level={5}>Phone Number:</Title>{guest.emergencycontact}
                                                <Title level={5}>Passport Number:</Title>{guest.passportnumber}
                                                {designation ? designation.filter(f => f.id === guest.designation).map((m) => {
                                                    return (
                                                        <>
                                                            <Title level={5}>Designation:</Title>{m.designation}
                                                        </>
                                                    )
                                                }) : null}
                                            </Card>
                                        </Col>
                                    </>
                                )
                            })}
                        </Row>
                        <Row gutter={[24, 0]}>
                            {data.map((tripSummary) => {
                                return (
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                                        <Card style={{ marginBottom: "20px" }}>
                                            <Row gutter={[24, 0]}>
                                                <Col xs={24} sm={24} md={12} lg={14} xl={14} className="mb-24">
                                                    <Title level={5}>Flying From:</Title>{tripSummary.flyingFrom.cityName}
                                                </Col>
                                                <Col xs={24} sm={24} md={12} lg={8} xl={8} className="mb-24">
                                                    <Title level={5}>Flying To:</Title>{tripSummary.flyingTo.cityName}
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                                                    <Title level={4}>Flight Details</Title>
                                                </Col>
                                                {tripSummary?.flightDetails ? tripSummary?.flightDetails?.map((flightDetails) => {
                                                    return (
                                                        <>
                                                            <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mb-24">
                                                                <Card>
                                                                    <Title level={5}>Departure:</Title>{dayjs(tripSummary.departure).format('YYYY-MM-DD')}
                                                                    <Title level={5}>Arrival:</Title>{dayjs(tripSummary.arrival).format('YYYY-MM-DD')}
                                                                    <Title level={5}>Departure Date:</Title>{dayjs(flightDetails.departureDate).format('YYYY-MM-DD')}
                                                                    <Title level={5}>Departure Time:</Title>{dayjs(flightDetails.departureTime).format('HH-MM-SS')}
                                                                    <Title level={5}>Flight Number:</Title>{flightDetails.flightNumber}
                                                                    <Title level={5}>Flight Price:</Title>{flightDetails.flightPrice}
                                                                </Card>
                                                            </Col>
                                                        </>
                                                    )
                                                }) : null}
                                                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                                                    <Title level={4}>Hotel Details</Title>
                                                </Col>
                                                {tripSummary?.hotelDetails ? tripSummary?.hotelDetails?.map((hotelDetails) => {
                                                    return (
                                                        <>
                                                            <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mb-24">
                                                                <Card>
                                                                    <Title level={5}>Hotel Name:</Title>{hotelDetails.hotelName}
                                                                    <Title level={5}>Hotel Price:</Title>{hotelDetails.hotelPrice}
                                                                    <Title level={5}>Check In:</Title>{dayjs(hotelDetails.checkIn).format('YYYY-MM-DD')}
                                                                    <Title level={5}>Check Out:</Title>{dayjs(hotelDetails.checkOut).format('YYYY-MM-DD')}
                                                                </Card>
                                                            </Col>
                                                        </>
                                                    )
                                                }) : null}
                                            </Row>
                                        </Card>
                                    </Col>
                                )
                            })}
                        </Row>
                        <Title level={2}>Return Detail</Title>
                        <Row gutter={[24, 0]}>

                            {arrivalFlight.map((flightDetails) => {
                                return (
                                    <>
                                        <Col xs={24} sm={24} md={8} lg={8} xl={8} className="mb-24">
                                            <Card>
                                                <Title level={5}>Departure Date:</Title>{dayjs(flightDetails.arrivalDate).format('YYYY-MM-DD')}
                                                <Title level={5}>Departure Time:</Title>{dayjs(flightDetails.arrivalTime).format("HH-MM-SS")}
                                                <Title level={5}>Flight Number:</Title>{flightDetails.flightNumber}
                                                <Title level={5}>Flight Price:</Title>{flightDetails.flightPrice}
                                            </Card>
                                        </Col>
                                    </>
                                )
                            })}

                        </Row>
                    </>
                ) : ""}
                <div style={{ textAlign: "end" }}>
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
                    {current < data.length + 1 && (
                        <Button
                            type="primary"
                            onClick={next}>
                            Next
                        </Button>
                    )}
                    {current === data.length + 1 && (
                        <>
                            <Button type="primary" onClick={() => setModalOpen(true)}>
                                Done
                            </Button>
                        </>
                    )}

                </div>
            </CardComp>
        </>
    );
}

export default EditTrips;