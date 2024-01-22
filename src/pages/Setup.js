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
  Select,
} from "antd";
import {
  CarOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import memberIcon from '../assets/images/member2.svg'
import deleteIcon from '../assets/images/del-icon.svg'
import StatisticsHeader from "../components/statistics/statisticsHeader";
import { GetAdminCommittees, GetUserCommittees } from "../middlewares/commitee";
import { setCommittees } from "../store/committeeSlice/committeeSlice";
import { GetAllMembers } from "../middlewares/members";
import { setApproveMembers } from "../store/membersSlice/membersSlice";

function Setup() {

  const { Title, Text } = Typography;
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.common.token)
  const committees = useSelector((state) => state.committees.committees)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [details, setDetails] = useState([])
  const approveMembers = useSelector((state) => state.members.approveMembers)

  useEffect(() => {
      setLoading(true)
      GetAdminCommittees(token)
        .then((res) => {
          const committee = res.data.allCommittees
          dispatch(setCommittees([...committee.level1, ...committee.level2, ...committee.level3]))
          setLoading(false)
        })
        .catch((err) => {
          console.log(err);
          setLoading(false)
        })
      GetAllMembers(token)
        .then((res) => {
          console.log(res?.data);
          dispatch(setApproveMembers(res?.data?.users))
        })
        .catch((error) => {
          console.log(error);
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
        return <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>{record?.name}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Email</Title>,
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.email}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Phone Number</Title>,
      dataIndex: 'phonenumber',
      key: 'phonenumber',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.contactNumber}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Level</Title>,
      dataIndex: 'level',
      key: 'level',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.level}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Enroll</Title>,
      dataIndex: 'enroll',
      key: 'enroll',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.committeeList?.length}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Enroll</Title>,
      dataIndex: 'enroll',
      key: 'enroll',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.committeeList[0].received === true ? "RECEIVED" : "NOT RECEIVED"}</Title>
      }
    },
    // {
    //   title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Action</Title>,
    //   render: (text, record) => {
    //     return (
    //       <Select
    //         defaultValue="Select"
    //         style={{ width: "100%" }}
    //         options={[
    //           { value: "RECEIVED", label: "RECEIVED" },
    //           { value: "NOT RECEIVED", label: "NOT RECEIVED" }
    //         ]}
    //       />
    //     )
    //   }
    // },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>View</Title>,
      render: (text, record) => {
        return (
          <Button onClick={() => navigate(`/members/verification-details/${record._id}`)} className="add-cycle-btn">View</Button>
        )
      }
    },
  ];

  const column2 = [
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Name</Title>,
      dataIndex: 'username',
      key: 'username',
      render: (text, record, index) => {
        return <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>{record?.name}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Email</Title>,
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.email}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Phone Number</Title>,
      dataIndex: 'phonenumber',
      key: 'phonenumber',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.contactNumber}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Level</Title>,
      dataIndex: 'level',
      key: 'level',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.level}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Enroll</Title>,
      dataIndex: 'enroll',
      key: 'enroll',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.committeeList?.length}</Title>
      }
    },

    // {
    //   title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Action</Title>,
    //   render: (text, record) => {
    //     return (
    //       <Select
    //         defaultValue="Select"
    //         style={{ width: "100%" }}
    //         options={[
    //           { value: "RECEIVED", label: "RECEIVED" },
    //           { value: "NOT RECEIVED", label: "NOT RECEIVED" }
    //         ]}
    //       />
    //     )
    //   }
    // },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>View</Title>,
      render: (text, record) => {
        return (
          <Button onClick={() => navigate(`/members/verification-details/${record._id}`)} className="add-cycle-btn">View</Button>
        )
      }
    },
  ];

  console.log(committees);

  return (
    <>
      {/* <StatisticsHeader user={user} approveMembers={approveMembers} /> */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <Title style={{ color: "#166805", margin: 0 }} level={3}>Committee members list’s</Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Title style={{ color: "#166805", margin: "0 15px 0 0" }} level={3}>Available Members: {approveMembers?.length}/12</Title>
          <img width={40} src={memberIcon} />
        </div>
      </div>
      <Card className="my-card" style={{ marginBottom: "20px" }}>
        <Table loading={loading} dataSource={committees?.map((f) => f?.committeeDetails?.enrolledUsers)?.flat()} columns={column} />
      </Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", marginTop: "40px" }}>
        <Title style={{ color: "#166805", margin: 0 }} level={3}>Committee Received</Title>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Title style={{ color: "#166805", margin: "0 15px 0 0" }} level={3}>Committee Remaining: 10/12</Title>
          <img width={40} src={memberIcon} />
        </div>
      </div>
      <Card className="my-card" style={{ marginBottom: "20px" }}>
        <Table loading={loading} dataSource={committees?.map((f) => f?.committeeDetails?.receivedUsers)?.flat()} columns={column2} />
      </Card>
    </>
  );
}

export default Setup;