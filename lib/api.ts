import axios from "axios";

const api = axios.create({
  baseURL: "", // Same-origin in Next.js
});

export default api;
