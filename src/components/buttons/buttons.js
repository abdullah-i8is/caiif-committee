import { Button } from 'antd'
import React from 'react'

const ButtonComp = ({ title, type, onClick }) => {
    return (
        <Button type={type} onClick={onClick}>
            {title}
        </Button>
    )
}

export default ButtonComp