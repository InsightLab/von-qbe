import axios from 'axios';
require('dotenv').config();

// api
const port = process.env.REACT_APP_VONQBEPORT ? process.env.REACT_APP_VONQBEPORT : 8080
const api = axios.create({
  baseURL:  `http://localhost:${port}`
});

export default api;