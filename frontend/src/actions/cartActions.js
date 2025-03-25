import axios from 'axios';
import { 
    CART_ADD_ITEM, 
    CART_REMOVE_ITEM, 
    CART_SAVE_PAYMENT_METHOD, 
    CART_SAVE_SHIPPING_ADDRESS,
    CART_DROP 
} from '../constants/cartConstants';

const url = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000' 
    : process.env.REACT_APP_URI_API_PRODUCTION

    export const addToCart = (id, qty, replace = false) => async (dispatch, getState) => {
        const { data } = await axios.get(`${url}/api/products/${id}`);
    
        // Buscar si el producto ya está en el carrito
        const existingItem = getState().cart.cartItems.find(item => item.product === id);
    
        dispatch({
            type: CART_ADD_ITEM,
            payload: {
                product: data._id,
                name: data.name,
                image: data.image,
                price: data.price,
                countInStock: data.countInStock,
                qty: existingItem && !replace ? existingItem.qty + qty : qty // ✅ Sumar cantidad si ya existe y no se reemplaza
            }
        });
    
        localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
    };
    

export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data
    });

    localStorage.setItem('shippingAddress', JSON.stringify(data));
}

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data
    });

    localStorage.setItem('paymentMethod', JSON.stringify(data));
}

export const cartDrop = () => (dispatch) => {
    // Despacha la acción para vaciar el carrito
    dispatch({
        type: CART_DROP,
    });

    // Limpia los datos del carrito en el localStorage
    localStorage.setItem('cartItems', JSON.stringify([])); // Guarda un array vacío para los items del carrito
};



