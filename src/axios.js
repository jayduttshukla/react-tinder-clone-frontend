import axios from 'axios';
import config from './config'

const instance = axios.create({
    baseURL: config.BASE_URL
    // baseURL: ' https://tinder-backend-clone-jd.herokuapp.com'
});

export default instance;