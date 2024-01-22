import { Button, Col, Form, Input } from 'antd'
import React from 'react'

const FormComp = () => {
    return (
        <Form layout="vertical">
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <Form.Item label="Username" name="username">
                    <Input />
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <Form.Item label="Password" name="password">
                    <Input.Password />
                </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <Form.Item>
                    <Button type="primary">
                        Submit
                    </Button>
                </Form.Item>
            </Col>
        </Form>
    )
}

export default FormComp