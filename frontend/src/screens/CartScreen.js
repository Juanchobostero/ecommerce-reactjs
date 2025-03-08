import React, { useState } from 'react';
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
    dispatch(removeFromCart(id))
  };

  const handleAddToCart = (product, qty) => {
    const currentItem = cartItems.find(item => item.product === product)
    const currentQty = currentItem ? currentItem.qty : 0
    const newTotalItems = cartItems.reduce((acc, item) => acc + item.qty, 0) - currentQty + qty
    const limit = 28
  
    if (newTotalItems > limit) {
      Swal.fire({
        title: 'Error!',
        text: `El límite de compra es hasta ${limit} productos por pedido. Por favor, revisa tu carrito.`,
        icon: 'error',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#d97706',
        background: '#fff',
        customClass: {
            title: 'font-source',
            popup: 'font-source',
        }
      });
      return
    } else {
      dispatch(addToCart(product, qty))
    }
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
        background: '#fff',
        customClass: {
            title: 'font-source',
            popup: 'font-source',
        }
      })
      return
    }
  };

  return (
    <Row className='mt-4'>
      <Col md={8}>
        {cartItems.length === 0 
          ? <Message>Tu carrito está vacío <Link to='/'>Volver</Link></Message>
          : (
            <ListGroup className='bg-white py-2 px-4'>
              <Row>
                <h1 className='font-source text-3xl text-amber-950 ml-[2rem] mb-4'>Carrito</h1>
              </Row>
              {cartItems.map(item => (
                <ListGroup.Item className='bg-white' key={item.product}>
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
                        className='font-source font-bold text-amber-950 hover:text-amber-600 opacity-80 transition-opacity duration-300' 
                        to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>
                      <span className='font-source font-extrabold text-amber-950'>${item.price}</span>
                    </Col>
                    <Col md={2}>
                      <Form.Control 
                        as='select' 
                        value={item.qty} 
                        onChange={(e) =>
                          handleAddToCart(item.product, Number(e.target.value))
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
                            className='bg-red-600'
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
          <ListGroup className='bg-white py-2 px-4'>
            <ListGroup.Item>
              <h2 className='font-source'>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) 
                items
              </h2>
              <span className='font-source font-bold text-base'>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>                  
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>
                Restantes disponibles: 
                  <span className='font-source cursor-pointer hover:opacity-50 transition-all rounded-sm border-green-950 bg-green-300 p-1 text-xl text-green-900'>
                    <b>{28 - (cartItems.reduce((acc, item) => acc + item.qty, 0))}</b>
                  </span>
              </strong>
            </ListGroup.Item>
            <ListGroup.Item>
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