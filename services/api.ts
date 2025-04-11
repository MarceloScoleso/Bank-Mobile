import axios from 'axios';

const api = axios.create({
baseURL: 'https://mock-bank-mock-back.yexuz7.easypanel.host', 
});

export default api;