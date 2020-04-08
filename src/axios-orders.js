import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://recat-lulus-burger.firebaseio.com'
});

export default instance;