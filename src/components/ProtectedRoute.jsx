// This component protects routes intended ONLY for authenticated Sellers.
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom"; // Import useLocation
import { useAuthContext } from "../context/AuthContext";
import { useSignupSigninModal } from "../hooks/useSignupSigninModal";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children }) {
	const { isAuthenticated, isLoading, userRole } = useAuthContext();
	const {
		openModal,
		switchToTab,
		isOpen: isModalOpen,
	} = useSignupSigninModal();
	const location = useLocation(); // To trigger effects on route change if needed

	// Effect 1: Handle prompting for sign-in if not authenticated
	useEffect(() => {
		if (!isLoading && !isAuthenticated && !isModalOpen) {
			toast.error("Please sign in as a Seller to access this page.");
			switchToTab("signin");
			openModal();
		}
	}, [isLoading, isAuthenticated, isModalOpen, openModal, switchToTab]);

	// Effect 2: Handle access denied due to incorrect role
	// This will run AFTER the component has rendered, avoiding the "setState in render" error.
	useEffect(() => {
		// Only show this toast if:
		// 1. Loading is complete
		// 2. User IS authenticated (meaning they tried to log in)
		// 3. Their role is NOT 'SELLER'
		// 4. And they are on the path that triggered this ProtectedRoute (handled implicitly by component mount/render)
		if (!isLoading && isAuthenticated && userRole !== "SELLER") {
			toast.error("Access Denied. This page is for Sellers only.");
			// The Navigate component below will handle the actual redirect to '/'
		}
	}, [isLoading, isAuthenticated, userRole, location.pathname]); // Add location.pathname to re-evaluate on path changes

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<p className="text-gray-500 animate-pulse">Authenticating Seller...</p>
			</div>
		);
	}

	// After loading, if the user is not authenticated OR they are not a Seller, redirect.
	// The toasts for these conditions are now handled in useEffects.
	if (!isAuthenticated || userRole !== "SELLER") {
		// Redirect to homepage if not authenticated or not a Seller
		return <Navigate to="/" replace />;
	}

	// If loading is complete, user is authenticated, AND userRole is 'SELLER', render children.
	return children;
}
