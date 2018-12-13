import axios from 'axios';

// api
const api = axios.create({
  baseURL:  "http://localhost:8080"
});

export default api;