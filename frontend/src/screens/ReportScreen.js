import React, { useEffect } from 'react';
import Chart from "../components/Chart";
import DemoColumnBar from '../components/DemoColumnBar';
import { notification } from 'antd';

const ChartScreen = () => {

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
            <h1>Reports</h1>
            <Chart />
            <hr></hr>
            <h1>Demo column bar</h1>
            <DemoColumnBar />
        </>
    )
}

export default ChartScreen