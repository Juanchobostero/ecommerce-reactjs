import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
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
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        navigate('/payment');
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='address'>
                    <Form.Label>Address</Form.Label>
                        <Form.Control 
                            type='address' 
                            placeholder='Enter Address' 
                            value={address}
                            required
                            onChange={(e) => setAddress(e.target.value)}
                            >
                        </Form.Control>
                </Form.Group>

                <Form.Group controlId='city'>
                    <Form.Label>city</Form.Label>
                        <Form.Control 
                            type='city' 
                            placeholder='Enter City' 
                            value={city}
                            required
                            onChange={(e) => setCity(e.target.value)}
                            >
                        </Form.Control>
                </Form.Group>

                <Form.Group controlId='postalCode'>
                    <Form.Label>postalcode</Form.Label>
                        <Form.Control 
                            type='postalcode' 
                            placeholder='Enter Postal Code' 
                            value={postalCode}
                            required
                            onChange={(e) => setPostalCode(e.target.value)}
                            >
                        </Form.Control>
                </Form.Group>

                <Form.Group controlId='country'>
                    <Form.Label>country</Form.Label>
                        <Form.Control 
                            type='country' 
                            placeholder='Enter Country' 
                            value={country}
                            required
                            onChange={(e) => setCountry(e.target.value)}
                            >
                        </Form.Control>
                </Form.Group>

                <Button
                    type='submit'
                    variant='primary'
                >
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default ShippingScreen;