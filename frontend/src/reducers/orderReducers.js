import { 
    ORDER_CREATE_REQUEST, 
    ORDER_CREATE_SUCCESS, 
    ORDER_CREATE_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL, 
    ORDER_DISPATCH_REQUEST,
    ORDER_DISPATCH_SUCCESS,
    ORDER_DISPATCH_FAIL,
    ORDER_DISPATCH_RESET,
    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_LIST_MY_FAIL,
    ORDER_LIST_MY_RESET,
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
    ORDER_LIST_RESET,
    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_FAIL,
    ORDER_DELIVER_RESET,
    ORDER_CREATE_RESET,
    ORDER_CANCEL_REQUEST,
    ORDER_CANCEL_SUCCESS,
    ORDER_CANCEL_FAIL,
    ORDER_CANCEL_RESET
} from "../constants/orderConstants";

export const orderCreateReducer = (state = {}, action) => {
    switch(action.type) {
        case ORDER_CREATE_REQUEST:
            return {
                loading: true
            }
        case ORDER_CREATE_SUCCESS:
            return {
                loading: false,
                success: true,
                order: action.payload
            }
        case ORDER_CREATE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case ORDER_CREATE_RESET:
            return {}
        default:
            return state;
    }
};

export const orderDetailsReducer = (
    state = { loading: true, orderItems: [], shippingAddress: {} }, 
    action
) => {
    switch(action.type) {
        case ORDER_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case ORDER_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                order: action.payload
            }
        case ORDER_DETAILS_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state;
    }
};

export const orderDispatchReducer = (state = { state: {} }, action ) => {
    switch(action.type) {
        case ORDER_DISPATCH_REQUEST:
            return {
                loading: true
            }
        case ORDER_DISPATCH_SUCCESS:
            return {
                loading: false,
                success: true
            }
        case ORDER_DISPATCH_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case ORDER_DISPATCH_RESET:
            return {}
        default:
            return state;
    }
};

export const orderListMyReducer = (state = { orders: [] }, action ) => {
    switch(action.type) {
        case ORDER_LIST_MY_REQUEST:
            return {
                loading: true
            }
        case ORDER_LIST_MY_SUCCESS:
            return {
                loading: false,
                orders: action.payload
            }
        case ORDER_LIST_MY_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case ORDER_LIST_MY_RESET:
            return { orders: [] }
        default:
            return state;
    }
};

export const orderListReducer = (state = { orders: [] }, action ) => {
    switch(action.type) {
        case ORDER_LIST_REQUEST:
            return {
                loading: true
            }
        case ORDER_LIST_SUCCESS:
            return {
                loading: false,
                orders: action.payload
            }
        case ORDER_LIST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case ORDER_LIST_RESET:
            return { orders: [] }
        default:
            return state;
    }
};

export const orderDeliverReducer = (state = { state: {} }, action ) => {
    switch(action.type) {
        case ORDER_DELIVER_REQUEST:
            return {
                loading: true
            }
        case ORDER_DELIVER_SUCCESS:
            return {
                loading: false,
                success: true
            }
        case ORDER_DELIVER_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case ORDER_DELIVER_RESET:
            return {}
        default:
            return state;
    }
};

export const orderCancelReducer = (state = { state: {} }, action ) => {
    switch(action.type) {
        case ORDER_CANCEL_REQUEST:
            return {
                loading: true
            }
        case ORDER_CANCEL_SUCCESS:
            return {
                loading: false,
                success: true
            }
        case ORDER_CANCEL_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case ORDER_CANCEL_RESET:
            return {}
        default:
            return state;
    }
};