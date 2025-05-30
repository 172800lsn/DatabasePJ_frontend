import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:9090/api', // 后端地址
    headers: {
        'Content-Type': 'application/json',
    },
});

export default API;