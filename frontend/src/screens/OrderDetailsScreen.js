import React, { useState, Fragment, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, dispatchOrder, deliverOrder } from '../actions/orderActions';
import { ORDER_DELIVER_RESET, ORDER_DISPATCH_RESET } from '../constants/orderConstants';
import emailjs from '@emailjs/browser' 
import { format, toZonedTime } from 'date-fns-tz'
import { es } from 'date-fns/locale'
import Swal from 'sweetalert2'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { CART_DROP } from '../constants/cartConstants';


const OrderDetailsScreen = () => {
    const orderRef = useRef()

    const dispatch = useDispatch();
    const { id } = useParams();

    const [daysToDispatch, setDaysToDispatch] = useState(0);

    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;

    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;

    const orderDispatch = useSelector((state) => state.orderDispatch);
    const { loading: loadingDispatch, success: successDispatch } = orderDispatch;
    
    const orderDeliver = useSelector((state) => state.orderDeliver);
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const navigate = useNavigate();

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

    const sendEmail = () => {
        emailjs.init("user_oJelKtrrrc8lIdPaF2FHz")
        emailjs.send("service_16zymxt", "template_6213qyo", {
            to_email: order.user.email,
            from_name: "EL PROMESERO",
            subject: `PEDIDO N°: ${order._id} DESPACHADO`,
            message: `Su Pedido fue Despachado con éxito. 
                Lo recibirá en su domicilio en aproximadamente ${order.days} días. Atte. El Promesero.`,
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
            })
        })
        .catch((error) => {
            console.error("Error al enviar el correo", error);
        });
    };

    const dispatchHandler = () => {
        //Modal para ingresar cantidad de dias para despachar
        dispatch(dispatchOrder(id, daysToDispatch))
        
        sendEmail()
    }    

    const deliverHandler = () => {
        dispatch(deliverOrder(order));
    }

    const formatDate = (dateString, formatString = "dd/MM/yyyy HH:mm:ss") => {
        if (!dateString) return ""
        
        const timeZone = "America/Argentina/Buenos_Aires"
        const date = new Date(dateString)
        const zonedDate = toZonedTime(date, timeZone)
                
        return format(zonedDate, formatString, { locale: es })
    }

    const generatePDF = () => {
        const input = orderRef.current

        const pdfButton = document.querySelector('.generate-pdf-button')
        if (pdfButton) pdfButton.style.display = 'none'

        html2canvas(input, { scale: 3 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4')
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width
            pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight)
            pdf.save(`Pedido_${order._id}.pdf`)
        });

        if (pdfButton) pdfButton.style.display = 'block';
    }

    useEffect(() => {
        if(!userInfo) {
            navigate('/login');
        }
        if(!order || successDispatch || successDeliver || order._id !== id) {
            dispatch({ type: ORDER_DISPATCH_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch({ type: CART_DROP })
            dispatch(getOrderDetails(id))
        } 
    }, [dispatch, navigate, id, successDispatch, successDeliver, order, userInfo]);

    return (
        loading 
            ? <Loader /> 
            : error ? <Message variant='danger'>{error}</Message> 
            : 
            <div 
                ref={orderRef} 
                id="order-details"
                className='mt-3 cursor-pointer'
            >
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h1>Pedido N°: <b>{order._id}</b></h1>
                            <h3 className='ubuntu font-extrabold'>Datos del Pedido</h3>
                            <p>
                                <strong><b>Usuario: </b></strong>{order.user.name}
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

                            {order.isDispatched 
                                ? 
                                    ( 
                                        <div className='mb-2 flex flex-col ubuntu'>
                                            <strong className='text-green-600 font-semibold mb-2'>
                                                ✅ Despachado el {formatDate(order.dispatchedAt, "dd/MM/yyyy")} a las {formatDate(order.dispatchedAt, "HH:mm:ss")}
                                            </strong>
                                            <strong><b>Días para Entrega: {order.days}</b></strong>
                                        </div>
                                        
                                    )
                                : (
                                    <div className='mb-2 flex flex-col ubuntu'>
                                        <strong className='text-red-600 font-semibold ubuntu'>❌ No Despachado</strong>
                                    </div>
                                )
                                    
                            }

                            {order.isDelivered 
                                ? (
                                    <div className='mb-2 flex flex-col ubuntu'>
                                        <strong className='text-green-600 font-semibold ubuntu'>
                                            ✅ Entregado el {formatDate(order.deliveredAt, "dd/MM/yyyy")}
                                        </strong>
                                    </div>
                                ) 
                                
                                : (
                                    <div className='mb-2 flex flex-col ubuntu'>
                                        <strong className='text-red-600 font-semibold ubuntu'>❌ No entregado</strong>
                                    </div>
                                )
                            }
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h3 className='ubuntu font-extrabold'>Detalle del Pedido</h3>
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
                            <ListGroup.Item className='p-0.5'>
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
                                    <Col><strong><b>Total</b></strong></Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            {loadingDispatch && <Loader />}
                            {userInfo && userInfo.isAdmin && !order.isDispatched && (
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
                                        onChange={(e) => setDaysToDispatch(Number(e.target.value))}
                                        placeholder="Días para despachar Pedido" 
                                        className="w-full p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                    <Button
                                        disabled={Number(daysToDispatch) === 0}
                                        type="button"
                                        className={`${daysToDispatch === 0 ? 'cursor-not-allowed': ''} w-full mt-3 bg-green-500 text-white py-2 px-4 rounded-md ${(daysToDispatch === 0) ? 'hover:bg-grey-300' : 'hover:bg-green-300' } green-600 transition duration-200`}
                                        onClick={dispatchHandler}
                                    >
                                        Despachar Pedido
                                    </Button>
                                </ListGroup.Item>
                            )}

                            {loadingDeliver && <Loader />}
                            {userInfo && userInfo.isAdmin && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button
                                        disabled={!order.isDelivered && !order.isDispatched}
                                        type='button'
                                        className={`${(!order.isDelivered && !order.isDispatched) ? 'cursor-not-allowed': ''} w-full mt-1 bg-green-500 text-white py-2 px-4 rounded-md ${(!order.isDelivered && !order.isDispatched) ? 'hover:bg-grey-300' : 'hover:bg-green-300' } green-600 transition duration-200`}
                                        onClick={deliverHandler}
                                    >
                                        Marcar como ENTREGADO
                                    </Button>
                                </ListGroup.Item>
                            )}
                            {userInfo && userInfo.isAdmin && order.isDispatched && order.isDelivered && (
                                <ListGroup.Item>
                                    <Button
                                        type="button"
                                        className="generate-pdf-button w-full mt-3 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
                                        onClick={generatePDF}
                                    >
                                        Generar PDF
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