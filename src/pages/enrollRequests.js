import { useEffect, useLayoutEffect, useState } from "react";
import {
    Card,
    Typography,
    notification,
    Table,
} from "antd";
import { useNavigate } from "react-router-dom";

function EnrollRequests() {

    const { Title, Text } = Typography;
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const data = [
        { username: "Hassan Soomro", email: "hassansoomro@i8is.com", amount: 4230142301423, phonenumber: "+92300000333", CNIC: 4230142301423, enroll: 3, },
        { username: "Nisa Hoorain", email: "nisahoorain@i8is.com", amount: 4230142301423, phonenumber: "+92300000333", CNIC: 4230142301423, enroll: 4, },
        { username: "Bilawal Soomro", email: "bilawalsoomro@i8is.com", amount: 4230142301423, phonenumber: "+92300000333", CNIC: 4230142301423, enroll: 1, },
        { username: "Hayat Ahmed", email: "hayatahmed@i8is.com", amount: 4230142301423, phonenumber: "+92300000333", CNIC: 4230142301423, enroll: 2, },
    ]

    const column = [
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Name</Title>,
            dataIndex: 'username',
            key: 'username',
            render: (text, record, index) => {
                return <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>{record?.username}</Title>
            }
        },
        {
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Amount</Title>,
            dataIndex: 'CNIC',
            key: 'CNIC',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.amount}</Title>
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
            title: <Title style={{ fontSize: "18px", margin: 0, color: "#166805", fontWeight: "600" }}>Email</Title>,
            dataIndex: 'CNIC',
            key: 'CNIC',
            render: (text, record) => {
                return <Title style={{ fontSize: "16px", margin: 0, color: "#818181" }}>{record?.email}</Title>
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
    ];

    return (
        <>
            {contextHolder}
            <Loader loading={loading} />
            <div style={{ marginBottom: "20px", marginTop: "50px" }}>
                <Title style={{ color: "#166805", margin: 0 }} level={3}>Enroll Request</Title>
            </div>
            <Card className="my-card" style={{ marginBottom: "20px" }}>
                <Table dataSource={data} columns={column} />
            </Card>
        </>
    );
}

export default EnrollRequests;