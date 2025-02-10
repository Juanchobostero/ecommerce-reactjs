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

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createProductReview(id, {
            rating,
            comment
        }));
    }

    return (
        <div className='h-auto mb-3'>
            <Button className='my-3 bg-amber-700 text-white' onClick={() => navigate(-1)}>
                Volver
            </Button>
            { loading 
                ? (<Loader />) 
                : error ? (<Message variant='danger'>{error}</Message>
                ) : (
                <>
                <Meta title={product.name} />
                <Row>
                    <Col md={6}>
                        <Image className='object-cover w-96 h-96' src={product.image} alt={product.name} fluid />
                    </Col>
                    <Col md={6}>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h3 className='ubuntu prod-name'>{product.name}</h3>
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
                </Row>
                <Row>
                    <Col md={6}>
                        <h2 className='ubuntu'>Reseñas</h2>
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
                                <h2 className='ubuntu'>Escribir una reseña</h2>
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
            
        </div>
    )
}

export default ProductScreen;