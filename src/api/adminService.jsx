import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = 'http://localhost:8080';

export async function getAllUsers() {
  
    return await axios.get(`${API_URL}/users`);    
  
}

export async function getAllProducts() {
  
    return await axios.get(`${API_URL}/products`);    
  
}

export async function getAllOrders() {
  
    return await axios.get(`${API_URL}/orders`);    
  
}

export async function getAllAdminMessages() {
  
    return await axios.get(`${API_URL}/AdminMessages`);    
  
}