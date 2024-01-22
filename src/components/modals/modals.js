import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const ModalComp = ({ title, children, setShow, open, onClick, loading }) => {
    return (
        <>
            <Modal
                title={title}
                centered
                open={open}
                onOk={onClick}
                onCancel={setShow}
                okText="Submit"
                okButtonProps={{
                    style: {
                        backgroundColor: "#166805",
                        color: "white",
                        width: "100px",
                    },
                    loading: loading
                }}
                cancelButtonProps={{
                    style: {
                        width: "100px",
                    },
                }}
            >
                {children}
            </Modal>
        </>
    );
};

export default ModalComp;