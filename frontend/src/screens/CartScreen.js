import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Form, Button, Card, ListGroupItem } from 'react-bootstrap';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../actions/cartActions';
import Swal from 'sweetalert2';

const CartScreen = () => {
  let navigate = useNavigate()
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  
  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    if(userInfo && userInfo.name) {
      navigate('/shipping');
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Debes iniciar sesión para poder continuar con la Compra',
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#d97706',
        background: '#fef3c7'
      })
      return
    }
  };

  return (
    <Row className='mt-4'>
      <Col md={8}>
        <h1 className='font-extrabold'>Tu carrito</h1>
        {cartItems.length === 0 
          ? <Message>Tu carrito está vacío <Link to='/'>Volver</Link></Message>
          : (
            <ListGroup variant='flush'>
              {cartItems.map(item => (
                <ListGroup.Item className='bg-amber-100' key={item.product}>
                  <Row>
                    <Col md={2}>
                      <Image 
                        className="w-40 h-20" 
                        src={item.image} 
                        alt={item.name} 
                        fluid 
                        rounder 
                      />
                    </Col>
                    <Col md={3}>
                      <Link 
                        className='ubuntu font-bold text-amber-950 hover:text-amber-600 opacity-80 transition-opacity duration-300' 
                        to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>
                      <span className='ubuntu font-extrabold text-amber-950'>${item.price}</span>
                    </Col>
                    <Col md={2}>
                      <Form.Control 
                        as='select' 
                        value={item.qty} 
                        onChange={(e) =>
                          dispatch(
                            addToCart(item.product, Number(e.target.value))
                          )
                        }
                      >
                        {[...Array(Number(item.countInStock)).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                          <Button 
                            type='button' 
                            variant='light'
                            onClick={() => removeFromCartHandler(item.product)}
                          >
                            <i className='fas fa-trash'></i>
                          </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item className='bg-amber-100'>
              <h2 className='ubuntu'>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) 
                items
              </h2>
              <span className='ubuntu font-bold text-base'>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>                  
            </ListGroup.Item>
            <ListGroup.Item className='bg-amber-100'>
              <strong>
                Restantes disponibles: 
                  <span className='ubuntu border-green-950 bg-green-300 p-1 text-xl text-green-900'>
                    <b>{40 - (cartItems.reduce((acc, item) => acc + item.qty, 0))}</b>
                  </span>
              </strong>
            </ListGroup.Item>
            <ListGroup.Item className='bg-amber-100' >
              <Button
                type='button'
                className='btn btn-block bg-amber-600'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Continuar con la Compra
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>                    
      </Col>
    </Row>
  )
}

export default CartScreen