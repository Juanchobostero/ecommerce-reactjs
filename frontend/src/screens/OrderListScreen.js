import React, { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, ListGroup, Row, Col, Form, FormLabel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listOrders } from '../actions/orderActions';
import { format, toZonedTime } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import ReactPaginate from 'react-paginate';

const OrderListScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders = [] } = orderList;
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin || {};

    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [fechaDesdeFiltro, setFechaDesdeFiltro] = useState('');
    const [fechaHastaFiltro, setFechaHastaFiltro] = useState('');
    const [numeroFiltro, setNumeroFiltro] = useState(''); // Nuevo estado para el filtro de número
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        if (userInfo?.isAdmin) {
            dispatch(listOrders());
        } else {
            navigate('/login');
        }
    }, [dispatch, navigate, userInfo]);

    const formatDate = (dateString, formatString = "dd/MM/yyyy HH:mm:ss") => {
        if (!dateString) return "";
        const timeZone = "America/Argentina/Buenos_Aires";
        const date = new Date(dateString);
        const zonedDate = toZonedTime(date, timeZone);
        return format(zonedDate, formatString, { locale: es });
    };

    const filteredOrders = orders.filter(order => {
        const matchEstado = !estadoFiltro || 
            (estadoFiltro === 'despachado' && order.isDispatched) ||
            (estadoFiltro === 'entregado' && order.isDelivered) ||
            (estadoFiltro === 'baja' && order.disabled);
        
        const formattedFechaDesdeFiltro = fechaDesdeFiltro ? formatDate(fechaDesdeFiltro, "yyyy-MM-dd'T'HH:mm:ss") : '';
        const formattedFechaHastaFiltro = fechaHastaFiltro ? formatDate(fechaHastaFiltro + 'T23:59:59', "yyyy-MM-dd'T'HH:mm:ss") : '';
        
        const matchFechaDesde = !formattedFechaDesdeFiltro || new Date(order.createdAt) >= new Date(formattedFechaDesdeFiltro);
        const matchFechaHasta = !formattedFechaHastaFiltro || new Date(order.createdAt) <= new Date(formattedFechaHastaFiltro);

        const matchNumero = !numeroFiltro || order.number.toString().includes(numeroFiltro); // Filtro por número de pedido
        
        return matchEstado && matchFechaDesde && matchFechaHasta && matchNumero;
    });

    const pageCount = Math.ceil(filteredOrders.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentOrders = filteredOrders.slice(offset, offset + itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    return (
        <Fragment>
            <ListGroup.Item className='bg-amber-100 mt-4 py-4 px-8'>
                {/* Fila para el título */}
                <Row className='mb-3'>
                    <Col>
                        <h1 className='font-source font-bold text-center'>Pedidos</h1>
                    </Col>
                </Row>

                {/* Fila para los filtros */}
                <Row className='flex flex-wrap gap-3 px-4 py-3'>
                    <Col xs={12} sm={6} md={3}>
                        <FormLabel>Estado</FormLabel>
                        <Form.Control 
                            as="select" 
                            value={estadoFiltro} 
                            onChange={(e) => setEstadoFiltro(e.target.value)}
                            className="text-sm"
                        >
                            <option value="">Todos</option>
                            <option value="despachado">Despachado</option>
                            <option value="entregado">Entregado</option>
                            <option value="baja">Cancelado</option>
                        </Form.Control>
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                        <FormLabel>Fecha Desde</FormLabel>
                        <Form.Control 
                            type="date" 
                            value={fechaDesdeFiltro} 
                            onChange={(e) => setFechaDesdeFiltro(e.target.value)} 
                            placeholder="Desde" 
                            className="text-sm"
                        />
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                        <FormLabel>Fecha Hasta</FormLabel>
                        <Form.Control 
                            type="date" 
                            value={fechaHastaFiltro} 
                            onChange={(e) => setFechaHastaFiltro(e.target.value)} 
                            placeholder="Hasta" 
                            className="text-sm"
                        />
                    </Col>
                    <Col xs={12} sm={6} md={3}>
                        <FormLabel>Número de Pedido</FormLabel>
                        <Form.Control 
                            type="text" 
                            value={numeroFiltro} 
                            onChange={(e) => setNumeroFiltro(e.target.value)} 
                            placeholder="Buscar por número" 
                            className="text-sm"
                        />
                    </Col>
                </Row>

                {/* Tabla de pedidos */}
                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant='danger'>{error}</Message>
                ) : (
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <Table striped bordered hover responsive className='table-sm'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>CLIENTE</th>
                                        <th>FECHA ALTA</th>
                                        <th>TOTAL</th>
                                        <th>DESPACHADO</th>
                                        <th>ENTREGADO</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentOrders.map(order => (
                                        <tr key={order._id}>
                                            <td><b>{order.number}</b></td>
                                            <td>{order.user?.name || 'Sin cliente'}</td>
                                            <td>{formatDate(order.createdAt, "dd/MM/yyyy")}</td>
                                            <td>${order.totalPrice}</td>
                                            <td>{order.isDispatched ? formatDate(order.dispatchedAt, "dd/MM/yyyy") : <i className='fas fa-times' style={{ color: 'red' }}></i>}</td>
                                            <td>{order.isDelivered ? formatDate(order.deliveredAt, "dd/MM/yyyy") : <i className='fas fa-times' style={{ color: 'red' }}></i>}</td>
                                            <td>
                                                <LinkContainer to={`/order/${order._id}`}>
                                                    <Button variant='dark' className='btn-sm bg-amber-400 hover:bg-amber-600'>
                                                        <i className='fas fa-edit'></i> Detalles
                                                    </Button>
                                                </LinkContainer>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <ReactPaginate
                                previousLabel={'← Anterior'}
                                nextLabel={'Siguiente →'}
                                breakLabel={'...'}
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={'pagination justify-content-center'}
                                pageClassName={'page-item'}
                                pageLinkClassName={'page-link'}
                                previousClassName={'page-item'}
                                previousLinkClassName={'page-link'}
                                nextClassName={'page-item'}
                                nextLinkClassName={'page-link'}
                                breakClassName={'page-item'}
                                breakLinkClassName={'page-link'}
                                activeClassName={'active'}
                            />
                        </ListGroup.Item>
                    </ListGroup>
                )}
            </ListGroup.Item>
        </Fragment>
    );
};

export default OrderListScreen;