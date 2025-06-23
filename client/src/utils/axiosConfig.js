import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Global axios instance for all user-authenticated requests
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});


const listingAPI = axios.create({
  baseURL: `${BASE_URL}/api/listings`,
  withCredentials: true,
});

const searchAPI = axios.create({
  baseURL: `${BASE_URL}/api/listings`,
  withCredentials: true,
});

export { API, listingAPI, searchAPI };

