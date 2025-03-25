import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../actions/cartActions';

const ShippingScreen = () => {
    const cart = useSelector(state => state.cart);

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            setAddress(userInfo.address || '')
            setCity(userInfo.city || '')
            setPostalCode(userInfo.postalCode || '')
            setCountry(userInfo.country || '')
        }
    }, [navigate, userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        navigate('/placeorder');
    };

    return (
        <FormContainer>
            <CheckoutSteps className="mt-3" step1 step2 />
            <ListGroup className='bg-white py-4 px-8 rounded-md shadow-md'>
                <h1>Envío</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='address' className='mb-3'>
                        <Form.Control
                            className="bg-gray-100 border border-gray-600 rounded-md" 
                            type='text' 
                            placeholder='Ingresar Dirección' 
                            value={address}
                            required
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId='city' className='mb-3'>
                        <Form.Control
                            className="bg-gray-100 border border-gray-600 rounded-md" 
                            type='text' 
                            placeholder='Ingresar Ciudad' 
                            value={city}
                            required
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId='postalCode' className='mb-3'>
                        <Form.Control
                            className="bg-gray-100 border border-gray-600 rounded-md" 
                            type='text' 
                            placeholder='Ingresar Código Postal' 
                            value={postalCode}
                            required
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId='country' className='mb-3'>
                        <Form.Control
                            className="bg-gray-100 border border-gray-600 rounded-md" 
                            type='text' 
                            placeholder='Ingresar País' 
                            value={country}
                            required
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </Form.Group>
                    <Button 
                        type='submit' 
                        variant='primary' 
                        className='btn-block my-3 bg-amber-700 text-white' 
                    >
                        Continuar
                    </Button>
                </Form>
            </ListGroup>
        </FormContainer>
    );
};

export default ShippingScreen;