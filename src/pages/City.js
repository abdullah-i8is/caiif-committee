
import { useEffect, useState } from "react";

import { CommentOutlined, PlusOutlined } from '@ant-design/icons';

import {
  Card,
  Col,
  Row,
  notification,
  FloatButton,
  Divider,
  Tooltip
} from "antd";
import City from "../components/helpers/city";

function Setup() {
  const [api, contextHolder] = notification.useNotification();
  const [openDepartModal,setDepartModal] = useState(false)
  const [openDesignation,setDesignation,] = useState(false)

  const handleDepartModal = ()=>setDepartModal(!openDepartModal)
  const handleDesignation = ()=>setDesignation(!openDesignation)

  return (
    <>
      {contextHolder}
      <div className="layout-content">
        <Row gutter={[24, 24]}>
          <Col xs={24}>
            <City open={openDesignation} handleDepartModal={handleDesignation} />
          </Col>
        </Row>
      </div>
      <Tooltip title="Add City" placement="left">
      <FloatButton
        type="primary"
        onClick={handleDesignation}
        icon={<PlusOutlined />}
      />
     
      </Tooltip>
    </>
  );
}

export default Setup;