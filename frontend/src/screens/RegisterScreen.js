import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { register } from '../actions/userActions';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);


  const dispatch = useDispatch();

  const userRegister = useSelector(state => state.userRegister);
  const { loading, error, userInfo } = userRegister;

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

    if(password !== confirmPassword) {
        setMessage('Passwords do not match !')
    } else {
        dispatch(register(name, email, password));
    }
  }
  
  return (
    <FormContainer>
        <h1>Registro</h1>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='mb-3'>
                    <Form.Control 
                        type='name' 
                        placeholder='Ingresar Nombre' 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        >
                    </Form.Control>
            </Form.Group>
            <Form.Group controlId='email' className='mb-3'>
                <Form.Control 
                    type='email' 
                    placeholder='Ingresar Correo' 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    >
                    </Form.Control>
            </Form.Group>

            <Form.Group controlId='password' className='mb-3'>
                <Form.Control 
                    type='password' 
                    placeholder='Ingresar Contraseña' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    >
                    </Form.Control>
            </Form.Group>

            <Form.Group controlId='confirmPassword' className='mb-3'>
                <Form.Control 
                    type='password' 
                    placeholder='Confirmar Contraseña' 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    >
                    </Form.Control>
            </Form.Group>
            <Button 
                className='btn btn-block bg-amber-600 mt-4' 
                type='submit' 
            >
                Confirmar
            </Button>
        </Form>

        <Row className='py-3'>
            <Col>
                <span className='text-amber-100 font-bold'>¿ Ya tenes una cuenta ?</span>
                    <Link
                        className='font-bold text-white hover:opacity-50' 
                        to={redirect 
                        ? `/login?redirect=${redirect}` 
                        : '/login'}> Iniciar Sesión</Link>
            </Col>
        </Row>
    </FormContainer>
  )
}

export default RegisterScreen;