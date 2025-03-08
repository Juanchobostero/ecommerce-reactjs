import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, ListGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../actions/cartActions';


const ShippingScreen = () => {
    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;

    const [address, setAddress] = useState(shippingAddress.address);
    const [city, setCity] = useState(shippingAddress.city);
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
    const [country, setCountry] = useState(shippingAddress.country);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({ address, city, postalCode, country }))
        navigate('/placeorder')
    }

    return (
        <FormContainer>
            <CheckoutSteps className="mt-3" step1 step2 />
            <ListGroup className='bg-white py-4 px-8 rounded-md shadow-md'>
                <h1>Envío</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='address' className='mb-3'>
                        <Form.Control
                            className="bg-gray-100 border border-gray-600 rounded-md" 
                            type='address' 
                            placeholder='Ingresar Dirección' 
                            value={address}
                            required
                            onChange={(e) => setAddress(e.target.value)}
                            >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='city' className='mb-3'>
                        <Form.Control
                            className="bg-gray-100 border border-gray-600 rounded-md" 
                            type='city' 
                            placeholder='Ingresar Ciudad' 
                            value={city}
                            required
                            onChange={(e) => setCity(e.target.value)}
                            >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='postalCode' className='mb-3'>
                        <Form.Control
                            className="bg-gray-100 border border-gray-600 rounded-md" 
                            type='postalcode' 
                            placeholder='Ingresar Código Postal' 
                            value={postalCode}
                            required
                            onChange={(e) => setPostalCode(e.target.value)}
                            >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='country' className='mb-3'>
                        <Form.Control
                            className="bg-gray-100 border border-gray-600 rounded-md" 
                            type='country' 
                            placeholder='Ingresar País' 
                            value={country}
                            required
                            onChange={(e) => setCountry(e.target.value)}
                            >
                        </Form.Control>
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
    )
}

export default ShippingScreen;