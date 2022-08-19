import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { useSelector } from 'react-redux';

const DemoColumnBar = () => {

    const [userlist, setUserList] = useState([]);

    const userList = useSelector(state => state.userList);
    const { users } = userList;

    useEffect(() => {
        const dataFromUsers = users.map((u) => ({
            user: u.name, sales: 10
        }));

        setUserList(dataFromUsers);
        console.log(dataFromUsers);
      
    }, [users]);
    

    const data = [
        {
            user: 'User 1',
            sales: 1
        },
        {
            user: 'User 2',
            sales: 2
        },
        {
            user: 'User 3',
            sales: 3
        },
        {
            user: 'User 4',
            sales: 4
        },
        {
            user: 'User 5',
            sales: 5
        } 
    ];

    const config = {
        userlist,
        xField: 'user',
        yField: 'sales',
        label: {
            // Manually configurable label data label location
            position: 'middle',
            // 'top', 'bottom', 'middle',
            // configuration style
            style: {
                fill: '#FFFFFF',
                opacity: 0.6
            }
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false
            }
        },
        meta: {
            type: {
                alias: 'user'
            }
        },
        sales: {
            alias: 'sales'
        }
    }

    return (
        <Column {... config} />
    )
}

export default DemoColumnBar;