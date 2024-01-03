import React from 'react'
import { Card, Col, Row, Typography } from 'antd'

const Summary = ({ children }) => {

    const { Title, Text } = Typography;

    return (
        <Card style={{ margin: "20px 0" }}>
            <Row gutter={[24, 0]} style={{ alignItems: "center" }}>
                {children}
            </Row>
        </Card>
    )
}

export default Summary