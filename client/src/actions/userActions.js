import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    CLEAR_ERRORS,
} from '../constants/userConstants';
import axios from 'axios';
import Cookies from 'universal-cookie';


// axios.defaults.withCredentials = true
// Login User

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST });

        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.post(
            'http://localhost:4000/api/v1/login',
            { email, password },
            config
        );
        let token = data.token;
        localStorage.setItem('token', token);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.message
        });
    }
}

// Register User
export const register = (userData) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });

        const config = { headers: { 'Content-Type': 'application/json' } };
        const { data } = await axios.post(
            'http://localhost:4000/api/v1/register',
            userData,
            config
        );
        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data
        });
        console.log(data);

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.message
        });
    }
}

// Load User // get user profile
export const loadUser = () => async (dispatch) => {
    try {

        dispatch({ type: LOAD_USER_REQUEST });
        const config = { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')} ` } };
        const { data } = await axios.get('http://localhost:4000/api/v1/me', config);
        console.log("data", data)
        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data.message
        });
    }
}

// Logout User
export const logOut = () => async (dispatch) => {
    try {

        // await axios.get('http://localhost:4000/api/v1/logout')
        localStorage.removeItem("token");

        dispatch({ type: LOGOUT_SUCCESS });
    } catch (error) {
        dispatch({
            type: LOGOUT_FAIL,
            payload: "Logged Out Successfully"
        });
    }
}
// Clearing Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
}