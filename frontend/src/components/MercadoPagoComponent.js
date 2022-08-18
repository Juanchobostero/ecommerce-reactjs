import React, { useEffect } from 'react';
import mercadopago from 'mercadopago';
import axios from 'axios';
import { useSelector } from 'react-redux';

const MercadoPagoComponent = ({ order }) => {

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;


    useEffect(() => {
        // Add SDK credentials
        // REPLACE WITH YOUR PUBLIC KEY AVAILABLE IN: https://developers.mercadopago.com/panel
        mercadopago.configure({
            access_token: 'APP_USR-5029250925841563-081611-6d6c33c264b920c6cce47d975f80e384-1180488044'
        });

        const loadMpButton = async (order) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                },
                orderItems: order.orderItems
            };

            const { data } = await axios
            .post('https://api.mercadopago.com/checkout/preferences', config);
            console.log(data);

            /* // Initialize the checkout
            mercadopago.checkout({
                preference: {
                    id: data.id
                },
                render: {
                    container: '#button-checkout', // Class name where the payment button will be displayed
                    label: 'Pay', // Change the payment button text (optional)
                }
            }); */
        }
        loadMpButton(order, userInfo);

      
    }, [order, userInfo]);


    return( 
        <div id="button-checkout">
        </div>       
    )
}

export default MercadoPagoComponent;