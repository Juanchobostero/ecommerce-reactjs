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

        const getDataPagoMercadoPago = async (paymentId) => {
            try {
                const response = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                    headers: {
                        'Authorization': 'Bearer APP_USR-5029250925841563-081611-6d6c33c264b920c6cce47d975f80e384-1180488044'
                    }
                });
                return response.data;
            } catch (error) {
                console.log(error);
            }   
        }
    
        const createPreference = async () => {
            try {
                const url = process.env.REACT_APP_ENV === 'development' 
                    ? 'http://localhost:5000' 
                    : process.env.REACT_APP_URI_API_PRODUCTION;
                const orderDataMercadoPago = cartItems.map((item) => ({
                    ...item,
                    name: item.name,
                    price: item.price,
                    quantity: item.qty,
                    currency_id: "ARS"
                }));
                console.log(orderDataMercadoPago);
                console.log('URI', process.env.REACT_APP_URI_API_PRODUCTION);
                const response = await axios.post(`${url}/create_preference`, {
                    orderDataMercadoPago,
                    order: order._id
                });
    
                const { id } = response.data;
                return id;
            } catch (error) {
                console.log(error);
            }
        }
        
        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get(`${process.env.REACT_APP_URI_API_PRODUCTION}/api/config/paypal`);
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
            script.async = true;
            script.onload = () => {
                setSdkReady(true);
            };

            document.body.appendChild(script);
        }

        const addMercadoPago = async () => {
            const preference = await createPreference();
                if(preference) {
                    setPreferenceId(preference);
                }
        }

            if(!order || successPay || successDeliver || order._id !== id) {
                dispatch({ type: ORDER_PAY_RESET });
                dispatch({ type: ORDER_DELIVER_RESET });
                dispatch(getOrderDetails(id));
            } else if(!order.isPaid) {
                if(order.paymentMethod === 'MP') {

                    //Verificar si hay parametros de mercado pago de redirección luego del pago exitoso
                    if(paramsMercadoPago && paramsMercadoPago.length > 0) {

                        //REFACTORIZE THIS IF 
                        // (CALL TO api/merchant_orders/:merchant_order_id }
                        // AND VERIFY ORDER PAID AND THEN CHANGE THE STATE OR NOT
                        if(paramsMercadoPago[3][1] === 'approved') {
                            // Extracts the payment_id from to array of params returned by MERCADO PAGO
                            paymentId = paramsMercadoPago[2][1];
                            // Get pay info
                            const mercadoPagoData = getDataPagoMercadoPago(paymentId);

                            successPaymentHandler({
                                id: paymentId,
                                status: paramsMercadoPago[3][1],
                                update_time: Date(mercadoPagoData.date_approved),
                                email_address: 'juancruzmart93@gmail.com'
                            });
                        } else {
                            if (paramsMercadoPago[3][1] === 'rejected') {
                                setSdkReady(false);
                                addMercadoPago();
                            } 
                        }
                    } else {
                        setSdkReady(false);
                        addMercadoPago();
                    } 
 
                } else {
                    if(!window.paypal) {
                        addPayPalScript();
                    }else {
                        setSdkReady(false);
                    }
                }
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
            <Fragment>
                <h1>Order {order._id}</h1>
                <Row>
                    <Col md={8}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Shipping</h2>
                                <p>
                                    <strong>Name: </strong>{order.user.name}
                                </p>
                                <p>
                                    <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                                </p>
                                <p>
                                    <strong>Address: </strong>
                                    {order.shippingAddress.address}, {order.shippingAddress.city} 
                                    {order.shippingAddress.postalCode}, {' '}
                                    {order.shippingAddress.country}
                                </p>

                                {order.isDelivered 
                                    ? <Message variant='success'>Delivered on {order.deliveredAt}</Message>
                                    : <Message variant='danger'>Not delivered</Message>
                                }
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method: </strong>
                                    {order.paymentMethod}
                                </p>
                                {order.isPaid 
                                    ? <Message variant='success'>Paid on {order.paidAt}</Message>
                                    : <Message variant='danger'>Not paid</Message>
                                }
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <h2>Order Items</h2>
                                {order.orderItems.length === 0 
                                    ? (<Message>Order is empty !</Message>)
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
                                                                {item.name}
                                                            </Link>
                                                        </Col>

                                                        <Col md={4}>
                                                            {item.qty} x ${item.price} = ${item.qty * item.price}
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
                                    <h2>Order Summary</h2>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${order.itemsPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${order.shippingPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${order.taxPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Total</Col>
                                        <Col>${order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>
                                {/* {!order.isPaid && (
                                    <ListGroup.Item>
                                        {loadingPay && <Loader />}
                                        {!sdkReady ? <Loader /> : (
                                            <PayPalButton 
                                                amount={order.totalPrice}
                                                onSuccess={successPaymentHandler}
                                            />
                                        )}
                                    </ListGroup.Item>
                                )} */}

                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {loadingPay && <Loader />}
                                        {!preferenceId ? <Loader /> : (
                                            <Wallet
                                                initialization={{ preferenceId }} 
                                            />
                                        )}
                                    </ListGroup.Item>
                                )}

                                {loadingDeliver && <Loader />}
                                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button
                                            type='button'
                                            className='btn btn-block'
                                            onClick={deliverHandler}
                                        >
                                            Mark As Delivered
                                        </Button>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
            </Fragment>
    )
}

export default OrderDetailsScreen;