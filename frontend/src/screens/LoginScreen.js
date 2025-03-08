import React, { useState, useEffect, Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { login } from '../actions/userActions';
import FormContainer from '../components/FormContainer';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const userLogin = useSelector(state => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const location = useLocation();
  const navigate = useNavigate();

  const redirect = location.search ? location.search.split('=')[1] : '/';
  
  useEffect(() => {
    if(userInfo && userInfo._id) {
        navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);
  

  const submitHandler = (e) => {
    e.preventDefault();

    // DISPATCH LOGIN
    dispatch(login(email, password));
  }
  
  return (
    <div className='mt-20'>
      <FormContainer>
            <ListGroup.Item>
              <h1 className='mb-6'>Iniciar Sesión</h1>
              {error && <Message variant='danger'>{error}</Message>}
              {loading && <Loader />}
              <Form onSubmit={submitHandler}>
                  <Form.Group controlId='email'>
                      <Form.Label>Correo</Form.Label>
                      <Form.Control
                          className="bg-gray-100 border border-gray-600 rounded-md"
                          type='email' 
                          placeholder='Ingresar correo' 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          >
                          </Form.Control>
                  </Form.Group>

                  <Form.Group controlId='password'>
                      <Form.Label>Contraseña</Form.Label>
                      <Form.Control
                          className="bg-gray-100 border border-gray-600 rounded-md"
                          type='password' 
                          placeholder='Ingresar contraseña' 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          >
                          </Form.Control>
                  </Form.Group>

                  <Button className='btn btn-block bg-green-600 mt-4' type='submit' variant='primary'>
                      Acceder
                  </Button>
              </Form>
            </ListGroup.Item>
          </FormContainer>
    </div>
    
  )
}

export default LoginScreen