import axios from "axios";
import { 
    ORDER_CREATE_REQUEST, 
    ORDER_CREATE_SUCCESS, 
    ORDER_CREATE_FAIL, 
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_LIST_MY_FAIL,
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_FAIL,
    ORDER_DELIVER_REQUEST,
    ORDER_DISPATCH_REQUEST,
    ORDER_DISPATCH_SUCCESS,
    ORDER_DISPATCH_FAIL,
    ORDER_CANCEL_REQUEST,
    ORDER_CANCEL_SUCCESS,
    ORDER_CANCEL_FAIL
} from "../constants/orderConstants";
import { CART_DROP } from "../constants/cartConstants";

const url = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000' 
        : process.env.REACT_APP_URI_API_PRODUCTION;

export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_CREATE_REQUEST,
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.post(`${url}/api/orders`, order, config);

        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data
        });

        dispatch({
            type: CART_DROP,
        });

    } catch(error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message
        })
    }
};

export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DETAILS_REQUEST,
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`${url}/api/orders/${id}`, config);

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data
        });

    } catch(error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message
        })
    }
};

// Cambia por action dispatchOrder. Antes era payOrder
export const dispatchOrder = (id, daysToDispatch) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DISPATCH_REQUEST,
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.put(`${url}/api/orders/${id}/dispatch`, { daysToDispatch }, config);

        dispatch({
            type: ORDER_DISPATCH_SUCCESS,
            payload: data
        });

    } catch(error) {
        dispatch({
            type: ORDER_DISPATCH_FAIL,
            payload: error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message
        });
    }
};

// Cambia por action dispatchOrder. Antes era payOrder
export const cancelOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_CANCEL_REQUEST,
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        await axios.put(`${url}/api/orders/${order._id}/cancel`, order, config);

        dispatch({  type: ORDER_CANCEL_SUCCESS });

    } catch(error) {
        dispatch({
            type: ORDER_CANCEL_FAIL,
            payload: error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message
        });
    }
};

export const listMyOrders = () => async (
    dispatch, 
    getState
) => {
    try {
        dispatch({
            type: ORDER_LIST_MY_REQUEST,
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`${url}/api/orders/myorders`, config);

        dispatch({
            type: ORDER_LIST_MY_SUCCESS,
            payload: data
        });

    } catch(error) {
        dispatch({
            type: ORDER_LIST_MY_FAIL,
            payload: error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message
        });
    }
};

export const listOrders = () => async (
    dispatch, 
    getState
) => {
    try {
        dispatch({
            type: ORDER_LIST_REQUEST,
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`${url}/api/orders`, config);

        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data
        });

    } catch(error) {
        dispatch({
            type: ORDER_LIST_FAIL,
            payload: error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message
        });
    }
};

export const deliverOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DELIVER_REQUEST,
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        await axios.put(`${url}/api/orders/${order._id}/deliver`, {}, config);

        dispatch({  type: ORDER_DELIVER_SUCCESS });

    } catch(error) {
        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload: error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message
        });
    }
};