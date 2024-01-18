import { useEffect, useState } from "react";

import {
    Card,
    Col,
    Row,
    Typography,
    Button,
    Form,
    Input,
    notification,
    Select,
    DatePicker
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import denyIcon from '../assets/images/deny.svg'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../config/api";
import { GetAdminCommittees } from "../middlewares/commitee";
import { setCommittees } from "../store/committeeSlice/committeeSlice";
import moment from 'moment'

function VerificationDetails() {

    const { Title, Text } = Typography;
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [additionalDetail, setAdditionalDetail] = useState(false)
    const navigate = useNavigate()
    const token = useSelector((state) => state.common.token)
    const [user, setUser] = useState()
    const [commitee, setCommittee] = useState()
    const state = useSelector((state) => state)
    const [note, setNote] = useState("");
    const [myNotes, setMyNotes] = useState([
        { note: "" }
    ]);
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement, message) => {
        api.success({
            message: `Notification`,
            description: message,
            placement,
        });
        if (message === "network error") {
            api.error({
                message: `Notification`,
                description: "network error",
                placement,
            });
        }
    };
    const { id, cid } = useParams()

    async function getUser() {
        try {
            const response = await axios.get(`${API_URL}/admin/userById/${id}`, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            if (response.status === 200) {
                console.log(response);
                setUser(response.data.user)
                try {
                    const res = await axios.get(`${API_URL}/user/committeeById/${response.data.user?.committeeList[0]?.cid}`)
                    setCommittee(res?.data?.data?.committee)
                    console.log(res);
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUser()
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
    }, [id])

    async function handleSubmit() {
        setLoading(true)
        try {
            const response = await axios.post(`${API_URL}/admin/additionalData/${id}`, {
                cId: user?.cId,
                firstName: user?.firstName,
                lastName: user?.lastName,
                email: user?.email,
                contactNumber: user?.contactNumber,
                jobOccupation: user?.jobOccupation,
                contactNumber: user?.contactNumber,
                sin: user?.sin,
                residentialAddress: user?.residentialAddress,
                residentialStatus: user?.residentialStatus,
                grossAnnualIncome: user?.grossAnnualIncome,
                sourceOfIncome: user?.sourceOfIncome,
                employmentStatus: user?.employmentStatus,
                appointment: {
                    date: user?.appointment?.date,
                },
                DOB: user?.appointment?.DOB,
                address1: user?.address1,
                address2: user?.address2,
                city: user?.city,
                province: user?.province,
                postalCode: user?.postalCode,
                adminNote: user?.adminNotes,
            }, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            if (response.status === 200) {
                setLoading(false)
                openNotification("topRight", "Profile update successfully")
                getUser()
                console.log(response);
            }
        } catch (error) {
            setLoading(false)
            api.error({
                message: `Notification`,
                description: error?.response?.data?.message,
                placement: "topRight",
            });
            console.log(error);
        }
    }

    const handleChange = async (value, name) => {
        console.log(value, name);
        setUser((prevDetail) => {
            return {
                ...prevDetail,
                [name]: value
            }
        })
        if (name === "cId") {
            console.log(value);
            const findCom = state?.committees?.committees?.find((f) => f?.committeeDetails?.committee._id === value)
            console.log(findCom?.committeeDetails?.committee);
            setCommittee(findCom?.committeeDetails?.committee)
            setUser((prevDetail) => {
                return {
                    ...prevDetail,
                    [name]: findCom?.committeeDetails?.committee?._id
                }
            })
        }
        if (name === "DOB") {
            setUser((prevDetail) => {
                return {
                    ...prevDetail,
                    [name]: value
                }
            })
        }
        if (name === "DOB") {
            setUser((prevDetail) => {
                return {
                    ...prevDetail,
                    [name]: value
                }
            })
        }
        if (name === "appointment") {
            setUser((prevDetail) => {
                return {
                    ...prevDetail,
                    appointment: {
                        date: value,
                    },
                }
            })
        }
    }

    console.log(user);
    // console.log(commitee);
    // console.log(myNotes);

    return (
        <>
            {contextHolder}
            <div style={{ marginBottom: "20px", marginTop: "50px" }}>
                <Title style={{ color: "#166805", margin: 0 }} level={3}>Verification Details</Title>
                {/* <div style={{ display: "flex", alignItems: "center" }}>
                    <Button loading={loading} onClick={() => handleApprove(false)} style={{ margin: "0 0 0 10px", width: "100px" }} className="deny-btn"> <img width={15} src={denyIcon} style={{ margin: "0 5px 0 0" }} /> Deny</Button>
                    <Button loading={loading2} onClick={() => handleApprove(true)} style={{ margin: "0 0 0 10px", width: "100px" }} className="add-cycle-btn"> Approve</Button>
                </div> */}
            </div>
            <Form
                form={form}
                layout="vertical"
            >
                <Card>
                    <Row gutter={[24, 0]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Card style={{ border: "2px solid #166805", marginBottom: 40, width: "50%" }}>
                                <img src={user?.nic} style={{ borderRadius: "10px", width: "100%", height: "150px", objectFit: "contain" }} />
                            </Card>
                        </Col>
                        <Col xs={16} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>First Name</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "firstName")} value={user?.firstName} />
                            </Form.Item>
                        </Col>
                        <Col xs={16} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Last Name</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "lastName")} value={user?.lastName} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Email Address</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "email")} value={user?.email} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Phone Number</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "contactNumber")} value={user?.contactNumber} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>DOB</Title>}>
                                <Input value={new Date(user?.DOB).toLocaleDateString()} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Date Of Birth</Title>}>
                                <DatePicker
                                    onChange={(date) => handleChange(date, "DOB")}
                                    inputReadOnly={true}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Sin</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "sin")} value={user?.sin} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>City</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "city")} value={user?.city} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Province</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "province")} value={user?.province} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Postal Code</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "postalCode")} value={user?.postalCode} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={8}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Address</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "address1")} value={user?.address1} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={8}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Street Address</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "address2")} value={user?.address2} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={8}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Residential Address</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "residentialAddress")} value={user?.residentialAddress} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={8}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Residential Status</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "residentialStatus")} value={user?.residentialStatus} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={8}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Employed Status</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "employmentStatus")} value={user?.employmentStatus} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={8}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Source Of Income</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "sourceOfIncome")} value={user?.sourceOfIncome} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={8}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Gross Annual Income</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "grossAnnualIncome")} value={user?.grossAnnualIncome} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Job Occupation</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "jobOccupation")} value={user?.jobOccupation} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Appointment</Title>}>
                                <Input value={new Date(user?.appointment?.date).toLocaleDateString()} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Select Appointment</Title>}>
                                <DatePicker
                                    showTime={{
                                        format: 'h A', // 12-hour format with AM/PM
                                        minuteStep: 60, // Set minuteStep to 60 to hide minutes
                                    }}
                                    format="YYYY-MM-DD h A" // 12-hour format with only hours and AM/PM
                                    style={{ width: '100%' }}
                                    onChange={(date) => handleChange(date, "appointment")}
                                    inputReadOnly={true}
                                    disabledDate={(current) => {
                                        const dayOfWeek = current.day();
                                        if (dayOfWeek === 0 || dayOfWeek === 6) {
                                            return true;
                                        }
                                        const currentYear = moment().year();
                                        const currentMonth = moment().month();
                                        const currentDay = moment().date();
                                        const isPreviousYear = current.year() < currentYear;
                                        const isCurrentYear = current.year() === currentYear;
                                        const isPastDateInCurrentYear = isCurrentYear && (
                                            (current.month() < currentMonth) ||
                                            (current.month() === currentMonth && current.date() < currentDay)
                                        );
                                        return isPreviousYear || isPastDateInCurrentYear;
                                    }}
                                // renderExtraFooter={() => (
                                //     <div>
                                //         <span>Selected Date: {user?.appointment?.date ? user?.appointment?.date.format('YYYY-MM-DD HH') : 'None'}</span>
                                //     </div>
                                // )}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ marginBottom: 20 }}>
                            <Button onClick={() => {
                                setUser((prevDetail) => {
                                    return {
                                        ...prevDetail,
                                        adminNotes: [...prevDetail?.adminNotes, { note: "" }]
                                    }
                                })
                            }} className="add-cycle-btn">Add note</Button>
                        </Col>

                        {user?.adminNotes?.map((note, index) => {
                            return (
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} key={index}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                        <Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Note</Title>
                                        <Button onClick={() => {
                                            setUser((prevDetail) => {
                                                return {
                                                    ...prevDetail,
                                                    adminNotes: prevDetail?.adminNotes?.filter((f) => f._id !== note?._id)
                                                }
                                            })
                                        }} className="add-cycle-btn">Delete note</Button>
                                    </div>
                                    <Form.Item
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Please input your Note!',
                                            },
                                        ]}
                                    >
                                        <Input.TextArea
                                            onChange={(e) => {
                                                setUser((prevUser) => {
                                                    const newArr = [...prevUser?.adminNotes];
                                                    newArr[index] = {
                                                        note: e.target.value,
                                                    };
                                                    return { ...prevUser, adminNotes: newArr };
                                                });
                                            }}
                                            value={note?.note}
                                        />
                                    </Form.Item>
                                </Col>
                            )
                        })}

                        {user?.approve === false && <Col xs={24} sm={24} md={12} lg={24} xl={24}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Select Committee</Title>}>
                                <Select
                                    defaultValue="Select Committee"
                                    style={{ width: "100%" }}
                                    options={state?.committees?.committees?.map((opt) => ({ value: opt?.committeeDetails?.committee?._id, label: opt?.committeeDetails?.committee?.name }))}
                                    onChange={(e) => handleChange(e, "cId")}
                                />
                            </Form.Item>
                        </Col>}
                        {/* <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Committee Number</Title>}>
                                <Input disabled={user?.approve === true ? true : false} onChange={(e) => setCommittee((prevDetail) => {
                                    return {
                                        ...prevDetail,
                                        commiteeNumber: e.target.value
                                    }
                                })} value={commitee?.commiteeNumber} />
                            </Form.Item>
                        </Col> */}
                        <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Committee</Title>}>
                                <Input disabled={user?.approve === true ? true : false} value={commitee?.name} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Payment</Title>}>
                                <Input disabled={user?.approve === true ? true : false} value={`$ ${commitee?.amount}`} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Amount</Title>}>
                                <Input disabled={user?.approve === true ? true : false} value={`$ ${commitee?.payment}`} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Members</Title>}>
                                <Input disabled={user?.approve === true ? true : false} value={commitee?.members} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Start Date</Title>}>
                                <Input disabled={user?.approve === true ? true : false} value={new Date(commitee?.startDate).toLocaleDateString()} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={4} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>End Date</Title>}>
                                <Input disabled={user?.approve === true ? true : false} value={new Date(commitee?.endDate).toLocaleDateString()} />
                            </Form.Item>
                        </Col>

                        {/* <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ marginBottom: additionalDetail ? 30 : 0 }}>
                            <Button onClick={() => setAdditionalDetail(true)} className="add-cycle-btn">Add Additional Detail</Button>
                        </Col> */}
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Button loading={loading} onClick={handleSubmit} className="add-cycle-btn">Submit</Button>
                        </Col>
                        {/* {additionalDetail && ( */}
                        {/* <> */}
                        {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Form.Item name="bankBranchName" rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Bank Branch Name!',
                                        },
                                    ]} label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Bank Branch Name</Title>}>
                                        <Input onChange={(e) => handleChange(e.target.value, "bankBranchName")} />
                                    </Form.Item>
                                </Col> */}
                        {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        name="accountNumber"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Account Number!',
                                            },
                                        ]} label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Bank Account Number</Title>}>
                                        <Input onChange={(e) => handleChange(e.target.value, "bankBranchName")} />
                                    </Form.Item>
                                </Col> */}
                        {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        name="workAddress"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Work Address!',
                                            },
                                        ]}
                                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Work Address</Title>}>
                                        <Input />
                                    </Form.Item>
                                </Col> */}
                        {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        name="residentialAddress"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Residential Address!',
                                            },
                                        ]}
                                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Residential Address</Title>}>
                                        <Input />
                                    </Form.Item>
                                </Col> */}
                        {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        name="monthlyIncome"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Monthly Income!',
                                            },
                                        ]}
                                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Monthly Income</Title>}>
                                        <Input />
                                    </Form.Item>
                                </Col> */}
                        {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        name="emergencyContactRelation"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Emergency Contact Relation!',
                                            },
                                        ]}
                                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Emergency Contact Relation</Title>}>
                                        <Input />
                                    </Form.Item>
                                </Col> */}
                        {/* <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        name="emergencyContact"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your Emergency Contact!',
                                            },
                                        ]}
                                        label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Emergency Contact</Title>}>
                                        <Input />
                                    </Form.Item>
                                </Col> */}

                        {/* </>
                        )} */}
                    </Row>
                </Card>
            </Form>
        </>
    );
}

export default VerificationDetails;