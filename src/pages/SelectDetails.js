import { Button, Card, Col, notification, Row, Typography, Tag, Modal } from 'antd';
import React, { useEffect, useState } from 'react'
import { Loader } from 'react-overlay-loader';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Summary from '../components/summary/summary';
import dayjs from 'dayjs'
import { useSelector } from 'react-redux';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const SelectDetails = () => {

    const { Title, Text } = Typography;
    const location = useLocation()
    const [api, contextHolder] = notification.useNotification();
    const [data, setData] = useState(location?.state)
    const [status] = useState(location?.state?.tripStatus)
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [approveTrips, setApproveTrips] = useState()
    const loginUser = useSelector((state) => state.auth.user)
    const [approval, setApproval] = useState(0)
    const navigate = useNavigate()

    function handleSelected(name, index, ind) {
        if (name === "flight") {
            setData((prev) => {
                return {
                    ...prev,
                    tripDetails: prev.tripDetails.map((v, i) => {
                        if (index === i) {
                            return {
                                ...v,
                                flightDetails: v.flightDetails.map((h, indd) => {
                                    if (indd === ind) {
                                        return {
                                            ...h,
                                            isSelected: Boolean(!h.isSelected)
                                        }
                                    }
                                    else {
                                        return {
                                            ...h,
                                            isSelected: false
                                        }
                                    }
                                })
                            }
                        }
                        else {
                            return v
                        }
                    })
                }
            })
        }
        else if (name === "hotel") {
            setData((prev) => {
                return {
                    ...prev,
                    tripDetails: prev.tripDetails.map((v, i) => {
                        if (index === i) {
                            return {
                                ...v,
                                hotelDetails: v.hotelDetails.map((h, indd) => {
                                    if (indd === ind) {
                                        return {
                                            ...h,
                                            isSelected: Boolean(!h.isSelected)
                                        }
                                    }
                                    else {
                                        return {
                                            ...h,
                                            isSelected: false
                                        }
                                    }
                                })
                            }
                        }
                        else {
                            return v
                        }
                    })
                }
            })
        }
    }

    const updateTrip = () => {
        setLoading(true)
        const docRef = doc(firestore, "trips", location.state.id)
        updateDoc(docRef, {
            tripDetails: data,
            tripNo: location.state.tripNo,
            tripStatus: 2
        })
            .then(() => {
                navigate("/")
            })
        setLoading(false)
    }

    function handleOpenModal() {
        setModalOpen(true)
        setApproveTrips(location.state)
    }

    const handleApproveTrip = (name) => {
        setLoading(true)
        const docRef = doc(firestore, "trips", approveTrips.id)
        setModalOpen(false)
        updateDoc(docRef, {
            // ...approveTrips,
            // createdAt: "",
            tripStatus: name === "approve by HOD" ? 1 : name === "approve by MANAGEMENT" ? 2 : name === "approve by ADMIN" ? 3 : name === "reject by HOD" ? 4 : name === "reject by MANAGEMENT" ? 4 : 0,
        })
            .then(() => {
                setLoading(false)
            })
    }

    // console.log(loginUser.role);
    // console.log(status);
    console.log(data);

    return (
        <div>
            <Modal
                style={{ minWidth: 400, maxWidth: "100%" }}
                footer={[
                    <>
                        <Button onClick={() => handleApproveTrip(Number(loginUser.role) === 2 ? "reject by HOD" : Number(loginUser.role) === 1 ? "reject by MANAGEMENT" : Number(loginUser.role) === 0 ? "reject by ADMIN" : "")} type="default">Reject</Button>
                        <Button onClick={() => handleApproveTrip(Number(loginUser.role) === 2 ? "approve by HOD" : Number(loginUser.role) === 1 ? "approve by MANAGEMENT" : Number(loginUser.role) === 0 ? "approve by ADMIN" : "")} type="primary">Approve</Button>
                    </>
                ]}
                centered
                title="Trips"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}>
                <Row gutter={[24, 0]}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Text style={{ fontSize: 20 }}>Trip No</Text>: <Text style={{ fontSize: 20 }}>{approveTrips ? approveTrips.tripNo : ""}</Text>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Text style={{ fontSize: 20 }}>Trip Status</Text>: <Tag color={"warning"}>{approveTrips ? approveTrips.tripStatus === 2 ? "PENDING" : "" : ""}</Tag>
                    </Col>
                    <Card style={{ width: "100%", margin: "10px 0" }}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            {/* <Row gutter={[24, 0]}>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Title level={5}>Total Flight Budget</Title> {flightBudget}
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Title level={5}>Total Hotel Budget</Title> {hotelBudget}
                                </Col>
                            </Row> */}
                        </Col>
                    </Card>
                </Row>
            </Modal>
            <ToastContainer />
            {contextHolder}
            <Loader fullPage loading={loading} />
            <div style={{ display: "flex", flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "space-between" }}>
                <Title level={3}>{data.tripNo} </Title>
                <div>
                    <Tag color=
                        {
                            Number(status) === 0 && Number(loginUser.role) === 2 ? "blue" :
                                Number(status) === 1 && Number(loginUser.role) === 1 ? "blue" :
                                    Number(status) === 1 && Number(loginUser.role) === 2 ? "success" :
                                        Number(status) === 4 && Number(loginUser.role) === 2 ? "error" :
                                            Number(status) === 2 && Number(loginUser.role) === 1 ? "success" :
                                                Number(status) === 4 && Number(loginUser.role) === 1 ? "error" : ""
                        }
                    >
                        {
                            Number(status) === 0 && Number(loginUser.role) === 2 ? "PENDING" :
                                Number(status) === 1 && Number(loginUser.role) === 1 ? "PENDING" :
                                    Number(status) === 1 && Number(loginUser.role) === 2 ? "APPROVED BY HOD" :
                                        Number(status) === 4 && Number(loginUser.role) === 2 ? "REJECTED BY HOD" :
                                            Number(status) === 2 && Number(loginUser.role) === 1 ? "APPROVED BY MANAGEMENT" :
                                                Number(status) === 4 && Number(loginUser.role) === 1 ? "REJECTED BY MANAGEMENT" : ""
                        }
                    </Tag>
                    {Number(status) === 0 && Number(loginUser.role) === 2 ? <Button onClick={handleOpenModal}>View</Button> : ""}
                    {Number(status) === 1 && Number(loginUser.role) === 1 ? <Button onClick={handleOpenModal}>View</Button> : ""}
                </div>
            </div>
            {/* <Row gutter={[24, 0]}>
                {data?.tripDetails.guests?.guestsDetails.map((guest) => {
                    return (
                        <>
                            <Col xs={24} sm={24} md={24} lg={8} xl={6} className="mb-24">
                                <Card style={{ marginBottom: "20px" }}>
                                    <Title level={5}>Name:</Title>{guest.firstname + " " + guest.lastname}
                                    <Title level={5}>Phone Number:</Title>{guest.emergencycontact}
                                    <Title level={5}>Passport Number:</Title>{guest.passportnumber}
                                </Card>
                            </Col>
                        </>
                    )
                })}
            </Row> */}
            {data?.tripDetails ? data?.tripDetails?.map((tripSummary, index) => {
                return (
                    <>
                        <Row gutter={[24, 0]}>
                            <Col xs={24} className="mb-24">
                                <Card>
                                    <Row gutter={[24, 0]}>
                                        <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
                                            <Title level={5}>Amount</Title>{Number(data.amount)}
                                        </Col>
                                        <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
                                            <Title level={5}>Currency</Title>{data.currency}
                                        </Col>
                                        <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
                                            <Title level={5}>Flying From</Title>{tripSummary.flyingFrom.cityName}
                                        </Col>
                                        <Col xs={24} sm={24} md={12} lg={6} xl={6} className="mb-24">
                                            <Title level={5}>Flying To</Title>{tripSummary.flyingTo.cityName}
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={[24, 0]}>
                            {tripSummary.tripDetails.map((d, i) => {
                                console.log(new Date(d.purposeDate),d.purposeDate)
                                return (
                                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                                        <Card>
                                            <Row gutter={[24, 0]}>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
                                                    <Title level={5}>Purpose</Title>
                                                    <Typography.Paragraph>{d.purpose}</Typography.Paragraph>
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
                                                    <Title level={5}>Name</Title>
                                                    <Typography.Paragraph>{d.name}</Typography.Paragraph>
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
                                                    <Title level={5}>Comment</Title>
                                                    <Typography.Paragraph>{d.comment}</Typography.Paragraph>
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
                                                    <Title level={5}>Date</Title>
                                                    <Typography.Paragraph>{new Date(d.purposeDate).toDateString()}</Typography.Paragraph>
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
                                                    <Title level={5}>Time</Title>
                                                    <Typography.Paragraph>{new Date(d.purposeTime).toLocaleTimeString()}</Typography.Paragraph>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                )
                            })}
                        </Row>
                        <Title level={4} style={{ margin: "20px 0" }}>Flight Details</Title>
                        {tripSummary.flightDetails ? tripSummary?.flightDetails?.map((flightDetails, ind) => {
                            return (
                                <>
                                    <Col xs={24} sm={24} md={8} lg={8} xl={8} onClick={() => handleSelected('flight', index, ind)}>
                                        <Card style={{ backgroundColor: flightDetails?.isSelected ? "#00B2CA" : "" }}>
                                            <Row gutter={[24, 0]}>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
                                                    <Title level={5} style={{ color: flightDetails?.isSelected ? "white" : "black" }}>Departure</Title>
                                                    <Typography.Paragraph style={{ color: flightDetails?.isSelected ? "white" : "black" }}>{new Date(tripSummary.departure).toLocaleDateString()}</Typography.Paragraph>
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
                                                    <Title level={5} style={{ color: flightDetails?.isSelected ? "white" : "black" }}>Arrival</Title>
                                                    <Typography.Paragraph style={{ color: flightDetails?.isSelected ? "white" : "black" }}>{new Date(tripSummary.arrival).toLocaleDateString()}</Typography.Paragraph>
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
                                                    <Title level={5} style={{ color: flightDetails?.isSelected ? "white" : "black" }}>Departure Date</Title>
                                                    <Typography.Paragraph style={{ color: flightDetails?.isSelected ? "white" : "black" }}>{new Date(flightDetails.departureDate).toLocaleDateString()}</Typography.Paragraph>
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
                                                    <Title level={5} style={{ color: flightDetails?.isSelected ? "white" : "black" }}>Departure Time</Title>
                                                    <Typography.Paragraph style={{ color: flightDetails?.isSelected ? "white" : "black" }}>{new Date(flightDetails.departureTime).toTimeString()}</Typography.Paragraph>
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
                                                    <Title level={5} style={{ color: flightDetails?.isSelected ? "white" : "black" }}>Flight Number</Title>
                                                    <Typography.Paragraph style={{ color: flightDetails?.isSelected ? "white" : "black" }}>{flightDetails.flightNumber}</Typography.Paragraph>
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
                                                    <Title level={5} style={{ color: flightDetails?.isSelected ? "white" : "black" }}>Flight Price</Title>
                                                    <Typography.Paragraph style={{ color: flightDetails?.isSelected ? "white" : "black" }}>{flightDetails.flightPrice}</Typography.Paragraph>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </>
                            )
                        }) : <Skeleton height={100} />}
                        <Title level={4} style={{ margin: "20px 0" }}>Hotel Details</Title>
                        {tripSummary.hotelDetails ? tripSummary?.hotelDetails?.map((hotelDetails, ind) => {
                            return (
                                <>
                                    <Col xs={24} sm={24} md={8} lg={8} xl={8} onClick={() => handleSelected('hotel', index, ind)}>
                                        <Card style={{ backgroundColor: hotelDetails?.isSelected ? "#00B2CA" : "", color: hotelDetails?.isSelected ? "white" : "black" }}>
                                            <Row gutter={[24, 0]}>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
                                                    <Title level={5} style={{ color: hotelDetails?.isSelected ? "white" : "black" }}>Check In</Title>
                                                    <Typography.Paragraph style={{ color: hotelDetails?.isSelected ? "white" : "black" }}>{new Date(hotelDetails.checkIn).toLocaleDateString()}</Typography.Paragraph>
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
                                                    <Title level={5} style={{ color: hotelDetails?.isSelected ? "white" : "black" }}>Check Out</Title>
                                                    <Typography.Paragraph style={{ color: hotelDetails?.isSelected ? "white" : "black" }}>{new Date(hotelDetails.checkOut).toLocaleDateString()}</Typography.Paragraph>
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
                                                    <Title level={5} style={{ color: hotelDetails?.isSelected ? "white" : "black" }}>Hotel Name</Title>
                                                    <Typography.Paragraph style={{ color: hotelDetails?.isSelected ? "white" : "black" }}>{hotelDetails.hotelName}</Typography.Paragraph>
                                                </Col>
                                                <Col xs={24} sm={24} md={24} lg={12} xl={12} className="mb-24">
                                                    <Title level={5} style={{ color: hotelDetails?.isSelected ? "white" : "black" }}>Hotel Price</Title>
                                                    <Typography.Paragraph style={{ color: hotelDetails?.isSelected ? "white" : "black" }}>{hotelDetails.hotelPrice}</Typography.Paragraph>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </>
                            )
                        }) : <Skeleton height={100} />}
                        {/* {status < 2 && <Button onClick={updateTrip}>Submit</Button>} */}
                    </>
                )
            }) : null}
        </div>
    )
}

export default SelectDetails