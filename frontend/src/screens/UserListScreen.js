import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { deleteUser, listUsers } from '../actions/userActions';
import { Tag } from 'antd';

const UserListScreen = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userList = useSelector(state => state.userList);
    const { loading, error, users } = userList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userDelete = useSelector((state) => state.userDelete);
    const { success: successDelete } = userDelete;

    useEffect(() => {
        if(userInfo && userInfo.isAdmin) {
            dispatch(listUsers());
        } else {
            navigate('/login');
        }
      
    }, [dispatch, navigate, successDelete, userInfo]);

    const deleteHandler = (id) => {
        if(window.confirm('¿ Are you sure ?')){
            dispatch(deleteUser(id));
        }
    }
    
    return (
        <>
            <h1>Usuarios <Tag color="green">{users ? users.length : '0'}</Tag></h1>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <Table
                                striped
                                bordered
                                hover
                                responsive
                                className='table-sm'
                            >
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>NOMBRE</th>
                                        <th>CORREO</th>
                                        <th>ES ADMIN</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user._id}</td>
                                            <td>{user.name}</td>
                                            <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                            <td>
                                                {user.isAdmin 
                                                    ? (<i className='fas fa-check' style={{color: 'green'}}></i>) 
                                                    : (<i className='fas fa-times' style={{color: 'red'}}></i>)
                                                }
                                            </td>
                                            <td>
                                                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                                    <Button 
                                                        variant='dark'
                                                        className='btn-sm bg-amber-400'
                                                    >
                                                        <i className='fas fa-edit'></i>
                                                    </Button>
                                                </LinkContainer>
                                                
                                                <Button
                                                    variant='dark'
                                                    className='btn-sm bg-red-600'
                                                    onClick={() => deleteHandler(user._id)}
                                                >
                                                    <i className='fas fa-trash'></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </ListGroup.Item>
                    </ListGroup>
                </>
            )}
        </>
    )
}

export default UserListScreen;