import axios from 'axios';
require('dotenv').config();

// api
const port = process.env.REACT_APP_PORT ? process.env.REACT_APP_PORT : 8080
const ip = process.env.REACT_APP_IP ? process.env.REACT_APP_IP : "localhost"
const api = axios.create({
  baseURL:  `http://${ip}:${port}`
});

export default api;