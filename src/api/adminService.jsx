import axios from "axios";

// IMPORTANT: Ensure this API_URL matches your backend Spring Boot application's URL
// For example: 'http://localhost:8080/api' if your backend runs on port 8080 and has a /api prefix
const API_URL = "http://localhost:8080/api";

// --- IMPORTANT: Define the AUTH_TOKEN_KEY here to match your AuthContext ---
// This key must be identical to the one used when saving the token in AuthContext.js
const AUTH_TOKEN_KEY = "appAuthToken";

// Create an Axios instance with default configuration for reusability
const axiosInstance = axios.create({
	baseURL: API_URL,
	withCredentials: true, // Keep this if your backend uses cookies/sessions in conjunction with JWT
});

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

// --- User Management API Calls ---

/**
 * Fetches all users from the backend.
 * @returns {Promise<Array>} A promise that resolves to an array of user objects.
 */
export async function getAllUsers() {
	try {
		const response = await axiosInstance.get("/users");
		return response.data; // Return the actual data from the response
	} catch (error) {
		console.error("Error fetching all users:", error);
		throw error; // Re-throw to allow component to handle
	}
}

export async function getAllProducts() {
	try {
		const response = await axiosInstance.get("/products");
		return response.data; // Return the actual data from the response
	} catch (error) {
		console.error("Error fetching all users:", error);
		throw error; // Re-throw to allow component to handle
	}
}

/**
 * Creates a new user.
 * @param {object} userData - An object containing the new user's data (firstName, lastName, email, password, role).
 * @returns {Promise<any>} The response data from the creation (e.g., the newly created user object).
 */
export async function createUser(userData) {
	try {
		const response = await axiosInstance.post("/users/register", userData); // Assuming POST to /api/users
		return response.data;
	} catch (error) {
		console.error("Error creating user:", error);
		throw error;
	}
}

/**
 * Updates an existing user with full data using a PUT request.
 * Use this if your backend expects a complete user object for updates.
 * @param {string} userId - The ID of the user to update.
 * @param {object} userData - An object containing the complete updated user data.
 * @returns {Promise<any>} The response data from the update (e.g., the updated user object).
 */
export async function updateUser(userId, userData) {
	try {
		const response = await axiosInstance.put(`/users/${userId}`, userData);
		return response.data;
	} catch (error) {
		console.error(`Error updating user with ID ${userId}:`, error);
		throw error;
	}
}

/**
 * Updates an existing user with partial data using a PATCH request.
 * Use this for incremental updates where you only send the changed fields.
 * @param {string} userId - The ID of the user to update.
 * @param {object} partialUserData - An object containing only the fields to be updated (e.g., { role: "ADMIN" }).
 * @returns {Promise<any>} The response data from the update.
 */
export async function patchUser(userId, partialUserData) {
	try {
		const response = await axiosInstance.patch(
			`/users/${userId}`,
			partialUserData
		);
		return response.data;
	} catch (error) {
		console.error(`Error patching user with ID ${userId}:`, error);
		throw error;
	}
}

/**
 * Deletes a user by their ID.
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<any>} The response data from the deletion.
 */
export async function deleteUser(userId) {
	try {
		const response = await axiosInstance.delete(`/users/${userId}`);
		return response.data;
	} catch (error) {
		console.error(`Error deleting user with ID ${userId}:`, error);
		throw error;
	}
}

// ---

// ### Order Management API Calls

/**
 * Fetches all orders from the backend.
 * @returns {Promise<Array>} A promise that resolves to an array of order objects.
 */
export async function getAllOrders() {
	try {
		const response = await axiosInstance.get("/orders");
		return response.data;
	} catch (error) {
		console.error("Error fetching all orders:", error);
		throw error;
	}
}

/**
 * Updates the status of a specific order.
 * @param {string} orderId - The ID of the order to update.
 * @param {string} newStatus - The new status of the order (e.g., "Pending", "Completed", "Cancelled").
 * @returns {Promise<any>} The response data from the update.
 */
export async function updateOrderStatus(orderId, newStatus) {
	try {
		const response = await axiosInstance.patch(`/orders/${orderId}/status`, {
			status: newStatus,
		});
		return response.data;
	} catch (error) {
		console.error(`Error updating order ${orderId} status:`, error);
		throw error;
	}
}

// ---

// ### Message Management API Calls

/**
 * Fetches all admin messages from the backend.
 * @returns {Promise<Array>} A promise that resolves to an array of message objects.
 */
export async function getAllAdminMessages() {
	try {
		const response = await axiosInstance.get("/AdminMessages"); // Assuming this endpoint for getting messages
		return response.data;
	} catch (error) {
		console.error("Error fetching all admin messages:", error);
		throw error;
	}
}

/**
 * Deletes a specific admin message by its ID.
 * @param {string} messageId - The ID of the message to delete.
 * @returns {Promise<any>} The response data from the deletion.
 */
export async function deleteAdminMessage(messageId) {
	try {
		const response = await axiosInstance.delete(`/AdminMessages/${messageId}`); // Assuming this endpoint for deleting
		return response.data;
	} catch (error) {
		console.error(`Error deleting message with ID ${messageId}:`, error);
		throw error;
	}
}

/**
 * Updates the status (e.g., read/unread) of a specific admin message.
 * @param {string} messageId - The ID of the message to update.
 * @param {string} newStatus - The new status of the message ("read" or "unread").
 * @returns {Promise<any>} The response data from the update.
 */
export async function updateMessageStatus(messageId, newStatus) {
	try {
		const response = await axiosInstance.patch(
			`/AdminMessages/${messageId}/status`,
			{
				status: newStatus,
			}
		);
		return response.data;
	} catch (error) {
		console.error(`Error updating message ${messageId} status:`, error);
		throw error;
	}
}
