import axios from 'axios';

const api = axios.create({
  baseURL: 'ALLOWED_ORIGIN' in import.meta.env ? import.meta.env.ALLOWED_ORIGIN : 'http://localhost:5000',
  withCredentials: true,
});
    
export default api;
