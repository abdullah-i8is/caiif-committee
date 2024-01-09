import { useEffect, useLayoutEffect, useState } from "react";

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
  FloatButton,
} from "antd";
import {
  CarOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import memberIcon from '../assets/images/member2.svg'
import StatisticsHeader from "../components/statistics/statisticsHeader";
import axios from "axios";
import { API_URL } from "../config/api";
import { SpinnerCircular } from "spinners-react";
import { setCommittees } from "../store/committeeSlice/committeeSlice";
import { GetAdminCommittees, GetUserCommittees } from "../middlewares/commitee";


function Home() {

  const { Title, Text } = Typography;
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [data2, setData2] = useState([])
  const [loading, setLoading] = useState(false)

  const column = [
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Name</Title>,
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => {
        return <Title style={{ fontSize: "18px", margin: 0 }}>{record?.committeeDetails?.committee?.name}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Amount</Title>,
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>$ {record?.committeeDetails?.committee?.amount}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Members</Title>,
      dataIndex: 'members',
      key: 'members',
      render: (text, record) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img width={30} src={memberIcon} />
            <Title style={{ fontSize: "16px", margin: "0 0 0 10px", color: "#818181" }}>{record?.committeeDetails?.committee?.members}</Title>
          </div>
        )
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Start Date</Title>,
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{new Date(record?.committeeDetails?.committee?.startDate).toLocaleDateString()}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>End Date</Title>,
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{new Date(record?.committeeDetails?.committee?.endDate).toLocaleDateString()}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Cycle</Title>,
      dataIndex: 'cycle',
      key: 'cycle',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.committeeDetails?.committee?.cycle.type}</Title>
      }
    },
    // {
    //   title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Available</Title>,
    //   dataIndex: 'available',
    //   key: 'available',
    //   render: (text, record) => {
    //     return (
    //       <div style={{ display: "flex", alignItems: "center" }}>
    //         <img width={30} src={memberIcon} />
    //         <Title style={{ fontSize: "16px", margin: "0 0 0 10px", color: "#818181" }}>{record?.committeeDetails?.committee?.available}</Title>
    //       </div>
    //     )
    //   }
    // },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Payment</Title>,
      dataIndex: 'payment',
      key: 'payment',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.committeeDetails?.committee?.payment}</Title>
      }
    },
    // {
    //   title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Payment</Title>,
    //   dataIndex: 'payment',
    //   key: 'payment',
    //   render: (text, record) => {
    //     return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.committeeDetails?.committee?.payment}</Title>
    //   }
    // },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}></Title>,
      render: (text, record) => {
        return (
          <Button style={{ margin: "0 0 0 20px" }} onClick={() => navigate(`/view-committee/${record?.committeeDetails?.committee?._id}`)} className="add-cycle-btn">View</Button>
        )
      }
    },
  ];

  const column2 = [
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Name</Title>,
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => {
        return <Title style={{ fontSize: "18px", margin: 0 }}>{record?.name}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Amount</Title>,
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>$ {record?.amount}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Members</Title>,
      dataIndex: 'members',
      key: 'members',
      render: (text, record) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img width={30} src={memberIcon} />
            <Title style={{ fontSize: "16px", margin: "0 0 0 10px", color: "#818181" }}>{record?.members}</Title>
          </div>
        )
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Start Date</Title>,
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.startDate}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>End Date</Title>,
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.endDate}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Cycle</Title>,
      dataIndex: 'cycle',
      key: 'cycle',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.cycle}</Title>
      }
    },
    // {
    //   title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Available</Title>,
    //   dataIndex: 'available',
    //   key: 'available',
    //   render: (text, record) => {
    //     return (
    //       <div style={{ display: "flex", alignItems: "center" }}>
    //         <img width={30} src={memberIcon} />
    //         <Title style={{ fontSize: "16px", margin: "0 0 0 10px", color: "#818181" }}>{record?.available}</Title>
    //       </div>
    //     )
    //   }
    // },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Payment</Title>,
      dataIndex: 'payment',
      key: 'payment',
      render: (text, record) => {
        return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.payment}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}></Title>,
      render: (text, record) => {
        return (
          <Button style={{ margin: "0 0 0 20px" }} onClick={() => navigate(`/view-committee/${record?.committeeDetails?.committee?._id}`)} className="add-cycle-btn">View</Button>
        )
      }
    },
  ];

  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.common.token)
  const approveMembers = useSelector((state) => state.members.approveMembers)
  const committees = useSelector((state) => state.committees.committees)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user?.userType === "admin") {
      setLoading(true)
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
    }
    if (user?.userType === "user") {
      setLoading(true)
      GetUserCommittees(token)
        .then((res) => {
          if (res.status === 200) {
            console.log(res);
            setLoading(false)
            const committee = res.data.allCommittees
            dispatch(setCommittees([...committee.level1, ...committee.level2, ...committee.level3]))
          }
        })
        .catch((err) => {
          setLoading(false)
          console.log(err);
        })
    }
  }, [user])

  console.log(committees);

  return (
    <>
      <StatisticsHeader approveMembers={approveMembers} user={user} committees={committees} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <Title style={{ color: "#166805", margin: 0 }} level={3}>Committee</Title>
        </div>
        <div>
          {user?.userType === "admin" && <Button onClick={() => navigate("/committee-details")} className="view-all-btn">Create Committee</Button>}
          <Button style={{ margin: "0 0 0 20px" }} onClick={() => navigate("/view-all-committee")} className="view-all-btn">View All</Button>
        </div>
      </div>
      <Card className="my-card">
        <Table
          dataSource={user?.userType === "admin" ? committees : user?.userType === "user" ? committees.filter((com) => com.committee.userIds.some((id) => id === user?._id)) : null}
          columns={column}
          loading={loading}
        />
      </Card>
    </>
  );
}

export default Home;