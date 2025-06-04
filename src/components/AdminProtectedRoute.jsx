// src/components/AdminProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function AdminProtectedRoute({ children }) {
	const { isAuthenticated, userRole, isLoading } = useAuthContext();
	const location = useLocation();

	console.log("AdminProtectedRoute: --- Checking Route Protection ---");
	console.log("AdminProtectedRoute: isLoading:", isLoading);
	console.log("AdminProtectedRoute: isAuthenticated:", isAuthenticated);
	console.log("AdminProtectedRoute: userRole:", userRole); // Current role: ADMIN
	console.log("AdminProtectedRoute: Expected Role for Admin: ADMIN"); // Updated expectation for clarity

	if (isLoading) {
		console.log("AdminProtectedRoute: Loading, returning 'Loading...'");
		return <div>Loading...</div>;
	}

	if (!isAuthenticated) {
		console.log(
			"AdminProtectedRoute: Not authenticated. Redirecting to /login."
		);
		return <Navigate to="/" state={{ from: location }} replace />;
	}

	// --- THE FIX IS HERE ---
	// Change "ROLE_ADMIN" to "ADMIN" to match the actual userRole value
	if (userRole !== "ADMIN") {
		console.log(
			"AdminProtectedRoute: User role MISMATCH! Current role:",
			userRole,
			"Expected: ADMIN"
		);
		console.log("AdminProtectedRoute: Redirecting to /unauthorized.");
		return <Navigate to="/" replace />;
	}

	console.log(
		"AdminProtectedRoute: User is authenticated and has ADMIN role. Rendering children."
	);
	return children;
}
