import React, { useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listOrders } from '../actions/orderActions';
import { format, toZonedTime } from 'date-fns-tz'
import { es } from 'date-fns/locale'

const OrderListScreen = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const orderList = useSelector(state => state.orderList);
    const { loading, error, orders } = orderList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userDelete = useSelector((state) => state.userDelete);
    const { success: successDelete } = userDelete;

    const formatDate = (dateString, formatString = "dd/MM/yyyy HH:mm:ss") => {
        if (!dateString) return ""
        
        const timeZone = "America/Argentina/Buenos_Aires"
        const date = new Date(dateString)
        const zonedDate = toZonedTime(date, timeZone)
        
        return format(zonedDate, formatString, { locale: es })
    }

    useEffect(() => {
        if(userInfo && userInfo.isAdmin) {
            dispatch(listOrders());
        } else {
            navigate('/login');
        }
      
    }, [dispatch, navigate, successDelete, userInfo]);
    
    return (
        <Fragment>
            <h1 className='ubuntu font-bold'>Pedidos</h1>
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
                                        <th>N°</th>
                                        <th>CLIENTE</th>
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
                                            <td>{order.user.name}</td>
                                            <td>{order.createdAt.substring(0, 10)}</td>
                                            <td>${order.totalPrice}</td>
                                            <td>
                                                {order.isDispatched 
                                                    ? (formatDate(order.dispatchedAt, "dd/MM/yyyy")) 
                                                    : (<i className='fas fa-times' style={{color: 'red'}}></i>)
                                                }
                                            </td>
                                            <td>
                                                {order.isDelivered 
                                                    ? (formatDate(order.deliveredAt, "dd/MM/yyyy")) 
                                                    : (<i className='fas fa-times' style={{color: 'red'}}></i>)
                                                }
                                            </td>
                                            <td>
                                                <LinkContainer to={`/order/${order._id}`}>
                                                    <Button 
                                                        variant='dark'
                                                        className='btn-sm bg-amber-400 hover:bg-amber-600'
                                                    >
                                                        <i className='fas fa-edit'></i>Detalles
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
                
            )}
        </Fragment>
    )
}

export default OrderListScreen;