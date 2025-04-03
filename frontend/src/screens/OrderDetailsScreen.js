import React, { useState, Fragment, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, dispatchOrder, deliverOrder, cancelOrder } from '../actions/orderActions';
import { ORDER_CANCEL_RESET, ORDER_DELIVER_RESET, ORDER_DISPATCH_RESET } from '../constants/orderConstants';
import emailjs from '@emailjs/browser';
import { format, toZonedTime } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CART_DROP } from '../constants/cartConstants';
import axios from 'axios';
import { FloatingWhatsApp } from 'react-floating-whatsapp';

const OrderDetailsScreen = () => {
    const orderRef = useRef();
    const dispatch = useDispatch();
    const { id } = useParams();
    const [daysToDispatch, setDaysToDispatch] = useState(0);
    const [productsWithDiscount, setProductsWithDiscount] = useState({});

    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;

    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;

    const orderDispatch = useSelector((state) => state.orderDispatch);
    const { loading: loadingDispatch, success: successDispatch } = orderDispatch;

    const orderDeliver = useSelector((state) => state.orderDeliver);
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

    const orderCancel = useSelector((state) => state.orderCancel);
    const { loading: loadingCancel, success: successCancelled } = orderCancel;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const navigate = useNavigate();

    // Obtener descuentos de cada producto en el pedido
    useEffect(() => {
        const fetchDiscounts = async () => {
            const url = process.env.NODE_ENV === 'development' 
                ? 'http://localhost:5000' 
                : process.env.REACT_APP_URI_API_PRODUCTION;

            const discounts = {};
            await Promise.all(order.orderItems.map(async (item) => {
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

        if (order && order.orderItems) {
            fetchDiscounts();
        }
    }, [order]);

    // Calcular precios
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const calculateItemPrice = (item) => {
        const discount = productsWithDiscount[item.product] || 0;
        return addDecimals(item.price * (1 - discount / 100) * item.qty);
    };

    const calculateItemPriceWithoutDiscount = (item) => {
        return addDecimals(item.price * item.qty);
    };

    const calculateSubtotalWithDiscounts = () => {
        return addDecimals(
            order.orderItems.reduce((acc, item) => acc + Number(calculateItemPrice(item)), 0)
        );
    };

    const calculateSubtotalWithoutDiscounts = () => {
        return addDecimals(
            order.orderItems.reduce((acc, item) => acc + Number(calculateItemPriceWithoutDiscount(item)), 0)
        );
    };

    const calculateTotalDiscount = () => {
        return addDecimals(
            order.orderItems.reduce((acc, item) => {
                const discount = productsWithDiscount[item.product] || 0;
                return acc + (item.price * (discount / 100) * item.qty);
            }, 0)
        );
    };

    const handleCancelOrder = () => {
        Swal.fire({
            title: "EL PROMESERO ✅",
            text: `¿Estás seguro de cancelar el Pedido N°: ${order.number}?`,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Volver',
            customClass: {
                title: 'font-source',
                popup: 'font-source',
            }
        }).then((result) => { 
            if (result.isConfirmed) {
                dispatch(cancelOrder(order));
                Swal.fire({
                    title: 'Pedido cancelado',
                    text: `El Pedido N°: ${order.number} fue cancelado.`,
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#b45309',
                    background: '#fff',
                    customClass: {
                        title: 'font-source',
                        popup: 'font-source',
                    }
                });
            }
        })
    }

    // Efecto para cargar los detalles del pedido
    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
        if (!order || successDispatch || successDeliver || successCancelled || order._id !== id) {
            dispatch({ type: ORDER_DISPATCH_RESET });
            dispatch({ type: ORDER_DELIVER_RESET });
            dispatch({ type: ORDER_CANCEL_RESET });
            dispatch({ type: CART_DROP });
            dispatch(getOrderDetails(id));
        }
    }, [dispatch, navigate, id, successDispatch, successDeliver, successCancelled, order, userInfo]);

    const sendEmail = () => {
        emailjs.init("user_oJelKtrrrc8lIdPaF2FHz");
        emailjs.send("service_bztw9ba", "template_6213qyo", {
            to_email: order.user.email,
            from_name: "EL PROMESERO",
            subject: `PEDIDO #${order.number} DESPACHADO`,
            message: `Su Pedido fue Despachado con éxito. 
                Lo recibirá en: <b>${order.user.address}</b> en aproximadamente ${daysToDispatch} días.`,
        })
        .then((response) => {
            Swal.fire({
                title: "EL PROMESERO ✅",
                text: `Se despachó el pedido correctamente.`,
                confirmButtonText: "OK",
                confirmButtonColor: '#b45309',
                background: '#fff',
                customClass: {
                    title: 'font-source',
                    popup: 'font-source',
                }
            });
        })
        .catch((error) => {
            console.error("Error al enviar el correo", error);
        });
    };

    const dispatchHandler = () => {
        dispatch(dispatchOrder(id, daysToDispatch));
        sendEmail();
    };

    const deliverHandler = () => {
        dispatch(deliverOrder(order));
    };

    const formatDate = (dateString, formatString = "dd/MM/yyyy HH:mm:ss") => {
        if (!dateString) return "";
        const timeZone = "America/Argentina/Buenos_Aires";
        const date = new Date(dateString);
        const zonedDate = toZonedTime(date, timeZone);
        return format(zonedDate, formatString, { locale: es });
    };

    const generatePDF = () => {
        const input = orderRef.current;
        const pdfButton = document.querySelector('.generate-pdf-button');
        const noPdfElements = document.querySelectorAll('.no-pdf');
    
        // Ocultar elementos con la clase "no-pdf"
        noPdfElements.forEach(el => el.style.display = 'none');
        if (pdfButton) pdfButton.style.display = 'none';
    
        html2canvas(input, { scale: 3 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
    
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
            pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight);
            pdf.save(`Pedido_${order.number}.pdf`);
    
            // Restaurar visibilidad después de generar el PDF
            noPdfElements.forEach(el => el.style.display = '');
            if (pdfButton) pdfButton.style.display = 'block';
        });
    };
    

    return (
        loading 
            ? <Loader /> 
            : error ? <Message variant='danger'>{error}</Message> 
            : 
                <>
                    <Row>
                        <Col md={8}>
                            <ListGroup 
                                ref={orderRef}
                                id="order-details" 
                                variant='flush'
                                className="bg-white shadow-md rounded-md p-4 mt-4"
                            >
                                <ListGroup.Item>
                                    <div className="flex items-center gap-2">
                                        {/* Logo a la izquierda */}
                                        <img 
                                            alt="Logo" 
                                            className="w-10 h-10 object-contain"
                                            src="/images/logo2.png" 
                                            style={{ maxHeight: '70px' }}
                                        />

                                        {/* Texto del pedido */}
                                        <h1 className="text-amber-600">
                                            Pedido <b>#{order.number}</b>
                                        </h1>
                                    </div>
                                    <h3 className='font-source font-extrabold'>Datos del Pedido</h3>
                                    <p>
                                        <strong><b>Nombre Completo: </b></strong>{order.user.name}
                                    </p>
                                    <p>
                                        <strong><b>Correo: </b></strong>
                                        <a
                                            className='text-sky-900'
                                            href={`mailto:${order.user.email}`}>{order.user.email}</a>
                                    </p>
                                    <p>
                                        <strong><b>Dirección: </b></strong>
                                        {order.shippingAddress.address}, {order.shippingAddress.city}
                                        {order.shippingAddress.postalCode}, {' '}
                                        {order.shippingAddress.country}
                                    </p>

                                    {order.isDispatched ? (
                                        <div className='mb-2 flex flex-col font-source no-pdf'>
                                            <strong className='text-green-600 font-semibold mb-2'>
                                                ✅ Despachado el {formatDate(order.dispatchedAt, "dd/MM/yyyy")} a las {formatDate(order.dispatchedAt, "HH:mm:ss")}
                                            </strong>
                                            <strong><b>Días para Entrega: {order.days}</b></strong>
                                        </div>
                                    ) : (
                                        <div className='mb-2 flex flex-col font-source no-pdf'>
                                            <strong className='text-red-600 font-semibold font-source'>❌ No Despachado</strong>
                                        </div>
                                    )}

                                    {order.isDelivered ? (
                                        <div className='mb-2 flex flex-col font-source no-pdf'>
                                            <strong className='text-green-600 font-semibold font-source'>
                                                ✅ Entregado el {formatDate(order.deliveredAt, "dd/MM/yyyy")}
                                            </strong>
                                        </div>
                                    ) : (
                                        <div className='mb-2 flex flex-col font-source no-pdf'>
                                            <strong className='text-red-600 font-semibold font-source'>❌ No entregado</strong>
                                        </div>
                                    )}

                                    <div className='my-2 flex flex-col font-source'>
                                        <strong><b>Teléfono: </b><i>{order.user.tel}</i></strong>
                                    </div>

                                    <div className='my-2 flex flex-col font-source'>
                                        <strong><b>FECHA: </b><i>{formatDate(order.createdAt, "dd/MM/yyyy")}</i></strong>
                                    </div>
                                </ListGroup.Item>

                                <ListGroup.Item className='no-pdf'>
                                    <h3 className='font-source font-extrabold'>Detalle del Pedido</h3>
                                    {order.orderItems.length === 0
                                        ? (<Message>No hay Pedidos</Message>)
                                        : (
                                            <ListGroup variant='flush'>
                                                {order.orderItems.map((item, index) => (
                                                    <ListGroup.Item key={index}>
                                                        <Row>
                                                            <Col md={1}>
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    fluid
                                                                    rounded />
                                                            </Col>
                                                            <Col>
                                                                <Link to={`/product/${item.product}`}>
                                                                    <span className='font-source text-amber-900'>{item.name}</span>
                                                                </Link>
                                                            </Col>
                                                            <Col md={4}>
                                                                <span className='font-source text-amber-950 font-extrabold'>
                                                                    {item.qty} x ${item.price}
                                                                    {productsWithDiscount[item.product] > 0 && (
                                                                        <span className="text-red-500"> (-{productsWithDiscount[item.product]}%)</span>
                                                                    )}
                                                                    = ${calculateItemPrice(item)}
                                                                </span>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>

                        <Col md={4}>
                            <Card className="bg-white shadow-md rounded-md p-4 mt-4">
                                <ListGroup.Item className='p-0.5'>
                                    <h2 className='font-source'>Resumen</h2>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong><b>Subtotal (sin descuentos)</b></strong></Col>
                                        <Col>${calculateSubtotalWithoutDiscounts()}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong><b>Descuentos</b></strong></Col>
                                        <Col className="text-red-500">-${calculateTotalDiscount()}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong><b>Subtotal (con descuentos)</b></strong></Col>
                                        <Col>${calculateSubtotalWithDiscounts()}</Col>
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
                                        <Col><strong><b>Total</b></strong></Col>
                                        <Col>${order.totalPrice}</Col>
                                    </Row>
                                </ListGroup.Item>

                                {loadingDispatch && <Loader />}
                                {userInfo && userInfo.isAdmin && !order.isDispatched && !order.disabled && (
                                    <ListGroup.Item className="p-3">
                                        <label
                                            htmlFor="daysToDispatch"
                                            className="block text-gray-700 mb-1"
                                        >
                                            Ingresar cantidad de días para entrega
                                        </label>
                                        <input
                                            id="daysToDispatch"
                                            type="number"
                                            value={daysToDispatch}
                                            onChange={(e) => setDaysToDispatch(Math.max(0, Number(e.target.value)))}
                                            placeholder="Días para despachar Pedido"
                                            className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                            min="0" />
                                        <Button
                                            disabled={Number(daysToDispatch) === 0}
                                            type="button"
                                            className={`${daysToDispatch === 0 ? 'cursor-not-allowed' : ''} w-full mt-3 bg-green-500 text-white py-2 px-4 rounded-md ${(daysToDispatch === 0) ? 'hover:bg-grey-300' : 'hover:bg-green-300'} green-600 transition duration-200`}
                                            onClick={dispatchHandler}
                                        >
                                            Despachar Pedido
                                        </Button>
                                    </ListGroup.Item>
                                )}

                                {loadingDeliver && <Loader />}
                                {userInfo && userInfo.isAdmin && !order.isDelivered && !order.disabled && (
                                    <ListGroup.Item>
                                        <Button
                                            disabled={!order.isDelivered && !order.isDispatched}
                                            type='button'
                                            className={`${(!order.isDelivered && !order.isDispatched) ? 'cursor-not-allowed' : ''} w-full mt-1 bg-green-500 text-white py-2 px-4 rounded-md ${(!order.isDelivered && !order.isDispatched) ? 'hover:bg-grey-300' : 'hover:bg-green-300'} green-600 transition duration-200`}
                                            onClick={deliverHandler}
                                        >
                                            Marcar como ENTREGADO
                                        </Button>
                                    </ListGroup.Item>
                                )}
                                {userInfo && userInfo.isAdmin && (
                                    <>
                                        <ListGroup.Item>
                                            <Button
                                                type="button"
                                                className="generate-pdf-button w-full mt-3 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
                                                onClick={generatePDF}
                                            >
                                                Generar PDF
                                            </Button>
                                        </ListGroup.Item>
                                        {!order.disabled && (
                                            <ListGroup.Item>
                                                <Button
                                                    type="button"
                                                    className="generate-pdf-button w-full mt-3 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
                                                    onClick={handleCancelOrder}
                                                >
                                                    CANCELAR PEDIDO
                                                </Button>
                                            </ListGroup.Item>
                                        )}
                                    </>
                                )}
                            </Card>
                        </Col>
                    </Row>
                    <div className="relative">
                        <div className="fixed bottom-4 right-4 z-[10]">
                            <FloatingWhatsApp
                                className={`${(userInfo && userInfo.name && userInfo.isAdmin) ? 'hidden' : 'block'}`}
                                phoneNumber="+543795004254"
                                accountName="EL PROMESERO"
                                avatar="/images/logo2.png"
                                statusMessage="Normalmente respondo en unos minutos"
                                chatMessage="¡Hola! ¿Tuviste algún problema con tu Pedido? Contactanos."
                                notification={false} />
                        </div>
                    </div>
                </>
            
    );
};

export default OrderDetailsScreen;