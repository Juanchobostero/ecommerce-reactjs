import React, { useState, Fragment, useEffect } from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions';
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';


const OrderDetailsScreen = () => {

    const dispatch = useDispatch();
    const { id } = useParams();

    const [sdkReady, setSdkReady] = useState(false);
    const [preferenceId, setPreferenceId] = useState(null);

    const [searchParamsMercadoPago] = useSearchParams();
    const paramsMercadoPago = [];

    // paramsMercadoPago [2]->payment_id, [3]->status, [7]->preference_id, [?]->date_created 

    if (searchParamsMercadoPago.size > 0) {
        searchParamsMercadoPago.forEach((value, key) => {
            paramsMercadoPago.push([key, value]);
        });
        console.log(paramsMercadoPago);
    } else {
        console.log('Redirección normal');
    }

    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;

    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;

    const orderPay = useSelector((state) => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;
    
    const orderDeliver = useSelector((state) => state.orderDeliver);
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const navigate = useNavigate();

    let paymentId = null;

    initMercadoPago('APP_USR-fb1d41da-86b4-4e79-afb8-ece9f34d0f03');

    if (!loading) {
    //   Calculate prices
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2); 
        };
        
        //Calculate prices
        order.itemsPrice = addDecimals(
            order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
        );
    }

    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult);
        dispatch(payOrder(id, paymentResult));
    };

    

    useEffect(() => {
        if(!userInfo) {
            navigate('/login');
        }
        if(!order || successPay || successDeliver || order._id !== id) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch({ type: ORDER_DELIVER_RESET });
            dispatch(getOrderDetails(id));
        } 
    }, [dispatch, navigate, id, successPay, successDeliver, order, userInfo]);

    const deliverHandler = () => {
        dispatch(deliverOrder(order));
    }
    

    return (
        loading 
            ? <Loader /> 
            : error ? <Message variant='danger'>{error}</Message> 
            : 
            <div className='mt-3'>
                <h1>Pedido {order._id}</h1>
                <Row>
                    <Col md={8}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2 className='ubuntu'>Envío</h2>
                                <p>
                                    <strong><b>Usuario: </b></strong>{order.user.name}
                                </p>
                                <p>
                                    <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                                </p>
                                <p>
                                    <strong><b>Dirección: </b></strong>
                                    {order.shippingAddress.address}, {order.shippingAddress.city} 
                                    {order.shippingAddress.postalCode}, {' '}
                                    {order.shippingAddress.country}
                                </p>

                                {order.isDelivered 
                                    ? <Message variant='success'>Entregado el {order.deliveredAt}</Message>
                                    : <Message variant='danger'>No entregado</Message>
                                }
                            </ListGroup.Item>

                            {/* <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method: </strong>
                                    {order.paymentMethod}
                                </p>
                                {order.isPaid 
                                    ? <Message variant='success'>Paid on {order.paidAt}</Message>
                                    : <Message variant='danger'>Not paid</Message>
                                }
                            </ListGroup.Item> */}

                            <ListGroup.Item>
                                <h2 className='ubuntu'>Detalle del Pedido</h2>
                                {order.orderItems.length === 0 
                                    ? (<Message>No hay Pedidos</Message>)
                                    : (<ListGroup variant='flush'>
                                        {order.orderItems.map(
                                            (item, index) => (
                                                <ListGroup.Item key={index}>
                                                    <Row>
                                                        <Col md={1}>
                                                            <Image 
                                                                src={item.image} 
                                                                alt={item.name}
                                                                fluid
                                                                rounded
                                                            />
                                                        </Col>

                                                        <Col>
                                                            <Link to={`/product/${item.product}`}>
                                                                <span className='ubuntu text-amber-900'>{item.name}</span>
                                                            </Link>
                                                        </Col>

                                                        <Col md={4}>
                                                        <span className='ubuntu text-amber-950 font-extrabold'>{item.qty} x ${item.price} = ${item.qty * item.price}</span>
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            )
                                        )}
                                    </ListGroup>)
                                
                                }
                                </ListGroup.Item>
                        </ListGroup>
                    </Col>

                    <Col md={4}>
                        <Card>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h2 className='ubuntu'>Resumen</h2>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong><b>Items</b></strong></Col>
                                        <Col>${order.itemsPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong><b>Envío</b></strong></Col>
                                        <Col>${order.shippingPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong><b>Tasa</b></strong></Col>
                                        <Col>${order.taxPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong><b>Total</b></strong></Col>
                                        <Col>${order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                {loadingDeliver && <Loader />}
                                {userInfo && userInfo.isAdmin && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button
                                            type='button'
                                            className='btn-block bg-green-500 text-white'
                                            onClick={deliverHandler}
                                        >
                                            Marcar como ENTREGADO
                                        </Button>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </div>
    )
}

export default OrderDetailsScreen;