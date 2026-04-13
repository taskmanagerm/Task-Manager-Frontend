import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://task-manager-backend-0ejx.onrender.com/api/";
const API_BASE_URL = "http://localhost:8081/api";

const API = axios.create({
    baseURL: API_BASE_URL,
});

API.interceptors.request.use((config) => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    console.log("Auth data:", auth);
    if (auth?.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
});

export default API;