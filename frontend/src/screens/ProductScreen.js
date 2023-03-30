import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import Rating from '../components/Rating';
import { useDispatch, useSelector } from 'react-redux';
import { listProductDetails, createProductReview } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';
import Meta from '../components/Meta';

const ProductScreen = () => {

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    
    const { id } = useParams();
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const productDetails = useSelector(state => state.productDetails);
    const { loading, error, product } = productDetails;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const productReviewCreate = useSelector(state => state.productReviewCreate);
    const { 
        error: errorProductReview, 
        success : successProductReview
    } = productReviewCreate;

    useEffect(() => {
        if(successProductReview) {
            alert('Review Submitted !');
            setRating(0);
            setComment('');
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
        }
        dispatch(listProductDetails(id));
      }, [dispatch, id, successProductReview]);

    const addToCartHandler = () => {
        navigate(`/cart/${id}?qty=${qty}`);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createProductReview(id, {
            rating,
            comment
        }));
    }

    return (
        <>
            <Link className='btn btn-light my-3' to='/'>
                Volver
            </Link>
            { loading 
                ? (<Loader />) 
                : error ? (<Message variant='danger'>{error}</Message>
                ) : (
                <>
                <Meta title={product.name} />
                <Row>
                    <Col md={6}>
                        <Image src={product.image} alt={product.name} fluid />
                    </Col>
                    <Col md={3}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h3>{product.name}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating 
                                    value={product.rating} 
                                    text={`${product.numReviews} reseñas`}
                                />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Precio: ${product.price}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Descripción: {product.description}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col md={3}>
                        <Card>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Precio:
                                        </Col>
                                        <Col>
                                            <strong>${product.price}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            Estado:
                                        </Col>
                                        <Col>
                                            {product.countInStock > 0 ? 'En stock' : 'Fuera de stock'}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Cantidad</Col>
                                            <Col>
                                                <Form.Control 
                                                    as='select' 
                                                    value={qty} 
                                                    onChange={(e) => 
                                                        setQty(e.target.value)}
                                                >
                                                    {[...Array(Number(product.countInStock)).keys()].map( (x) => (
                                                        <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}

                                <ListGroup.Item>
                                    <Button 
                                        onClick={addToCartHandler}
                                        className='btn-block' 
                                        disabled={product.countInStock === 0}
                                    >
                                        Agregar al carrito
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <h2>Reseñas</h2>
                        {product.reviews.length === 0 && <Message>No hay reseñas</Message>}
                        <ListGroup variant='flush'>
                            {product.reviews.map(review => (
                                <ListGroup.Item key={review._id}>
                                    <strong>{review.name}</strong>
                                    <Rating value={review.rating} />
                                    <p>
                                      {review.createdAt.substring(0, 10)}  
                                    </p>
                                    <p>
                                        {review.comment}
                                    </p>
                                </ListGroup.Item>
                            ))}
                            <ListGroup.Item>
                                <h2>Escribir una reseña</h2>
                                {errorProductReview && (
                                    <Message variant='danger'>{errorProductReview}</Message>
                                )}
                                {userInfo && userInfo.name
                                    ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId='rating'>
                                                <Form.Label>Calificación</Form.Label>
                                                <Form.Control
                                                    as='select'
                                                    value={rating}
                                                    onChange={(e) => setRating(e.target.value)}
                                                >
                                                    <option value=''>Seleccionar...</option>
                                                    <option value='1'>1 - Pobre</option>
                                                    <option value='2'>2 - Justa</option>
                                                    <option value='3'>3 - Bueno</option>
                                                    <option value='4'>4 - Muy bueno</option>
                                                    <option value='5'>5 - Excelente</option>
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group controlId='comment'>
                                                <Form.Label>Comment</Form.Label>
                                                <Form.Control
                                                    as='textarea'
                                                    row='3'
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                >

                                                </Form.Control>
                                            </Form.Group>
                                            <Button 
                                                type='submit'
                                                variant='primary'
                                            >
                                                Enviar
                                            </Button>
                                        </Form>
                                    ) 
                                    : (<Message>Por favor <Link to='/login'>ingresar</Link> para escribir una reseña</Message>)}
                            </ListGroup.Item>                                       
                        </ListGroup>
                    </Col>
                </Row>
                </>
                ) }
            
        </>
    )
}

export default ProductScreen;