import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { 
    productListReducer, 
    productDetailsReducer, 
    productDeleteReducer, 
    productCreateReducer,
    productUpdateReducer,
    productReviewCreateReducer,
    productTopRatedReducer,
    productCategoriesReducer
} from './reducers/productReducers';
import { categoryListReducer } from './reducers/productCategoryReducers';
import { cartReducer } from './reducers/cartReducers';
import { 
    userDetailsReducer, 
    userLoginReducer, 
    userRegisterReducer, 
    userUpdateReducer,
    userListReducer,
    userDeleteReducer,
    userUpdateProfileReducer
} from './reducers/userReducers';
import { 
    orderCreateReducer, 
    orderDeliverReducer, 
    orderDetailsReducer, 
    orderListMyReducer, 
    orderListReducer, 
    orderDispatchReducer, 
    orderCancelReducer
} from './reducers/orderReducers';

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productReviewCreate: productReviewCreateReducer,
    productTopRated: productTopRatedReducer,
    productCategories: productCategoriesReducer,
    productCategory: categoryListReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderDispatch: orderDispatchReducer,
    orderListMy: orderListMyReducer,
    orderList: orderListReducer,
    orderDeliver: orderDeliverReducer,
    orderCancel: orderCancelReducer
});

const categoriesFromStorage = localStorage.getItem('categoriesInfo') 
    ? JSON.parse(localStorage.getItem('categoriesInfo')) 
    : [];

const cartItemsFromStorage = localStorage.getItem('cartItems') 
    ? JSON.parse(localStorage.getItem('cartItems')) 
    : [];

const userInfoFromStorage = localStorage.getItem('userInfo') 
? JSON.parse(localStorage.getItem('userInfo')) 
: [];

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') 
? JSON.parse(localStorage.getItem('shippingAddress')) 
: {};

const initialState = {
    cart: { cartItems: cartItemsFromStorage, shippingAddress: shippingAddressFromStorage },
    userLogin: { userInfo: userInfoFromStorage },
    categories: categoriesFromStorage
};

const middleware = [thunk];

const store = createStore(
    reducer, 
    initialState, 
    composeWithDevTools(applyMiddleware(...middleware)));

export default store;