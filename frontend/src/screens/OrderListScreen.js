import React, { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, ListGroup, Row, Col, Form } from 'react-bootstrap';
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
    const [fechaFiltro, setFechaFiltro] = useState('');
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
            (estadoFiltro === 'entregado' && order.isDelivered);
        const matchFecha = !fechaFiltro || order.createdAt.substring(0, 10) === fechaFiltro;
        return matchEstado && matchFecha;
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
                <Row className='flex flex-row gap-8 px-4 py-3'>
                    <h1 className='ubuntu font-bold'>Pedidos</h1>
                    <Col md={3}>
                        <Form.Control as="select" value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="despachado">Despachado</option>
                            <option value="entregado">Entregado</option>
                        </Form.Control>
                    </Col>
                    <Col md={3}>
                        <Form.Control type="date" value={fechaFiltro} onChange={(e) => setFechaFiltro(e.target.value)} />
                    </Col>
                </Row>

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
                                            <td>{order._id}</td>
                                            <td>{order.user?.name || 'Sin cliente'}</td>
                                            <td>{order.createdAt?.substring(0, 10) || '-'}</td>
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
