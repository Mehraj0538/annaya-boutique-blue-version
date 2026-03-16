import axios from 'axios';

const api = axios.create({
  baseURL: '',  // Same-origin in Next.js — no baseURL needed
  withCredentials: true,
});

export default api;
