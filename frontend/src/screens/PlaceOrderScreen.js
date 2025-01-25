import React, {Fragment, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';

const PlaceOrderScreen = () => {

    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    const navigate = useNavigate();

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2)
      }

    //Calculate prices
    cart.itemsPrice = addDecimals(
        cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      );
    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)
    cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))
    cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
    ).toFixed(2);

    const orderCreate = useSelector((state) => state.orderCreate);
    const { order, success, error } = orderCreate;

    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice
        }))
    };

    useEffect(() => {
      if(success) {
        navigate(`/order/${order._id}`);
      };
      // eslint-disable-next-line
    }, [navigate, success]);
    

    return (
        <Fragment>
            <CheckoutSteps step1 step2 step3 step4/>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Datos de Envío</h2>
                            <p>
                                <strong>Dirección: </strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city} 
                                {cart.shippingAddress.postalCode}, {' '}
                                {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Detalle del Pedido</h2>
                            {cart.cartItems.length === 0 
                                ? (<Message>Tu Carrito está vacío !</Message>)
                                : (<ListGroup variant='flush'>
                                    {cart.cartItems.map(
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
                                                            <span className='playball-font text-amber-900'>{item.name}</span>
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
                                <h2>Resumen del Pedido</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong><b>Items</b></strong></Col>
                                    <Col>${cart.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong><b>Envío</b></strong></Col>
                                    <Col>${cart.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong><b>Tasa</b></strong></Col>
                                    <Col>${cart.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col><strong><b>Total</b></strong></Col>
                                    <Col>${cart.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {error && 
                                <ListGroup.Item>
                                    {error && <Message variant='danger'>{error}</Message>}
                                </ListGroup.Item>
                            }
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn-block bg-green-500 text-white'
                                    disabled={cart.cartItems === 0}
                                    onClick={placeOrderHandler}
                                >
                                    Realizar Pedido
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}

export default PlaceOrderScreen