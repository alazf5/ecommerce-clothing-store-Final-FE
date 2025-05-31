import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import { toast } from "react-hot-toast";

const AuthContext = createContext(); // Define and export AuthContext

const API_BASE_URL = "http://localhost:8080/api";

const AUTH_TOKEN_KEY = "appAuthToken";
const AUTH_USER_DATA_KEY = "appAuthUserData";

export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuthContext must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const signout = useCallback(async (notify = true) => {
		if (notify) {
			toast.success("Signed out successfully.");
		}
		setIsLoading(true);
		const token = localStorage.getItem(AUTH_TOKEN_KEY);
		try {
			if (token) {
				await fetch(`${API_BASE_URL}/users/logout`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
			}
		} catch (error) {
			console.error("Error calling backend logout:", error);
		} finally {
			setCurrentUser(null);
			setIsAuthenticated(false);
			setUserRole(null);
			localStorage.removeItem(AUTH_TOKEN_KEY);
			localStorage.removeItem(AUTH_USER_DATA_KEY);
			setIsLoading(false);
		}
	}, []);

	const fetchUserProfile = useCallback(
		async (tokenOverride) => {
			const token = tokenOverride || localStorage.getItem(AUTH_TOKEN_KEY);

			if (!token) {
				if (isAuthenticated) {
					await signout(false);
				} else {
					setCurrentUser(null);
					setIsAuthenticated(false);
					setUserRole(null);
					setIsLoading(false);
				}
				return null;
			}

			setIsLoading(true);
			try {
				const response = await fetch(`${API_BASE_URL}/users/me`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					if (response.status === 401 || response.status === 403) {
						await signout(false);
					} else {
						console.error(`fetchUserProfile: API error - ${response.status}`);
						setCurrentUser(null);
						setIsAuthenticated(false);
						setUserRole(null);
						localStorage.removeItem(AUTH_USER_DATA_KEY);
					}
					throw new Error(
						`Failed to fetch user profile. Status: ${response.status}`
					);
				}

				const userData = await response.json();
				setCurrentUser(userData);
				setIsAuthenticated(true);
				setUserRole(userData.role);
				localStorage.setItem(AUTH_USER_DATA_KEY, JSON.stringify(userData));
				setIsLoading(false);
				return userData;
			} catch (error) {
				console.error("AuthContext Fetch Profile Error:", error.message);
				if (isAuthenticated) {
					await signout(false);
				} else {
					setCurrentUser(null);
					setIsAuthenticated(false);
					setUserRole(null);
					localStorage.removeItem(AUTH_TOKEN_KEY);
					localStorage.removeItem(AUTH_USER_DATA_KEY);
				}
				setIsLoading(false);
				return null;
			}
		},
		[signout, isAuthenticated]
	);

	useEffect(() => {
		const attemptAutoLogin = async () => {
			const initialToken = localStorage.getItem(AUTH_TOKEN_KEY);
			if (initialToken) {
				const parts = initialToken.split(".");
				if (parts.length === 3) {
					await fetchUserProfile(initialToken);
				} else {
					localStorage.removeItem(AUTH_TOKEN_KEY);
					localStorage.removeItem(AUTH_USER_DATA_KEY);
					setIsAuthenticated(false);
					setCurrentUser(null);
					setUserRole(null);
					setIsLoading(false);
				}
			} else {
				setIsAuthenticated(false);
				setCurrentUser(null);
				setUserRole(null);
				setIsLoading(false);
			}
		};
		attemptAutoLogin();
	}, [fetchUserProfile]);

	const signin = useCallback(async (email, password) => {
		setIsLoading(true);
		try {
			const response = await fetch(`${API_BASE_URL}/users/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				let errorMsg = "Login failed. Please check your credentials.";
				try {
					const errorData = await response.json();
					errorMsg = errorData.message || errorMsg;
				} catch (e) {
					console.log("Signin error parsing response:", e);
				}
				setIsLoading(false);
				return { success: false, error: errorMsg };
			}

			// --- CRITICAL CHANGE START ---
			// Your backend returns the AuthResponseDto (UserDto + token) in the response body.
			const responseData = await response.json(); // Parse the full response body

			const userDto = responseData.userDto; // Assuming the user data is under 'userDto' key
			const token = responseData.token; // Assuming the token is under 'token' key
			// --- CRITICAL CHANGE END ---

			if (token && userDto) {
				// Check if both token and userDto were successfully extracted
				localStorage.setItem(AUTH_TOKEN_KEY, token);
				localStorage.setItem(AUTH_USER_DATA_KEY, JSON.stringify(userDto)); // Save the UserDto
				setCurrentUser(userDto); // Set the currentUser to the UserDto
				setIsAuthenticated(true);
				setUserRole(userDto.role); // Get role from the UserDto
				setIsLoading(false);
				toast.success("Logged in successfully!"); // Add success toast
				return { success: true, user: userDto };
			} else {
				setIsLoading(false);
				return {
					success: false,
					error:
						"Login failed: Invalid response from server (missing user data or token in body).",
				};
			}
		} catch (error) {
			console.error("Signin error:", error);
			setIsLoading(false);
			return {
				success: false,
				error: "An unexpected error occurred during sign-in.",
			};
		}
	}, []);

	const signup = useCallback(async (signupData) => {
		setIsLoading(true);
		try {
			const response = await fetch(`${API_BASE_URL}/users/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(signupData),
			});

			if (!response.ok) {
				let errorMsg = "Signup failed. Please try again.";
				try {
					const errorData = await response.json();
					errorMsg = errorData.message || errorMsg;
				} catch (e) {
					console.log("Signup error parsing response:", e);
				}
				setIsLoading(false);
				return { success: false, error: errorMsg };
			}

			setIsLoading(false);
			return { success: true };
		} catch (error) {
			console.error("Signup error:", error);
			setIsLoading(false);
			return {
				success: false,
				error: "An unexpected error occurred during sign-up.",
			};
		}
	}, []);

	const updateCurrentUserData = useCallback((updatedData) => {
		setCurrentUser((prevUser) => {
			const newUser = { ...prevUser, ...updatedData };
			localStorage.setItem(AUTH_USER_DATA_KEY, JSON.stringify(newUser));
			if (updatedData.role && prevUser && updatedData.role !== prevUser.role) {
				setUserRole(updatedData.role);
			}
			return newUser;
		});
	}, []);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (
				document.visibilityState === "visible" &&
				isAuthenticated &&
				localStorage.getItem(AUTH_TOKEN_KEY)
			) {
				fetchUserProfile();
			}
		};
		const handleOnline = () => {
			if (
				navigator.onLine &&
				isAuthenticated &&
				localStorage.getItem(AUTH_TOKEN_KEY)
			) {
				fetchUserProfile();
			}
		};

		window.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("online", handleOnline);
		return () => {
			window.removeEventListener("visibilitychange", handleVisibilityChange);
			window.removeEventListener("online", handleOnline);
		};
	}, [fetchUserProfile, isAuthenticated]);

	const value = {
		currentUser,
		isAuthenticated,
		userRole,
		isLoading,
		signin,
		signup,
		signout,
		updateCurrentUserData,
		fetchUserProfile,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
