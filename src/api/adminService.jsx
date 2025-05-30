import axios from 'axios';
// import { API_BASE_URL } from '../config'; // Assuming you still use this or directly define API_URL

const API_URL = 'http://localhost:8080/api'; // Ensure this matches your backend URL

// Create an Axios instance with default configuration for reusability
// This is a best practice if many of your requests need the same config
const axiosInstance = axios.create({
  baseURL: API_URL, // Set base URL once
  withCredentials: true, // <-- CRITICAL: Include cookies with cross-origin requests
});

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
    const response = await axiosInstance.get('/AdminMessages'); // Check capitalization if your backend uses 'adminMessages'
    return response.data;
  } catch (error) {
    console.error("Error fetching all admin messages:", error);
    throw error;
  }
}

// Example login function (if you have one in services)
// This will also need withCredentials: true
export async function loginUser(email, password) {
  try {
    const response = await axiosInstance.post('/users/login', { email, password });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}