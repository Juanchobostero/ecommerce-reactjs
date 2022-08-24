import React, { useEffect } from 'react';
import { notification } from 'antd';

const ReportScreen = () => {

    const openNotificationWithIcon = (type) => {
        notification[type]({
          message: 'Welcome admin !',
          description:
            'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
        });
      };

    useEffect(() => {
      openNotificationWithIcon('info');
    }, []);
    
    return (
        <>
            <h3>Reports Panel</h3>
            <hr></hr>
            <h1>Products</h1>

            <hr></hr>
            <h1>Orders</h1>

            <hr></hr>
        </>
    )
}

export default ReportScreen