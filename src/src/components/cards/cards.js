import { Card } from 'antd'
import React from 'react'

const CardComp = ({ children }) => {
    return (
        <Card bordered={false} className="criclebox">{children}</Card>
    )
}

export default CardComp