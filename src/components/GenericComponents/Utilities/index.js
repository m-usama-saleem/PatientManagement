import jwt_decode from "jwt-decode";
import Cookies from 'universal-cookie';

export const decodeToken = (token) => {
    const decoded = jwt_decode(token)
    return decoded
};

export const checkLoggedInUser = () => {
    const cookies = new Cookies()
    if(!cookies.get('loggedInUser')) {
        localStorage.setItem('sessionExpired', true)
        window.location.href = '/'
    }
}