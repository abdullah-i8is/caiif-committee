import { useEffect, useLayoutEffect, useState } from "react";

import {
  Card,
  Col,
  Row,
  Typography,
  Tooltip,
  Button,
  notification,
  Table,
  Tag,
  Modal,
  FloatButton,
  Form,
  Input,
} from "antd";
import {
  CarOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import memberIcon from '../assets/images/member2.svg'
import deleteIcon from '../assets/images/del-icon.svg'
import StatisticsHeader from "../components/statistics/statisticsHeader";
import { GetAdminCommittees } from "../middlewares/commitee";
import { setCommittees } from "../store/committeeSlice/committeeSlice";

function Setup() {

  const { Title, Text } = Typography;
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.common.token)
  const committees = useSelector((state) => state.committees.committees)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [details, setDetails] = useState([])

  useEffect(() => {
    GetAdminCommittees(token)
      .then((res) => {
        const committee = res.data.allCommittees
        dispatch(setCommittees([...committee.level1, ...committee.level2, ...committee.level3]))
        if (res.status === 200) {
          console.log(res);
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false)
      })
  }, [])

  const data2 = [
    { username: "Hassan Soomro", accountnumber: "4003830171874018", email: "hassansoomro@i8is.com", phonenumber: "+92300000333", CNIC: "4230142301423", pdf: "Upload Pdf" },
    { username: "Nisa Hoorain", accountnumber: "4003830171874018", email: "nisahoorain@i8is.com", phonenumber: "+92300000333", CNIC: "4230142301423", pdf: "Upload Pdf" },
    { username: "Bilawal Soomro", accountnumber: "4003830171874018", email: "bilawalsoomro@i8is.com", phonenumber: "+92300000333", CNIC: "4230142301423", pdf: "Upload Pdf" },
    { username: "Hayat Ahmed", accountnumber: "4003830171874018", email: "hayatahmed@i8is.com", phonenumber: "+92300000333", CNIC: "4230142301423", pdf: "Upload Pdf" },
  ]

  const [form] = Form.useForm();

  const column = [
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Name</Title>,
      dataIndex: 'username',
      key: 'username',
      render: (text, record, index) => {
        return <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>{record?.committeeDetails?.username}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Email</Title>,
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.committeeDetails?.email}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Phone Number</Title>,
      dataIndex: 'phonenumber',
      key: 'phonenumber',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.committeeDetails?.phonenumber}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>CNIC</Title>,
      dataIndex: 'CNIC',
      key: 'CNIC',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.committeeDetails?.CNIC}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Enroll</Title>,
      dataIndex: 'enroll',
      key: 'enroll',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.committeeDetails?.enroll}</Title>
      }
    },
  ];

  const column2 = [
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Name</Title>,
      dataIndex: 'username',
      key: 'username',
      render: (text, record, index) => {
        return <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>{record?.username}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Account</Title>,
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.accountnumber}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Phone Number</Title>,
      dataIndex: 'phonenumber',
      key: 'phonenumber',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.phonenumber}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>CNIC</Title>,
      dataIndex: 'CNIC',
      key: 'CNIC',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.CNIC}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>PDF’S</Title>,
      dataIndex: 'enroll',
      key: 'enroll',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.pdf}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}></Title>,
      render: (text, record) => {
        return (
          <div>
            <img src={deleteIcon} />
            <Button style={{ margin: "0 0 0 20px" }} onClick={() => navigate("/view-all-committee")} className="add-cycle-btn">Add cycle</Button>
          </div>
        )
      }
    },
  ];

  console.log(committees);

  return (
    <>
      <StatisticsHeader user={user} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <Title style={{ color: "#166805", margin: 0 }} level={3}>Committee members list’s</Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Title style={{ color: "#166805", margin: "0 15px 0 0" }} level={3}>Available Members: 3/12</Title>
          <img width={40} src={memberIcon} />
        </div>
      </div>
      <Card className="my-card" style={{ marginBottom: "20px" }}>
        <Table dataSource={committees} columns={column} />
      </Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", marginTop: "40px" }}>
        <Title style={{ color: "#166805", margin: 0 }} level={3}>Committee Received</Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Title style={{ color: "#166805", margin: "0 15px 0 0" }} level={3}>Committee Remaining: 10/12</Title>
          <img width={40} src={memberIcon} />
        </div>
      </div>
      <Card className="my-card" style={{ marginBottom: "20px" }}>
        <Table dataSource={data2} columns={column2} />
      </Card>
    </>
  );
}

export default Setup;