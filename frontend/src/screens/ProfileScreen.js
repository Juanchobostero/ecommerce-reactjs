import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Form, Button, Row, Col, Table, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import { listMyOrders } from '../actions/orderActions';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderMyList = useSelector((state) => state.orderListMy);
  const { loading: loadingOrders, error: errorOrders, orders } = orderMyList;

  useEffect(() => {
    if(!userInfo) {
        navigate('/login');
    } else {
        if(!user || !user.name || success) {
            dispatch({ type: USER_UPDATE_PROFILE_RESET });
            dispatch(getUserDetails('profile'));
            dispatch(listMyOrders());
        } else {
            setName(user.name);
            setEmail(user.email);
        }
    }
  }, [dispatch, navigate, userInfo, user, success]);
  

  const submitHandler = (e) => {
    e.preventDefault();

    if(password !== confirmPassword) {
        setMessage('Passwords do not match !')
    } else {
        dispatch(updateUserProfile({ id: user._id, name, email, password }))
    }
  }
  
  return (
    <Row className='mt-4 flex flex-row p-0 font-source'>
        <Col md={3}>
            <ListGroup.Item className='p-2 w-4/4'>
                <h2 className='font-source'>Mis Datos</h2>
                {message && <Message variant='danger'>{message}</Message>}
                {error && <Message variant='danger'>{error}</Message>}
                {success && <Message variant='success'>Perfil Actualizado !</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                className="bg-gray-400 border border-gray-600 rounded-md font-bold focus:ring-0 focus:border-gray-700"
                                disabled 
                                type='name' 
                                placeholder='Ingresar Nombre' 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                >
                            </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='email'>
                        <Form.Label>Correo</Form.Label>
                        <Form.Control
                            className="bg-gray-400 border border-gray-600 rounded-md font-bold focus:ring-0 focus:border-gray-700"
                            disabled 
                            type='email' 
                            placeholder='Ingresar Correo' 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            >
                            </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='password'>
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            className="bg-gray-100 border border-gray-600 rounded-md" 
                            type='password' 
                            placeholder='Nueva Contraseña' 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                <Form.Group controlId='confirmPassword'>
                    <Form.Label>Confirmar Contraseña</Form.Label>
                    <Form.Control
                        className="bg-gray-100 border border-gray-600 rounded-md"
                        type='password' 
                        placeholder='Repetir Contraseña' 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>

                    <Button 
                        type='submit' 
                        variant='primary'
                        className='bg-amber-700 btn-block mt-2 hover:bg-amber-900'
                    >
                        Actualizar
                    </Button>

                </Form>
            </ListGroup.Item>
        </Col>
        <Col md={9}>
        <ListGroup.Item className='p-2 w-4/4'>
            <h2 className='font-source'>Mis Pedidos</h2>
            {loadingOrders 
                ? <Loader /> 
                : errorOrders 
                    ? <Message variant='danger'>{errorOrders}</Message>
                    : (<>
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
                                            <th>FECHA ALTA</th>
                                            <th>TOTAL</th>
                                            <th>DESPACHADO</th>
                                            <th>ENTREGADO</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order._id}>
                                                <td>{order._id}</td>
                                                <td>{order.createdAt.substring(0, 10)}</td>
                                                <td>{order.totalPrice}</td>
                                                <td>{order.isDispatched 
                                                        ? order.dispatchedAt.substring(0, 10) 
                                                        : (
                                                            <i 
                                                                className='fas fa-times' 
                                                                style={{color: 'red'}}
                                                            >
                                                            </i>
                                                )}</td>
                                                <td>{order.isDelivered 
                                                        ? order.deliveredAt.substring(0, 10) 
                                                        : (
                                                            <i 
                                                                className='fas fa-times' 
                                                                style={{color: 'red'}}
                                                            >
                                                            </i>
                                                )}</td>
                                                <td>
                                                    <LinkContainer to={`/order/${order._id}`}>
                                                        <Button 
                                                            className='btn-sm bg-amber-700 hover:bg-amber-900'
                                                        >
                                                            DETALLES
                                                        </Button>
                                                    </LinkContainer>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </ListGroup.Item>
                        </ListGroup>
                        </>
                    )
                }
            </ListGroup.Item>
        </Col>
    </Row>
  )
}

export default ProfileScreen;