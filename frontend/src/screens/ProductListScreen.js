import React, { useEffect, useState, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, ListGroup, Row, Col, Form, FormLabel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listProducts } from '../actions/productActions';
import { format, toZonedTime } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import ReactPaginate from 'react-paginate';

const ProductListScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productList = useSelector((state) => state.productList);
    const { loading, error, products = [] } = productList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin || {};

    // Estados para los filtros
    const [nombreFiltro, setNombreFiltro] = useState('');
    const [descuentoFiltro, setDescuentoFiltro] = useState('');
    const [fechaDesdeFiltro, setFechaDesdeFiltro] = useState('');
    const [fechaHastaFiltro, setFechaHastaFiltro] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5; // Cantidad de productos por página

    // Obtener productos al cargar el componente
    useEffect(() => {
        if (userInfo?.isAdmin) {
            dispatch(listProducts());
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

    // Aplicar los filtros en el frontend
    const filteredProducts = products.filter(product => {
        const matchNombre = !nombreFiltro || product.name.toLowerCase().includes(nombreFiltro.toLowerCase());
        const matchDescuento = !descuentoFiltro || 
            (descuentoFiltro === 'con_descuento' && product.discount > 0) || 
            (descuentoFiltro === 'sin_descuento' && product.discount === 0);
        
        const formattedFechaDesdeFiltro = fechaDesdeFiltro ? formatDate(fechaDesdeFiltro, "yyyy-MM-dd'T'HH:mm:ss") : '';
        const formattedFechaHastaFiltro = fechaHastaFiltro ? formatDate(fechaHastaFiltro + 'T23:59:59', "yyyy-MM-dd'T'HH:mm:ss") : '';
        
        const matchFechaDesde = !formattedFechaDesdeFiltro || new Date(product.createdAt) >= new Date(formattedFechaDesdeFiltro);
        const matchFechaHasta = !formattedFechaHastaFiltro || new Date(product.createdAt) <= new Date(formattedFechaHastaFiltro);
        
        return matchNombre && matchDescuento && matchFechaDesde && matchFechaHasta;
    });

    // Calcular la paginación
    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
    const offset = currentPage * itemsPerPage;
    const currentProducts = filteredProducts.slice(offset, offset + itemsPerPage);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const createProductHandler = () => {
        navigate(`/admin/product/new`);
    }

    // ...existing code...

return (
    <Fragment>
        <ListGroup.Item className='bg-amber-100 mt-4 py-4 px-8'>
            <Row className='flex flex-row gap-2 px-2 py-1'>
                <h1 className='ubuntu font-bold'>Productos 
                    <Button 
                        className='my-1 mx-3 bg-amber-700 text-white border rounded-sm border-amber-500' 
                        onClick={createProductHandler}
                    >
                    <i className='fas fa-plus'></i>
                </Button></h1>
            </Row>
            <Row className='flex flex-row gap-4 px-4 py-2'>
                <Col md={2}>
                    <FormLabel>Nombre</FormLabel>
                    <Form.Control 
                        type="text" 
                        placeholder="Buscar por nombre" 
                        value={nombreFiltro} 
                        onChange={(e) => setNombreFiltro(e.target.value)}
                        className='p-1'
                    />
                </Col>
                <Col md={2}>
                    <FormLabel>Descuento</FormLabel>
                    <Form.Control 
                        as="select" 
                        value={descuentoFiltro} 
                        onChange={(e) => setDescuentoFiltro(e.target.value)}
                        className='p-1'
                    >
                        <option value="">Todos</option>
                        <option value="con_descuento">Con Descuento</option>
                        <option value="sin_descuento">Sin Descuento</option>
                    </Form.Control>
                </Col>
                <Col md={2}>
                    <FormLabel>Fecha Desde</FormLabel>
                    <Form.Control 
                        type="date" 
                        value={fechaDesdeFiltro} 
                        onChange={(e) => setFechaDesdeFiltro(e.target.value)}
                        className='p-1'
                    />
                </Col>
                <Col md={2}>
                    <FormLabel>Fecha Hasta</FormLabel>
                    <Form.Control 
                        type="date" 
                        value={fechaHastaFiltro} 
                        onChange={(e) => setFechaHastaFiltro(e.target.value)}
                        className='p-1'
                    />
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
                                    <th>NOMBRE</th>
                                    <th>FECHA CREACIÓN</th>
                                    <th>PRECIO</th>
                                    <th>DESCUENTO</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map(product => (
                                    <tr key={product._id}>
                                        <td>{product._id}</td>
                                        <td>{product.name}</td>
                                        <td>{formatDate(product.createdAt, "dd/MM/yyyy")}</td>
                                        <td>${product.price}</td>
                                        <td>{product.discount > 0 ? `${product.discount}%` : 'Sin descuento'}</td>
                                        <td>
                                            <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                <Button variant='dark' className='btn-sm bg-amber-400 hover:bg-amber-600'>
                                                    <i className='fas fa-edit'></i> Editar
                                                </Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        
                        {/* Paginación */}
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

export default ProductListScreen;