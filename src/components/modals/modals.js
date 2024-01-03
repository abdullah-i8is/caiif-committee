import { Button, Modal } from 'antd'

const ModalComp = ({ children, title, modalOpen, setOpen, okText, width }) => {
    return (
        <>
            <Modal
                htmlType="submit"
                width={width}
                title={title}
                centered
                open={modalOpen}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                okText={okText}
            >
                {children}
            </Modal>
        </>
    )
}

export default ModalComp