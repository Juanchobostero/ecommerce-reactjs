import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
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
    <FormContainer>
        <h1>Iniciar Sesión</h1>
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='email'>
                <Form.Label>Correo</Form.Label>
                <Form.Control 
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
                    type='password' 
                    placeholder='Ingresar contraseña' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    >
                    </Form.Control>
            </Form.Group>

            <Button className='btn btn-block bg-amber-600 mt-4' type='submit' variant='primary'>
                Acceder
            </Button>
        </Form>

        <Row className='py-3'>
            <Col>
                Eres nuevo ? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Registrarse</Link>
            </Col>
        </Row>
    </FormContainer>
  )
}

export default LoginScreen