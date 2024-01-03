import { Table } from 'antd'
import React from 'react'

const TableComp = ({ dataSource, columns }) => {
    return (
        <Table dataSource={dataSource} columns={columns} />
    )
}

export default TableComp