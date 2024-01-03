import { Input } from 'antd'
import React from 'react'

const InputComp = ({ name, value, onChange, placeholder }) => {
    return (
        <>
            <Input name={name} placeholder={placeholder} value={value} onChange={(e) => onChange(e)} />
        </>
    )
}

export default InputComp