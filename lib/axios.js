// Centralized axios instance with credentials enabled for cookie-based JWT auth
import axios from "axios";

const api = axios.create({
    baseURL: "",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;

