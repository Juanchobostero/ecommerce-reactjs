import axios from 'axios';
import { 
    CATEGORY_LIST_FAIL, 
    CATEGORY_LIST_REQUEST, 
    CATEGORY_LIST_SUCCESS 
} from '../constants/productCategoryConstants';

const url = process.env.REACT_APP_ENV === 'development' 
    ? 'http://localhost:5000' 
    : process.env.REACT_APP_URI_API_PRODUCTION;

export const listProductCategories = () => async (dispatch) => {
    try {
        dispatch({ type: CATEGORY_LIST_REQUEST });

        const { data } = await axios.get(`${process.env.REACT_APP_URI_API_PRODUCTION}/api/categories`);

        dispatch({
            type: CATEGORY_LIST_SUCCESS,
            payload: data
        });

        localStorage.setItem('categoriesInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: CATEGORY_LIST_FAIL,
            payload: error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message
        });
    }
}

