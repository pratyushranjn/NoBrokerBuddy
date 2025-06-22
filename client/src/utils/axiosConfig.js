import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const listingAPI = axios.create({
  baseURL: `${BASE_URL}/api/listings`,
});

export const API = axios.create({
  baseURL: `${BASE_URL}/api/user`,
  withCredentials: true,
});

export const searchAPI = axios.create({
  baseURL: `${BASE_URL}/api/listings`,
});
