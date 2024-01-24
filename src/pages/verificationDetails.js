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
import crossIcon from "../assets/images/cross-icon.png";
import downloadIcon from "../assets/images/download-icon.png";
import moment from 'moment'

function VerificationDetails() {

    const { Title, Text } = Typography;
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [fullScreen, setFullScreen] = useState(false)
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
            placement: "bottomRight",
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
                DOB: user?.DOB,
                // DOB: {
                //     day: user?.DOB?.day,
                //     month: user?.DOB?.month,
                //     year: user?.DOB?.year,
                // },
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
                api.success({
                    message: `Notification`,
                    description: "Profile update successfully",
                    placement: "bottomRight",
                });
                getUser()
                console.log(response);
            }
        } catch (error) {
            setLoading(false)
            api.error({
                message: `Notification`,
                description: error?.response?.data?.message,
                placement: "bottomRight",
            });
            console.log(error);
        }
    }

    const handleChange = async (value, name, ind) => {
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
            console.log(findCom);
            setCommittee(findCom?.committeeDetails?.committee)
            setUser((prevDetail) => {
                console.log(prevDetail);
                return prevDetail?.committeeList?.map((val, index) => {
                    if (ind === index) {
                        return {
                            ...prevDetail,
                            committeeNumber: "",
                            received: false,
                            _id: "",
                            cid: {
                                amount: findCom?.committeeDetails?.committee?.amount,
                                completed: findCom?.committeeDetails?.committee?.completed,
                                createdAt: findCom?.committeeDetails?.committee?.createdAt,
                                cycle: { type: findCom?.committeeDetails?.committee?.cycle.type, value: findCom?.committeeDetails?.committee?.cycle.value },
                                endDate: findCom?.committeeDetails?.committee?.endDate,
                                members: findCom?.committeeDetails?.committee?.members,
                                name: findCom?.committeeDetails?.committee?.name,
                                payment: findCom?.committeeDetails?.committee?.payment,
                                recievedBy: findCom?.committeeDetails?.committee?.recievedBy,
                                startDate: findCom?.committeeDetails?.committee?.startDate,
                                uniqueId: findCom?.committeeDetails?.committee?.uniqueId,
                                updatedAt: findCom?.committeeDetails?.committee?.updatedAt,
                                userIds: findCom?.committeeDetails?.committee?.userIds,
                                __v: findCom?.committeeDetails?.committee?._v,
                                _id: findCom?.committeeDetails?.committee?._id,
                            }
                        }
                    }
                    else {
                        return val
                    }
                })
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
        if (name === "employmentStatus") {
            setUser((prevDetail) => {
                return {
                    ...prevDetail,
                    [name]: value,
                }
            })
        }
        if (name === "residentialStatus") {
            setUser((prevDetail) => {
                return {
                    ...prevDetail,
                    [name]: value,
                }
            })
        }
        if (name === "sourceOfIncome") {
            setUser((prevDetail) => {
                return {
                    ...prevDetail,
                    [name]: value,
                }
            })
        }
        if (name === "province") {
            setUser((prevDetail) => {
                return {
                    ...prevDetail,
                    [name]: value,
                }
            })
        }
    }

    async function handleApprove(type) {
        setLoading(type === "DECLINE" ? true : false)
        setLoading2(type === "APPROVE" ? true : false)
        try {
            const response = await axios.post(`${API_URL}/admin/approveAccount/${id}`, {
                approve: type === "APPROVE" ? true : false,
                cId: commitee
            }, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            if (response.status === 200) {
                console.log(response);
                if (response.data.message === "Account deleted Successfully") {
                    navigate("/members")
                }
                setLoading(false)
                setLoading2(false)
                api.success({
                    message: `Notification`,
                    description: response?.data?.message,
                    placement: "bottomRight",
                });
                getUser()
            }
        } catch (error) {
            setLoading(false)
            setLoading2(false)
            console.log(error);
            api.error({
                message: `Notification`,
                description: error?.response?.data?.message ? error?.response?.data?.message : "network error",
                placement: "bottomRight",
            });
        }
    }

    async function downloadImage() {
        try {
            const response = await fetch(user?.nic);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'downloaded_image.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    }

    async function downloadPDF() {
        try {
            const response = await fetch(user?.nic);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'downloaded_file.pdf';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading PDF:', error);
        }
    }

    console.log(user);
    console.log(commitee);

    return (
        <>
            {contextHolder}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", marginTop: "50px" }}>
                <Title style={{ color: "#166805", margin: 0 }} level={3}>Verification Details</Title>
                {user?.approve === false && <div style={{ display: "flex", alignItems: "center" }}>
                    <Button onClick={() => {
                        handleApprove("DECLINE")
                    }} loading={loading} style={{ margin: "0 0 0 10px", width: "100px" }} className="deny-btn"> <img width={15} src={denyIcon} style={{ margin: "0 5px 0 0" }} /> Deny</Button>
                    <Button onClick={() => {
                        handleApprove("APPROVE")
                    }} loading={loading2} style={{ margin: "0 0 0 10px", width: "100px" }} className="add-cycle-btn"> Approve</Button>
                </div>}
            </div>
            <Form
                form={form}
                layout="vertical"
            >
                <Card>
                    <Row gutter={[24, 0]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} onClick={() => setFullScreen(true)} style={{ cursor: "pointer" }}>
                            <Card style={{ border: "2px solid #166805", marginBottom: 40, width: "50%" }}>
                                {user?.nic.includes(".pdf") ? (
                                    <iframe
                                        title="PDF Viewer"
                                        src={`https://docs.google.com/gview?url=${encodeURIComponent(user?.nic)}&embedded=true`}
                                        style={{ width: '100%', height: '250px', border: 'none' }}
                                    />
                                ) : !user?.nic.includes(".pdf") ? (
                                    <img style={{ borderRadius: "10px", width: "100%", height: "150px", objectFit: "contain" }} src={user?.nic} />
                                ) : ""}
                            </Card>
                        </Col>
                        {fullScreen === true && (
                            <div class="image-container">
                                <img class="download-button" src={downloadIcon} onClick={() => user?.nic?.includes(".pdf") ? downloadPDF() : downloadImage()} />
                                <img class="close-button" src={crossIcon} onClick={() => setFullScreen(false)} />
                                <div class="fullscreen-overlay">
                                    {user?.nic.includes(".pdf") ? (
                                        <iframe
                                            title="PDF Viewer"
                                            src={`https://docs.google.com/gview?url=${encodeURIComponent(user?.nic)}&embedded=true`}
                                            class="fullscreen-image"
                                            width="85%"
                                            height="85%"
                                        />
                                    ) : !user?.nic.includes(".pdf") ? (
                                        <img alt="Your Image" class="fullscreen-image" src={user?.nic} />
                                    ) : ""}
                                </div>
                            </div>
                        )}
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
                                <Input
                                    placeholder="(___)___-___"
                                    value={user?.contactNumber}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 11) {
                                            const value = e.target.value.replace(/[^0-9]/g, '');
                                            const formattedValue = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                                            handleChange(formattedValue, "contactNumber")
                                        }
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Secondary phone</Title>}>
                                <Input
                                    placeholder="(___)___-___"
                                    value={user?.emergencyContact}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 11) {
                                            const value = e.target.value.replace(/[^0-9]/g, '');
                                            const formattedValue = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                                            handleChange(formattedValue, "emergencyContact")
                                        }
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Birth date (DD-MM-YYY)</Title>}>
                                <Input
                                    onChange={(e) => {
                                        setUser((prevDetail) => {
                                            return {
                                                ...prevDetail,
                                                DOB: e.target.value,
                                            };
                                        });
                                    }}
                                    value={user?.DOB}
                                />
                            </Form.Item>
                        </Col>

                        {/* <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Date Of Birth</Title>}>
                                <DatePicker
                                    onChange={(date) => handleChange(date, "DOB")}
                                    inputReadOnly={true}
                                />
                            </Form.Item>
                        </Col> */}
                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Sin</Title>}>
                                <Input
                                    placeholder="___-__-___"
                                    onChange={(e) => {
                                        if (e.target.value.length <= 9) {
                                            const inputValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                            const formattedValue = inputValue.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3'); // Format as 123-12-3123
                                            handleChange(formattedValue, "sin")
                                        }
                                    }}
                                    value={user?.sin}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>City</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "city")} value={user?.city} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Province</Title>}>
                                <Select
                                    value={user?.province}
                                    options={[
                                        { value: 'AB', label: 'Alberta' },
                                        { value: 'BC', label: 'British Columbia' },
                                        { value: 'MB', label: 'Manitoba' },
                                        { value: 'NB', label: 'New Brunswick' },
                                        { value: 'NL', label: 'Newfoundland and Labrador' },
                                        { value: 'NS', label: 'Nova Scotia' },
                                        { value: 'NT', label: 'Northwest Territories' },
                                        { value: 'NU', label: 'Nunavut' },
                                        { value: 'ON', label: 'Ontario' },
                                        { value: 'PE', label: 'Prince Edward Island' },
                                        { value: 'QC', label: 'Quebec' },
                                        { value: 'SK', label: 'Saskatchewan' },
                                        { value: 'YT', label: 'Yukon' },
                                    ]}
                                    onChange={(e) => handleChange(e, "province")}
                                />
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
                        {/* <Col xs={24} sm={24} md={6} lg={6} xl={8}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Residential Address</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "residentialAddress")} value={user?.residentialAddress} />
                            </Form.Item>
                        </Col> */}
                        <Col xs={24} sm={24} md={6} lg={6} xl={8}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Residential Status</Title>}>
                                <Select
                                    value={user?.residentialStatus}
                                    options={[
                                        { value: 'ownsHome', label: 'Owns Home' },
                                        { value: 'rents', label: 'Rents' },
                                        { value: 'livingWithFamily', label: 'Living with Family' },
                                        { value: 'studentHousing', label: 'Student Housing' },
                                        { value: 'temporaryAccommodation', label: 'Temporary Accommodation' },
                                    ]}
                                    onChange={(e) => handleChange(e, "residentialStatus")}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={8}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Employed Status</Title>}>
                                <Select
                                    value={user?.employmentStatus}
                                    options={[
                                        { value: 'fullTime', label: 'Full-Time' },
                                        { value: 'partTime', label: 'Part-Time' },
                                        { value: 'contract', label: 'Contract' },
                                        { value: 'temporary', label: 'Temporary' },
                                        { value: 'intern', label: 'Intern' },
                                        { value: 'freelancer', label: 'Freelancer' },
                                        { value: "selfEmployed", label: "Self-Employed" },
                                        { value: "unEmployed", label: "Un-Employed" },
                                    ]}
                                    onChange={(e) => handleChange(e, "employmentStatus")}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={8}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Source Of Income</Title>}>
                                <Select
                                    value={user?.sourceOfIncome}
                                    options={[
                                        { value: 'employment', label: 'Employment' },
                                        { value: 'selfEmployment', label: 'Self-Employment' },
                                        { value: 'freelance', label: 'Freelance' },
                                        { value: 'businessOwner', label: 'Business Owner' },
                                        { value: 'investment', label: 'Investment' },
                                        { value: 'retirement', label: 'Retirement' },
                                        { value: 'rentalIncome', label: 'Rental Income' },
                                        { value: 'governmentAssistance', label: 'Government Assistance' },
                                        { value: 'other', label: 'Other' },
                                    ]}
                                    onChange={(e) => handleChange(e, "sourceOfIncome")}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={6} lg={6} xl={8}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Gross Annual Income</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "grossAnnualIncome")} value={user?.grossAnnualIncome} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Occupation</Title>}>
                                <Input onChange={(e) => handleChange(e.target.value, "jobOccupation")} value={user?.jobOccupation} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={6} lg={6} xl={4}>
                            <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Appointment</Title>}>
                                <Input
                                    onChange={(e) => handleChange(e.target.value, "appointment")}
                                    value={user?.appointment?.date}
                                />
                            </Form.Item>
                        </Col>

                        {/* <Col xs={24} sm={24} md={6} lg={6} xl={4}>
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
                                    value={user?.appointment?.date ? moment(user.appointment.date) : null}
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
                        </Col> */}

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

                        <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ marginBottom: 20 }}>
                            <Button onClick={() => {
                                setUser((prevDetail) => {
                                    return {
                                        ...prevDetail,
                                        committeeList: [
                                            ...prevDetail?.committeeList,
                                            {
                                                committeeNumber: "",
                                                received: false,
                                                _id: "",
                                                cid: {
                                                    amount: "",
                                                    completed: false,
                                                    createdAt: "",
                                                    cycle: { type: '', value: '' },
                                                    endDate: "",
                                                    members: "",
                                                    name: "",
                                                    payment: "",
                                                    recievedBy: [],
                                                    startDate: "",
                                                    uniqueId: "",
                                                    updatedAt: "",
                                                    userIds: [],
                                                    __v: 28,
                                                    _id: "",
                                                }
                                            }
                                        ]
                                    }
                                })
                            }} className="add-cycle-btn" style={{ float: "right" }}>Add more commitee</Button>
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
                        {user?.committeeList?.map((com, ind) => {
                            return (
                                <>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Title style={{ color: "#166805", margin: "0 0 20px 0" }} level={3}>Committee {com?.cid?.uniqueId}</Title>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                                        <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Select Committee</Title>}>
                                            <Select
                                                value={com?.cid?.uniqueId ? com?.cid?.uniqueId : state?.committees?.committees?.find((opt) => opt?.committeeDetails?.committee?._id === user?.cId)?.committeeDetails?.committee?.uniqueId}
                                                style={{ width: "100%" }}
                                                options={state?.committees?.committees?.map((opt) => ({ value: opt?.committeeDetails?.committee?._id, label: opt?.committeeDetails?.committee?.uniqueId }))}
                                                onChange={(e) => handleChange(e, "cId", ind)}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                                        <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Committee</Title>}>
                                            <Input value={com?.cid?.name} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                                        <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Payment</Title>}>
                                            <Input value={`$ ${com?.cid?.amount}`} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                                        <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Amount</Title>}>
                                            <Input value={`$ ${com?.cid?.payment}`} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                                        <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Members</Title>}>
                                            <Input value={com?.cid?.members} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                                        <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Start Date</Title>}>
                                            <Input value={new Date(com?.cid?.startDate).toLocaleDateString()} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                                        <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>End Date</Title>}>
                                            <Input value={new Date(com?.cid?.endDate).toLocaleDateString()} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                                        <Form.Item label={<Title style={{ fontSize: "16px", margin: 0, color: "#4E4E4E" }}>Select Committee Number</Title>}>
                                            <Select

                                                defaultValue="Select Committee Number"
                                                value={com?.cid?.committeeNumber}
                                                style={{ width: "100%" }}
                                                options={([
                                                    { value: 0, label: 0 },
                                                    { value: 1, label: 1 },
                                                    { value: 2, label: 2 },
                                                    { value: 3, label: 3 },
                                                    { value: 4, label: 4 },
                                                    { value: 5, label: 5 },
                                                    { value: 6, label: 6 },
                                                    { value: 7, label: 7 },
                                                    { value: 8, label: 8 },
                                                    { value: 9, label: 9 },
                                                    { value: 10, label: 10 },
                                                ])}
                                                onChange={(e) => handleChange(e, "committeeNumber")}
                                            />
                                        </Form.Item>
                                    </Col>
                                </>
                            )
                        })}
                        {/* <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ marginBottom: additionalDetail ? 30 : 0 }}>
                            <Button onClick={() => setAdditionalDetail(true)} className="add-cycle-btn">Add Additional Detail</Button>
                        </Col> */}
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Button loading={loading} onClick={handleSubmit} className="add-cycle-btn">Update</Button>
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