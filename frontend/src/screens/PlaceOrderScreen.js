import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';
import { cartDrop } from '../actions/cartActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import axios from 'axios';

const PlaceOrderScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const [productsWithDiscount, setProductsWithDiscount] = useState({});

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    // Obtener descuentos de cada producto en el carrito
    useEffect(() => {
        const fetchDiscounts = async () => {
            const url = process.env.NODE_ENV === 'development' 
                ? 'http://localhost:5000' 
                : process.env.REACT_APP_URI_API_PRODUCTION;

            const discounts = {};
            await Promise.all(cart.cartItems.map(async (item) => {
                try {
                    const { data } = await axios.get(`${url}/api/products/${item.product}`);
                    discounts[item.product] = data.discount || 0;
                } catch (error) {
                    console.error(`Error obteniendo descuento para ${item.product}:`, error);
                    discounts[item.product] = 0;
                }
            }));
            setProductsWithDiscount(discounts);
        };

        fetchDiscounts();
    }, [cart.cartItems]);

    // Recalcular precios considerando descuentos
    const calculateItemPrice = (item) => {
        const discount = productsWithDiscount[item.product] || 0;
        return addDecimals(item.price * (1 - discount / 100) * item.qty);
    };

    cart.itemsPrice = addDecimals(
        cart.cartItems.reduce((acc, item) => acc + Number(calculateItemPrice(item)), 0)
    );
    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice)).toFixed(2);

    const orderCreate = useSelector((state) => state.orderCreate);
    const { order, success, error } = orderCreate;

    const sendEmail = (order) => {
        emailjs.init("user_oJelKtrrrc8lIdPaF2FHz");
        emailjs.send("service_bztw9ba", "template_mcvuce9", {
            from_name: "EL PROMESERO",
            subject: `Se ha generado un nuevo Pedido`,
            message: `El usuario: ${userInfo.name} ha realizado el pedido N°: ${order}.`,
        }).then(() => {
            Swal.fire({
                title: "EL PROMESERO ✅",
                text: `Se ha realizado con éxito tu Pedido.`,
                confirmButtonText: "OK",
                confirmButtonColor: '#b45309',
                background: '#fff',
                customClass: {
                    title: 'font-source',
                    popup: 'font-source',
                }
            });
        }).catch((error) => {
            console.error("Error al enviar el correo", error);
        });
    };

    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            totalPrice: cart.totalPrice
        }));
    };

    useEffect(() => {
        if (success) {
            sendEmail(order._id);
            dispatch(cartDrop());
            navigate(`/order/${order._id}`);
            dispatch({ type: ORDER_CREATE_RESET });
        }
    }, [navigate, success, order, dispatch]);

    return (
        <div className='font-source'>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2 className='font-source'>Datos de Envío</h2>
                            <p className='ml-4'>
                                <strong className='font-source font-extrabold'>Dirección: </strong>
                                {cart.shippingAddress.address}, {cart.shippingAddress.city} 
                                {cart.shippingAddress.postalCode}, {' '}
                                {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2 className='font-source'>Detalle del Pedido</h2>
                            {cart.cartItems.length === 0 
                                ? (<Message>Tu Carrito está vacío !</Message>)
                                : (
                                    <ListGroup variant='flush'>
                                        {cart.cartItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={2}>
                                                        <Image src={item.image} alt={item.name} fluid className='w-20 h-20' />
                                                    </Col>

                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>
                                                            <span className='font-source text-amber-900'>{item.name}</span>
                                                        </Link>
                                                    </Col>

                                                    <Col md={4}>
                                                        {item.qty} x ${item.price} 
                                                        {productsWithDiscount[item.product] > 0 && (
                                                            <span className="text-red-500"> (-{productsWithDiscount[item.product]}%)</span>
                                                        )}
                                                        = <span className='text-2xl'>${calculateItemPrice(item)}</span>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )
                            }
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2 className='font-source'>Resumen del Pedido</h2>
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
                                    <Col><strong><b>Total</b></strong></Col>
                                    <Col><span className='font-source text-3xl font-extrabold'>${cart.totalPrice}</span></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button type='button' className='btn-block bg-green-500 text-white' disabled={cart.cartItems.length === 0} onClick={placeOrderHandler}>
                                    Realizar Pedido
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default PlaceOrderScreen;
