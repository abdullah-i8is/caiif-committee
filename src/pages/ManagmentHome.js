import React, { useState, useLayoutEffect, useEffect } from 'react'
import { Loader } from "react-overlay-loader";
import {
  Card,
  Col,
  Row,
  Typography,
  Tooltip,
  Progress,
  Upload,
  message,
  Button,
  Timeline,
  Radio,
  notification,
  Badge,
  Table,
  Tag,
  Modal,
  Divider
} from "antd";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import CountUp from 'react-countup';


const ManagmentHome = () => {
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [depart, setDepart] = useState([])
  const [designation, setDesignation] = useState([])
  const [city, setCity] = useState([])
  const [trips, setTrips] = useState([])

  const column = [
    {
      title: 'Serial No',
      dataIndex: 'serialNo',
      key: 'serialNo',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Trip No',
      dataIndex: 'tripNo',
      key: 'tripNo',
    },
    {
      title: 'Flying From',
      dataIndex: 'flyingFrom',
      key: 'flyingFrom',
      render: (text, record) => {
        console.log(record);
        return record?.tripDetails[0]?.flyingFrom?.cityName
      }
    },
    {
      title: 'Flying To',
      dataIndex: 'flyingTo',
      key: 'flyingTo',
      render: (text, record) => {
        return record?.tripDetails[record.tripDetails.length - 1]?.flyingTo?.cityName
      }
    },
    ,
    {
      title: 'Expense',
      // dataIndex: '',
      // key: 'flyingTo',
      render: (text, record) => {
        let expense = 0;

        record?.tripDetails?.map(t => {
          if (t.flightDetails) {
            t.flightDetails.map(d => {
              if (d.isSelected) {
                expense += Number(d.flightPrice)
              }
            })
          }
          if (t.hotelDetails) {
            t.hotelDetails.map(d => {
              if (d.isSelected) {
                expense += Number(d.hotelPrice)
              }
            })
          }
          if (t.expenses) {
            t.expenses.map(e => {
              if (e.expense) {
                expense += Number(e.expense)
              }
            })
          }
        })
        record?.arrivalFlight?.map(d => {
          if (d.isSelected) {
            expense += Number(d.flightPrice)
          }
        })
        return expense
      }
    },
    {
      title: 'Trip Status',
      render: (text, record) => {
        return (
          <Tag color={Number(record.tripStatus) === 0 ? "blue" : Number(record.tripStatus) === 1 ? "blue" : Number(record.tripStatus) === 2 ? "warning" : Number(record.tripStatus) === 3 ? "green" : Number(record.tripStatus) === 4 ? "error" : ""}>
            {Number(record.tripStatus) === 0 ? "WAITING FOR APPROVEL BY HOD" : Number(record.tripStatus) === 1 ? "WAITING FOR APPROVEL BY YOU" : Number(record.tripStatus) === 2 ? "WAITING FOR DETAILS" : Number(record.tripStatus) === 3 ? "DETAILS UPATED" : Number(record.tripStatus) === 4 ? "REJECTED" : ""}
          </Tag>
        )
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => <Button type="primary" onClick={() => navigate({ pathname: "/trip-detail" }, { state: record })} >View Trip</Button>
    },
  ];

  const [arr, setArr] = useState([
    { id: 1, title: "All Trips", description: 0, },
    { id: 2, title: "ACTIVE", description: 0, status: "ACTIVE" },
    { id: 3, title: "PENDING", description: 0, status: "PENDING" },
    { id: 4, title: "REJECTED", description: 0, status: "REJECTED" },
  ])
  useLayoutEffect(() => {
    setLoading(true)
    onSnapshot(collection(firestore, "trips"), (snapshot) => {
      const res = snapshot.docs.map((doc) => {
        let data = doc.data()
        console.log(data, "data")
        data = {
          ...data,
          arrivalFlight: data.arrivalFlight?.map(a => {
            return {
              ...a,
              arrivalDate: a.arrivalDate.toDate(),
            }
          }),
          tripDetails: data.tripDetails?.map(t => {
            return {
              ...t,
              flightDetails: t.flightDetails?.map(d => {
                return {
                  ...d,
                  departureDate: d.departureDate.toDate()
                }
              }),
              hotelDetails: t.hotelDetails?.map(h => {
                return {
                  ...h,
                  checkInn: h.checkIn.toDate(),
                  checkOut: h.checkOut.toDate()
                }
              }),
              arrival: t.arrival.toDate(),
              departure: t.departure.toDate(),
              hotelArrival: t.hotelArrival.toDate(),
              hotelDeparture: t.hotelDeparture.toDate()
            }
          })
        }
        return {
          ...data,
          id: doc.id
        }
      })
      setTrips(res)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (trips) {
      setArr([
        { id: 1, title: "All Trips", description: trips.length, },
        { id: 2, title: "ACTIVE", description: trips.filter(r => Number(r.tripStatus) === 3).length, status: "ACTIVE" },
        { id: 3, title: "PENDING", description: trips.filter(r => Number(r.tripStatus) <= 2).length, status: "PENDING" },
        { id: 4, title: "REJECTED", description: trips.filter(r => Number(r.tripStatus) === 4).length, status: "REJECTED" },
      ])
      onSnapshot(collection(firestore, "department"), (snapshot) => {
        const res = snapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            count: trips.filter(f => f.tripDepartMent === doc.id).length,
            id: doc.id
          }
        })
        setDepart(res)
      })
      onSnapshot(collection(firestore, "designation"), (snapshot) => {
        const res = snapshot.docs.map((doc) => {
          let count = 0;
          trips.map(t => t.tripDetails[0].guests.guestsDetails.map(g => {
            if (g.designation === doc.id) {
              count += 1
            }
          }))
          return {
            ...doc.data(),
            count,
            id: doc.id
          }
        })
        setDesignation(res)
      })
      onSnapshot(collection(firestore, "city"), (snapshot) => {
        const res = snapshot.docs.map((doc) => {
          let count = 0;
          trips.map(t => t.tripDetails.map(c => {
            if (c.flyingTo.id === doc.id) {
              count += 1;
            }
          }))
          return {
            ...doc.data(),
            count,
            id: doc.id
          }
        })
        setCity(res)
      })

      setLoading(false)

    }
  }, [trips])

  console.log(depart, city, designation)
  
  return (
    <>
      {contextHolder}
      <Loader fullPage loading={loading} />
      <Row gutter={[24, 0]}>
        {arr.map((card, index) => {
          return (
            <Col xs={24} sm={24} md={12} lg={12} xl={6} className="mb-24">
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 20 }}>{card.title}</p>
                  {card.status && <Badge
                    className="site-badge-count-109"
                    count={card.status}
                    style={{
                      margin: "5px 0",
                      backgroundColor: card.status === "ACTIVE" ? "#52c41a" : card.status === "REJECTED" ? "red" : card.status === "PENDING" ? "grey" : "",
                    }}
                  />}
                </div>
                <Typography.Title level={"5"}><CountUp start={0} end={card.description} /></Typography.Title>
              </Card>
            </Col>
          )
        })}
      </Row>

      <Row gutter={[24, 0]} justify="space-around" align="stretch">
        <Col xs={24} sm={24} md={8} className="mb-24">
          <Card style={{ height: "100%" }}>
            <Typography.Title level={5}>Department</Typography.Title>
            {depart.map(d => {

              return (
                <>
                  <Typography.Paragraph>
                    {d.department}
                  </Typography.Paragraph>
                  <Progress percent={Math.ceil((d.count * 100) / trips.length)} status="active" />
                </>
              )
            })}
          </Card>
        </Col>

        <Col xs={24} sm={24} md={8} className="mb-24">
          <Card style={{ height: "100%" }}>
            <Typography.Title level={5}>Designation</Typography.Title>
            {designation.map(d => {

              return (
                <>
                  <Typography.Paragraph>
                    {d.designation}
                  </Typography.Paragraph>
                  <Progress percent={Math.ceil((d.count * 100) / trips.length)} status="active" />
                </>
              )
            })}
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8} className="mb-24">
          <Card style={{ height: "100%" }}  >

            <Typography.Title level={5}>City</Typography.Title>
            {city.map(d => {

              return (
                <>
                  <Typography.Paragraph>
                    {d.city}
                  </Typography.Paragraph>
                  <Progress percent={Math.ceil((d.count * 100) / trips.length)} status="active" />
                </>
              )
            })}
          </Card>
        </Col>
      </Row>

      <Card>
        <Typography.Title level={3}>List Of Trips</Typography.Title>
        <Table dataSource={trips} columns={column} />
      </Card>
    </>
  )
}

export default ManagmentHome