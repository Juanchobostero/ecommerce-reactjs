import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';



const PaymentScreen = () => {
    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;

    const navigate = useNavigate();

    if(!shippingAddress) {
        navigate('/shipping');
    }

    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h1>Método de pago</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Seleccionar método de pago</Form.Label>
                

                    <Col>
                        <Form.Check 
                            type='radio' 
                            label='PayPal o Tarjeta de Crédito' 
                            id='PayPal'
                            name='paymentMethod'
                            value='PayPal'
                            onChange={(e)=> setPaymentMethod(e.target.value)}
                        >

                        </Form.Check>

                        <Form.Check 
                            type='radio' 
                            label='Mercado Pago' 
                            id='mp'
                            name='paymentMethod'
                            value='MP'
                            onChange={(e)=> setPaymentMethod(e.target.value)}
                        > 

                        </Form.Check>
                    </Col>
                </Form.Group>
                <Button
                    type='submit'
                    variant='primary'
                >
                    Continuar
                </Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen;