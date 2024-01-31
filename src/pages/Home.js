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

  Form,
  Select,
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
import { GetAdminCommittees, GetUserCommittees, GetUserallCommittees } from "../middlewares/commitee";
import { setApproveMembers } from "../store/membersSlice/membersSlice";
import { GetAllMembers } from "../middlewares/members";

function Home() {

  const { Title, Text } = Typography;
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [data2, setData2] = useState([])
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [id, setID] = useState("")
  const [cName, setCname] = useState("")
  const [show, setShow] = useState(false)
  const [api, contextHolder] = notification.useNotification();
  const [showModal, setShowModal] = useState(false)
  const [committeeID, setCommitteeID] = useState("")
  const [committeeOptions, setCommitteeOptions] = useState([]);

  async function deleteCommittee() {
    setLoading2(true)
    try {
      const response = await axios.get(`${API_URL}/admin/deleteCommittee/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.status === 200) {
        setLoading2(false)
        setShow(false)
        api.success({
          message: `Notification`,
          description: response?.data?.message,
          placement: "bottomRight",
        });
        setLoading(true)
        GetAdminCommittees(token)
          .then((res) => {
            dispatch(setCommittees(res.data.allCommittees))
            if (res.status === 200) {
              console.log(res);
              setLoading(false)
            }
          })
          .catch((err) => {
            console.log(err);
            setLoading(false)
          })
        console.log(response);
      }
    } catch (error) {
      setLoading2(false)
      setShow(false)
    }
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const response = await axios.post(
        `${API_URL}/user/reqForCommittee`, { cId: committeeID }, // Send cId in the request body
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      if (response.status === 200) {
        setLoading(false);
        api.success({
          message: "Notification",
          description: "Enroll request sent successfully",
          placement: "bottomRight",
        });
        console.log(response);
      }
    } catch (error) {
      setLoading(false);
      api.error({
        message: "Notification",
        description: error?.response?.data?.message,
        placement: "bottomRight",
      });
      console.log(error);
    }
  }

  const column = [
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Committee ID</Title>,
      dataIndex: 'uniqueId',
      key: 'uniqueId',
      render: (text, record, index) => {
        return <Title onClick={() => navigate(`/dashboard/view-committee/${record?.committeeDetails?.committee?._id}`)} style={{ fontSize: "18px", margin: 0, cursor: "pointer" }}>{record?.committeeDetails?.committee?.uniqueId}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Name</Title>,
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => {
        return <Title onClick={() => navigate(`/dashboard/view-committee/${record?.committeeDetails?.committee?._id}`)} style={{ fontSize: "18px", margin: 0, cursor: "pointer" }}>{record?.committeeDetails?.committee?.name}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Contribution</Title>,
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => {
        return <Title onClick={() => navigate(`/dashboard/view-committee/${record?.committeeDetails?.committee?._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181", cursor: "pointer" }}>$ {record?.committeeDetails?.committee?.amount}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Payout</Title>,
      dataIndex: 'payment',
      key: 'payment',
      render: (text, record) => {
        return <Title onClick={() => navigate(`/dashboard/view-committee/${record?.committeeDetails?.committee?._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181", cursor: "pointer" }}>$ {record?.committeeDetails?.committee?.payment}</Title>
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
            <Title style={{ fontSize: "16px", margin: "0 0 0 10px", color: "#818181", cursor: "pointer" }}>{record?.committeeDetails?.enrolledUsers?.length + "/" + record?.committeeDetails?.committee?.members}</Title>
          </div>
        )
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600", cursor: "pointer" }}>Start Date</Title>,
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text, record) => {
        return <Title onClick={() => navigate(`/dashboard/view-committee/${record?.committeeDetails?.committee?._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{new Date(record?.committeeDetails?.committee?.startDate).toLocaleDateString()}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600", cursor: "pointer" }}>End Date</Title>,
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text, record) => {
        return <Title onClick={() => navigate(`/dashboard/view-committee/${record?.committeeDetails?.committee?._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181", cursor: "pointer" }}>{new Date(record?.committeeDetails?.committee?.endDate).toLocaleDateString()}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Cycle</Title>,
      dataIndex: 'cycle',
      key: 'cycle',
      render: (text, record) => {
        return <Title onClick={() => navigate(`/dashboard/view-committee/${record?.committeeDetails?.committee?._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181", cursor: "pointer" }}>{record?.committeeDetails?.committee?.cycle?.type}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Term</Title>,
      dataIndex: 'cycle',
      key: 'cycle',
      render: (text, record) => {
        return <Title onClick={() => navigate(`/dashboard/view-committee/${record?.committeeDetails?.committee?._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181", cursor: "pointer" }}>8 months</Title>
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
          <>
            <Button style={{ margin: "0 20px 0 0" }} onClick={() => navigate(`/dashboard/view-committee/${record?.committeeDetails?.committee?._id}`)} className="add-cycle-btn">View</Button>
            <Button style={{ margin: "0" }} onClick={() => {
              setID(record?.committeeDetails?.committee?._id)
              setCname(record?.committeeDetails?.committee?.uniqueId)
              setShow(true)
            }} className="add-cycle-btn">Delete</Button>
          </>
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
        console.log(record);
        return <Title onClick={() => navigate(`/dashboard/view-committee/${record?.committee?._id}`)} style={{ fontSize: "18px", margin: 0, cursor: "pointer" }}>{record?.committee?.name}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Contribution</Title>,
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => {
        return <Title onClick={() => navigate(`/dashboard/view-committee/${record?.committee?._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181", cursor: "pointer" }}>$ {record?.committee?.payment}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Members</Title>,
      dataIndex: 'members',
      key: 'members',
      render: (text, record) => {
        return (
          <div onClick={() => navigate(`/dashboard/view-committee/${record?.committee?._id}`)} style={{ display: "flex", alignItems: "center" }}>
            <img width={30} src={memberIcon} />
            <Title style={{ fontSize: "16px", margin: "0 0 0 10px", color: "#818181", cursor: "pointer" }}>{record?.committee?.members}</Title>
          </div>
        )
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Start Date</Title>,
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text, record) => {
        return <Title onClick={() => navigate(`/dashboard/view-committee/${record?.committee?._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181", cursor: "pointer" }}>{new Date(record?.committee?.startDate).toLocaleDateString()}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>End Date</Title>,
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text, record) => {
        return <Title onClick={() => navigate(`/dashboard/view-committee/${record?.committee?._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181", cursor: "pointer" }}>{new Date(record?.committee?.endDate).toLocaleDateString()}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Cycle</Title>,
      dataIndex: 'cycle',
      key: 'cycle',
      render: (text, record) => {
        return <Title onClick={() => navigate(`/dashboard/view-committee/${record?.committee?._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181", cursor: "pointer" }}>{record?.committee?.cycle?.type}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600", cursor: "pointer" }}>Term</Title>,
      dataIndex: 'cycle',
      key: 'cycle',
      render: (text, record) => {
        return <Title onClick={() => navigate(`/dashboard/view-committee/${record?.committee?._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181", cursor: "pointer" }}>8 months</Title>
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
    //         <Title style={{ fontSize: "16px", margin: "0 0 0 10px", color: "#818181" }}>{record?.committee?.available}</Title>
    //       </div>
    //     )
    //   }
    // },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600", cursor: "pointer" }}>Payout</Title>,
      dataIndex: 'payment',
      key: 'payment',
      render: (text, record) => {
        return <Title onClick={() => navigate(`/dashboard/view-committee/${record?.committee?._id}`)} style={{ fontSize: "16px", margin: 0, color: "#818181" }}>$ {record?.committee?.amount}</Title>
      }
    },
    {
      title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}></Title>,
      render: (text, record) => {
        return (
          <Button style={{ margin: "0 0 0 20px" }} onClick={() => navigate(`/dashboard/view-committee/${record?.committee?._id}`)} className="add-cycle-btn">View</Button>
        )
      }
    },
  ];

  const state = useSelector((state) => state)
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.common.token)
  const approveMembers = useSelector((state) => state.members.approveMembers)
  const committees = useSelector((state) => state.committees.committees)
  const dispatch = useDispatch()

  useEffect(() => {
    GetAllMembers(token)
      .then((res) => {
        console.log(res?.data);
        dispatch(setApproveMembers(res?.data?.users))
      })
      .catch((error) => {
        console.log(error);
      })
    if (user?.userType === "admin") {
      setLoading(true)
      GetAdminCommittees(token)
        .then((res) => {
          dispatch(setCommittees(res.data.allCommittees))
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
      GetUserallCommittees(token)
        .then((res) => {
          if (res.status === 200) {
            console.log(res);
            setLoading(false)
            const committee = res.data.data.committees
            dispatch(setCommittees(committee))
          }
        })
        .catch((err) => {
          setLoading(false)
          console.log(err);
        })
      GetUserCommittees()
        .then((res) => {
          setCommitteeOptions(res.data.committees);
        })
        .catch((err) => {
          console.log(err);
        });
    }

  }, [user])

  console.log(committees);

  return (
    <>
      {contextHolder}
      <Modal
        okButtonProps={{ style: { backgroundColor: "#166805" }, loading: loading2 }}
        okText="Delete"
        centered
        open={show}
        onOk={() => {
          deleteCommittee()
        }}
        onCancel={() => setShow(false)}
      >
        <Title style={{ color: "#166805", margin: "0 0 20px 0" }} level={5}>Are your sure want to delete {cName} commitee ?</Title>
      </Modal>
      {user?.userType === "user" && (
        <>
          <Modal
            okButtonProps={{ style: { backgroundColor: "#166805" } }}
            centered
            open={showModal}
            onOk={() => {
              handleSubmit()
              setShowModal(false)
            }}
            onCancel={() => setShowModal(false)}
          >
            <Title style={{ color: "#166805", margin: "0 0 20px 0" }} level={3}>New Committee Request</Title>
            <Card style={{ marginBottom: "20px" }}>
              <Row gutter={[24, 0]}>

                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Select Committee</Title>}>
                    <Select
                      defaultValue="Select Committee"
                      style={{ width: "100%" }}
                      options={committeeOptions?.map((opt) => ({
                        value: opt?._id,
                        label: opt?.name
                      }))}
                      // options={state?.committees?.committees?.map((opt) => ({ 
                      //   value: opt?.committeeDetails?.committee?._id, 
                      //   label: opt?.committeeDetails?.committee?.uniqueId }))}
                      onChange={(e) => setCommitteeID(e)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Modal>
        </>
      )}
      <StatisticsHeader
        approveMembers={approveMembers}
        user={user}
        committees={committees}
      />
      {user?.userType === "user" ? (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Title style={{ color: "#166805", margin: 0 }} level={3}>Committee</Title>
          <Button onClick={() => setShowModal(true)} className="add-cycle-btn" style={{ float: "right" }}>Enroll Committee</Button>
        </div>
      ) : (
        <Title style={{ color: "#166805", margin: 0 }} level={3}>Committee</Title>
      )}
      <Card className="my-card" style={{ marginTop: 40 }}>
        <Table
          dataSource={committees?.slice().sort((a, b) => {
            const dateA = a?.committeeDetails?.committee?.createdAt;
            const dateB = b?.committeeDetails?.committee?.createdAt;

            // Handle null or undefined values
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;

            // Convert to Date objects if necessary
            const dateObjA = new Date(dateA);
            const dateObjB = new Date(dateB);

            // Sort in descending order
            return dateObjB - dateObjA;
          })}
          columns={user?.userType === "admin" ? column : column2}
          loading={loading}
          pagination={false}
        />

      </Card>
    </>
  );
}

export default Home;