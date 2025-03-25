import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, ListGroup, FormLabel } from 'react-bootstrap';
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
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
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
  
  const validateName = (name) => {
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
    return nameRegex.test(name);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!validateName(name)) {
        showMessage('El nombre no puede contener números ni caracteres especiales.');
    } else if (!validateEmail(email)) {
        showMessage('El correo electrónico no es válido.');
    } else if (password !== confirmPassword) {
        showMessage('Las contraseñas no coinciden.');
    } else if (name === '' || email === '' || password === '' || confirmPassword === '' || address === '' || city === '' || postalCode === '' || country === '') {
        showMessage('Todos los campos son obligatorios.');
    } else {
        setMessage(null);
        dispatch(register({
            name, 
            email, 
            password,
            address,
            city,
            postalCode,
            country
        }));
    }
  };
  
  return (
    <div className='mt-10'>
    <FormContainer>
        <ListGroup.Item className='bg-white mb-8'>
            <h1 className='mb-6'>Registro</h1>
            {message && <Message variant='danger'>{message}</Message>}
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId='name' className='mb-3'>
                            <FormLabel>Nombre</FormLabel>
                            <Form.Control
                                className="bg-gray-100 border border-gray-600 rounded-md" 
                                type='text' 
                                placeholder='Ingresar Nombre' 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId='email' className='mb-3'>
                            <FormLabel>Correo</FormLabel>
                            <Form.Control
                                className="bg-gray-100 border border-gray-600 rounded-md" 
                                type='email' 
                                placeholder='Ingresar Correo' 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId='password' className='mb-3'>
                            <FormLabel>Contraseña</FormLabel>
                            <Form.Control
                                className="bg-gray-100 border border-gray-600 rounded-md" 
                                type='password' 
                                placeholder='Ingresar Contraseña' 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId='confirmPassword' className='mb-3'>
                            <FormLabel>Confirmar Contraseña</FormLabel>
                            <Form.Control
                                className="bg-gray-100 border border-gray-600 rounded-md" 
                                type='password' 
                                placeholder='Confirmar Contraseña' 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId='address' className='mb-3'>
                            <FormLabel>Dirección</FormLabel>
                            <Form.Control
                                className="bg-gray-100 border border-gray-600 rounded-md" 
                                type='text' 
                                placeholder='Ingresar Dirección' 
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId='city' className='mb-3'>
                            <FormLabel>Ciudad</FormLabel>
                            <Form.Control
                                className="bg-gray-100 border border-gray-600 rounded-md" 
                                type='text' 
                                placeholder='Ingresar Ciudad' 
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId='postalCode' className='mb-3'>
                            <FormLabel>Código Postal</FormLabel>
                            <Form.Control
                                className="bg-gray-100 border border-gray-600 rounded-md" 
                                type='text' 
                                placeholder='Ingresar Código Postal' 
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId='country' className='mb-3'>
                            <FormLabel>País</FormLabel>
                            <Form.Control
                                className="bg-gray-100 border border-gray-600 rounded-md" 
                                type='text' 
                                placeholder='Ingresar País' 
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button 
                    className='btn btn-block bg-green-600 mt-4' 
                    type='submit' 
                >
                    Confirmar
                </Button>
            </Form>
            <Row className='py-1'>
                <Col>
                    <Button 
                        className='my-3 bg-amber-700 text-white w-full' 
                        onClick={() => navigate(-1)}
                    >
                        Volver
                    </Button>
                </Col>
            </Row>
        </ListGroup.Item>
    </FormContainer>
    </div>
  );
};

export default RegisterScreen;