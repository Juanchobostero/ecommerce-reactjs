import { Button, Col, Row, Statistic } from 'antd';
import React from 'react';

const Quantity = ({ title, value }) => {
  return (
    <Row gutter={16}>
        <Col span={12}>
            <Statistic title={title} value={value} />
        </Col>
  </Row>
  )
}

Quantity.defaultProps = {
    title: 'Active',
    value: 0
}

export default Quantity;