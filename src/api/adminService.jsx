import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Ensure this matches your backend URL

// --- IMPORTANT: Define the AUTH_TOKEN_KEY here to match your AuthContext ---
const AUTH_TOKEN_KEY = "appAuthToken"; // <--- This must match the key in AuthContext.js

// Create an Axios instance with default configuration for reusability
const axiosInstance = axios.create({
  baseURL: API_URL, // Set base URL once
  withCredentials: true, // Keep this if your backend also uses cookies for sessions, but JWT is primary for auth
});

// --- CRITICAL ADDITION: Axios Request Interceptor ---
// This interceptor will automatically add the Authorization header to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage using the correct key
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// --- END OF CRITICAL ADDITION ---


export async function getAllUsers() {
  try {
    const response = await axiosInstance.get('/users');
    return response.data; // Return the actual data from the response
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error; // Re-throw to allow component to handle
  }
}

export async function getAllProducts() {
  try {
    const response = await axiosInstance.get('/products');
    return response.data;
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
}

export async function getAllOrders() {
  try {
    const response = await axiosInstance.get('/orders');
    return response.data;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
}

export async function getAllAdminMessages() {
  try {
    const response = await axiosInstance.get('/AdminMessages');
    return response.data;
  } catch (error) {
    console.error("Error fetching all admin messages:", error);
    throw error;
  }
}

// Note: The loginUser function is typically handled in AuthContext.js,
// but if you have it here for some reason, ensure it also saves the token
// to localStorage using the correct AUTH_TOKEN_KEY.
/*
export async function loginUser(email, password) {
  try {
    const response = await axiosInstance.post('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, response.data.token); // Use AUTH_TOKEN_KEY here
    }
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}
*/