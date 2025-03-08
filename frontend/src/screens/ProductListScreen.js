import React, { useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { deleteProduct, listProducts, createProduct } from '../actions/productActions';
import { PRODUCT_CREATE_RESET } from '../constants/productConstants';
import Paginate from '../components/Paginate';
import { useParams } from 'react-router-dom';

const ProductListScreen = () => {
    const params = useParams();
    const pageNumber = params.pageNumber || 1;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productList = useSelector(state => state.productList);
    const { 
        loading, 
        error, 
        products,
        page,
        pages
    } = productList;

    const productDelete = useSelector(state => state.productDelete);
    const { 
        loading: loadingDelete, 
        error: errorDelete, 
        success: successDelete 
    } = productDelete;

    const productCreate = useSelector(state => state.productCreate);
    const { 
        loading: loadingCreate, 
        error: errorCreate, 
        success: successCreate,
        product: createdProduct 
    } = productCreate;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {

        dispatch({ type: PRODUCT_CREATE_RESET });

        if(!userInfo.isAdmin) {
            navigate('/login');
        }
        
        if(successCreate) {
            navigate(`/admin/product/${createdProduct._id}/edit`);
        } else {
            dispatch(listProducts('', pageNumber));
        }
      
    }, [
        dispatch, 
        navigate, 
        userInfo, 
        successDelete, 
        successCreate, 
        createdProduct,
        pageNumber
    ]);

    const deleteHandler = (id) => {
        if(window.confirm('¿ Estás seguro de eliminar éste Usuario ?')){
            dispatch(deleteProduct(id));
        }
    }

    const createProductHandler = () => {
        navigate(`/admin/product/new`);
    }
    
    return (
        <Fragment>
            <Row className='align-items-center'>
                <Col>
                    <h1>Productos</h1>
                </Col>
                <Col className='text-right'>
                    <Button 
                        className='my-3 bg-amber-700 text-white' 
                        onClick={createProductHandler}>
                        <i className='fas fa-plus'></i> Nuevo Producto
                    </Button>
                </Col>
            </Row>
            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
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
                                        <th>CÓDIGO</th>
                                        <th>NOMBRE</th>
                                        <th>PRECIO</th>
                                        <th>STOCK</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {products.map(product => (
                                        <tr key={product._id}>
                                            <td>{product.code}</td>
                                            <td>{product.name}</td>
                                            <td>
                                                ${product.price}
                                            </td>
                                            <td 
                                                className={`${(product.countInStock <= 5 && 'lowStock')}`}
                                            >
                                                {product.countInStock}
                                            </td>
                                            <td>
                                                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                                    <Button 
                                                        variant='dark'
                                                        className='btn-sm bg-amber-400 hover:bg-amber-600'
                                                    >
                                                        <i className='fas fa-edit'></i>
                                                    </Button>
                                                </LinkContainer>
                                                <Button
                                                    variant='dark'
                                                    className='btn-sm bg-red-600'
                                                    onClick={() => deleteHandler(product._id)}
                                                >
                                                    <i className='fas fa-trash'></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </ListGroup.Item>
                    </ListGroup>
                    <Paginate 
                        pages={pages}
                        page={page}
                        isAdmin={true}
                    />
                </>
            )}
        </Fragment>
    )
}

export default ProductListScreen;