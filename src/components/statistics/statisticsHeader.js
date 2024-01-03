import React, { useState } from 'react';
import {
    Card,
    Col,
    Row,
    Typography
} from "antd";
import CountUp from 'react-countup';
import icon1 from '../../assets/images/member2.svg'
import icon2 from '../../assets/images/enroll.svg'
import icon3 from '../../assets/images/committee.svg'

const StatisticsHeader = () => {
    const { Title, Text } = Typography;
    const arr = [
        { id: 1, title: "Total Members", description: 63, icon: icon1 },
        { id: 2, title: "Enroll Request", description: 4, icon: icon2 },
        { id: 3, title: "Add New Committee", description: "Click Now", icon: icon3 },
    ]
    return (
        <div className="layout-content" style={{ marginTop: "50px", marginBottom:"40px" }}>
            <Row gutter={[24, 0]}>
                {arr.map((card, index) => {
                    return (
                        <Col xs={24} sm={24} md={12} lg={8} xl={8} className="mb-24">
                            <Card bordered={false} className="criclebox" style={{ border: '4px solid rgba(22, 104, 5, 0.50)' }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <p style={{ fontSize: 20, fontWeight: '700', margin: 0, color: "#166805" }}>{card.title}</p>
                                        <Title level={"5"} style={{ fontWeight: '600', margin: 0, color: "#F2C649" }}><CountUp start={0} end={card.description} /></Title>
                                    </div>
                                    <div>
                                        <img src={card.icon} alt="" />
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        </div>
    );
}

export default StatisticsHeader;
